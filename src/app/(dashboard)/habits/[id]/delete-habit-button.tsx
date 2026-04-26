"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteHabit } from "@/app/actions/habits";

export function DeleteHabitButton({ habitId }: { habitId: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить эту привычку? Это действие нельзя отменить.")) return;
    await deleteHabit(habitId);
    router.push("/habits");
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 mr-2" />
      Удалить
    </Button>
  );
}
