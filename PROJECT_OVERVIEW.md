# Project Overview: Трекер Привычек (The Mindful Ritual)

**Design Source:** [Stitch Project](https://stitch.withgoogle.com/projects/6270119330405921257)  
**Design System:** Ethos Minimalist — "The Digital Sanctuary"  
**Screens:** 5 (Dashboard, Create Habit, Statistics, Login/Register, Calendar)

---

## Design Philosophy

The design rejects frantic productivity aesthetics. Habit tracking is positioned as a meditative practice. The interface feels like a high-end stationery set: tactile, expensive, and calm.

Key principles:
- **Intentional asymmetry** and **tonal depth**
- **No-Line Rule**: No 1px solid borders for sectioning
- **Paper-on-Stone**: Depth through background color shifts
- **Whitespace as functional tool** to reduce cognitive load

---

## Color System

### Surface Hierarchy (Paper-on-Stone)

| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | #F8F9FA | Base layer, page background |
| `surface-container-low` | #F3F4F5 | Sidebar, large functional areas |
| `surface-container-lowest` | #FFFFFF | Cards, active modules, inputs on focus |
| `surface-container` | #EDEEEF | Elevated sections |
| `surface-container-high` | #E7E8E9 | Higher elevation |
| `surface-container-highest` | #E1E3E4 | Input backgrounds |
| `surface-dim` | #D9DADB | Dimmed areas |
| `surface-variant` | #E1E3E4 | Variant surfaces |

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | #0F53CD | Primary actions, links |
| `primary-container` | #386DE7 | Gradient end, hover states |
| `primary-fixed` | #DBE1FF | Fixed primary surfaces |
| `primary-fixed-dim` | #B3C5FF | Dimmed primary |
| `on-primary` | #FFFFFF | Text on primary |
| `on-primary-container` | #FEFCFF | Text on primary container |

### Secondary Colors (Success/Complete)

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | #006E28 | Completed states, success |
| `secondary-container` | #6FFB85 | Success backgrounds |
| `secondary-fixed` | #72FE88 | Fixed success |
| `secondary-fixed-dim` | #53E16F | Dimmed success |
| `on-secondary` | #FFFFFF | Text on secondary |

### Tertiary Colors (Streak/Flame)

| Token | Hex | Usage |
|-------|-----|-------|
| `tertiary` | #894D00 | Streak icons, flame |
| `tertiary-container` | #AC6300 | Streak backgrounds |
| `tertiary-fixed` | #FFDCBF | Warm glow effect |
| `tertiary-fixed-dim` | #FFB874 | Dimmed warmth |
| `on-tertiary` | #FFFFFF | Text on tertiary |

### Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | #F8F9FA | Page background |
| `on-background` | #191C1D | Primary text |
| `on-surface` | #191C1D | Text on surfaces |
| `on-surface-variant` | #434654 | Secondary text |
| `outline` | #737685 | Borders (at 15% opacity only) |
| `outline-variant` | #C3C6D6 | Subtle borders, dividers |

### Error Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `error` | #BA1A1A | Error states |
| `error-container` | #FFDAD6 | Error backgrounds |
| `on-error` | #FFFFFF | Text on error |

### Inverse Colors (Dark mode prep)

| Token | Hex | Usage |
|-------|-----|-------|
| `inverse-surface` | #2E3132 | Dark surfaces |
| `inverse-on-surface` | #F0F1F2 | Text on dark |
| `inverse-primary` | #B3C5FF | Primary on dark |

---

## Typography

**Font Family:** Inter (Google Fonts)

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display-md` | 2.75rem (44px) | Bold (700) | 1.2 | -0.02em | Streak counts, daily summaries |
| `headline-sm` | 1.5rem (24px) | Semibold (600) | 1.3 | -0.01em | Page titles ("Мои привычки") |
| `title-md` | 1.125rem (18px) | Semibold (600) | 1.4 | 0 | Habit names |
| `title-sm` | 1rem (16px) | Medium (500) | 1.4 | 0 | Button text |
| `body-md` | 0.875rem (14px) | Regular (400) | 1.5 | 0 | Descriptions, notes |
| `body-sm` | 0.8125rem (13px) | Regular (400) | 1.5 | 0 | Secondary text |
| `label-sm` | 0.6875rem (11px) | Medium (500) | 1.2 | 0.05em | Uppercase labels ("STREAK", "STATUS") |

**Russian Cyrillic Note:** Use generous line-height (1.5+) for Cyrillic characters to maintain readability.

---

## Spacing & Layout

### Layout Grid

- **Sidebar:** 220px fixed width
- **Main Canvas:** max-width 960px, centered
- **Gutter:** 48px between sidebar and main content
- **Page Padding:** 24px internal

### Spacing Scale

| Token | Value |
|-------|-------|
| `space-xs` | 4px |
| `space-sm` | 8px |
| `space-md` | 16px |
| `space-lg` | 24px |
| `space-xl` | 32px |
| `space-2xl` | 48px |
| `space-3xl` | 64px |

### Corner Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Small elements |
| `rounded-md` | 8px | Default |
| `rounded-lg` | 16px | Cards |
| `rounded-xl` | 24px | Buttons, pills |
| `rounded-full` | 9999px | Avatars, circular buttons |

---

## Elevation & Shadows

### Tonal Layering (Preferred)

Instead of shadows, use background color shifts:
- Card on surface: `surface-container-lowest` on `surface`
- Elevated card: `surface-container-low` on `surface`

### Ambient Shadows (For floating elements only)

```css
box-shadow: 0 12px 32px -4px rgba(25, 28, 29, 0.06);
```

Used for:
- FAB (Floating Action Button)
- Modals
- Dropdown menus

### Glass Effect (Modals)

```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(20px);
```

---

## Components

### Sidebar

- Width: 220px fixed
- Background: `surface-container-low` (#F3F4F5)
- Navigation items with icon + text
- User profile section at bottom
- Active state: `surface-container` background

### Habit Cards

- Background: `surface-container-lowest` (#FFFFFF)
- No border
- Corner radius: `rounded-lg` (16px)
- Padding: 16px
- Vertical spacing between cards: 16px
- Icon: 40px circle with habit color
- Streak badge: `tertiary` icon + count
- Completion toggle: circle (empty → checkmark)

### Buttons

**Primary:**
- Background: linear-gradient(135deg, `primary` #0F53CD → `primary-container` #386DE7)
- Text: `on-primary` (#FFFFFF)
- Corner radius: `rounded-xl` (24px)
- Padding: 12px 24px
- Font: `title-sm`

**Tertiary:**
- Background: transparent
- Text: `primary` (#0F53CD)
- No border
- Hover: `primary-fixed` background

### Inputs

- Background: `surface-container-highest` (#E1E3E4)
- No border by default
- Corner radius: `rounded-lg` (16px)
- Padding: 12px 16px
- Focus: background → `surface-container-lowest`, 1px ghost border (15% `primary` opacity)
- Placeholder: `on-surface-variant` at 50% opacity

### Modal (Create/Edit Habit)

- Background: `surface-container-lowest` at 80% opacity
- Backdrop: blur(20px)
- Corner radius: `rounded-xl` (24px)
- Shadow: ambient shadow
- Max-width: 480px

### Streak Indicator ("Flame")

- Icon: Fire icon in `tertiary` (#894D00)
- Glow: `tertiary-fixed` (#FFDCBF) soft shadow
- Count: `title-md` weight

---

## Screens

### 1. Dashboard (Привычки)

**URL:** `/`

**Layout:**
- Header: "Привет, [Имя]!" + "Выполнено X из Y сегодня"
- FAB: "Добавить привычку" (bottom-right or top)
- Habit list: vertical stack of habit cards
- Each card: icon, name, streak, completion toggle
- Footer: "Мудрость дня" quote card

**Actions:**
- Toggle habit completion
- Add new habit (opens modal)
- Edit habit (swipe or menu)
- Delete habit (confirmation)

### 2. Create/Edit Habit (Модалка)

**URL:** Modal overlay

**Fields:**
- Название (text input)
- Частота повторений:
  - Daily (default)
  - Custom days (Пн, Вт, Ср, Чт, Пт, Сб, Вс toggles)
- Иконка (emoji picker: 🏃 📚 💧 🧘 🎨 🍎 😴 💻)
- Цвет (color picker)

**Buttons:**
- Отмена (tertiary)
- Сохранить (primary)

### 3. Statistics (Статистика)

**URL:** `/statistics`

**Layout:**
- Header: "Статистика" + subtitle
- Toggle: Неделя / Месяц
- Overall progress card: percentage + label
- Current streaks list: habit name + streak count
- Activity chart: bar/line chart by days
- Insight cards: tips and achievements

**Data:**
- Completion rate (SQL aggregation)
- Streak counts (SQL gaps-and-islands)
- Weekly activity (group by day)

### 4. Calendar (Календарь)

**URL:** `/calendar`

**Layout:**
- Header: "Календарь — [Месяц Год]"
- Navigation: ← → month
- Grid: 7 columns (Пн–Вс)
- Day cells: number + completion count
- Legend: выполнено / не выполнено
- Footer: monthly progress % + current streak

### 5. Login/Register (Вход/Регистрация)

**URL:** `/login`, `/register`

**Layout:**
- Centered card on `surface` background
- Logo: spa icon + "Привычки" + "The Mindful Ritual"
- Email input
- Password input
- Submit button
- Link to register/login
- Quote at bottom

---

## Animation Specifications

### Habit Completion

- Circle fills with `secondary` color
- Checkmark draws in (SVG stroke animation)
- Subtle scale pulse (1 → 1.1 → 1)
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### Streak Counter

- Number increments with counting animation
- Duration: 500ms
- Easing: ease-out

### Page Transitions

- Fade in: opacity 0 → 1
- Duration: 200ms
- Easing: ease-in-out

### Modal

- Backdrop: opacity 0 → 0.5
- Content: scale 0.95 → 1, opacity 0 → 1
- Duration: 200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

---

## Responsive Behavior

### Desktop (≥1024px)
- Full sidebar (220px)
- Main canvas: 960px max-width
- Two-column layouts where applicable

### Tablet (768px–1023px)
- Collapsible sidebar (icon only)
- Main canvas: full width with padding

### Mobile (<768px)
- Bottom navigation instead of sidebar
- Full-width cards
- Modal becomes bottom sheet

---

## Assets

### Icons (Lucide React)

| Usage | Icon |
|-------|------|
| Dashboard | `LayoutDashboard` |
| Calendar | `Calendar` |
| Statistics | `BarChart3` |
| Add | `Plus` |
| Check | `Check` |
| Fire/Streak | `Flame` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Close | `X` |
| Chevron Left | `ChevronLeft` |
| Chevron Right | `ChevronRight` |
| User | `User` |
| Logout | `LogOut` |
| Settings | `Settings` |
| Mail | `Mail` |
| Lock | `Lock` |
| Quote | `Quote` |
| Lightbulb | `Lightbulb` |
| Trophy | `Trophy` |

### Emoji Icons for Habits

| Emoji | Habit Type |
|-------|-----------|
| 🧘 | Медитация |
| 📖 | Чтение |
| 💧 | Вода |
| 🏃 | Спорт |
| 🎨 | Творчество |
| 🍎 | Питание |
| 😴 | Сон |
| 💻 | Работа |

---

## Accessibility

- All interactive elements have focus states
- Color contrast meets WCAG 2.1 AA
- Icons have aria-labels
- Modal traps focus
- Keyboard navigation for all actions
- Reduced motion support

---

## Notes for Implementation

1. **No hardcoded colors** — always use design tokens
2. **No 1px borders** — use tonal layering or 15% opacity outlines
3. **Russian text** — ensure buttons accommodate longer words ("Завершить" vs "Done")
4. **Inter font** — load from Google Fonts with Cyrillic subset
5. **Date handling** — use date-fns with ru locale
6. **Streak calculation** — use SQL gaps-and-islands pattern, not in-memory
7. **Optimistic updates** — toggle completion immediately, sync with server
