"use client";

import { useState } from "react";
import DataTable from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
import { Receipt, CheckCircle, Clock } from "lucide-react";
import { useAdminInvoices, Invoice } from "@/hooks/useAdmin";
import { formatVND } from "@/lib/utils";

export default function AdminInvoicesPage() {
  const { invoices, isLoading, createInvoice, payInvoice } = useAdminInvoices();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Form states (Create)
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [dueDate, setDueDate] = useState("");

  // Form states (Pay)
  const [method, setMethod] = useState("transfer");
  const [note, setNote] = useState("");

  const handleOpenAdd = () => {
    setStudentId("");
    setAmount("");
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    setDueDate("");
    setIsDialogOpen(true);
  };

  const handleOpenPay = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setMethod("transfer");
    setNote("");
    setIsPayOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !amount || !dueDate) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    createInvoice({
      studentId: studentId,
      amount: Number(amount),
      month,
      year,
      dueDate: new Date(dueDate).toISOString(),
    });

    setIsDialogOpen(false);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInvoice) {
      payInvoice({
        id: selectedInvoice.id,
        amount: selectedInvoice.amount,
        method,
        note,
      });
      setIsPayOpen(false);
    }
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "student.name",
      header: "Học viên",
      cell: ({ row }) => {
        const student = row.original.student;
        return (
          <div className="font-semibold text-navy">
            {student ? student.name : row.original.studentId}
          </div>
        );
      },
    },
    {
      accessorKey: "month",
      header: "Tháng",
      cell: ({ row }) => <span className="font-medium">Tháng {row.original.month}/{row.original.year}</span>,
    },
    {
      accessorKey: "amount",
      header: "Số tiền",
      cell: ({ row }) => <span className="font-bold text-orange">{formatVND(row.original.amount)}</span>,
    },
    {
      accessorKey: "dueDate",
      header: "Hạn chót",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {row.original.dueDate ? format(new Date(row.original.dueDate), "dd/MM/yyyy", { locale: vi }) : "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === "paid") {
          return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none"><CheckCircle className="w-3 h-3 mr-1"/> Đã thu</Badge>;
        }
        if (status === "overdue") {
          return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none"><Clock className="w-3 h-3 mr-1"/> Quá hạn</Badge>;
        }
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none"><Clock className="w-3 h-3 mr-1"/> Chưa thu</Badge>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const invoice = row.original;
        if (invoice.status === "paid") return null;

        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              className="bg-navy hover:bg-navy-light h-8 text-xs"
              onClick={() => handleOpenPay(invoice)}
            >
              Thu tiền
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-navy flex items-center gap-2">
          <Receipt className="h-6 w-6 text-orange" />
          Quản lý Hóa đơn & Học phí
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Theo dõi trạng thái đóng học phí, tạo hóa đơn hàng tháng và ghi nhận thu tiền.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        searchKey="studentId" // Search by student ID
        searchPlaceholder="Tìm theo mã học viên..."
        onAdd={handleOpenAdd}
        addLabel="Tạo Hóa đơn"
        isLoading={isLoading}
      />

      {/* Create Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-navy">Tạo hóa đơn học phí</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Tạo hóa đơn yêu cầu đóng học phí cho học viên.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700 text-sm">
              <div className="space-y-1">
                <Label htmlFor="student-id" className="text-xs font-bold text-navy">ID Học viên *</Label>
                <Input
                  id="student-id"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Nhập UUID của học viên"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="amount" className="text-xs font-bold text-navy">Số tiền (VNĐ) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="VD: 1500000"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="due-date" className="text-xs font-bold text-navy">Hạn nộp *</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="month" className="text-xs font-bold text-navy">Kỳ (Tháng) *</Label>
                  <Input
                    id="month"
                    type="number"
                    min="1" max="12"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="year" className="text-xs font-bold text-navy">Kỳ (Năm) *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white">Tạo hóa đơn</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pay Invoice Dialog */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <form onSubmit={handlePay}>
            <DialogHeader>
              <DialogTitle className="text-navy">Xác nhận thu tiền</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Ghi nhận thanh toán cho học viên {selectedInvoice?.student?.name} (Tháng {selectedInvoice?.month}/{selectedInvoice?.year}).
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700 text-sm">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-navy">Tổng tiền cần thu</Label>
                <div className="p-3 bg-slate-50 rounded-md border border-slate-200 font-bold text-orange text-lg text-center">
                  {selectedInvoice ? formatVND(selectedInvoice.amount) : "0 đ"}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="method" className="text-xs font-bold text-navy">Hình thức thanh toán</Label>
                <Select value={method} onValueChange={(val) => setMethod(val || "transfer")}>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transfer">Chuyển khoản</SelectItem>
                    <SelectItem value="cash">Tiền mặt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="note" className="text-xs font-bold text-navy">Ghi chú thêm</Label>
                <Input
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Mã giao dịch..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPayOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Xác nhận đã thu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
