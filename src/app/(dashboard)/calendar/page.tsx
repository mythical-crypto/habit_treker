import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, completions } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";
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
  
  const monthStr = format(currentDate, "yyyy-MM");
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
            sql`${completions.date} >= ${format(monthStart, "yyyy-MM-dd")}`,
            sql`${completions.date} <= ${format(monthEnd, "yyyy-MM-dd")}`,
            sql`${completions.habitId} IN (${sql.join(
              habitIds.map((id) => sql`${id}`),
              sql`, `
            )})`
          )
        )
    : [];

  // Calculate completions per day
  const dayStats = days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayCompletions = monthCompletions.filter(
      (c) => c.date === dateStr && c.completed
    );
    const totalForDay = userHabits.filter((h) => {
      // Simple frequency check - assume daily for now
      return true;
    }).length;
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
        .where(
          sql`${completions.habitId} IN (${sql.join(
            habitIds.map((id) => sql`${id}`),
            sql`, `
          )})`
        )
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
        <div>
          <h1 className="text-[1.5rem] font-semibold text-on-surface tracking-tight">
            Календарь
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5 capitalize">
            {format(currentDate, "MMMM yyyy", { locale: ru })}
          </p>
        </div>
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
            <div key={`offset-cell-${i}`} className="aspect-square" />
          ))}

          {dayStats.map(({ date, completed, total }) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isTodayDate = isToday(date);
            const progress = total > 0 ? completed / total : 0;

            return (
              <div
                key={date.toISOString()}
                className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isTodayDate
                    ? "bg-primary/10"
                    : "hover:bg-surface-container"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isTodayDate
                      ? "text-primary"
                      : isCurrentMonth
                      ? "text-on-surface"
                      : "text-on-surface-variant/40"
                  }`}
                >
                  {format(date, "d")}
                </span>
                {total > 0 && (
                  <div className="flex gap-0.5">
                    {progress >= 1 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    )}
                    {progress > 0 && progress < 1 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    )}
                  </div>
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
          <span className="text-on-surface-variant">Выполнено</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/40" />
          <span className="text-on-surface-variant">Частично</span>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-surface-container-low rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-on-surface-variant">Прогресс месяца</p>
          <p className="text-2xl font-bold text-on-surface">{monthlyProgress}%</p>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-tertiary" />
          <div className="text-right">
            <p className="text-sm text-on-surface-variant">Текущая серия</p>
            <p className="text-2xl font-bold text-tertiary">{currentStreak} дн</p>
          </div>
        </div>
      </div>
    </div>
  );
}
