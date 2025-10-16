// Seed minimal dataset: 1–2 lessons with a few exercises
import { ExerciseType, ThreatType } from '../models.js';

export function seedData() {
  return {
    tracks: [
      { id: 'track_hygiene', slug: 'cyber-hygiene', title: 'Кибергигиена', level: 'base' }
    ],
    courses: [
      { id: 'course_passwords', trackId: 'track_hygiene', title: 'Пароли и MFA', tags: ['password','mfa'], status: 'published', version: 1, estimatedMinutes: 30 }
    ],
    modules: [
      { id: 'mod_passwords', courseId: 'course_passwords', title: 'Пароли', order: 1, skillIds: ['skill_passwords'] }
    ],
    units: [
      { id: 'unit_mfa', moduleId: 'mod_passwords', title: 'Двухфакторная аутентификация', order: 1, estimatedMinutes: 6 }
    ],
    lessons: [
      { id: 'lesson_mfa_intro', unitId: 'unit_mfa', title: 'Введение в MFA', order: 1, goals: ['Понять факторы'], reading: 'Короткая теория о факторах аутентификации.', estimatedMinutes: 5, exerciseCount: 4, status: 'published', version: 1 }
    ],
    exercises: [
      {
        id: 'ex_mcq_1', lessonId: 'lesson_mfa_intro', type: ExerciseType.MCQ, threatType: ThreatType.PASSWORD, difficulty: 1,
        stimulus: { text: 'Что относится к факторам аутентификации?' },
        options: [
          { id: 'o1', label: 'Знание (пароль)' },
          { id: 'o2', label: 'Владение (телефон)' },
          { id: 'o3', label: 'Наследственная привилегия' }
        ],
        solution: { correctOptionIds: ['o1','o2'] },
        explanation: 'Факторы: знание, владение, биометрия.',
        hints: ['Подумай о том, что ты знаешь/имеешь/кем являешься']
      },
      {
        id: 'ex_tf_1', lessonId: 'lesson_mfa_intro', type: ExerciseType.TRUE_FALSE, threatType: ThreatType.PASSWORD, difficulty: 1,
        stimulus: { text: 'SMS‑коды — самый безопасный второй фактор.' },
        options: [{ id: 't', label: 'Верно' }, { id: 'f', label: 'Неверно' }],
        solution: { correctOptionId: 'f' },
        explanation: 'SMS уязвим для перехвата; приложения‑токены/ключи надёжнее.',
        hints: ['Подумай о риске SIM‑свапа']
      },
      {
        id: 'ex_phish_1', lessonId: 'lesson_mfa_intro', type: ExerciseType.PHISHING_DETECT, threatType: ThreatType.PHISHING, difficulty: 2,
        stimulus: { subject: 'Срочно подтвердите аккаунт', body: 'Нажмите ссылку и введите код.', screenshotUrl: '' },
        options: [{ id: 'safe', label: 'Безопасно' },{ id: 'sus', label: 'Подозрительно' }],
        solution: { correctOptionId: 'sus', rationale: 'Срочность и неизвестный домен' },
        explanation: 'Проверь домен и SSL, избегай срочных требований.',
        hints: ['Наведи на ссылку и посмотри домен (симуляция)']
      },
      {
        id: 'ex_url_1', lessonId: 'lesson_mfa_intro', type: ExerciseType.URL_CHECK, threatType: ThreatType.URL, difficulty: 2,
        stimulus: { url: 'https://app.example‑secure.com/login' },
        options: [{ id: 'ok', label: 'ОК' },{ id: 'bad', label: 'Риск' }],
        solution: { correctOptionId: 'bad', rationale: 'Домен‑мимикрия example‑secure.com vs example.com' },
        explanation: 'Субдомены и «похожие» домены — частая уловка.',
        hints: ['Смотри регистрирующий домен: example‑secure.com ≠ example.com']
      }
    ]
  };
}

