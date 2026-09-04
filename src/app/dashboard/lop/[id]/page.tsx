"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import StudentList from "@/components/coach-dashboard/StudentList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, CalendarRange, Clock, ArrowLeft, ClipboardCheck, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { ClassInfo, Student } from "@/types";

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

const getDayName = (day: number) => {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  return days[day];
};

export default function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = use(params);

  // Fetch class details
  const { data: classItem, isLoading: loadingClass } = useQuery<ClassInfo>({
    queryKey: ["class", id],
    queryFn: async () => {
      const res = await api.get(`/public/classes`);
      const classes = res.data;
      return classes.find((c: { id: string }) => c.id === id);
    },
  });

  // Fetch students belonging to this class directly from coach API
  const { data: classStudents = [], isLoading: loadingStudents } = useQuery<Student[]>({
    queryKey: ["class-students", id],
    queryFn: async () => {
      const res = await api.get(`/coach/classes/${id}/students`);
      return res.data || [];
    },
  });

  if (loadingClass || !classItem) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-navy space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange" />
        <span className="text-sm font-semibold">Đang tải thông tin lớp học...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs text-muted-foreground hover:text-navy transition-colors gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại lịch dạy
        </Link>
      </div>

      {/* Class brief details */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-navy text-navy font-semibold text-[10px] uppercase">
              Cấp độ: {classItem.level}
            </Badge>
            <span className="text-xs text-muted-foreground">• ID: {classItem.id}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-navy">{classItem.name}</h2>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-orange shrink-0" />
              {classItem.court?.name || "N/A"}
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-orange shrink-0" />
              Sĩ số: {classStudents.length} học viên
            </span>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button asChild className="bg-orange hover:bg-orange-dark text-white flex-1 md:flex-none">
            <Link href={`/dashboard/lop/${classItem.id}/diem-danh`} className="flex items-center gap-1.5 justify-center py-5">
              <ClipboardCheck className="h-4 w-4" />
              Điểm danh hôm nay
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Roster & Schedule widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class roster - spans 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-navy">Danh sách học viên ({classStudents.length})</h3>
          </div>
          {loadingStudents ? (
            <div className="flex items-center justify-center p-8 bg-white rounded-xl border border-border">
              <Loader2 className="h-6 w-6 animate-spin text-orange mr-2" />
              <span className="text-xs text-muted-foreground">Đang tải danh sách học viên...</span>
            </div>
          ) : (
            <StudentList students={classStudents} />
          )}
        </div>

        {/* Schedule & info sidebar widget */}
        <div className="space-y-6">
          <Card className="border-border">
            <div className="p-4 bg-slate-50 border-b border-border rounded-t-lg font-bold text-sm text-navy">
              Thông tin lớp học
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Huấn luyện viên phụ trách
                </p>
                <p className="font-bold text-navy text-sm">{classItem.coach?.name || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{classItem.coach?.specialization || ""}</p>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Lịch học cố định
                </p>
                <div className="space-y-1.5">
                  {classItem.schedule && classItem.schedule.length > 0 ? (
                    classItem.schedule.map((sched, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-50 last:border-b-0 pb-1.5 last:pb-0">
                        <span className="font-semibold text-navy flex items-center gap-1">
                          <CalendarRange className="h-3.5 w-3.5 text-orange" />
                          {getDayName(sched.dayOfWeek)}
                        </span>
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3 text-orange" />
                          {sched.startTime} - {sched.endTime}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Chưa có lịch học</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Phân bổ sĩ số
                </p>
                <div className="flex justify-between text-slate-700">
                  <span>Chính thức:</span>
                  <span className="font-bold text-navy">
                    {classStudents.filter((s) => s.status === "active").length} học viên
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Học thử:</span>
                  <span className="font-bold text-navy">
                    {classStudents.filter((s) => s.status === "trial").length} học viên
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Sức chứa tối đa:</span>
                  <span className="font-bold text-navy">{classItem.maxStudents} học viên</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
