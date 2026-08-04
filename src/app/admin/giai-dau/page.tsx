"use client";

import { useState } from "react";
import { useAdminTournaments } from "@/hooks/useAdminTournaments";
import { Tournament, TournamentStatus } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash, Trophy, MapPin, Calendar } from "lucide-react";

export default function AdminTournamentsPage() {
  const { tournaments, isLoading, createTournament, updateTournament, deleteTournament } = useAdminTournaments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tournament | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<TournamentStatus>(TournamentStatus.UPCOMING);
  const [description, setDescription] = useState("");

  const handleOpenAdd = () => {
    setEditingTour(null);
    setName("");
    setLocation("");
    setDate(new Date().toISOString().split("T")[0]);
    setStatus(TournamentStatus.UPCOMING);
    setDescription("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (tour: Tournament) => {
    setEditingTour(tour);
    setName(tour.name);
    setLocation(tour.location);
    setDate(tour.date);
    setStatus(tour.status);
    setDescription(tour.description);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !date || !status) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    if (editingTour) {
      updateTournament(
        {
          id: editingTour.id,
          name,
          location,
          date,
          status,
          description,
        },
        {
          onSuccess: () => setIsDialogOpen(false),
        }
      );
    } else {
      createTournament(
        {
          name,
          location,
          date,
          status,
          description,
          banner: "/images/tournament-placeholder.jpg",
        },
        {
          onSuccess: () => setIsDialogOpen(false),
        }
      );
    }
  };

  const handleDelete = (tour: Tournament) => {
    setEditingTour(tour);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (editingTour) {
      deleteTournament(editingTour.id, {
        onSuccess: () => setIsDeleteOpen(false),
      });
    }
  };

  const columns: ColumnDef<Tournament>[] = [
    {
      accessorFn: (_, index) => index + 1,
      id: "index",
      header: "STT",
      cell: (info) => <span className="font-medium text-slate-500">{info.getValue() as number}</span>,
    },
    {
      accessorKey: "name",
      header: "Giải đấu",
      cell: ({ row }) => (
        <div className="font-bold text-navy flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-orange shrink-0" />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Địa điểm thi đấu",
      cell: ({ row }) => (
        <span className="text-xs text-slate-605 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {row.original.location}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Thời gian diễn ra",
      cell: ({ row }) => (
        <span className="text-xs text-slate-650 flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-orange" />
          {row.original.date}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const st = row.original.status;
        return (
          <Badge
            className={`font-bold text-[9px] uppercase border-none tracking-wider ${
              st === TournamentStatus.UPCOMING
                ? "bg-yellow-105 text-yellow-800"
                : st === TournamentStatus.ONGOING
                ? "bg-blue-100 text-blue-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {st === TournamentStatus.UPCOMING && "Sắp diễn ra"}
            {st === TournamentStatus.ONGOING && "Đang diễn ra"}
            {st === TournamentStatus.COMPLETED && "Đã kết thúc"}
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
            title="Xóa giải đấu"
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
        <h2 className="text-xl md:text-2xl font-black text-navy">Quản lý Giải đấu & Giao hữu</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tạo và quản lý các sự kiện thể thao, giải đấu bóng rổ nội bộ hoặc liên câu lạc bộ
        </p>
      </div>

      <DataTable
        columns={columns}
        data={tournaments}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Tìm tên giải đấu..."
        onAdd={handleOpenAdd}
        addLabel="Thêm Giải đấu mới"
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-navy flex items-center gap-2">
                <Trophy className="h-5 w-5 text-orange" />
                {editingTour ? "Cập nhật giải đấu" : "Tạo mới giải đấu"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Thiết lập thông tin đăng ký, lịch trình và mô tả sự kiện.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700 text-sm">
              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor="tour-name" className="text-xs font-bold text-navy">
                  Tên giải đấu *
                </Label>
                <Input
                  id="tour-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="OceanBasketball Cup 2025"
                  className="border-slate-200 focus-visible:ring-orange"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-1">
                <Label htmlFor="tour-location" className="text-xs font-bold text-navy">
                  Địa điểm thi đấu *
                </Label>
                <Input
                  id="tour-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Sân OceanPark 3 - The Manhattan..."
                  className="border-slate-200 focus-visible:ring-orange"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-1">
                  <Label htmlFor="tour-date" className="text-xs font-bold text-navy">
                    Ngày khai mạc *
                  </Label>
                  <Input
                    id="tour-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-slate-200 focus-visible:ring-orange"
                    required
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <Label htmlFor="tour-status" className="text-xs font-bold text-navy">
                    Trạng thái giải đấu *
                  </Label>
                  <Select value={status} onValueChange={(val) => val && setStatus(val as TournamentStatus)}>
                    <SelectTrigger className="bg-white border-slate-200 text-navy font-semibold">
                      <SelectValue placeholder="Chọn trạng thái..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {Object.values(TournamentStatus).map((st) => (
                        <SelectItem key={st} value={st}>
                          {st === TournamentStatus.UPCOMING && "Sắp diễn ra"}
                          {st === TournamentStatus.ONGOING && "Đang diễn ra"}
                          {st === TournamentStatus.COMPLETED && "Đã kết thúc"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="tour-desc" className="text-xs font-bold text-navy">
                  Mô tả nội dung giải đấu
                </Label>
                <Textarea
                  id="tour-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chi tiết cơ cấu giải thưởng, thể thức thi đấu..."
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
              Xác nhận xóa giải đấu
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Bạn có chắc chắn muốn xóa giải đấu <strong>{editingTour?.name}</strong> khỏi hệ thống? Hành động này không thể hoàn tác.
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
