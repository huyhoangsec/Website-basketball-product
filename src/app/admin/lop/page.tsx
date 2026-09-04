"use client";

import { useState } from "react";
import { useAdminClasses } from "@/hooks/useAdmin";
import { useCourts, useCoaches } from "@/hooks/usePublicData";
import { ClassInfo, TrainingLevel, ClassSchedule } from "@/types";
import DataTable from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash, BookOpen, Clock, Users, Plus, Trash2, CalendarRange } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 1, label: "Thứ Hai" },
  { value: 2, label: "Thứ Ba" },
  { value: 3, label: "Thứ Tư" },
  { value: 4, label: "Thứ Năm" },
  { value: 5, label: "Thứ Sáu" },
  { value: 6, label: "Thứ Bảy" },
  { value: 0, label: "Chủ Nhật" },
];

const TIME_PRESETS = [
  { label: "Sáng (08:00 - 09:30)", start: "08:00", end: "09:30" },
  { label: "Sáng (09:30 - 11:00)", start: "09:30", end: "11:00" },
  { label: "Chiều (16:30 - 18:00)", start: "16:30", end: "18:00" },
  { label: "Chiều (17:30 - 19:00)", start: "17:30", end: "19:00" },
  { label: "Tối (18:00 - 19:30)", start: "18:00", end: "19:30" },
  { label: "Tối (19:30 - 21:00)", start: "19:30", end: "21:00" },
];

const getDayName = (day: number) => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[day];
};

export default function AdminClassesPage() {
  const { classes, createClass, updateClass, deleteClass } = useAdminClasses();
  const { data: mockCourts = [] } = useCourts();
  const { data: mockCoaches = [] } = useCoaches();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [courtId, setCourtId] = useState("");
  const [coachId, setCoachId] = useState("");
  const [level, setLevel] = useState<TrainingLevel>(TrainingLevel.BEGINNER);
  const [maxStudents, setMaxStudents] = useState("15");
  const [schedules, setSchedules] = useState<ClassSchedule[]>([
    { dayOfWeek: 2, startTime: "17:30", endTime: "19:00" },
  ]);

  const handleAddSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      { dayOfWeek: prev.length > 0 ? (prev[prev.length - 1].dayOfWeek + 2) % 7 : 2, startTime: "17:30", endTime: "19:00" },
    ]);
  };

  const handleRemoveSchedule = (idx: number) => {
    if (schedules.length <= 1) return;
    setSchedules((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleScheduleChange = (idx: number, field: keyof ClassSchedule, value: unknown) => {
    setSchedules((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleOpenAdd = () => {
    setEditingClass(null);
    setName("");
    setCourtId(mockCourts.length > 0 ? mockCourts[0].id : "");
    setCoachId(mockCoaches.length > 0 ? mockCoaches[0].id : "");
    setLevel(TrainingLevel.BEGINNER);
    setMaxStudents("15");
    setSchedules([
      { dayOfWeek: 2, startTime: "17:30", endTime: "19:00" },
      { dayOfWeek: 4, startTime: "17:30", endTime: "19:00" },
    ]);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (classInfo: ClassInfo) => {
    setEditingClass(classInfo);
    setName(classInfo.name);
    setCourtId(classInfo.court?.id || (classInfo as any).courtId || "");
    setCoachId(classInfo.coach?.id || (classInfo as any).coachId || "");
    setLevel(classInfo.level);
    setMaxStudents(String(classInfo.maxStudents));
    setSchedules(
      classInfo.schedule && classInfo.schedule.length > 0
        ? classInfo.schedule
        : [{ dayOfWeek: 2, startTime: "17:30", endTime: "19:00" }]
    );
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !courtId || !coachId || !level || !maxStudents) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (schedules.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khung giờ học!");
      return;
    }

    const selectedCourt = mockCourts.find((c) => c.id === courtId) || mockCourts[0];
    const selectedCoach = mockCoaches.find((c) => c.id === coachId) || mockCoaches[0];

    if (editingClass) {
      // Edit
      updateClass({
        id: editingClass.id,
        data: {
          name,
          court: selectedCourt,
          coach: selectedCoach,
          level,
          maxStudents: Number(maxStudents),
          schedule: schedules,
        } as any,
      });
    } else {
      // Add
      createClass({
        name,
        court: selectedCourt,
        coach: selectedCoach,
        level,
        schedule: schedules,
        maxStudents: Number(maxStudents),
        currentStudents: 0,
        trialStudents: 0,
      } as any);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (classInfo: ClassInfo) => {
    setEditingClass(classInfo);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (editingClass) {
      if (editingClass.id) {
        deleteClass(editingClass.id);
      } else {
        toast.error("Không tìm thấy ID của Lớp học để xóa!");
      }
      setIsDeleteOpen(false);
      setEditingClass(null);
    }
  };

  const columns: ColumnDef<ClassInfo>[] = [
    {
      accessorFn: (_, index) => index + 1,
      id: "index",
      header: "STT",
      cell: (info) => <span className="font-medium text-slate-500">{info.getValue() as number}</span>,
    },
    {
      accessorKey: "name",
      header: "Tên lớp",
      cell: ({ row }) => (
        <div className="font-bold text-navy flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-orange shrink-0" />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "level",
      header: "Cấp độ",
      cell: ({ row }) => (
        <Badge variant="outline" className="border-navy text-navy font-bold text-[10px] capitalize bg-slate-50">
          {row.original.level}
        </Badge>
      ),
    },
    {
      accessorFn: (row) => row.coach.name,
      id: "coach",
      header: "HLV phụ trách",
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.coach.name}</span>,
    },
    {
      accessorFn: (row) => row.court.name,
      id: "court",
      header: "Điểm sân",
      cell: ({ row }) => <span className="text-xs text-slate-600 line-clamp-1">{row.original.court.name}</span>,
    },
    {
      accessorKey: "schedule",
      header: "Lịch học",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.schedule.map((sched, idx) => (
            <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-650 hover:bg-slate-100 text-[10px] flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5 text-orange" />
              T{getDayName(sched.dayOfWeek)} ({sched.startTime})
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "capacity",
      header: "Sĩ số",
      cell: ({ row }) => {
        const cls = row.original;
        return (
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            {cls.currentStudents} / {cls.maxStudents}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-slate-600 hover:text-navy"
            onClick={() => handleOpenEdit(row.original)}
            title="Sửa thông tin"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDelete(row.original)}
            title="Xóa lớp"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-navy">Quản lý Lớp học Bóng rổ</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Danh sách các lớp học, lịch huấn luyện, phân bổ HLV và sĩ số chuyên cần
        </p>
      </div>

      <DataTable
        columns={columns}
        data={classes}
        searchKey="name"
        searchPlaceholder="Tìm tên lớp học..."
        onAdd={handleOpenAdd}
        addLabel="Thêm Lớp mới"
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-navy flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange" />
                {editingClass ? "Cập nhật lớp học" : "Tạo mới lớp học"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Thiết lập thông tin và cấu hình HLV + sân cho lớp học bóng rổ.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700 text-sm">
              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor="class-name" className="text-xs font-bold text-navy">
                  Tên lớp học *
                </Label>
                <Input
                  id="class-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Beginner E - Thứ 3,5"
                  className="border-slate-200 focus-visible:ring-orange"
                  required
                />
              </div>

              {/* Court Select */}
              <div className="space-y-1">
                <Label htmlFor="court" className="text-xs font-bold text-navy">
                  Địa điểm cụm sân *
                </Label>
                <Select value={courtId} onValueChange={(val) => setCourtId(val || "")}>
                  <SelectTrigger className="bg-white border-slate-200 text-navy font-semibold">
                    <SelectValue placeholder="Chọn cụm sân..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border">
                    {mockCourts.map((court) => (
                      <SelectItem key={court.id} value={court.id}>
                        {court.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Coach Select */}
              <div className="space-y-1">
                <Label htmlFor="coach" className="text-xs font-bold text-navy">
                  Huấn luyện viên giảng dạy *
                </Label>
                <Select value={coachId} onValueChange={(val) => setCoachId(val || "")}>
                  <SelectTrigger className="bg-white border-slate-200 text-navy font-semibold">
                    <SelectValue placeholder="Chọn HLV..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border">
                    {mockCoaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {coach.name} ({coach.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Level */}
                <div className="space-y-1">
                  <Label htmlFor="level" className="text-xs font-bold text-navy">
                    Cấp độ (Level) *
                  </Label>
                  <Select value={level} onValueChange={(val) => val && setLevel(val as TrainingLevel)}>
                    <SelectTrigger className="bg-white border-slate-200 text-navy font-semibold">
                      <SelectValue placeholder="Chọn cấp độ..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {Object.values(TrainingLevel).map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>
                          <span className="capitalize">{lvl}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Students */}
                <div className="space-y-1">
                  <Label htmlFor="max-students" className="text-xs font-bold text-navy">
                    Sức chứa tối đa *
                  </Label>
                  <Input
                    id="max-students"
                    type="number"
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                    placeholder="15"
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>
              </div>

              {/* Schedule / Time Slots */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-navy flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange" />
                    Khung giờ dạy & Lịch học trong tuần *
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSchedule}
                    className="h-7 text-xs text-orange border-orange/40 hover:bg-orange/10 hover:text-orange gap-1 font-semibold"
                  >
                    <Plus className="h-3 w-3" />
                    Thêm ca học
                  </Button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {schedules.map((sched, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        {/* Day of Week */}
                        <div className="flex-1">
                          <Select
                            value={String(sched.dayOfWeek)}
                            onValueChange={(val) => handleScheduleChange(idx, "dayOfWeek", Number(val))}
                          >
                            <SelectTrigger className="h-8 bg-white border-slate-200 text-xs text-navy font-semibold">
                              <SelectValue placeholder="Chọn thứ..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-border">
                              {DAYS_OF_WEEK.map((d) => (
                                <SelectItem key={d.value} value={String(d.value)} className="text-xs font-medium">
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Start Time */}
                        <div className="w-24">
                          <Input
                            type="time"
                            value={sched.startTime}
                            onChange={(e) => handleScheduleChange(idx, "startTime", e.target.value)}
                            className="h-8 bg-white border-slate-200 text-xs text-navy font-medium"
                            required
                          />
                        </div>
                        <span className="text-xs text-slate-400 font-bold">-</span>

                        {/* End Time */}
                        <div className="w-24">
                          <Input
                            type="time"
                            value={sched.endTime}
                            onChange={(e) => handleScheduleChange(idx, "endTime", e.target.value)}
                            className="h-8 bg-white border-slate-200 text-xs text-navy font-medium"
                            required
                          />
                        </div>

                        {/* Remove */}
                        {schedules.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSchedule(idx)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                            title="Xóa ca học này"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>

                      {/* Quick presets */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px]">
                        <span className="text-slate-400 font-medium">Gợi ý nhanh:</span>
                        {TIME_PRESETS.map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              handleScheduleChange(idx, "startTime", preset.start);
                              handleScheduleChange(idx, "endTime", preset.end);
                            }}
                            className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
                              sched.startTime === preset.start && sched.endTime === preset.end
                                ? "bg-orange text-white border-orange font-bold"
                                : "bg-white text-slate-650 border-slate-200 hover:border-orange hover:text-orange"
                            }`}
                          >
                            {preset.start}-{preset.end}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white font-semibold">
                Lưu lại
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <DialogHeader>
            <DialogTitle className="text-navy flex items-center gap-2">
              Xác nhận xóa lớp học
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Bạn có chắc chắn muốn xóa lớp học <strong>{editingClass?.name}</strong>? Toàn bộ danh sách điểm danh và phân bổ sẽ bị gỡ bỏ.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
