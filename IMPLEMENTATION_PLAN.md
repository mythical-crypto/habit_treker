# Implementation Plan: Habit Tracker (Трекер Привычек)

**Project:** Трекер Привычек (The Mindful Ritual)  
**Design Source:** [Stitch](https://stitch.withgoogle.com/projects/6270119330405921257) — "Ethos Minimalist" design system  
**Stack:** Next.js 16 + React 19 + TypeScript + Drizzle ORM + PostgreSQL + Better Auth + Recharts + shadcn/ui  
**Target:** localhost:3000

---

## Phase 0: Foundation ✅

- [x] Initialize Next.js 16 project with App Router
- [x] Configure Tailwind CSS v4
- [x] Set up shadcn/ui
- [x] Configure Drizzle ORM + PostgreSQL
- [x] Set up Better Auth (email/password)
- [x] Create middleware for route protection
- [x] Create base database schema (users, sessions, habits, completions)

**Verification:** `npm run dev` starts without errors on localhost:3000

---

## Phase 1: Authentication & Layout ✅

- [x] Login page (`/login`)
- [x] Registration page (`/register`)
- [x] Dashboard layout with sidebar
- [x] Sidebar navigation (Привычки, Календарь, Статистика)
- [x] Logout functionality
- [x] Middleware route protection

**Verification:**
- [x] Can register new account
- [x] Can log in with existing account
- [x] Unauthenticated users redirected to `/login`
- [x] Authenticated users redirected from `/login` to `/`

---

## Phase 2: Core Habit Management ✅

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

## Phase 3: Statistics & Analytics ✅

### 3.1 Statistics Page (`/statistics`)
- [x] Weekly/Monthly toggle
- [x] Overall completion percentage
- [x] Current streaks list by habit
- [x] Activity heatmap (by days of week)
- [x] Weekly insight cards

### 3.2 Charts
- [x] Completion rate line chart (Recharts)
- [x] Habit distribution pie chart
- [x] Weekly activity bar chart
- [x] Streak history visualization

### 3.3 Data Aggregation
- [x] Completion rate calculation (SQL)
- [x] Streak calculation (SQL gaps-and-islands)
- [x] Weekly/monthly aggregation functions

**Verification:**
- [x] Statistics page loads with real data
- [x] Charts render correctly
- [x] Toggle between week/month updates data

---

## Phase 4: Calendar View

### 4.1 Calendar Page (`/calendar`)
- [x] Monthly calendar grid
- [x] Navigation (prev/next month)
- [x] Day cells show completion count ("Выполнено X из Y")
- [x] Visual indicators for completed/partial/missed days

### 4.2 Day Detail
- [ ] Click day to see habit details
- [ ] Show which habits were completed
- [ ] Allow retroactive completion

**Verification:**
- [x] Calendar shows correct month
- [x] Days show accurate completion data
- [x] Navigation works correctly

---

## Phase 5: Design System Implementation

### 5.1 Design Tokens
- [x] Create `globals.css` with all Stitch colors (mapped to CSS vars + Tailwind)
- [x] Map tokens to Tailwind config (via `@theme inline`)
- [x] Typography scale (Inter font via `next/font`)

### 5.2 Component Styling
- [x] Sidebar (surface-container-low, navigation with icons)
- [x] Habit cards (no borders, tonal layering with surface-container-lowest)
- [x] Buttons (primary gradient via shadcn/ui + Tailwind)
- [x] Inputs (surface-container-highest via shadcn/ui)
- [x] Modal (glass effect via Dialog component)

### 5.3 Layout
- [x] Main canvas (max-width 960px, centered)
- [x] Sidebar + main content layout (flex)
- [x] Corner radius (rounded-2xl for cards, rounded-xl for buttons)

### 5.4 Russian Localization
- [x] All UI text in Russian
- [x] Date formatting (ru locale via date-fns)
- [x] Proper text expansion for buttons

**Verification:**
- [x] No hardcoded colors (all via CSS variables / Tailwind tokens)
- [x] No 1px borders (tonal layering)
- [x] Proper Russian text throughout

---

## Phase 6: Polish & Performance

### 6.1 Animations
- [ ] Habit completion animation
- [ ] Streak counter animation
- [ ] Page transitions
- [ ] Modal open/close animation

### 6.2 Optimizations
- [x] Server Components for data fetching
- [ ] Optimistic updates for habit completion
- [ ] Image optimization
- [x] Font optimization (Inter from Google Fonts via next/font)

### 6.3 Error Handling
- [ ] Error boundaries
- [ ] Loading states (skeletons)
- [ ] Empty states
- [x] Toast notifications (Sonner)

**Verification:**
- [ ] Lighthouse score > 90
- [ ] Smooth animations at 60fps
- [ ] No layout shift

---

## Phase 7: Testing & Deployment Prep

### 7.1 Testing
- [ ] Unit tests for streak calculation
- [ ] Unit tests for habit CRUD actions
- [ ] Integration tests for auth flow
- [ ] E2E tests for critical paths

### 7.2 Documentation
- [x] README with setup instructions
- [x] Environment variable documentation
- [x] Database setup guide (drizzle-kit migrate)

### 7.3 Production Readiness
- [ ] Environment validation
- [ ] Error monitoring setup
- [ ] Performance monitoring

**Verification:**
- [ ] All tests pass
- [ ] App runs on clean environment
- [ ] No console errors

---

## Database Schema Evolution

### Current Schema
```
users (id, email, name, emailVerified, image, createdAt, updatedAt)
sessions (id, expiresAt, token, ipAddress, userAgent, userId)
habits (id, userId, name, description, frequency, color, icon, targetPerWeek, archivedAt, customDays, targetCount, createdAt, updatedAt)
completions (id, habitId, date, completed, notes, createdAt)
```

### Phase 2 Additions
- `habits.archived_at` (timestamp, nullable)
- `habits.custom_days` (integer[], for custom frequency)
- `habits.target_count` (integer, default 1)

### Phase 3 Additions
- Streak calculation done in TypeScript (`src/lib/streaks.ts`) — no separate `streaks` table needed
- Indexes for performance

---

## File Structure (Current)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── calendar/page.tsx
│   │   ├── habits/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── edit/page.tsx
│   │   │       ├── edit-habit-button.tsx
│   │   │       ├── delete-habit-button.tsx
│   │   │       └── archive-habit-button.tsx
│   │   ├── statistics/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/auth/[...all]/route.ts
│   ├── layout.tsx
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── charts/
│   │   ├── completion-rate-chart.tsx
│   │   ├── habit-distribution-chart.tsx
│   │   ├── streak-history-chart.tsx
│   │   ├── weekly-chart.tsx
│   │   └── habit-chart.tsx
│   ├── ui/                    # shadcn/ui components
│   ├── sidebar.tsx
│   ├── habit-form.tsx
│   └── statistics-client.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── streaks.ts
│   └── utils.ts
├── actions/
│   ├── habits.ts
│   └── completions.ts
├── scripts/
│   └── seed.ts
└── middleware.ts
```

---

## Next Steps

1. ~~**Immediate:** Complete Phase 2 (Habit CRUD + tracking)~~ ✅ DONE
2. ~~**This week:** Phase 3 (Statistics) + Phase 4 (Calendar)~~ ✅ Phase 3 done, Phase 4 mostly done
3. **Current:** Phase 4.2 (Day detail in calendar) + Phase 6 (Animations)
4. **Final:** Phase 6 (Performance) + Phase 7 (Testing)

**Success Criteria:**
- [x] Functional habit tracking with streaks
- [x] Working statistics and calendar
- [x] Design system tokens implemented
- [ ] All 5 Stitch screens pixel-perfect
- [ ] Runs on localhost:3000 with single `npm run dev`
