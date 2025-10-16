# CyberLingo — Client-only MVP

Статический PWA‑прототип без сервера и БД. Все данные — в `localStorage` (простая мок‑API), офлайн через `Service Worker`.

Запуск:
- Откройте `client/index.html` в браузере, или
- Поднимите простой локальный сервер (например, `python -m http.server` в папке `client`).

Основные экраны:
- Домой: прогресс, лидерборд (локальный)
- Учиться → Трек → Курс → Модуль → Юнит → Урок
- Урок: проверка ответов, начисление XP, сердца, streak
- Повторение: очередь появляется после ошибок
- Профиль: XP, сердца, серия
- Авторинг: добавление MCQ в тестовый урок, предпросмотр

Структура:
- `index.html`, `styles.css`, `manifest.webmanifest`, `sw.js`
- `src/utils/storage.js` — JSON‑хранилище
- `src/models.js` — константы и модели
- `src/data/seed.js` — сид‑контент
- `src/logic/gamification.js` — XP/streak/hearts
- `src/logic/adaptive.js` — сложность/SRS
- `src/api.js` — мок эндпоинты (`/exercise/:id/attempt`, `/lesson/:id/complete`, др.)
- `src/router.js`, `src/main.js` — мини‑роутер и экраны

Замечания:
- «Опасные» темы эмулируются. Ввод экранируется, выполнение HTML/JS не происходит.
- Данные можно сбросить через очистку `localStorage`.
- Это скелет для быстрых итераций UX/логики.
