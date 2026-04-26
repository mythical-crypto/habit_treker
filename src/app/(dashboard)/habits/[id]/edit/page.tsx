import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { updateHabit } from "@/app/actions/habits";
import { HabitForm } from "@/components/habit-form";

export default async function EditHabitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return null;

  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.id, parseInt(id)), eq(habits.userId, String(user.id))),
  });

  if (!habit) notFound();

  const boundUpdate = updateHabit.bind(null, habit.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Habit</h1>
      <HabitForm
        action={boundUpdate}
        submitLabel="Сохранить изменения"
        defaultValues={{
          name: habit.name,
          description: habit.description ?? undefined,
          frequency: habit.frequency,
          color: habit.color ?? undefined,
          icon: habit.icon ?? undefined,
          targetPerWeek: habit.targetPerWeek ?? undefined,
          customDays: habit.customDays ?? undefined,
        }}
      />
    </div>
  );
}
