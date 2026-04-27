"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createHabit } from "@/app/actions/habits";

const ICONS = ["🏃", "📚", "💧", "🧘", "🎨", "🍎", "😴", "💻"];
const DAYS = [
  { value: 1, label: "Пн" },
  { value: 2, label: "Вт" },
  { value: 3, label: "Ср" },
  { value: 4, label: "Чт" },
  { value: 5, label: "Пт" },
  { value: 6, label: "Сб" },
  { value: 7, label: "Вс" },
];

export function CreateHabitDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [icon, setIcon] = useState("🏃");
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  function toggleDay(day: number) {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleSubmit(formData: FormData) {
    formData.set("color", "#0F53CD");
    formData.set("icon", icon);
    if (customDays.length === 7) {
      formData.set("frequency", "daily");
    } else {
      formData.set("frequency", "custom");
      formData.set("customDays", JSON.stringify(customDays));
    }
    formData.set("targetPerWeek", String(customDays.length));

    startTransition(async () => {
      const result = await createHabit(formData);
      if (result?.success) {
        setOpen(false);
        router.refresh();
        setIcon("🏃");
        setCustomDays([1, 2, 3, 4, 5, 6, 7]);
      }
    });
  }

  return (
    <>
      <div className="fixed bottom-8 right-8">
        <Button
          onClick={() => setOpen(true)}
          className="shadow-[0_12px_32px_-4px_rgba(25,28,29,0.06)] rounded-2xl"
        >
          <Plus className="h-5 w-5" />
          Добавить привычку
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[440px] bg-surface-container-lowest border-0 rounded-2xl p-6 ring-0">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-on-surface">
              Новая привычка
            </DialogTitle>
          </DialogHeader>

          <form action={handleSubmit} className="space-y-5 mt-2">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-on-surface">
                Название
              </Label>
              <Input
                name="name"
                placeholder="Название привычки"
                required
                className="bg-surface-container-highest border-0 focus-visible:bg-surface-container-lowest focus-visible:ring-1 focus-visible:ring-primary/15"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-on-surface">
                Частота повторений
              </Label>
              <div className="flex gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`flex-1 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                      customDays.includes(day.value)
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high hover:bg-surface-container text-on-surface"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-on-surface">
                Иконка
              </Label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      icon === i
                        ? "bg-primary scale-110"
                        : "bg-surface-container-high hover:bg-surface-container"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="tertiary"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
