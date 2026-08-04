import { Metadata } from "next";
import { getClasses, getStudents } from "@/lib/api-fetch";
import StudentList from "@/components/coach-dashboard/StudentList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, CalendarRange, Clock, ArrowLeft, ClipboardCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ClassDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const classesData = await getClasses();
  const classItem = classesData.find((c) => c.id === id);
  return {
    title: classItem ? `${classItem.name} | Chi tiết lớp học` : "Chi tiết lớp học",
  };
}

const getDayName = (day: number) => {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  return days[day];
};

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = await params;
  const classesData = await getClasses();
  const classItem = classesData.find((c) => c.id === id);

  if (!classItem) {
    notFound();
  }

  // Filter students belonging to this class
  const studentsData = await getStudents();
  const classStudents = studentsData.filter((s) => s.classId === id);

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
            <h3 className="text-base font-bold text-navy">Danh sách học viên</h3>
          </div>
          <StudentList students={classStudents} />
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
                  {classItem.schedule?.map((sched, idx) => (
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
                  ))}
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
