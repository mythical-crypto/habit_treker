"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const COLORS = [
  { value: "#0F53CD", label: "Синий" },
  { value: "#006E28", label: "Зеленый" },
  { value: "#894D00", label: "Оранжевый" },
  { value: "#BA1A1A", label: "Красный" },
  { value: "#6B4C9A", label: "Фиолетовый" },
  { value: "#0077B6", label: "Голубой" },
];

const ICONS = [
  { value: "🧘", label: "Медитация" },
  { value: "📖", label: "Чтение" },
  { value: "💧", label: "Вода" },
  { value: "🏃", label: "Спорт" },
  { value: "🎨", label: "Творчество" },
  { value: "🍎", label: "Питание" },
  { value: "😴", label: "Сон" },
  { value: "💻", label: "Работа" },
];

const DAYS = [
  { value: 1, label: "Пн" },
  { value: 2, label: "Вт" },
  { value: 3, label: "Ср" },
  { value: 4, label: "Чт" },
  { value: 5, label: "Пт" },
  { value: 6, label: "Сб" },
  { value: 7, label: "Вс" },
];

interface HabitFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    name?: string;
    description?: string;
    frequency?: string;
    color?: string;
    icon?: string;
    targetPerWeek?: number;
    customDays?: number[];
  };
  submitLabel: string;
}

export function HabitForm({ action, defaultValues, submitLabel }: HabitFormProps) {
  const [isPending, startTransition] = useTransition();
  const [color, setColor] = useState(defaultValues?.color ?? "#0F53CD");
  const [icon, setIcon] = useState(defaultValues?.icon ?? "🧘");
  const [frequency, setFrequency] = useState(defaultValues?.frequency ?? "daily");
  const [customDays, setCustomDays] = useState<number[]>(defaultValues?.customDays ?? []);

  function toggleDay(day: number) {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleSubmit(formData: FormData) {
    formData.set("color", color);
    formData.set("icon", icon);
    formData.set("frequency", frequency);
    if (frequency === "custom") {
      formData.set("customDays", JSON.stringify(customDays));
    }
    startTransition(() => action(formData));
  }

  return (
    <div className="space-y-6">
      <Link
        href="/habits"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к привычкам
      </Link>

      <form action={handleSubmit} className="bg-surface-container-lowest rounded-2xl p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-on-surface">
            Название
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Например, Утренняя зарядка"
            defaultValue={defaultValues?.name}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-on-surface">
            Описание
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Необязательное описание..."
            defaultValue={defaultValues?.description}
            rows={3}
            className="rounded-2xl bg-surface-container-highest border-0 focus-visible:bg-surface-container-lowest focus-visible:ring-1 focus-visible:ring-primary/15"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-on-surface">Частота</Label>
          <Select value={frequency} onValueChange={(v) => setFrequency(v ?? "daily")}>
            <SelectTrigger className="h-11 rounded-2xl bg-surface-container-highest border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Ежедневно</SelectItem>
              <SelectItem value="weekly">Еженедельно</SelectItem>
              <SelectItem value="custom">Выборочно</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {frequency === "custom" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-on-surface">Дни недели</Label>
            <div className="flex gap-2">
              {DAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    customDays.includes(day.value)
                      ? "bg-primary text-on-primary scale-110"
                      : "bg-surface-container-high hover:bg-surface-container text-on-surface"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium text-on-surface">Иконка</Label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((i) => (
              <button
                key={i.value}
                type="button"
                onClick={() => setIcon(i.value)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                  icon === i.value
                    ? "bg-primary text-on-primary scale-110"
                    : "bg-surface-container-high hover:bg-surface-container"
                }`}
                title={i.label}
              >
                {i.value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-on-surface">Цвет</Label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`w-10 h-10 rounded-full transition-transform ${
                  color === c.value
                    ? "ring-2 ring-on-surface scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: c.value }}
                onClick={() => setColor(c.value)}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetPerWeek" className="text-sm font-medium text-on-surface">
            Цель в неделю
          </Label>
          <Input
            id="targetPerWeek"
            name="targetPerWeek"
            type="number"
            min={1}
            max={7}
            defaultValue={defaultValues?.targetPerWeek ?? 7}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/habits" className="flex-1">
            <Button variant="tertiary" className="w-full">
              Отмена
            </Button>
          </Link>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? "Сохранение..." : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
