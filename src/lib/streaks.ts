import { differenceInDays, format, subDays, parseISO } from "date-fns";

export function calculateStreak(
  completionData: { date: string; completed: boolean }[]
): number {
  const completed = completionData
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort()
    .reverse();

  if (completed.length === 0) return 0;

  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  if (completed[0] !== today && completed[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < completed.length; i++) {
    const diff = differenceInDays(
      parseISO(completed[i - 1]),
      parseISO(completed[i])
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateBestStreak(
  completionData: { date: string; completed: boolean }[]
): number {
  const completed = completionData
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort();

  if (completed.length === 0) return 0;

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completed.length; i++) {
    const diff = differenceInDays(
      parseISO(completed[i]),
      parseISO(completed[i - 1])
    );
    if (diff === 1) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (diff > 1) {
      currentStreak = 1;
    }
  }

  return bestStreak;
}

export function getCompletionRate(
  completionData: { date: string; completed: boolean }[],
  days: number
): number {
  if (days <= 0) return 0;
  const completedCount = completionData.filter((c) => c.completed).length;
  return Math.round((completedCount / days) * 100);
}
