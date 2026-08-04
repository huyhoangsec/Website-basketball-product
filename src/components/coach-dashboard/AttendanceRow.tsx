"use client";

import { useState } from "react";
import { Student, AttendanceStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, CalendarClock, Ban, Undo2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AttendanceRowProps {
  student: Student;
  currentStatus: AttendanceStatus | undefined;
  onMarkStatus: (status: AttendanceStatus) => void;
  onUndo: () => void;
  index: number;
}

export default function AttendanceRow({
  student,
  currentStatus,
  onMarkStatus,
  onUndo,
  index,
}: AttendanceRowProps) {
  const [isDropConfirmOpen, setIsDropConfirmOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  // Row color depending on current status
  const getRowBgColor = () => {
    if (currentStatus === AttendanceStatus.PRESENT) return "bg-green-50/40 border-green-200/50";
    if (currentStatus === AttendanceStatus.EXCUSED) return "bg-yellow-50/40 border-yellow-200/50";
    if (currentStatus === AttendanceStatus.UNEXCUSED) return "bg-red-50/40 border-red-200/50";
    if (currentStatus === AttendanceStatus.DROPPED) return "bg-slate-100/50 border-slate-200 opacity-60";
    return "bg-white border-border hover:bg-slate-50/40";
  };

  const handleConfirmDrop = () => {
    onMarkStatus(AttendanceStatus.DROPPED);
    setIsDropConfirmOpen(false);
  };

  return (
    <>
      <tr className={`border-b transition-all duration-200 border-l-4 ${getRowBgColor()}`}>
        {/* Index & Avatar */}
        <td className="p-4 align-middle text-sm font-medium w-16 text-center text-muted-foreground">
          {index + 1}
        </td>
        <td className="p-4 align-middle">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 bg-navy text-white font-semibold">
              <AvatarFallback className="bg-navy-light text-white text-xs">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm text-navy">{student.name}</p>
              <p className="text-xs text-muted-foreground">Sinh năm: {student.birthYear}</p>
            </div>
          </div>
        </td>

        {/* Parent Info */}
        <td className="p-4 align-middle hidden md:table-cell text-sm text-slate-700">
          <div>
            <p className="font-medium text-navy">{student.parentName}</p>
            <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
          </div>
        </td>

        {/* Current status display */}
        <td className="p-4 align-middle">
          {currentStatus ? (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                currentStatus === AttendanceStatus.PRESENT
                  ? "bg-green-100 text-green-800"
                  : currentStatus === AttendanceStatus.EXCUSED
                  ? "bg-yellow-100 text-yellow-800"
                  : currentStatus === AttendanceStatus.UNEXCUSED
                  ? "bg-red-100 text-red-800"
                  : "bg-slate-200 text-slate-800"
              }`}
            >
              {currentStatus === AttendanceStatus.PRESENT && "Có mặt"}
              {currentStatus === AttendanceStatus.EXCUSED && "Phép"}
              {currentStatus === AttendanceStatus.UNEXCUSED && "Không phép"}
              {currentStatus === AttendanceStatus.DROPPED && "Nghỉ hẳn"}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground italic">Chưa điểm danh</span>
          )}
        </td>

        {/* Action Buttons */}
        <td className="p-4 align-middle">
          <div className="flex items-center justify-end gap-1.5">
            {/* Present ✅ */}
            <Button
              size="sm"
              type="button"
              variant={currentStatus === AttendanceStatus.PRESENT ? "default" : "outline"}
              className={`h-8 w-8 p-0 rounded-full ${
                currentStatus === AttendanceStatus.PRESENT
                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                  : "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
              }`}
              onClick={() => onMarkStatus(AttendanceStatus.PRESENT)}
              title="Có mặt"
            >
              <Check className="h-4 w-4" />
            </Button>

            {/* Excused 📝 */}
            <Button
              size="sm"
              type="button"
              variant={currentStatus === AttendanceStatus.EXCUSED ? "default" : "outline"}
              className={`h-8 w-8 p-0 rounded-full ${
                currentStatus === AttendanceStatus.EXCUSED
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                  : "hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-300"
              }`}
              onClick={() => onMarkStatus(AttendanceStatus.EXCUSED)}
              title="Nghỉ có phép"
            >
              <CalendarClock className="h-4 w-4" />
            </Button>

            {/* Unexcused ❌ */}
            <Button
              size="sm"
              type="button"
              variant={currentStatus === AttendanceStatus.UNEXCUSED ? "default" : "outline"}
              className={`h-8 w-8 p-0 rounded-full ${
                currentStatus === AttendanceStatus.UNEXCUSED
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                  : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              }`}
              onClick={() => onMarkStatus(AttendanceStatus.UNEXCUSED)}
              title="Nghỉ không phép"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Undo ↩️ */}
            {currentStatus && (
              <Button
                size="sm"
                type="button"
                variant="outline"
                className="h-8 w-8 p-0 rounded-full text-slate-500 hover:bg-slate-100 border-slate-200"
                onClick={onUndo}
                title="Hoàn tác điểm danh"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            )}

            {/* Drop 🚫 */}
            <Button
              size="sm"
              type="button"
              variant={currentStatus === AttendanceStatus.DROPPED ? "default" : "outline"}
              className={`h-8 w-8 p-0 rounded-full ${
                currentStatus === AttendanceStatus.DROPPED
                  ? "bg-slate-800 hover:bg-slate-900 text-white border-slate-800"
                  : "hover:bg-slate-100 text-red-500 hover:text-red-700 border-red-200"
              }`}
              onClick={() => setIsDropConfirmOpen(true)}
              title="Báo cáo nghỉ hẳn"
            >
              <Ban className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>

      {/* Confirmation Dialog for Dropping a student */}
      <Dialog open={isDropConfirmOpen} onOpenChange={setIsDropConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <DialogHeader>
            <DialogTitle className="text-navy flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-600 animate-pulse" />
              Xác nhận học viên nghỉ hẳn
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Hành động này sẽ đánh dấu học viên <strong>{student.name}</strong> là <strong>nghỉ hẳn</strong> khỏi lớp. Thông tin này sẽ gửi trực tiếp đến Ban quản trị (Admin).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDropConfirmOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirmDrop}
            >
              Xác nhận nghỉ hẳn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
