import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, completions } from "@/lib/db/schema";
import { eq, and, gte, lte, inArray } from "drizzle-orm";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, subMonths, addMonths } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { calculateStreak } from "@/lib/streaks";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const user = await getUser();
  if (!user) return null;

  const params = await searchParams;
  const currentDate = params.month ? new Date(params.month + "-01") : new Date();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const prevMonth = format(subMonths(currentDate, 1), "yyyy-MM");
  const nextMonth = format(addMonths(currentDate, 1), "yyyy-MM");

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, user.id),
  });

  const habitIds = userHabits.map((h) => h.id);
  
  const monthCompletions = habitIds.length > 0
    ? await db
        .select()
        .from(completions)
        .where(
          and(
            gte(completions.date, format(monthStart, "yyyy-MM-dd")),
            lte(completions.date, format(monthEnd, "yyyy-MM-dd")),
            inArray(completions.habitId, habitIds)
          )
        )
    : [];

  // Calculate completions per day
  const dayStats = days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayCompletions = monthCompletions.filter(
      (c) => c.date === dateStr && c.completed
    );
    const totalForDay = userHabits.length;
    return {
      date: day,
      completed: dayCompletions.length,
      total: totalForDay,
    };
  });

  const totalCompleted = monthCompletions.filter((c) => c.completed).length;
  const totalPossible = userHabits.length * days.length;
  const monthlyProgress = totalPossible > 0 
    ? Math.round((totalCompleted / totalPossible) * 100) 
    : 0;

  const allCompletions = habitIds.length > 0
    ? await db
        .select()
        .from(completions)
        .where(inArray(completions.habitId, habitIds))
        .orderBy(completions.date)
    : [];

  const currentStreak = calculateStreak(
    allCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false }))
  );

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  // Get first day of month (0 = Sunday, 1 = Monday)
  const firstDayOfWeek = getDay(monthStart);
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[1.5rem] font-semibold text-on-surface tracking-tight">
          Календарь — {format(currentDate, "LLLL yyyy", { locale: ru })}
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/calendar?month=${prevMonth}`}
            className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center hover:bg-surface-container transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-on-surface-variant" />
          </Link>
          <Link
            href={`/calendar?month=${nextMonth}`}
            className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center hover:bg-surface-container transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-on-surface-variant" />
          </Link>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface-container-lowest rounded-2xl p-5">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-on-surface-variant py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${offset}-${i}`} className="aspect-square" />
          ))}

          {dayStats.map(({ date, completed, total }) => {
            const isTodayDate = isToday(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const hasCompletion = completed > 0;

            return (
              <div
                key={date.toISOString()}
                className={`aspect-auto min-h-[80px] rounded-xl p-2 flex flex-col items-center gap-0.5 transition-colors ${
                  isTodayDate
                    ? "bg-primary/10"
                    : "hover:bg-surface-container"
                }`}
              >
                <span className={`text-sm font-medium ${
                  isTodayDate
                    ? "text-primary"
                    : isCurrentMonth
                      ? "text-on-surface"
                      : "text-on-surface-variant/40"
                }`}>
                  {format(date, "d")}
                </span>
                {hasCompletion && total > 0 && (
                  <span className="text-[10px] text-on-surface-variant/60 text-center leading-tight">
                    Выполнено {completed} из {total}
                  </span>
                )}
                {total > 0 && !hasCompletion && (
                  <span className="text-[10px] text-on-surface-variant/30 text-center">
                    —
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-on-surface-variant">выполнено</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-surface-container-high" />
          <span className="text-on-surface-variant">не выполнено</span>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Progress */}
        <div className="bg-surface-container-low rounded-2xl p-5">
          <p className="text-sm text-on-surface-variant mb-1">Прогресс месяца</p>
          <p className="text-3xl font-bold text-on-surface">{monthlyProgress}%</p>
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${monthlyProgress}%` }}
            />
          </div>
          <p className="text-xs text-on-surface-variant/60 mt-2">
            {monthlyProgress >= 70 ? "Отличный темп!" : "Продолжайте в том же духе!"}
          </p>
        </div>

        {/* Current Streak */}
        <div className="bg-surface-container-low rounded-2xl p-5">
          <p className="text-sm text-on-surface-variant mb-1">Текущая серия</p>
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-tertiary" />
            <span className="text-3xl font-bold text-tertiary">{currentStreak}</span>
            <span className="text-sm text-on-surface-variant">дней</span>
          </div>
          <p className="text-xs text-on-surface-variant/60 mt-2">
            Новый рекорд близок
          </p>
        </div>
      </div>
    </div>
  );
}
