"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyChart } from "@/components/charts/weekly-chart";
import { CompletionRateChart } from "@/components/charts/completion-rate-chart";
import { HabitDistributionChart } from "@/components/charts/habit-distribution-chart";
import { StreakHistoryChart } from "@/components/charts/streak-history-chart";
import { Flame, Trophy, TrendingUp, Target, Calendar, Lightbulb } from "lucide-react";

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
  totalCompleted,
  currentStreak,
  bestStreak,
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
            Ваш прогресс и аналитика
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Выполнено"
          value={String(totalCompleted)}
          color="primary"
        />
        <StatCard
          icon={Flame}
          label="Текущая серия"
          value={`${currentStreak} дн`}
          color="tertiary"
        />
        <StatCard
          icon={Trophy}
          label="Лучшая серия"
          value={`${bestStreak} дн`}
          color="secondary"
        />
        <StatCard
          icon={TrendingUp}
          label="Успешность"
          value={`${completionRate}%`}
          color="primary"
        />
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-surface-container-lowest border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">
                  {period === "week" ? "За неделю" : "За месяц"}
                </p>
                <p className="text-2xl font-bold text-on-surface mt-1">
                  {insights.rate}%
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {insights.completed} из {insights.total} выполнено
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Lightbulb className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">
                  Лучший день
                </p>
                <p className="text-lg font-bold text-on-surface mt-1">
                  {insights.bestDay}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {insights.trend === "positive"
                    ? "Отличная динамика!"
                    : "Есть куда расти"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate Chart */}
        <Card className="bg-surface-container-lowest border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Динамика выполнения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CompletionRateChart
              data={completionRateData}
              color="#3b82f6"
            />
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
            <CardTitle className="text-base">
              Активность по дням недели
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyChart data={weeklyData} />
          </CardContent>
        </Card>

        {/* Streak History */}
        <Card className="bg-surface-container-lowest border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              История серий
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StreakHistoryChart data={streakHistory} />
          </CardContent>
        </Card>
      </div>

      {/* Current Streaks */}
      {topStreaks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-on-surface">
            Текущие серии
          </h2>
          <div className="space-y-3">
            {topStreaks.map((habit) => (
              <div
                key={habit.id}
                className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: habit.color ?? "#0F53CD" }}
                >
                  <span className="text-lg">{habit.icon ?? "✨"}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-on-surface">{habit.name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-tertiary" />
                  <span className="text-sm font-semibold text-tertiary">
                    {habit.streak}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: "primary" | "secondary" | "tertiary";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    tertiary: "bg-tertiary/10 text-tertiary",
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 space-y-3">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
        <p className="text-xs text-on-surface-variant">{label}</p>
      </div>
    </div>
  );
}
