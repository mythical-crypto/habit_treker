"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { habits, completions } from "@/lib/db/schema";
import { eq, and, isNull, isNotNull } from "drizzle-orm";
import { z } from "zod";

const habitSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "custom"]),
  color: z.string().default("#3b82f6"),
  icon: z.string().optional(),
  targetPerWeek: z.coerce.number().min(1).max(7).default(7),
  customDays: z.string().optional(),
});

function parseCustomDays(customDaysStr: string | undefined): number[] | undefined {
  if (!customDaysStr) return undefined;
  try {
    const parsed = JSON.parse(customDaysStr);
    if (Array.isArray(parsed) && parsed.every((d) => typeof d === "number")) {
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return undefined;
}

export async function createHabit(formData: FormData) {
  const user = await getUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    frequency: formData.get("frequency"),
    color: formData.get("color"),
    icon: formData.get("icon"),
    targetPerWeek: formData.get("targetPerWeek"),
    customDays: formData.get("customDays"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { customDays, ...data } = parsed.data;

  await db.insert(habits).values({
    userId: String(user.id),
    ...data,
    customDays: parseCustomDays(customDays),
  });

  revalidatePath("/");
  revalidatePath("/habits");
  return { success: true };
}

export async function updateHabit(id: number, formData: FormData) {
  const user = await getUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const existing = await db.query.habits.findFirst({
    where: and(eq(habits.id, id), eq(habits.userId, String(user.id))),
  });
  if (!existing) return { success: false, error: "Привычка не найдена" };

  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    frequency: formData.get("frequency"),
    color: formData.get("color"),
    icon: formData.get("icon"),
    targetPerWeek: formData.get("targetPerWeek"),
    customDays: formData.get("customDays"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { customDays, ...data } = parsed.data;

  await db
    .update(habits)
    .set({
      ...data,
      customDays: parseCustomDays(customDays),
      updatedAt: new Date(),
    })
    .where(eq(habits.id, id));

  revalidatePath("/");
  redirect(`/habits/${id}`);
}

export async function deleteHabit(id: number) {
  const user = await getUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const existing = await db.query.habits.findFirst({
    where: and(eq(habits.id, id), eq(habits.userId, String(user.id))),
  });
  if (!existing) return { success: false, error: "Привычка не найдена" };

  await db.delete(completions).where(eq(completions.habitId, id));
  await db.delete(habits).where(eq(habits.id, id));

  revalidatePath("/");
  redirect("/habits");
}

export async function archiveHabit(id: number) {
  const user = await getUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const existing = await db.query.habits.findFirst({
    where: and(eq(habits.id, id), eq(habits.userId, String(user.id))),
  });
  if (!existing) return { success: false, error: "Привычка не найдена" };

  await db
    .update(habits)
    .set({ archivedAt: new Date(), updatedAt: new Date() })
    .where(eq(habits.id, id));

  revalidatePath("/");
  revalidatePath("/habits");
  return { success: true };
}

export async function restoreHabit(id: number) {
  const user = await getUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const existing = await db.query.habits.findFirst({
    where: and(eq(habits.id, id), eq(habits.userId, String(user.id))),
  });
  if (!existing) return { success: false, error: "Привычка не найдена" };

  await db
    .update(habits)
    .set({ archivedAt: null, updatedAt: new Date() })
    .where(eq(habits.id, id));

  revalidatePath("/");
  revalidatePath("/habits");
  return { success: true };
}

export async function getActiveHabits() {
  const user = await getUser();
  if (!user) return [];

  return db.query.habits.findMany({
    where: and(eq(habits.userId, String(user.id)), isNull(habits.archivedAt)),
    orderBy: (habits, { desc }) => [desc(habits.createdAt)],
  });
}

export async function getArchivedHabits() {
  const user = await getUser();
  if (!user) return [];

  return db.query.habits.findMany({
    where: and(eq(habits.userId, String(user.id)), isNotNull(habits.archivedAt)),
    orderBy: (habits, { desc }) => [desc(habits.createdAt)],
  });
}
