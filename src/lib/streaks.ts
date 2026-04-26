import {
  differenceInDays,
  format,
  subDays,
  parseISO,
  startOfWeek,
  startOfMonth,
  eachDayOfInterval,
  getWeek,
} from "date-fns";

export function calculateStreak(
  completionData: { date: string; completed: boolean }[]
): number {
  const completed = completionData
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort()
    .reverse();

  if (completed.length === 0) return 0;

  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  if (completed[0] !== today && completed[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < completed.length; i++) {
    const diff = differenceInDays(
      parseISO(completed[i - 1]),
      parseISO(completed[i])
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateBestStreak(
  completionData: { date: string; completed: boolean }[]
): number {
  const completed = completionData
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort();

  if (completed.length === 0) return 0;

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completed.length; i++) {
    const diff = differenceInDays(
      parseISO(completed[i]),
      parseISO(completed[i - 1])
    );
    if (diff === 1) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (diff > 1) {
      currentStreak = 1;
    }
  }

  return bestStreak;
}

export function getCompletionRate(
  completionData: { date: string; completed: boolean }[],
  days: number
): number {
  if (days <= 0) return 0;
  const completedCount = completionData.filter((c) => c.completed).length;
  return Math.round((completedCount / days) * 100);
}

// Aggregate completions by week for the last N weeks
export function getWeeklyCompletionData(
  completionData: { date: string; completed: boolean }[],
  weeks: number = 12
) {
  const today = new Date();
  const data = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = startOfWeek(subDays(today, i * 7), { weekStartsOn: 1 });
    const weekEnd = subDays(startOfWeek(subDays(today, (i - 1) * 7), { weekStartsOn: 1 }), 1);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weekCompletions = completionData.filter((c) => {
      return weekDays.some((d) => format(d, "yyyy-MM-dd") === c.date);
    });

    const completed = weekCompletions.filter((c) => c.completed).length;
    const total = weekDays.length;

    data.push({
      label: `Нед ${getWeek(weekStart)}`,
      date: format(weekStart, "yyyy-MM-dd"),
      completed,
      total,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  }

  return data;
}

// Aggregate completions by month for the last N months
export function getMonthlyCompletionData(
  completionData: { date: string; completed: boolean }[],
  months: number = 12
) {
  const today = new Date();
  const data = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const monthCompletions = completionData.filter((c) => {
      return monthDays.some((d) => format(d, "yyyy-MM-dd") === c.date);
    });

    const completed = monthCompletions.filter((c) => c.completed).length;
    const total = monthDays.length;

    data.push({
      label: format(monthDate, "MMM yyyy", { locale: undefined }),
      date: format(monthStart, "yyyy-MM-dd"),
      completed,
      total,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  }

  return data;
}

// Get daily completion data for the last N days (for line chart)
export function getDailyCompletionData(
  completionData: { date: string; completed: boolean }[],
  days: number = 30
) {
  const today = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayCompletions = completionData.filter((c) => c.date === dateStr);
    const completed = dayCompletions.filter((c) => c.completed).length;
    const total = dayCompletions.length || 1;

    data.push({
      label: format(date, "dd.MM"),
      date: dateStr,
      completed,
      total,
      rate: Math.round((completed / total) * 100),
    });
  }

  return data;
}

// Get habit distribution data (completed vs missed for each habit)
export function getHabitDistributionData(
  habits: { id: number; name: string; color?: string | null }[],
  completions: { habitId: number; completed: boolean | null }[]
) {
  return habits.map((habit) => {
    const habitCompletions = completions.filter((c) => c.habitId === habit.id);
    const completed = habitCompletions.filter((c) => c.completed).length;
    const missed = habitCompletions.filter((c) => !c.completed).length;

    return {
      name: habit.name,
      color: habit.color || "#3b82f6",
      completed,
      missed,
      total: habitCompletions.length,
    };
  });
}

// Get streak history (current and best streaks per habit)
export function getStreakHistory(
  habits: { id: number; name: string; color?: string | null; icon?: string | null }[],
  allCompletions: { habitId: number; date: string; completed: boolean }[]
) {
  return habits.map((habit) => {
    const habitCompletions = allCompletions.filter((c) => c.habitId === habit.id);
    const current = calculateStreak(habitCompletions.map((c) => ({ date: c.date, completed: c.completed })));
    const best = calculateBestStreak(habitCompletions.map((c) => ({ date: c.date, completed: c.completed })));

    return {
      id: habit.id,
      name: habit.name,
      color: habit.color || "#3b82f6",
      icon: habit.icon || "✨",
      current,
      best,
    };
  });
}

// Get activity by day of week (for heatmap/chart)
export function getActivityByDayOfWeek(
  completionData: { date: string; completed: boolean }[],
  habitCount: number
) {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  return days.map((day, i) => {
    const dayCompletions = completionData.filter((c) => {
      const date = new Date(c.date + "T00:00:00");
      // getDay() returns 0 for Sunday, 1 for Monday, etc.
      return date.getDay() === ((i + 1) % 7) && c.completed;
    });
    const total = habitCount * Math.ceil(90 / 7);
    return {
      day,
      completed: dayCompletions.length,
      total,
    };
  });
}

export interface InsightsData {
  completed: number;
  total: number;
  rate: number;
  bestDay: string;
  trend: "positive" | "negative";
}

// Get insights for the period
export function getInsights(
  completionData: { date: string; completed: boolean }[],
  habitsCount: number,
  periodDays: number = 7
): InsightsData {
  const today = new Date();
  const periodStart = subDays(today, periodDays);

  const periodCompletions = completionData.filter((c) => {
    const cDate = parseISO(c.date);
    return cDate >= periodStart && cDate <= today;
  });

  const completed = periodCompletions.filter((c) => c.completed).length;
  const total = periodDays * habitsCount;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Find most productive day
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  periodCompletions.forEach((c) => {
    if (c.completed) {
      const day = new Date(c.date + "T00:00:00").getDay();
      dayCounts[day]++;
    }
  });
  const bestDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
  const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

  return {
    completed,
    total,
    rate,
    bestDay: dayNames[bestDayIndex] ?? "Неизвестно",
    trend: rate >= 50 ? "positive" : "negative",
  };
}
