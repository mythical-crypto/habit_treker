"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Archive, RotateCcw } from "lucide-react";
import { archiveHabit, restoreHabit } from "@/app/actions/habits";

export function ArchiveHabitButton({
  habitId,
  archived,
}: {
  habitId: number;
  archived: boolean;
}) {
  const router = useRouter();

  async function handleArchive() {
    if (archived) {
      if (!confirm("Восстановить привычку?")) return;
      await restoreHabit(habitId);
    } else {
      if (!confirm("Архивировать привычку?")) return;
      await archiveHabit(habitId);
    }
    router.refresh();
  }

  return (
    <Button
      variant={archived ? "default" : "secondary"}
      size="sm"
      onClick={handleArchive}
    >
      {archived ? (
        <>
          <RotateCcw className="h-4 w-4 mr-2" />
          Восстановить
        </>
      ) : (
        <>
          <Archive className="h-4 w-4 mr-2" />
          В архив
        </>
      )}
    </Button>
  );
}
