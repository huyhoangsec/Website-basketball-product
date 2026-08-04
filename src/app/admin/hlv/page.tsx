"use client";

import { useState } from "react";
import { useAdminCoaches } from "@/hooks/useAdmin";
import { Coach } from "@/types";
import DataTable from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageUploadInput from "@/components/admin/ImageUploadInput";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, Trash, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminCoachesPage() {
  const { coaches, createCoach, updateCoach, deleteCoach } = useAdminCoaches();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");

  const handleOpenAdd = () => {
    setEditingCoach(null);
    setName("");
    setEmail("");
    setPhone("");
    setSpecialization("");
    setExperience("");
    setAvatar("/images/img2.jpg");
    setBio("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (coach: Coach) => {
    setEditingCoach(coach);
    setName(coach.name);
    setEmail(coach.email);
    setPhone(coach.phone);
    setSpecialization(coach.specialization);
    setExperience(coach.experience);
    setAvatar(coach.avatar || "/images/img2.jpg");
    setBio(coach.bio);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !specialization) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (editingCoach) {
      // Edit mode
      updateCoach({
        id: editingCoach.id,
        data: {
          name,
          email,
          phone,
          specialization,
          experience,
          avatar: avatar || "/images/img2.jpg",
          bio,
        }
      });
    } else {
      // Add mode
      createCoach({
        name,
        email,
        phone,
        specialization,
        experience,
        achievements: ["Đội ngũ HLV Ocean"],
        bio,
        avatar: avatar || "/images/img2.jpg",
        isActive: true,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (coach: Coach) => {
    setEditingCoach(coach);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (editingCoach) {
      if (editingCoach.id) {
        deleteCoach(editingCoach.id);
      } else {
        toast.error("Không tìm thấy ID của HLV để xóa!");
      }
      setIsDeleteOpen(false);
      setEditingCoach(null);
    }
  };

  const toggleActiveStatus = (id: string, _name: string) => {
    const coach = coaches.find((c) => c.id === id);
    if (coach) {
      updateCoach({
        id,
        data: { ...coach, isActive: !coach.isActive }
      });
    }
  };

  const columns: ColumnDef<Coach>[] = [
    {
      accessorFn: (_, index) => index + 1,
      id: "index",
      header: "STT",
      cell: (info) => <span className="font-medium text-slate-500">{info.getValue() as number}</span>,
    },
    {
      accessorKey: "name",
      header: "Họ và tên HLV",
      cell: ({ row }) => {
        const coach = row.original;
        const initials = coach.name.split(" ").map((n) => n[0]).slice(-2).join("").toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
              <AvatarImage src={coach.avatar || "/images/img2.jpg"} alt={coach.name} className="object-cover" />
              <AvatarFallback className="bg-navy-light text-white text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-navy">{coach.name}</span>
              <span className="text-[11px] text-slate-500">{coach.specialization}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "SĐT / Email",
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs text-slate-600">
          <p className="font-medium">{row.original.phone}</p>
          <p className="text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "experience",
      header: "Kinh nghiệm",
      cell: ({ row }) => <span className="text-slate-600 text-xs font-medium">{row.original.experience}</span>,
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => {
        const coach = row.original;
        return (
          <Badge
            onClick={() => toggleActiveStatus(coach.id, coach.name)}
            className={`cursor-pointer border-none font-bold text-[9px] uppercase tracking-wider ${
              coach.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
            }`}
          >
            {coach.isActive ? "Đang dạy" : "Tạm ngưng"}
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
            title="Xóa huấn luyện viên"
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
        <h2 className="text-xl md:text-2xl font-black text-navy">Quản lý Đội ngũ Huấn luyện viên</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Danh sách, ảnh đại diện tải từ máy tính, hồ sơ năng lực và cấp tài khoản hoạt động cho các HLV
        </p>
      </div>

      <DataTable
        columns={columns}
        data={coaches}
        searchKey="name"
        searchPlaceholder="Tìm tên huấn luyện viên..."
        onAdd={handleOpenAdd}
        addLabel="Thêm HLV mới"
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white border border-border">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-navy flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-orange" />
                {editingCoach ? "Cập nhật thông tin HLV" : "Thêm mới Huấn luyện viên"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Vui lòng nhập thông tin lý lịch chi tiết và tải ảnh đại diện trực tiếp từ máy tính client.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700">
              {/* Image Uploader Component */}
              <ImageUploadInput
                label="Ảnh đại diện HLV (Tải từ máy tính)"
                value={avatar}
                onChange={setAvatar}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <Label htmlFor="coach-name" className="text-xs font-bold text-navy">
                    Họ và tên *
                  </Label>
                  <Input
                    id="coach-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>

                {/* Specialization */}
                <div className="space-y-1">
                  <Label htmlFor="specialization" className="text-xs font-bold text-navy">
                    Chuyên môn chính *
                  </Label>
                  <Input
                    id="specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Ví dụ: Kỹ thuật cá nhân"
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs font-bold text-navy">
                    Số điện thoại *
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-bold text-navy">
                    Địa chỉ Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@oceanbasketball.vn"
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-1">
                <Label htmlFor="experience" className="text-xs font-bold text-navy">
                  Kinh nghiệm giảng dạy
                </Label>
                <Input
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Ví dụ: 8 năm kinh nghiệm huấn luyện"
                  className="border-slate-200 focus-visible:ring-orange"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <Label htmlFor="bio" className="text-xs font-bold text-navy">
                  Tóm tắt tiểu sử
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Mô tả kỹ năng, tiểu sử HLV..."
                  rows={3}
                  className="border-slate-200 focus-visible:ring-orange resize-none"
                />
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
                Lưu dữ liệu
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
              Xóa Huấn luyện viên
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Bạn có chắc chắn muốn xóa HLV <strong>{editingCoach?.name}</strong> khỏi hệ thống? Hành động này sẽ gỡ bỏ hồ sơ HLV và không thể hoàn tác.
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
