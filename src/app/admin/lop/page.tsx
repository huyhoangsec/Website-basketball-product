"use client";

import { useState } from "react";
import { useAdminClasses } from "@/hooks/useAdmin";
import { useCourts, useCoaches } from "@/hooks/usePublicData";
import { ClassInfo, TrainingLevel } from "@/types";
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
import { Edit, Trash, BookOpen, Clock, Users } from "lucide-react";

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

  const handleOpenAdd = () => {
    setEditingClass(null);
    setName("");
    setCourtId(mockCourts.length > 0 ? mockCourts[0].id : "");
    setCoachId(mockCoaches.length > 0 ? mockCoaches[0].id : "");
    setLevel(TrainingLevel.BEGINNER);
    setMaxStudents("15");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (classInfo: ClassInfo) => {
    setEditingClass(classInfo);
    setName(classInfo.name);
    setCourtId(classInfo.court.id);
    setCoachId(classInfo.coach.id);
    setLevel(classInfo.level);
    setMaxStudents(String(classInfo.maxStudents));
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !courtId || !coachId || !level || !maxStudents) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
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
        }
      });
    } else {
      // Add
      createClass({
        name,
        court: selectedCourt,
        coach: selectedCoach,
        level,
        schedule: [{ dayOfWeek: 2, startTime: "17:00", endTime: "18:30" }], // mock schedule for simplicity
        maxStudents: Number(maxStudents),
        currentStudents: 0,
        trialStudents: 0,
      });
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
