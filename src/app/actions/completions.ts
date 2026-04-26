"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, completions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function toggleCompletion(habitId: number, date: string) {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.id, habitId), eq(habits.userId, String(user.id))),
  });
  if (!habit) return { success: false, error: "Habit not found" };

  const existing = await db.query.completions.findFirst({
    where: and(
      eq(completions.habitId, habitId),
      eq(completions.date, date)
    ),
  });

  if (existing) {
    await db
      .update(completions)
      .set({ completed: !existing.completed })
      .where(eq(completions.id, existing.id));

    revalidatePath("/");
    return { success: true, completed: !existing.completed };
  }

  await db.insert(completions).values({
    habitId,
    date,
    completed: true,
  });

  revalidatePath("/");
  return { success: true, completed: true };
}
