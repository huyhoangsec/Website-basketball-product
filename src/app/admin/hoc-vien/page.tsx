"use client";

import { useState } from "react";
import { useAdminStudents } from "@/hooks/useAdmin";
import { useClasses } from "@/hooks/usePublicData";
import { Student, StudentStatus } from "@/types";
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
import { Edit, Trash, UserPlus, Phone, UserCheck, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminStudentsPage() {
  const { students, createStudent, updateStudent, deleteStudent } = useAdminStudents();
  const { data: mockClasses = [] } = useClasses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("2014");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [classId, setClassId] = useState("");
  const [status, setStatus] = useState<StudentStatus>(StudentStatus.ACTIVE);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setName("");
    setBirthYear("2014");
    setParentName("");
    setParentPhone("");
    setClassId(mockClasses.length > 0 ? mockClasses[0].id : "");
    setStatus(StudentStatus.ACTIVE);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setBirthYear(String(student.birthYear));
    setParentName(student.parentName);
    setParentPhone(student.parentPhone);
    setClassId(student.classId);
    setStatus(student.status);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !parentName || !parentPhone || !classId || !status) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    const assignedClass = mockClasses.find((c) => c.id === classId);
    const className = assignedClass ? assignedClass.name : "Chưa xếp lớp";

    if (editingStudent) {
      // Edit
      updateStudent({
        id: editingStudent.id,
        data: {
          name,
          birthYear: Number(birthYear),
          parentName,
          parentPhone,
          classId,
          className,
          status,
        }
      });
    } else {
      // Add
      createStudent({
        name,
        birthYear: Number(birthYear),
        parentName,
        parentPhone,
        classId,
        className,
        status,
        joinDate: new Date().toISOString().split("T")[0],
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (student: Student) => {
    setEditingStudent(student);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (editingStudent) {
      if (editingStudent.id) {
        deleteStudent(editingStudent.id);
      } else {
        toast.error("Không tìm thấy ID của Học viên để xóa!");
      }
      setIsDeleteOpen(false);
      setEditingStudent(null);
    }
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorFn: (_, index) => index + 1,
      id: "index",
      header: "STT",
      cell: (info) => <span className="font-medium text-slate-500">{info.getValue() as number}</span>,
    },
    {
      accessorKey: "name",
      header: "Học viên",
      cell: ({ row }) => {
        const student = row.original;
        const initials = student.name.split(" ").map((n) => n[0]).slice(-2).join("").toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-navy text-white text-[10px]">
              <AvatarFallback className="bg-navy-light text-white text-[10px] font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-navy">{student.name}</p>
              <p className="text-[10px] text-muted-foreground">Năm sinh: {student.birthYear}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "className",
      header: "Lớp học",
      cell: ({ row }) => (
        <Badge variant="outline" className="border-navy text-navy text-xs font-bold bg-slate-50">
          {row.original.className || "Chưa xếp lớp"}
        </Badge>
      ),
    },
    {
      accessorKey: "parentName",
      header: "Thông tin Phụ huynh",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-navy flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-slate-400" />
              {student.parentName}
            </p>
            <p className="text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3 text-orange" />
              {student.parentPhone}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "joinDate",
      header: "Ngày nhập học",
      cell: ({ row }) => (
        <div className="text-xs text-slate-650 flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5 text-orange" />
          {row.original.joinDate}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const statusVal = row.original.status;
        return (
          <Badge
            className={`font-bold text-[9px] uppercase border-none tracking-wider ${
              statusVal === StudentStatus.ACTIVE
                ? "bg-green-100 text-green-800"
                : statusVal === StudentStatus.TRIAL
                ? "bg-yellow-100 text-yellow-800"
                : statusVal === StudentStatus.DROPPED
                ? "bg-red-105 text-red-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {statusVal === StudentStatus.ACTIVE && "Chính thức"}
            {statusVal === StudentStatus.TRIAL && "Học thử"}
            {statusVal === StudentStatus.DROPPED && "Nghỉ hẳn"}
            {statusVal === StudentStatus.INACTIVE && "Tạm ngưng"}
          </Badge>
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
            title="Xóa học viên"
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
        <h2 className="text-xl md:text-2xl font-black text-navy">Quản lý Học viên</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Danh sách thông tin học viên chính thức và học thử của CLB, xếp lớp học phù hợp
        </p>
      </div>

      <DataTable
        columns={columns}
        data={students}
        searchKey="name"
        searchPlaceholder="Tìm tên học viên hoặc phụ huynh..."
        onAdd={handleOpenAdd}
        addLabel="Thêm Học viên mới"
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-navy flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-orange" />
                {editingStudent ? "Cập nhật hồ sơ học viên" : "Đăng ký học viên mới"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Vui lòng điền hồ sơ chi tiết và phân bổ lớp học bóng rổ phù hợp.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700 text-sm">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <Label htmlFor="student-name" className="text-xs font-bold text-navy">
                    Tên học viên *
                  </Label>
                  <Input
                    id="student-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Gia Bảo"
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>

                {/* Birth year */}
                <div className="space-y-1">
                  <Label htmlFor="birth-year" className="text-xs font-bold text-navy">
                    Năm sinh *
                  </Label>
                  <Input
                    id="birth-year"
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="2014"
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Parent Name */}
                <div className="space-y-1">
                  <Label htmlFor="parent-name" className="text-xs font-bold text-navy">
                    Họ tên Phụ huynh *
                  </Label>
                  <Input
                    id="parent-name"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Nguyễn Văn Minh"
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>

                {/* Parent Phone */}
                <div className="space-y-1">
                  <Label htmlFor="parent-phone" className="text-xs font-bold text-navy">
                    SĐT Phụ huynh *
                  </Label>
                  <Input
                    id="parent-phone"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="0901111111"
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Class Select */}
                <div className="space-y-1">
                  <Label htmlFor="class" className="text-xs font-bold text-navy">
                    Lớp phân bổ *
                  </Label>
                  <Select value={classId} onValueChange={(val) => setClassId(val || "")}>
                    <SelectTrigger className="bg-white border-slate-200 text-navy font-semibold">
                      <SelectValue placeholder="Chọn lớp..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {mockClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Select */}
                <div className="space-y-1">
                  <Label htmlFor="status" className="text-xs font-bold text-navy">
                    Trạng thái học tập *
                  </Label>
                  <Select value={status} onValueChange={(val) => val && setStatus(val as StudentStatus)}>
                    <SelectTrigger className="bg-white border-slate-200 text-navy font-semibold">
                      <SelectValue placeholder="Chọn trạng thái..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {Object.values(StudentStatus).map((st) => (
                        <SelectItem key={st} value={st}>
                          {st === StudentStatus.ACTIVE && "Chính thức"}
                          {st === StudentStatus.TRIAL && "Học thử"}
                          {st === StudentStatus.DROPPED && "Nghỉ hẳn"}
                          {st === StudentStatus.INACTIVE && "Tạm ngưng"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                Lưu hồ sơ
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
              Xác nhận xóa học viên
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Bạn có chắc chắn muốn xóa học viên <strong>{editingStudent?.name}</strong> khỏi danh sách? Dữ liệu điểm danh của học viên này cũng sẽ bị gỡ bỏ.
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
