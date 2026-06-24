"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type EquityChartPoint = {
  date: string;
  value: number;
};

export default function EquityChartClient({
  data,
}: {
  data: EquityChartPoint[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
