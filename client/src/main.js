import { startRouter, route, navigate } from './router.js';
import { apiBootstrap, apiGetMe, apiGetTracks, apiGetCoursesByTrack, apiGetModulesByCourse, apiGetUnitsByModule, apiGetLessonsByUnit, apiGetLesson, apiGetExercises, apiPostAttempt, apiCompleteLesson, apiGetSrsQueue, apiGetLeaderboard, apiAuthorAddExercise, apiPreviewLesson } from './api.js';

function el(tag, attrs = {}, children = []) { const e = document.createElement(tag); for (const [k,v] of Object.entries(attrs)) { if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v); else e.setAttribute(k, v); } for (const c of [].concat(children)) { if (c == null) continue; if (typeof c === 'string') e.appendChild(document.createTextNode(c)); else e.appendChild(c); } return e; }

function kpi(label, val){
  return el('div', {class:'pill'}, [`${label}: ${val}`]);
}

route('404', (root)=> root.appendChild(el('div',{},'Страница не найдена')));

route('home', async (root)=>{
  await apiBootstrap();
  const me = await apiGetMe();
  const lb = await apiGetLeaderboard();
  root.appendChild(el('div',{class:'card'},[
    el('h2',{},'Добро пожаловать 👋'),
    el('div',{class:'kpi'},[
      kpi('XP', me.xpTotal||0),
      kpi('Сердца', me.balances?.hearts ?? 0),
      kpi('Серия', me.streak?.days ?? 0)
    ]),
    el('div',{class:'row'},[
      el('button',{class:'btn primary',onClick:()=>navigate('learn')},'Начать урок'),
      el('button',{class:'btn',onClick:()=>navigate('review')},'Повторение на сегодня')
    ]),
  ]));
  root.appendChild(el('div',{class:'card'},[
    el('h3',{},'Лидерборд (локально)'),
    el('ul',{class:'list'}, lb.entries.map(e=> el('li',{},`#${e.rank} ${e.nickname} — ${e.xp} XP`)))
  ]));
});

route('learn', async (root)=>{
  const tracks = await apiGetTracks();
  root.appendChild(el('div',{class:'card'},[
    el('h2',{},'Треки'),
    ...tracks.map(t=> el('div',{class:'row'},[
      el('div',{},`${t.title}`),
      el('button',{class:'btn',onClick:()=>navigate(`track/${t.id}`)},'Открыть')
    ]))
  ]));
});

route('track', async (root, [trackId])=>{
  const courses = await apiGetCoursesByTrack(trackId);
  root.appendChild(el('div',{class:'card'},[
    el('h2',{},'Курс'),
    ...courses.map(c=> el('div',{class:'row'},[
      el('div',{},c.title),
      el('button',{class:'btn',onClick:()=>navigate(`course/${c.id}`)},'Дальше')
    ]))
  ]));
});

route('course', async (root, [courseId])=>{
  const mods = await apiGetModulesByCourse(courseId);
  root.appendChild(el('div',{class:'card'},[
    el('h2',{},'Модуль'),
    ...mods.map(m=> el('div',{class:'row'},[
      el('div',{},m.title),
      el('button',{class:'btn',onClick:()=>navigate(`module/${m.id}`)},'Юниты')
    ]))
  ]));
});

route('module', async (root, [moduleId])=>{
  const units = await apiGetUnitsByModule(moduleId);
  root.appendChild(el('div',{class:'card'},[
    el('h2',{},'Юнит'),
    ...units.map(u=> el('div',{class:'row'},[
      el('div',{},u.title),
      el('button',{class:'btn',onClick:()=>navigate(`unit/${u.id}`)},'Уроки')
    ]))
  ]));
});

route('unit', async (root, [unitId])=>{
  const lessons = await apiGetLessonsByUnit(unitId);
  root.appendChild(el('div',{class:'card'},[
    el('h2',{},'Уроки'),
    ...lessons.map(l=> el('div',{class:'row'},[
      el('div',{},`${l.title} · ${l.estimatedMinutes} мин · ${l.exerciseCount} зад.`),
      el('button',{class:'btn primary',onClick:()=>navigate(`lesson/${l.id}`)},'Старт')
    ]))
  ]));
});

route('lesson', async (root, [lessonId])=>{
  const lesson = await apiGetLesson(lessonId);
  const exercises = await apiGetExercises(lessonId);
  let idx = 0; let correctCount = 0; const start = Date.now();
  const wrap = el('div',{class:'card'});
  const status = el('div',{class:'muted'},'');
  const content = el('div',{});
  wrap.append(el('h2',{},lesson.title), status, content);
  root.appendChild(wrap);

  async function renderExercise() {
    const ex = exercises[idx];
    status.textContent = `Задание ${idx+1}/${exercises.length}`;
    content.innerHTML='';
    content.appendChild(el('p',{}, ex.stimulus?.text || ex.stimulus?.subject || ex.stimulus?.url || ''));

    // Render input by type (MCQ/multi or single)
    const chosen = new Set();
    const isMulti = Array.isArray(ex.solution?.correctOptionIds);
    const choices = el('div',{class:'choices'});
    (ex.options||[]).forEach(opt=>{
      const ch = el('div',{class:'choice',tabindex:'0',role:'button',onClick:()=>{
        if (isMulti) {
          if (chosen.has(opt.id)) chosen.delete(opt.id); else chosen.add(opt.id);
          ch.classList.toggle('active');
        } else {
          chosen.clear(); chosen.add(opt.id);
          [...choices.children].forEach(x=>x.classList.remove('active'));
          ch.classList.add('active');
        }
      }}, opt.label);
      choices.appendChild(ch);
    });
    content.appendChild(choices);
    const feedback = el('div', {class:'muted'});
    const btn = el('button',{class:'btn ok',onClick: async ()=>{
      const payload = isMulti ? { selectedOptionIds: [...chosen] } : { selectedOptionId: [...chosen][0] };
      const res = await apiPostAttempt({ exerciseId: ex.id, payload, idempotencyKey: `${ex.id}:${idx}:${Date.now()}`, clientTs: Date.now() });
      if (res.error) { feedback.textContent = res.error.message; return; }
      if (res.result === 'correct') correctCount++;
      feedback.textContent = `${res.result.toUpperCase()} • ${res.explanation||''} • +${res.rewards?.xp||0} XP`;
      // Visual mark
      [...choices.children].forEach((node,i)=>{
        const opt = ex.options[i];
        const good = (ex.solution.correctOptionId && opt.id===ex.solution.correctOptionId) || (ex.solution.correctOptionIds?.includes?.(opt.id));
        node.classList.add(good ? 'correct' : '');
        if (!good && [...chosen].includes(opt.id)) node.classList.add('wrong');
      });
      // Next
      setTimeout(async ()=>{
        idx++;
        if (idx < exercises.length) renderExercise();
        else {
          const durationMs = Date.now() - start; const accuracy = Math.round((correctCount/exercises.length)*100);
          const final = await apiCompleteLesson(lesson.id, { durationMs, accuracy });
          content.innerHTML='';
          content.appendChild(el('h3',{},`Готово! Точность ${accuracy}%`));
          content.appendChild(el('p',{},`Серия: ${final.streak.days}${final.streak.usedFreeze?' (заморозка)':''}`));
          content.appendChild(el('button',{class:'btn primary',onClick:()=>navigate('home')},'На главную'));
        }
      }, 900);
    }}, 'Проверить'));
    content.append(btn, feedback);
  }
  renderExercise();
});

route('review', async (root)=>{
  const queue = await apiGetSrsQueue(10);
  root.appendChild(el('div',{class:'card'},[
    el('h2',{},'Повторение'),
    el('p',{},`Готово к повтору: ${queue.length}`),
    el('div',{class:'footer-note'},'Алгоритм SRS упростен; повтор появится после ошибок в уроках.')
  ]));
});

route('profile', async (root)=>{
  const me = await apiGetMe();
  root.appendChild(el('div',{class:'card'},[
    el('h2',{},'Профиль'),
    el('div',{},`Ник: ${me.nickname}`),
    el('div',{},`Цель дня: ${me.settings?.dailyGoal||5} мин`),
    el('div',{},`XP: ${me.xpTotal||0}`),
    el('div',{},`Сердца: ${me.balances?.hearts??0} · Монеты: ${me.balances?.coins??0}`),
    el('div',{},`Серия: ${me.streak?.days??0}`)
  ]));
});

route('author', async (root)=>{
  const state = { lessonId: 'lesson_mfa_intro' };
  const form = el('div',{class:'card'},[
    el('h2',{},'Авторинг (минимум)'),
    el('div',{},'Добавить вопрос MCQ в урок «Введение в MFA»'),
    el('label',{},'Текст вопроса'),
    el('input',{class:'input',id:'f_q',placeholder:'Вопрос...'}),
    el('label',{},'Варианты (через ;) — правильные отмечайте звездочкой *'),
    el('input',{class:'input',id:'f_opts',placeholder:'пример: A*;B;C*'}),
    el('button',{class:'btn primary',onClick:async()=>{
      const q = document.getElementById('f_q').value.trim();
      const raw = document.getElementById('f_opts').value.trim();
      if (!q || !raw) return alert('Заполните поля');
      const parts = raw.split(';').map((t,i)=>{ const isC = t.trim().endsWith('*'); const label=t.replace(/\*$/,'').trim(); return { id:`o${i+1}`, label, correct:isC };});
      const ex = await apiAuthorAddExercise(state.lessonId, { type:'mcq', threatType:'password', difficulty:1, stimulus:{text:q}, options: parts.map(p=>({id:p.id,label:p.label})), solution:{ correctOptionIds: parts.filter(p=>p.correct).map(p=>p.id) }, explanation:'', hints:['Подумай ещё раз'] });
      alert(`Добавлено упражнение ${ex.id}`);
    }},'Добавить')
  ]);
  root.appendChild(form);
  const prevBtn = el('button',{class:'btn',onClick: async ()=>{
    const { lesson, exercises } = await apiPreviewLesson(state.lessonId);
    const box = el('div',{class:'card'});
    box.appendChild(el('h3',{},`Предпросмотр: ${lesson.title}`));
    box.appendChild(el('div',{},`Всего заданий: ${exercises.length}`));
    root.appendChild(box);
  }},'Предпросмотр');
  root.appendChild(prevBtn);
});

// Start
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
startRouter();

