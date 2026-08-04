'use client';
import React, { useMemo } from 'react';

interface StatsProps {
  present: number;
  absent: number;
  late: number;
}

export default function AttendanceStats({ present, absent, late }: StatsProps) {
  const total = present + absent + late;
  const rate = useMemo(() => {
    return total > 0 ? Math.round((present / total) * 100) : 0;
  }, [present, total]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-white">
        <p className="text-sm text-slate-400">Có mặt</p>
        <p className="text-2xl font-bold text-emerald-400">{present}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-white">
        <p className="text-sm text-slate-400">Đi muộn</p>
        <p className="text-2xl font-bold text-amber-400">{late}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-white">
        <p className="text-sm text-slate-400">Vắng mặt</p>
        <p className="text-2xl font-bold text-rose-400">{absent}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-white">
        <p className="text-sm text-slate-400">Tỷ lệ chuyên cần</p>
        <p className="text-2xl font-bold text-cyan-400">{rate}%</p>
      </div>
    </div>
  );
}