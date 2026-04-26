import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, completions } from "@/lib/db/schema";
import { eq, gte, and, inArray } from "drizzle-orm";
import { format, subDays } from "date-fns";
import { StatisticsClient } from "@/components/statistics-client";
import {
  calculateStreak,
  calculateBestStreak,
  getCompletionRate,
  getWeeklyCompletionData,
  getMonthlyCompletionData,
  getHabitDistributionData,
  getStreakHistory,
  getActivityByDayOfWeek,
  getInsights,
} from "@/lib/streaks";

export default async function StatisticsPage() {
  const user = await getUser();
  if (!user) return null;

  const ninetyDaysAgo = format(subDays(new Date(), 90), "yyyy-MM-dd");

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, user.id),
  });

  const activeHabits = userHabits.filter((h) => !h.archivedAt);

  const allCompletions =
    userHabits.length > 0
      ? await db
          .select()
          .from(completions)
          .where(
            and(
              gte(completions.date, ninetyDaysAgo),
              inArray(
                completions.habitId,
                userHabits.map((h) => h.id)
              )
            )
          )
          .orderBy(completions.date)
      : [];

  const totalCompleted = allCompletions.filter((c) => c.completed).length;
  const currentStreak = calculateStreak(
    allCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false }))
  );
  const bestStreak = calculateBestStreak(
    allCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false }))
  );
  const completionRate = getCompletionRate(
    allCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false })),
    90
  );

  // Weekly activity data
  const weeklyData = getActivityByDayOfWeek(
    allCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false })),
    activeHabits.length
  );

  // Weekly completion rate (last 12 weeks)
  const weeklyCompletionRate = getWeeklyCompletionData(
    allCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false })),
    12
  );

  // Monthly completion rate (last 6 months)
  const monthlyCompletionRate = getMonthlyCompletionData(
    allCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false })),
    6
  );

  // Habit distribution
  const habitDistribution = getHabitDistributionData(
    activeHabits.map((h) => ({
      id: h.id,
      name: h.name,
      color: h.color,
    })),
    allCompletions.map((c) => ({
      habitId: c.habitId,
      completed: c.completed,
    }))
  );

  // Streak history
  const streakHistory = getStreakHistory(
    activeHabits.map((h) => ({
      id: h.id,
      name: h.name,
      color: h.color,
      icon: h.icon,
    })),
    allCompletions.map((c) => ({
      habitId: c.habitId,
      date: c.date,
      completed: c.completed ?? false,
    }))
  ).filter((h) => h.current > 0 || h.best > 0);

  // Top streaks
  const topStreaks = streakHistory
    .filter((h) => h.current > 0)
    .sort((a, b) => b.current - a.current)
    .slice(0, 5)
    .map((h) => ({
      id: h.id,
      name: h.name,
      color: h.color,
      icon: h.icon,
      streak: h.current,
    }));

  // Insights
  const weeklyInsights = getInsights(
    allCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false })),
    activeHabits.length,
    7
  );

  const monthlyInsights = getInsights(
    allCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false })),
    activeHabits.length,
    30
  );

  return (
    <StatisticsClient
      totalCompleted={totalCompleted}
      currentStreak={currentStreak}
      bestStreak={bestStreak}
      completionRate={completionRate}
      weeklyData={weeklyData}
      weeklyCompletionRate={weeklyCompletionRate}
      monthlyCompletionRate={monthlyCompletionRate}
      habitDistribution={habitDistribution}
      streakHistory={streakHistory}
      topStreaks={topStreaks}
      weeklyInsights={weeklyInsights}
      monthlyInsights={monthlyInsights}
    />
  );
}
