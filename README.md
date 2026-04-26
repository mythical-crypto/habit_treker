# Habit Treker

Приложение для отслеживания привычек с системой streaks, календарем и статистикой.

## Стек

- **Framework:** Next.js 16 (App Router) + React 19
- **UI:** shadcn/ui + Tailwind CSS 4
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (email/password)
- **Charts:** Recharts v3

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone git@github.com:mythical-crypto/habit_treker.git
cd habit_treker
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка окружения

Отредактируйте `.env` в корне проекта:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/habit_treker

# Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long!!!
BETTER_AUTH_URL=http://127.0.0.1:3000
```

### 4. Настройка базы данных

Убедитесь, что PostgreSQL запущен, затем выполните миграции:

```bash
npx drizzle-kit migrate
```

### 5. Запуск приложения

**Production-режим (рекомендуется для Windows):**

```bash
npm run build
npm start
```

**Dev-режим (может не работать на Windows из-за бага Turbopack):**

```bash
npm run dev
```

Откройте в браузере: **http://127.0.0.1:3000/login**

## Дополнительные команды

| Команда | Описание |
|---------|----------|
| `npm run build` | Сборка production-версии |
| `npm run lint` | Проверка линтером |
| `npx drizzle-kit studio` | GUI для базы данных |
| `npx drizzle-kit generate` | Генерация миграций |

## Документация

- [Next.js](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs)
- [Better Auth](https://www.better-auth.com/docs)
