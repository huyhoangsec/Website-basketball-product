"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface TooltipPayloadItem {
  name: string;
  value: number | string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border p-3 rounded-lg shadow-md space-y-1">
        {label && <p className="font-bold text-xs text-navy border-b pb-1 mb-1">{label}</p>}
        {payload.map((p, idx: number) => (
          <p key={idx} className="text-xs font-semibold flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
            {p.name}: <span className="text-navy">{String(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function ReportChart({
  type,
  data,
  dataKeys,
  xAxisKey,
  colors = ["#FF6B35", "#1B2A4A", "#10B981", "#F59E0B", "#8B5CF6"],
  height = 300,
}: {
  type: "line" | "bar" | "pie";
  data: Record<string, unknown>[];
  dataKeys: string[];
  xAxisKey?: string;
  colors?: string[];
  height?: number;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl"
      >
        <span className="text-xs text-muted-foreground animate-pulse">Đang tải biểu đồ...</span>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }} className="recharts-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        {type === "line" ? (
          <LineChart data={memoizedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            {dataKeys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[idx % colors.length]}
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
                dot={{ r: 3, strokeWidth: 1 }}
              />
            ))}
          </LineChart>
        ) : type === "bar" ? (
          <BarChart data={memoizedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            {dataKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[idx % colors.length]}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={memoizedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey={dataKeys[0]}
              labelLine={false}
            >
              {memoizedData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
