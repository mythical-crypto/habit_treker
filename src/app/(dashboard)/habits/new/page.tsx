import { createHabit } from "@/app/actions/habits";
import { HabitForm } from "@/components/habit-form";

export default function NewHabitPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-[1.5rem] font-semibold text-on-surface tracking-tight">
          Новая привычка
        </h1>
        <p className="text-sm text-on-surface-variant">
          Создайте новую привычку для отслеживания
        </p>
      </div>

      <HabitForm action={createHabit} submitLabel="Создать привычку" />
    </div>
  );
}
