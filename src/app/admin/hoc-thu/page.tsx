"use client";

import { useState } from "react";
import { TrialRegistration } from "@/types";
import { useAdminTrials } from "@/hooks/useAdmin";
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
import { toast } from "sonner";
import { Check, X, UserPlus, Phone, UserCheck } from "lucide-react";

export default function AdminTrialPage() {
  const { trials: registrations, updateStatus } = useAdminTrials();
  const [selectedReg, setSelectedReg] = useState<TrialRegistration | null>(null);
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  const handleApprove = (id: string, name: string) => {
    updateStatus(id, "approved");
    toast.success(`Đã phê duyệt hồ sơ học thử của ${name}`);
  };

  const handleReject = (id: string, name: string) => {
    updateStatus(id, "rejected");
    toast.error(`Đã từ chối hồ sơ học thử của ${name}`);
  };

  const handleOpenConvert = (reg: TrialRegistration) => {
    setSelectedReg(reg);
    setIsConvertOpen(true);
  };

  const handleConvertConfirm = () => {
    if (selectedReg) {
      updateStatus(selectedReg.id, "converted");
      toast.success(`Đã chuyển học viên học thử ${selectedReg.studentName} thành học viên chính thức!`);
      setIsConvertOpen(false);
    }
  };

  const columns: ColumnDef<TrialRegistration>[] = [
    {
      accessorFn: (_, index) => index + 1,
      id: "index",
      header: "STT",
      cell: (info) => <span className="font-medium text-slate-500">{info.getValue() as number}</span>,
    },
    {
      accessorKey: "studentName",
      header: "Học viên học thử",
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-navy">{row.original.studentName}</p>
          <p className="text-[10px] text-muted-foreground">Sinh năm: {row.original.studentBirthYear}</p>
        </div>
      ),
    },
    {
      accessorKey: "parentName",
      header: "Thông tin Phụ huynh",
      cell: ({ row }) => {
        const reg = row.original;
        return (
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-navy flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-slate-400" />
              {reg.parentName}
            </p>
            <p className="text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3 text-orange" />
              {reg.parentPhone}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "preferredCourt",
      header: "Sân mong muốn",
      cell: ({ row }) => <span className="text-xs font-semibold text-slate-700">{row.original.preferredCourt}</span>,
    },
    {
      accessorKey: "notes",
      header: "Ghi chú",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500 italic max-w-xs block truncate" title={row.original.notes}>
          {row.original.notes || "Không có"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày đăng ký",
      cell: ({ row }) => <span className="text-xs text-slate-650">{row.original.createdAt}</span>,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const st = row.original.status;
        return (
          <Badge
            className={`font-bold text-[9px] uppercase border-none tracking-wider ${
              st === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : st === "approved"
                ? "bg-green-100 text-green-800"
                : st === "converted"
                ? "bg-blue-105 text-blue-800"
                : "bg-red-100 text-red-805"
            }`}
          >
            {st === "pending" && "Chờ duyệt"}
            {st === "approved" && "Đã duyệt"}
            {st === "converted" && "Chính thức"}
            {st === "rejected" && "Từ chối"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Phê duyệt</div>,
      cell: ({ row }) => {
        const reg = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            {reg.status === "pending" && (
              <>
                <Button
                  size="sm"
                  className="h-7 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-2.5 rounded-md"
                  onClick={() => handleApprove(reg.id, reg.studentName)}
                >
                  <Check className="h-3.5 w-3.5 mr-0.5" /> Duyệt
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-red-200 hover:bg-red-50 text-red-650 hover:text-red-700 font-bold text-xs px-2.5 rounded-md"
                  onClick={() => handleReject(reg.id, reg.studentName)}
                >
                  <X className="h-3.5 w-3.5 mr-0.5" /> Từ chối
                </Button>
              </>
            )}

            {reg.status === "approved" && (
              <Button
                size="sm"
                className="h-7 bg-[#FF6B35] hover:bg-[#E55520] text-white font-bold text-xs px-2.5 rounded-md flex items-center gap-1"
                onClick={() => handleOpenConvert(reg)}
              >
                <UserPlus className="h-3.5 w-3.5" /> Lên chính thức
              </Button>
            )}

            {(reg.status === "converted" || reg.status === "rejected") && (
              <span className="text-[11px] text-muted-foreground italic mr-2 select-none">
                Đã xử lý xong
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-navy">Quản lý Đăng ký Học thử</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Danh sách tiếp nhận học thử, liên hệ tư vấn phụ huynh và thực hiện tuyển sinh chính thức
        </p>
      </div>

      <DataTable
        columns={columns}
        data={registrations}
        searchKey="studentName"
        searchPlaceholder="Tìm tên học sinh học thử..."
      />

      {/* Convert to official Dialog */}
      <Dialog open={isConvertOpen} onOpenChange={setIsConvertOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <DialogHeader>
            <DialogTitle className="text-navy flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-orange animate-bounce" />
              Chuyển thành học viên chính thức
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Bạn đang chuyển học viên học thử <strong>{selectedReg?.studentName}</strong> thành học viên chính thức của câu lạc bộ.
              Hành động này sẽ tạo hồ sơ học viên chính thức và cho phép xếp lớp.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConvertOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-[#FF6B35] hover:bg-[#E55520] text-white"
              onClick={handleConvertConfirm}
            >
              Xác nhận tuyển sinh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
