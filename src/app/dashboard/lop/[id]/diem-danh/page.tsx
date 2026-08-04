"use client";

import { useState, use } from "react";
import { useAttendance } from "@/hooks/useAttendance";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AttendanceRow from "@/components/coach-dashboard/AttendanceRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ClipboardCheck, Calendar, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { AttendanceStatus, Student } from "@/types";

interface AttendancePageProps {
  params: Promise<{ id: string }>;
}

export default function AttendancePage({ params }: AttendancePageProps) {
  const { id } = use(params);

  // Get current date string (YYYY-MM-DD)
  const getTodayDateString = () => {
    const d = new Date();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  // Fetch class details
  const { data: classItem } = useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const res = await api.get(`/public/classes`);
      const classes = res.data;
      return classes.find((c: { id: string }) => c.id === id);
    }
  });

  // Fetch students
  const { data: classStudents = [] } = useQuery({
    queryKey: ["class-students", id],
    queryFn: async () => {
      const res = await api.get(`/coach/classes/${id}/students`);
      return res.data || [];
    }
  });

  const { getAttendanceForClassAndDate, markAttendance, removeAttendanceRecord } = useAttendance(id, selectedDate);

  if (!classItem) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // Get attendance records for the selected date
  const attendanceRecords = getAttendanceForClassAndDate();

  // Statistics calculations
  const totalStudents = classStudents.length;
  const presentCount = attendanceRecords.filter((r) => r.status === AttendanceStatus.PRESENT).length;
  const excusedCount = attendanceRecords.filter((r) => r.status === AttendanceStatus.EXCUSED).length;
  const unexcusedCount = attendanceRecords.filter((r) => r.status === AttendanceStatus.UNEXCUSED).length;
  const markedCount = attendanceRecords.length;

  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href={`/dashboard/lop/${id}`}
          className="inline-flex items-center text-xs text-muted-foreground hover:text-navy transition-colors gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại chi tiết lớp
        </Link>
      </div>

      {/* Title section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#FF6B35]/10 rounded-md text-orange">
              <ClipboardCheck className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold text-navy uppercase tracking-wider">
              Điểm danh chuyên cần
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-navy">{classItem.name}</h2>
          <p className="text-xs text-muted-foreground">
            Chọn ngày học và đánh giá tình trạng tham gia của từng học viên
          </p>
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-2.5 bg-slate-100 border border-slate-200 p-2.5 rounded-xl w-full md:w-auto">
          <Calendar className="h-4 w-4 text-orange shrink-0" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-sm text-navy focus:ring-0 cursor-pointer w-full md:w-auto"
          />
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium uppercase">Tổng số học viên</p>
            <p className="text-2xl font-black text-navy">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200/50 bg-green-50/15">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-[10px] text-green-700 font-bold uppercase">Có mặt ✅</p>
            <p className="text-2xl font-black text-green-600">{presentCount}</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200/50 bg-yellow-50/15">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-[10px] text-yellow-700 font-bold uppercase">Nghỉ phép 📝</p>
            <p className="text-2xl font-black text-yellow-500">{excusedCount}</p>
          </CardContent>
        </Card>

        <Card className="border-red-200/50 bg-red-50/15">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-[10px] text-red-700 font-bold uppercase">Không phép ❌</p>
            <p className="text-2xl font-black text-red-600">{unexcusedCount}</p>
          </CardContent>
        </Card>

        <Card className="border-border col-span-2 md:col-span-1 bg-slate-50/30">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium uppercase">Tỉ lệ tham gia</p>
            <p className="text-2xl font-black text-navy">{attendanceRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance marking Roster table */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border">
              <th className="p-4 font-bold text-xs text-navy uppercase w-16 text-center">STT</th>
              <th className="p-4 font-bold text-xs text-navy uppercase">Học viên</th>
              <th className="p-4 font-bold text-xs text-navy uppercase hidden md:table-cell">Phụ huynh</th>
              <th className="p-4 font-bold text-xs text-navy uppercase">Trạng thái</th>
              <th className="p-4 font-bold text-xs text-navy uppercase text-end w-48">Đánh giá</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {classStudents.length > 0 ? (
              classStudents.map((student: Student, index: number) => {
                // Find record for this student
                const record = attendanceRecords.find((r) => r.studentId === student.id);
                return (
                  <AttendanceRow
                    key={student.id}
                    student={student}
                    index={index}
                    currentStatus={record?.status}
                    onMarkStatus={(status) =>
                      markAttendance(student.id, student.name, id, selectedDate, status)
                    }
                    onUndo={() => removeAttendanceRecord(student.id, id, selectedDate)}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                  Lớp học không có học viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Save / Complete status indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="text-xs text-slate-600">
          * Tiến trình: Đã điểm danh <strong className="text-navy">{markedCount}/{totalStudents}</strong> học viên.
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-100 flex-1 sm:flex-initial"
            onClick={() => {
              // Simulating export to CSV
              const header = "STT,Học viên,Trạng thái,Ngày,HLV\n";
              const rows = classStudents
                .map((s: Student, idx: number) => {
                  const record = attendanceRecords.find((r) => r.studentId === s.id);
                  const statusLabel =
                    record?.status === AttendanceStatus.PRESENT
                      ? "Có mặt"
                      : record?.status === AttendanceStatus.EXCUSED
                      ? "Nghỉ phép"
                      : record?.status === AttendanceStatus.UNEXCUSED
                      ? "Không phép"
                      : record?.status === AttendanceStatus.DROPPED
                      ? "Nghỉ hẳn"
                      : "Chưa điểm danh";
                  return `${idx + 1},${s.name},${statusLabel},${selectedDate},${classItem.coach.name}`;
                })
                .join("\n");
              
              const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.setAttribute("download", `DiemDanh_${classItem.name.replace(/\s+/g, "")}_${selectedDate}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button
            className="bg-navy hover:bg-navy-light text-white flex-1 sm:flex-initial"
            asChild
          >
            <Link href={`/dashboard/lop/${id}`}>
              Hoàn thành điểm danh
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
