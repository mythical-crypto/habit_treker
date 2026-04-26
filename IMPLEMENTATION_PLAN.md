# Implementation Plan: Habit Tracker (Трекер Привычек)

**Project:** Трекер Привычек (The Mindful Ritual)  
**Design Source:** [Stitch](https://stitch.withgoogle.com/projects/6270119330405921257) — "Ethos Minimalist" design system  
**Stack:** Next.js 16 + React 19 + TypeScript + Drizzle ORM + PostgreSQL + Better Auth + Recharts + shadcn/ui  
**Target:** localhost:3000

---

## Phase 0: Foundation (Completed)

- [x] Initialize Next.js 16 project with App Router
- [x] Configure Tailwind CSS v4
- [x] Set up shadcn/ui
- [x] Configure Drizzle ORM + PostgreSQL
- [x] Set up Better Auth (email/password)
- [x] Create middleware for route protection
- [x] Create base database schema (users, sessions, habits, completions)

**Verification:** `npm run dev` starts without errors on localhost:3000

---

## Phase 1: Authentication & Layout (Completed)

- [x] Login page (`/login`)
- [x] Registration page (`/register`)
- [x] Dashboard layout with sidebar
- [x] Sidebar navigation (Привычки, Календарь, Статистика)
- [x] Logout functionality
- [x] Middleware route protection

**Verification:**
- Can register new account
- Can log in with existing account
- Unauthenticated users redirected to `/login`
- Authenticated users redirected from `/login` to `/`

---

## Phase 2: Core Habit Management (Completed)

### 2.1 Habit CRUD
- [x] Create habit form — name, icon, frequency (daily/weekly/custom days), color, targetPerWeek
- [x] Edit habit with all fields
- [x] Delete habit with confirmation (Russian text)
- [x] Archive habit (soft delete) + restore functionality

### 2.2 Habit Tracking
- [x] Mark habit as complete/incomplete for today
- [x] Visual completion indicator (check/circle with color transition)
- [x] Streak counter display (Flame icon + count)
- [x] Daily progress summary ("Выполнено X из Y")

### 2.3 Dashboard Enhancement
- [x] Habit cards with icons and streaks
- [x] "Мудрость дня" (daily quote) section
- [x] Quick-add habit button (FAB)

**Database Changes Done:**
- [x] Add `archived_at` to habits table
- [x] Add `custom_days` array to habits (for custom frequency)
- [x] `icon` field already existed
- [x] `target_per_week` already existed

**Verification:**
- [x] Can create habit with all fields (including custom days)
- [x] Can edit habit with all fields
- [x] Can archive/restore habit
- [x] Can delete habit with confirmation
- [x] Can mark habit complete/incomplete
- [x] Streak updates correctly
- [x] Dashboard shows all active habits with correct status
- [x] Build passes (`npm run build`)
- [x] Lint clean (0 errors)

---

## Phase 3: Statistics & Analytics

### 3.1 Statistics Page (`/statistics`)
- [ ] Weekly/Monthly toggle
- [ ] Overall completion percentage
- [ ] Current streaks list by habit
- [ ] Activity heatmap (by days of week)
- [ ] Weekly insight cards

### 3.2 Charts
- [ ] Completion rate line chart (Recharts)
- [ ] Habit distribution pie chart
- [ ] Weekly activity bar chart
- [ ] Streak history visualization

### 3.3 Data Aggregation
- [ ] Completion rate calculation (SQL)
- [ ] Streak calculation (SQL gaps-and-islands)
- [ ] Weekly/monthly aggregation functions

**Verification:**
- Statistics page loads with real data
- Charts render correctly
- Toggle between week/month updates data

---

## Phase 4: Calendar View

### 4.1 Calendar Page (`/calendar`)
- [ ] Monthly calendar grid
- [ ] Navigation (prev/next month)
- [ ] Day cells show completion count ("Выполнено X из Y")
- [ ] Visual indicators for completed/partial/missed days

### 4.2 Day Detail
- [ ] Click day to see habit details
- [ ] Show which habits were completed
- [ ] Allow retroactive completion

**Verification:**
- Calendar shows correct month
- Days show accurate completion data
- Navigation works correctly

---

## Phase 5: Design System Implementation

### 5.1 Design Tokens
- [ ] Create `lib/design-tokens.ts` with all Stitch colors
- [ ] Map tokens to Tailwind config
- [ ] Typography scale (Inter font)

### 5.2 Component Styling
- [ ] Sidebar (220px, surface-container-low)
- [ ] Habit cards (no borders, tonal layering)
- [ ] Buttons (gradient primary, ghost tertiary)
- [ ] Inputs (surface-container-highest, ghost border on focus)
- [ ] Modal (glass effect, 80% opacity, backdrop-blur)

### 5.3 Layout
- [ ] Main canvas (max-width 960px, centered)
- [ ] Gutter (48px between sidebar and content)
- [ ] Corner radius (lg 16px for cards, xl 24px for buttons)

### 5.4 Russian Localization
- [ ] All UI text in Russian
- [ ] Date formatting (ru locale)
- [ ] Proper text expansion for buttons

**Verification:**
- Visual comparison with Stitch screenshots
- No hardcoded colors
- No 1px borders
- Proper Russian text throughout

---

## Phase 6: Polish & Performance

### 6.1 Animations
- [ ] Habit completion animation
- [ ] Streak counter animation
- [ ] Page transitions
- [ ] Modal open/close animation

### 6.2 Optimizations
- [ ] Server Components for data fetching
- [ ] Optimistic updates for habit completion
- [ ] Image optimization
- [ ] Font optimization (Inter from Google Fonts)

### 6.3 Error Handling
- [ ] Error boundaries
- [ ] Loading states (skeletons)
- [ ] Empty states
- [ ] Toast notifications (Sonner)

**Verification:**
- Lighthouse score > 90
- Smooth animations at 60fps
- No layout shift

---

## Phase 7: Testing & Deployment Prep

### 7.1 Testing
- [ ] Unit tests for streak calculation
- [ ] Unit tests for habit CRUD actions
- [ ] Integration tests for auth flow
- [ ] E2E tests for critical paths

### 7.2 Documentation
- [ ] README with setup instructions
- [ ] Environment variable documentation
- [ ] Database setup guide

### 7.3 Production Readiness
- [ ] Environment validation
- [ ] Error monitoring setup
- [ ] Performance monitoring

**Verification:**
- All tests pass
- App runs on clean environment
- No console errors

---

## Database Schema Evolution

### Current Schema
```
users (id, email, name, emailVerified, image, createdAt, updatedAt)
sessions (id, expiresAt, token, ipAddress, userAgent, userId)
habits (id, userId, name, description, frequency, color, icon, targetPerWeek, createdAt, updatedAt)
completions (id, habitId, date, completed, notes, createdAt)
```

### Phase 2 Additions
- `habits.archived_at` (timestamp, nullable)
- `habits.custom_days` (integer[], for custom frequency)
- `habits.target_count` (integer, default 1)

### Phase 3 Additions
- `streaks` table (id, habitId, startDate, endDate, length)
- Indexes for performance

---

## File Structure Target

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── habits/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── statistics/
│   │   │   └── page.tsx
│   │   ├── calendar/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── sidebar.tsx
│   ├── habit-card.tsx
│   ├── habit-form.tsx
│   ├── streak-badge.tsx
│   ├── progress-ring.tsx
│   ├── calendar-grid.tsx
│   ├── statistics-chart.tsx
│   └── daily-quote.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── streaks.ts
│   ├── design-tokens.ts
│   └── utils.ts
├── actions/
│   ├── habits.ts
│   └── completions.ts
└── middleware.ts
```

---

## Dependencies

### Core
- next: ^16.2.4
- react: ^19.2.4
- react-dom: ^19.2.4
- typescript: ^5.7.0

### Database
- drizzle-orm: ^0.45.2
- drizzle-kit: ^0.31.10
- postgres: ^3.4.9

### Auth
- better-auth: ^1.6.9

### UI
- tailwindcss: ^4.0.0
- @tailwindcss/postcss: ^4.0.0
- shadcn/ui: ^4.5.0
- lucide-react: ^1.11.0
- class-variance-authority: ^0.7.1
- clsx: ^2.1.1
- tailwind-merge: ^3.5.0

### Forms & Validation
- react-hook-form: ^7.74.0
- @hookform/resolvers: ^5.2.2
- zod: ^4.3.6

### Charts
- recharts: ^3.8.1

### Date
- date-fns: ^4.1.0

### Notifications
- sonner: ^2.0.7

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/habit_tracker

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-change-in-production
BETTER_AUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Next Steps

1. **Immediate:** Complete Phase 2 (Habit CRUD + tracking) ✅ DONE
2. **This week:** Phase 3 (Statistics) + Phase 4 (Calendar)
3. **Next week:** Phase 5 (Design system polish)
4. **Final:** Phase 6 (Performance) + Phase 7 (Testing)

**Success Criteria:**
- All 5 Stitch screens implemented
- Functional habit tracking with streaks
- Working statistics and calendar
- Pixel-perfect(ish) design matching Stitch
- Runs on localhost:3000 with single `npm run dev`
