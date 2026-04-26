"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface HabitDistributionChartProps {
  data: { name: string; completed: number; missed: number; color: string }[];
}

export function HabitDistributionChart({
  data,
}: HabitDistributionChartProps) {
  const pieData = data.map((item) => ({
    name: item.name,
    value: item.completed,
    color: item.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          nameKey="name"
        >
          {pieData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            backgroundColor: "hsl(var(--popover))",
            color: "hsl(var(--popover-foreground))",
          }}
          formatter={(value, name) => [
            `${value as number} выполнений`,
            name as string,
          ]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
