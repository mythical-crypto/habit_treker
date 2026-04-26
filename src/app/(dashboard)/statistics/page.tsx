import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, completions } from "@/lib/db/schema";
import { eq, gte, sql } from "drizzle-orm";
import { format, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyChart } from "@/components/charts/weekly-chart";
import { HabitChart } from "@/components/charts/habit-chart";
import { Flame, Trophy, TrendingUp, Target } from "lucide-react";
import {
  calculateStreak,
  calculateBestStreak,
  getCompletionRate,
} from "@/lib/streaks";

export default async function StatisticsPage() {
  const user = await getUser();
  if (!user) return null;

  const ninetyDaysAgo = format(subDays(new Date(), 90), "yyyy-MM-dd");

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, user.id),
  });

  const allCompletions =
    userHabits.length > 0
      ? await db
          .select()
          .from(completions)
          .where(
            sql`${completions.date} >= ${ninetyDaysAgo} AND ${completions.habitId} IN (${sql.join(
              userHabits.map((h) => sql`${h.id}`),
              sql`, `
            )})`
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

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const weeklyData = days.map((day, i) => {
    const dayCompletions = allCompletions.filter((c) => {
      const date = new Date(c.date + "T00:00:00");
      return date.getDay() === ((i + 1) % 7) && c.completed;
    });
    const totalForDay = userHabits.length * Math.ceil(90 / 7);
    return {
      day,
      completed: dayCompletions.length,
      total: totalForDay,
    };
  });

  // Get streaks per habit
  const habitsWithStreaks = await Promise.all(
    userHabits.map(async (habit) => {
      const habitCompletions = allCompletions.filter(
        (c) => c.habitId === habit.id
      );
      const streak = calculateStreak(
        habitCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false }))
      );
      return { ...habit, streak };
    })
  );

  const topStreaks = habitsWithStreaks
    .filter((h) => h.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-[1.5rem] font-semibold text-on-surface tracking-tight">
          Статистика
        </h1>
        <p className="text-sm text-on-surface-variant">
          Ваш прогресс за последние 90 дней
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Выполнено"
          value={String(totalCompleted)}
          color="primary"
        />
        <StatCard
          icon={Flame}
          label="Текущая серия"
          value={`${currentStreak} дн`}
          color="tertiary"
        />
        <StatCard
          icon={Trophy}
          label="Лучшая серия"
          value={`${bestStreak} дн`}
          color="secondary"
        />
        <StatCard
          icon={TrendingUp}
          label="Успешность"
          value={`${completionRate}%`}
          color="primary"
        />
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Активность по дням недели</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyChart data={weeklyData} />
        </CardContent>
      </Card>

      {/* Current Streaks */}
      {topStreaks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-on-surface">
            Текущие серии
          </h2>
          <div className="space-y-3">
            {topStreaks.map((habit) => (
              <div
                key={habit.id}
                className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: habit.color ?? "#0F53CD" }}
                >
                  <span className="text-lg">{habit.icon ?? "✨"}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-on-surface">{habit.name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-tertiary" />
                  <span className="text-sm font-semibold text-tertiary">
                    {habit.streak}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: "primary" | "secondary" | "tertiary";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    tertiary: "bg-tertiary/10 text-tertiary",
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 space-y-3">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
        <p className="text-xs text-on-surface-variant">{label}</p>
      </div>
    </div>
  );
}
