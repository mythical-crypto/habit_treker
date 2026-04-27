"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyChart } from "@/components/charts/weekly-chart";
import { CompletionRateChart } from "@/components/charts/completion-rate-chart";
import { HabitDistributionChart } from "@/components/charts/habit-distribution-chart";
import { StreakHistoryChart } from "@/components/charts/streak-history-chart";
import { Flame, Trophy, Lightbulb } from "lucide-react";

interface StatisticsClientProps {
  totalCompleted: number;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  weeklyData: { day: string; completed: number; total: number }[];
  weeklyCompletionRate: { label: string; rate: number }[];
  monthlyCompletionRate: { label: string; rate: number }[];
  habitDistribution: {
    name: string;
    completed: number;
    missed: number;
    color: string;
  }[];
  streakHistory: {
    name: string;
    current: number;
    best: number;
    color: string;
  }[];
  topStreaks: {
    id: number;
    name: string;
    color: string | null;
    icon: string | null;
    streak: number;
  }[];
  weeklyInsights: {
    completed: number;
    total: number;
    rate: number;
    bestDay: string;
    trend: "positive" | "negative";
  };
  monthlyInsights: {
    completed: number;
    total: number;
    rate: number;
    bestDay: string;
    trend: "positive" | "negative";
  };
}

export function StatisticsClient({
  completionRate,
  weeklyData,
  weeklyCompletionRate,
  monthlyCompletionRate,
  habitDistribution,
  streakHistory,
  topStreaks,
  weeklyInsights,
  monthlyInsights,
}: StatisticsClientProps) {
  const [period, setPeriod] = useState<"week" | "month">("week");

  const insights = period === "week" ? weeklyInsights : monthlyInsights;
  const completionRateData =
    period === "week" ? weeklyCompletionRate : monthlyCompletionRate;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-[1.5rem] font-semibold text-on-surface tracking-tight">
            Статистика
          </h1>
          <p className="text-sm text-on-surface-variant">
            Ваш прогресс и осознанность за последнее время
          </p>
        </div>

        {/* Period Toggle */}
        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as "week" | "month")}
        >
          <TabsList className="h-9">
            <TabsTrigger value="week" className="text-xs px-3">
              Неделя
            </TabsTrigger>
            <TabsTrigger value="month" className="text-xs px-3">
              Месяц
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Progress & Streaks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Общий прогресс */}
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <h3 className="text-sm font-medium text-on-surface-variant mb-4">
            Общий прогресс
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <title>Общий прогресс: {completionRate}%</title>
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-surface-container-high"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-primary"
                  strokeDasharray={`${completionRate * 2.64} ${264 - completionRate * 2.64}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-on-surface">
                  {completionRate}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant text-center mt-3">
            выполнено за {period === "week" ? "неделю" : "месяц"}
          </p>
        </div>

        {/* Текущие серии */}
        <div className="bg-surface-container-lowest rounded-2xl p-6">
          <h3 className="text-sm font-medium text-on-surface-variant mb-4">
            Текущие серии
          </h3>
          <div className="space-y-4">
            {topStreaks.length > 0 ? (
              topStreaks.map((habit) => (
                <div key={habit.id} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-container"
                    style={
                      habit.color
                        ? { backgroundColor: habit.color + "20" }
                        : undefined
                    }
                  >
                    <span className="text-base">{habit.icon ?? "✨"}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">
                      {habit.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-on-surface">
                      {habit.streak} дней
                    </span>
                    {habit.streak > 0 && (
                      <Flame className="h-4 w-4 text-tertiary" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-4">
                Нет активных серий
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">Инсайт недели</p>
            <p className="text-sm text-on-surface-variant mt-1">
              {insights.trend === "positive"
                ? "Отличная динамика! Вы на верном пути к своим целям."
                : "Есть потенциал для роста. Попробуйте изменить расписание."}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-tertiary/10 flex items-center justify-center shrink-0">
            <Trophy className="h-4 w-4 text-tertiary" />
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">До цели</p>
            <p className="text-sm text-on-surface-variant mt-1">
              {topStreaks.length > 0
                ? `Осталось совсем немного до нового рекорда по серии "${topStreaks[0].name}"!`
                : "Создайте привычки и начните отслеживать прогресс!"}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate Chart */}
        <Card className="bg-surface-container-lowest border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Динамика выполнения</CardTitle>
          </CardHeader>
          <CardContent>
            <CompletionRateChart data={completionRateData} color="#3b82f6" />
          </CardContent>
        </Card>

        {/* Habit Distribution */}
        <Card className="bg-surface-container-lowest border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Распределение по привычкам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HabitDistributionChart data={habitDistribution} />
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="bg-surface-container-lowest border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Активность по дням</CardTitle>
            {weeklyData.length > 0 && (
              <p className="text-xs text-on-surface-variant">
                {weeklyData[0]?.day} — {weeklyData[weeklyData.length - 1]?.day}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <WeeklyChart data={weeklyData} />
          </CardContent>
        </Card>

        {/* Streak History */}
        <Card className="bg-surface-container-lowest border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">История серий</CardTitle>
          </CardHeader>
          <CardContent>
            <StreakHistoryChart data={streakHistory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
