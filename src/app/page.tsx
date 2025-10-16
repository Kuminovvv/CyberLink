
"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchIndex } from "@shared/lib/content";
import type { ContentIndex } from "@shared/types/content";
import { Button } from "@shared/ui/button";

export default function Home() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetchIndex().then(setIndex).catch(() => setIndex(null));
  }, []);

  const filteredTracks = useMemo(() => {
    const tracks = index?.tracks ?? [];
    const query = q.trim().toLowerCase();
    if (!query) return tracks;
    return tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.description ?? "").toLowerCase().includes(query)
    );
  }, [index, q]);

  return (
    <main className="relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-purple-950/20" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Новый подход к изучению кибербезопасности</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  Защити себя
                </span>
                <br />
                <span className="text-foreground">в цифровом мире</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Интерактивная платформа для изучения кибербезопасности.
                <br />
                <span className="font-semibold text-foreground">
                  Учись как в Duolingo, защищайся как профессионал
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl transition-all"
                >
                  <Link href="/onboarding">
                    Начать бесплатно
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2"
                >
                  <Link href="/learn">Смотреть курсы</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Без серверов</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Данные у вас</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Офлайн-режим</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>PWA установка</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                9+
              </div>
              <div className="text-sm text-muted-foreground">Интерактивных уроков</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                4
              </div>
              <div className="text-sm text-muted-foreground">Трека обучения</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                15+
              </div>
              <div className="text-sm text-muted-foreground">Терминов в глоссарии</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-sm text-muted-foreground">Бесплатно</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Почему выбирают{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  CyberLink
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Современный подход к обучению кибербезопасности
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🎯",
                  title: "Практика на реальных сценариях",
                  desc: "Фишинг, пароли, MFA, приватность, HTTPS и другие темы",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: "🧠",
                  title: "Адаптивное обучение",
                  desc: "Система повторений и тренировка слабых мест",
                  gradient: "from-cyan-500 to-purple-500",
                },
                {
                  icon: "🎮",
                  title: "Геймификация",
                  desc: "XP, streak, сердца, монеты и короны за достижения",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: "📱",
                  title: "PWA приложение",
                  desc: "Работает офлайн и устанавливается на устройство",
                  gradient: "from-pink-500 to-blue-500",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative p-6 rounded-2xl border-2 bg-card hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold">
                Попробуйте{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  прямо сейчас
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Пример интерактивного упражнения
              </p>
            </div>

            <div className="bg-card rounded-3xl border-2 shadow-2xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-semibold">Проверка URL</div>
                    <div className="text-sm text-muted-foreground">
                      Определите, безопасна ли эта ссылка
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-secondary/30 border-2">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground font-mono">
                      Отображаемый текст:
                    </div>
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      paypal.com/secure
                    </div>
                    <div className="border-t pt-3">
                      <div className="text-sm text-muted-foreground font-mono mb-1">
                        Реальная ссылка:
                      </div>
                      <div className="text-sm font-mono bg-background p-3 rounded border break-all">
                        https://paypa1.com/secure-login
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors">
                    ✓ Безопасно
                  </button>
                  <button className="flex-1 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                    ✗ Опасно
                  </button>
                </div>

                <div className="text-center pt-4">
                  <Link
                    href="/lesson/l1"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Начать полный урок →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Catalog */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-4xl font-bold mb-2">Треки обучения</h2>
                <p className="text-muted-foreground">
                  От базовых до продвинутых навыков
                </p>
              </div>
              <Link
                className="text-primary hover:underline font-medium"
                href="/learn"
              >
                Смотреть все →
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <input
                aria-label="Поиск по курсам"
                className="border-2 rounded-lg px-4 py-3 w-full max-w-md focus:border-primary focus:outline-none"
                placeholder="Поиск: фишинг, пароли, HTTPS…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(filteredTracks ?? []).map((t, i) => (
                <div
                  key={t.id}
                  className="group relative rounded-2xl border-2 p-6 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <div className="space-y-4">
                    <div className="text-4xl">
                      {i === 0 ? "🛡️" : i === 1 ? "🌐" : i === 2 ? "🔐" : "🚀"}
                    </div>
                    <div>
                      <div className="font-bold text-lg mb-2">{t.title}</div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {t.description}
                      </p>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 transition-all"
                    >
                      <Link href={`/learn/${t.id}`}>Начать обучение</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {!index && (
                <div className="text-sm text-muted-foreground">
                  Загрузка каталога…
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">Что говорят пользователи</h2>
              <p className="text-muted-foreground">
                Реальные отзывы от специалистов
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Супер-практика: научился быстро распознавать фишинг. Теперь чувствую себя увереннее при работе с почтой.",
                  author: "Андрей",
                  role: "Аналитик SOC",
                  avatar: "👨‍💼",
                },
                {
                  quote: "Удобно заниматься в метро благодаря офлайн-режиму. Геймификация действительно мотивирует!",
                  author: "Ирина",
                  role: "Менеджер проектов",
                  avatar: "👩‍💼",
                },
                {
                  quote: "Короткие уроки идеально вписываются в рабочий график. Ревью-режим помогает не забывать материал.",
                  author: "Максим",
                  role: "Разработчик",
                  avatar: "👨‍💻",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="rounded-2xl border-2 p-6 bg-card hover:shadow-lg transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex gap-1 text-yellow-500">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600 p-12 md:p-16 text-center text-white shadow-2xl">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Готовы начать обучение?
                </h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  Присоединяйтесь к тысячам пользователей, которые уже укрепили свои навыки кибербезопасности
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl"
                  >
                    <Link href="/onboarding">
                      Начать бесплатно
                      <svg
                        className="ml-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                  >
                    <Link href="/glossary">Изучить глоссарий</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                  CyberLink
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Интерактивная платформа для изучения кибербезопасности в стиле Duolingo
                </p>
                <div className="text-xs text-muted-foreground">
                  © 2025 CyberLink. Все права защищены.
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3">Обучение</div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <Link href="/learn" className="block hover:text-primary">
                    Курсы
                  </Link>
                  <Link href="/review" className="block hover:text-primary">
                    Повторение
                  </Link>
                  <Link href="/glossary" className="block hover:text-primary">
                    Глоссарий
                  </Link>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3">О платформе</div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <Link href="/profile" className="block hover:text-primary">
                    Профиль
                  </Link>
                  <Link href="/settings" className="block hover:text-primary">
                    Настройки
                  </Link>
                  <Link href="/author" className="block hover:text-primary">
                    Авторинг
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
