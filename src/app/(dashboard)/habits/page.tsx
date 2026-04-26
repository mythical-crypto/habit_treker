import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Plus, Pencil, Archive, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { archiveHabit, restoreHabit } from "@/app/actions/habits";

export default async function HabitsPage() {
  const user = await getUser();
  if (!user) return null;

  const allHabits = await db.query.habits.findMany({
    where: eq(habits.userId, user.id),
    orderBy: (habits, { desc }) => [desc(habits.createdAt)],
  });

  const activeHabits = allHabits.filter((h) => !h.archivedAt);
  const archivedHabits = allHabits.filter((h) => h.archivedAt);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-on-surface tracking-tight">
            Мои привычки
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {activeHabits.length} {getHabitsCountText(activeHabits.length)}
          </p>
        </div>
        <Link href="/habits/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </Link>
      </div>

      {/* Active Habits Grid */}
      {activeHabits.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeHabits.map((habit) => (
            <div key={habit.id} className="bg-surface-container-lowest rounded-2xl p-4 hover:bg-surface-container-low transition-colors group">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <Link href={`/habits/${habit.id}`} className="shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: habit.color ?? "#0F53CD" }}
                  >
                    <span className="text-lg">{habit.icon ?? "✨"}</span>
                  </div>
                </Link>

                {/* Info */}
                <Link href={`/habits/${habit.id}`} className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-base truncate">
                    {habit.name}
                  </p>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    {getFrequencyLabel(habit.frequency)} · {habit.targetPerWeek}x/нед
                  </p>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/habits/${habit.id}/edit`}>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-on-surface-variant" />
                    </Button>
                  </Link>
                  <ArchiveButton habitId={habit.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archived Habits */}
      {archivedHabits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">
            Архив ({archivedHabits.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
            {archivedHabits.map((habit) => (
              <div key={habit.id} className="bg-surface-container-lowest rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center grayscale"
                    style={{ backgroundColor: habit.color ?? "#0F53CD" }}
                  >
                    <span className="text-lg">{habit.icon ?? "✨"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-base truncate line-through">
                      {habit.name}
                    </p>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      Архивирована
                    </p>
                  </div>
                  <RestoreButton habitId={habit.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArchiveButton({ habitId }: { habitId: number }) {
  async function handleArchive() {
    "use server";
    await archiveHabit(habitId);
  }
  return (
    <form action={handleArchive}>
      <Button variant="ghost" size="icon-sm" className="h-8 w-8" type="submit" title="Архивировать">
        <Archive className="h-4 w-4 text-on-surface-variant" />
      </Button>
    </form>
  );
}

function RestoreButton({ habitId }: { habitId: number }) {
  async function handleRestore() {
    "use server";
    await restoreHabit(habitId);
  }
  return (
    <form action={handleRestore}>
      <Button variant="ghost" size="icon-sm" className="h-8 w-8" type="submit" title="Восстановить">
        <RotateCcw className="h-4 w-4 text-on-surface-variant" />
      </Button>
    </form>
  );
}

function getHabitsCountText(count: number): string {
  if (count === 0) return "привычек";
  if (count === 1) return "привычка";
  if (count < 5) return "привычки";
  return "привычек";
}

function getFrequencyLabel(frequency: string): string {
  switch (frequency) {
    case "daily":
      return "Ежедневно";
    case "weekly":
      return "Еженедельно";
    default:
      return frequency;
  }
}
