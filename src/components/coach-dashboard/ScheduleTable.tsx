"use client";

import { ClassInfo } from "@/types";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Clock } from "lucide-react";

interface ScheduleTableProps {
  classes: ClassInfo[];
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Thứ Hai" },
  { value: 2, label: "Thứ Ba" },
  { value: 3, label: "Thứ Tư" },
  { value: 4, label: "Thứ Năm" },
  { value: 5, label: "Thứ Sáu" },
  { value: 6, label: "Thứ Bảy" },
  { value: 0, label: "Chủ Nhật" },
];

const TIME_SLOTS = [
  "08:00 - 09:30",
  "17:00 - 18:30",
  "17:30 - 19:00",
  "18:00 - 19:30",
];

export default function ScheduleTable({ classes }: ScheduleTableProps) {
  const router = useRouter();

  // Helper to find a class in a specific slot and day
  const getClassInSlot = (day: number, slot: string) => {
    return classes.find((c) =>
      c.schedule.some((s) => {
        const slotTime = `${s.startTime} - ${s.endTime}`;
        return s.dayOfWeek === day && slotTime === slot;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Desktop view */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-navy text-white">
              <th className="w-36 p-4 font-semibold text-sm border-r border-navy-light">Giờ học</th>
              {DAYS_OF_WEEK.map((day) => (
                <th key={day.value} className="p-4 font-semibold text-sm border-r border-navy-light last:border-r-0">
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TIME_SLOTS.map((slot) => (
              <tr key={slot} className="hover:bg-slate-50/55 transition-colors">
                <td className="p-4 align-middle font-medium border-r border-border text-sm text-muted-foreground flex items-center gap-1.5 h-28">
                  <Clock className="h-4 w-4 text-orange" />
                  {slot}
                </td>
                {DAYS_OF_WEEK.map((day) => {
                  const classItem = getClassInSlot(day.value, slot);
                  return (
                    <td
                      key={day.value}
                      className="p-2 border-r border-border last:border-r-0 align-middle h-28"
                    >
                      {classItem ? (
                        <div
                          onClick={() => router.push(`/dashboard/lop/${classItem.id}`)}
                          className="h-full w-full p-2.5 rounded-lg border border-navy/10 hover:border-orange bg-[#FAFBFC] hover:bg-[#FF6B35]/5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between group"
                        >
                          <div>
                            <p className="font-bold text-xs text-navy group-hover:text-orange line-clamp-1 transition-colors">
                              {classItem.name}
                            </p>
                            <div className="flex items-center text-[10px] text-muted-foreground mt-1 gap-0.5">
                              <MapPin className="h-3 w-3 text-orange shrink-0" />
                              <span className="line-clamp-1">{classItem.court.name}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-1 border-t border-slate-100 pt-1">
                            <span className="text-[10px] text-muted-foreground">
                              LV: <span className="font-bold text-navy capitalize">{classItem.level}</span>
                            </span>
                            <span className="text-[10px] bg-navy/10 text-navy px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                              <Users className="h-2.5 w-2.5" />
                              {classItem.currentStudents}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 text-xs select-none">
                          Trống
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Day List Accordion style */}
      <div className="block lg:hidden space-y-4">
        {DAYS_OF_WEEK.map((day) => {
          // Find classes in this day
          const dayClasses = classes.filter((c) =>
            c.schedule.some((s) => s.dayOfWeek === day.value)
          );

          return (
            <Card key={day.value} className="border-border">
              <div className="bg-navy p-3 rounded-t-lg flex justify-between items-center text-white">
                <h3 className="font-bold text-sm">{day.label}</h3>
                <Badge className="bg-orange hover:bg-orange text-white border-none text-[10px]">
                  {dayClasses.length} lớp
                </Badge>
              </div>
              <CardContent className="p-3 space-y-2.5 bg-slate-50/50">
                {dayClasses.length > 0 ? (
                  dayClasses.map((classItem) => {
                    // Find matching schedule item
                    const sched = classItem.schedule.find(
                      (s) => s.dayOfWeek === day.value
                    );
                    return (
                      <div
                        key={classItem.id}
                        onClick={() => router.push(`/dashboard/lop/${classItem.id}`)}
                        className="p-3 bg-white border border-border rounded-lg shadow-sm hover:border-orange cursor-pointer transition-all duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-navy">{classItem.name}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                              <Clock className="h-3.5 w-3.5 text-orange" />
                              <span>
                                {sched?.startTime} - {sched?.endTime}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                              <MapPin className="h-3.5 w-3.5 text-orange shrink-0" />
                              <span className="line-clamp-1">{classItem.court.name}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-navy text-navy font-semibold text-[10px] capitalize">
                            {classItem.level}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-xs">
                          <span className="text-muted-foreground">
                            Huấn luyện viên: <span className="font-medium text-navy">{classItem.coach.name}</span>
                          </span>
                          <span className="text-navy font-semibold flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {classItem.currentStudents} HS
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-center py-4 text-muted-foreground">Không có lịch dạy ngày này</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
