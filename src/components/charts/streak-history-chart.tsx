"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface StreakHistoryChartProps {
  data: {
    name: string;
    current: number;
    best: number;
    color: string;
  }[];
}

export function StreakHistoryChart({ data }: StreakHistoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          type="number"
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
          width={100}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            backgroundColor: "hsl(var(--popover))",
            color: "hsl(var(--popover-foreground))",
          }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={8}
        />
        <Bar
          dataKey="current"
          name="Текущая серия"
          fill="hsl(var(--primary))"
          radius={[0, 4, 4, 0]}
        />
        <Bar
          dataKey="best"
          name="Лучшая серия"
          fill="hsl(var(--secondary))"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
