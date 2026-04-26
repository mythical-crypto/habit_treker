import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, completions } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditHabitButton } from "./edit-habit-button";
import { DeleteHabitButton } from "./delete-habit-button";
import { ArchiveHabitButton } from "./archive-habit-button";

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Ежедневно",
  weekly: "Еженедельно",
  custom: "Выборочно",
};

const DAY_LABELS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return null;

  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.id, parseInt(id, 10)), eq(habits.userId, String(user.id))),
  });

  if (!habit) notFound();

  const isArchived = !!habit.archivedAt;

  const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const recentCompletions = await db
    .select()
    .from(completions)
    .where(
      and(eq(completions.habitId, habit.id), gte(completions.date, thirtyDaysAgo))
    )
    .orderBy(completions.date);

  const completedDates = new Set(
    recentCompletions.filter((c) => c.completed).map((c) => c.date)
  );

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
    return { date, completed: completedDates.has(date) };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: habit.color ?? "#3b82f6" }}
          />
          <div>
            <h1 className="text-2xl font-bold">{habit.name}</h1>
            {habit.description && (
              <p className="text-muted-foreground">{habit.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <EditHabitButton habitId={habit.id} />
          <ArchiveHabitButton habitId={habit.id} archived={isArchived} />
          <DeleteHabitButton habitId={habit.id} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {isArchived && (
          <Badge variant="destructive">В архиве</Badge>
        )}
        <Badge>{FREQUENCY_LABELS[habit.frequency] ?? habit.frequency}</Badge>
        <Badge variant="outline">{habit.targetPerWeek} в неделю</Badge>
        <Badge variant="secondary">
          {recentCompletions.filter((c) => c.completed).length} выполнений (30 дней)
        </Badge>
        {habit.frequency === "custom" && habit.customDays && habit.customDays.length > 0 && (
          <Badge variant="outline">
            {habit.customDays.map((d) => DAY_LABELS[d]).join(", ")}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Последние 30 дней</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-1.5">
            {last30Days.map((day) => (
              <div
                key={day.date}
                className={`aspect-square rounded-sm text-xs flex items-center justify-center ${
                  day.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
                title={`${day.date} ${day.completed ? "✓" : "—"}`}
              >
                {format(new Date(`${day.date}T00:00:00`), "d")}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
