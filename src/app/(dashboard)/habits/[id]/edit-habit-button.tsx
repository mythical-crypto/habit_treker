"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export function EditHabitButton({ habitId }: { habitId: number }) {
  return (
    <Link href={`/habits/${habitId}/edit`}>
      <Button variant="outline" size="sm">
        <Pencil className="h-4 w-4 mr-2" />
        Редактировать
      </Button>
    </Link>
  );
}
