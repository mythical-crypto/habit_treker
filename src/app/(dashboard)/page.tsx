import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, completions } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { format } from "date-fns";
import Link from "next/link";
import { Flame, Plus, Quote, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateStreak } from "@/lib/streaks";
import { CreateHabitDialog } from "@/components/create-habit-dialog";

const quotes = [
  "Мы — это то, что мы делаем постоянно. Совершенство, следовательно, не действие, а привычка.",
  "Маленькие шаги каждый день ведут к большим достижениям.",
  "Привычка — вторая натура.",
  "Лучшее время начать — сейчас.",
  "Постоянство — ключ к мастерству.",
];

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) return null;

  const today = format(new Date(), "yyyy-MM-dd");

  const userHabits = await db.query.habits.findMany({
    where: eq(habits.userId, user.id),
  });

  const activeHabits = userHabits.filter((h) => !h.archivedAt);

  const todayCompletions = await db
    .select()
    .from(completions)
    .where(
      and(
        eq(completions.date, today),
        inArray(completions.habitId, userHabits.map((h) => h.id))
      )
    );

  const completedToday = todayCompletions.filter((c) => c.completed).length;
  const totalHabits = activeHabits.length;

  // Get streaks for each habit
  const habitsWithStreaks = await Promise.all(
    activeHabits.map(async (habit) => {
      const habitCompletions = await db
        .select()
        .from(completions)
        .where(eq(completions.habitId, habit.id))
        .orderBy(completions.date);
      
      const streak = calculateStreak(
        habitCompletions.map((c) => ({ date: c.date, completed: c.completed ?? false }))
      );
      
      const isCompleted = todayCompletions.some(
        (c) => c.habitId === habit.id && c.completed
      );
      
      return { ...habit, streak, isCompleted };
    })
  );

  const todayQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-[1.5rem] font-semibold text-on-surface tracking-tight">
          Привет, {user.name ?? "там"}!
        </h1>
        <p className="text-sm text-on-surface-variant">
          Выполнено {completedToday} из {totalHabits} сегодня
        </p>
      </div>

      {/* Habit List */}
      <div className="space-y-4">
        {habitsWithStreaks.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-8 text-center">
            <p className="text-on-surface-variant mb-4">
              У вас пока нет привычек. Создайте первую!
            </p>
            <Link href="/habits/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить привычку
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {habitsWithStreaks.map((habit) => (
              <div
                key={habit.id}
                className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: habit.color ?? "#0F53CD" }}
                >
                  <span className="text-lg">{habit.icon ?? "✨"}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-base">
                    {habit.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {habit.streak > 0 && (
                      <div className="flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-tertiary" />
                        <span className="text-xs font-medium text-tertiary">
                          {habit.streak} дней
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions - edit and delete */}
                <div className="flex items-center gap-1">
                  <Link href={`/habits/${habit.id}`}>
                    <button type="button" className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant/40 hover:text-on-surface-variant hover:bg-surface-container transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                  <form action={async () => { "use server"; const { deleteHabit } = await import("@/app/actions/habits"); await deleteHabit(habit.id); }}>
                    <button type="submit" className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant/40 hover:text-error hover:bg-error-container/50 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>

                {/* Completion Toggle */}
                <form
                  action={async () => {
                    "use server";
                    const { toggleCompletion } = await import(
                      "@/app/actions/completions"
                    );
                    await toggleCompletion(habit.id, today);
                  }}
                >
                  <button
                    type="submit"
                    aria-label={habit.isCompleted ? "Отметить невыполненной" : "Отметить выполненной"}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      habit.isCompleted
                        ? "bg-secondary border-secondary scale-100"
                        : "border-outline-variant/30 hover:border-outline/50"
                    }`}
                  >
                    {habit.isCompleted && (
                      <svg
                        className="w-4 h-4 text-on-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      {userHabits.length > 0 && <CreateHabitDialog />}

      {/* Quote Card */}
      <div className="bg-surface-container-low rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
              Мудрость дня
            </p>
            <p className="text-sm text-on-surface-variant italic leading-relaxed">
              {todayQuote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
