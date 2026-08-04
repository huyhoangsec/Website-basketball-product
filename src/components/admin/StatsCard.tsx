"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isUp: boolean;
  };
  className?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  trend,
  className = "",
  iconBgColor = "bg-orange/10",
  iconColor = "text-orange",
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`border-border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {label}
              </p>
              <h3 className="text-2xl font-black text-navy tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor}`}>
              {icon}
            </div>
          </div>

          {trend && (
            <div className="flex items-center gap-1 mt-4 pt-3 border-t border-slate-100">
              <span
                className={`inline-flex items-center text-xs font-bold ${
                  trend.isUp ? "text-green-600" : "text-red-500"
                }`}
              >
                {trend.isUp ? (
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                )}
                {trend.value}
              </span>
              <span className="text-[11px] text-muted-foreground">so với tháng trước</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
