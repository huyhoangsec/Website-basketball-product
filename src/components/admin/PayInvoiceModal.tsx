import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice } from "@/hooks/useAdmin";

interface PayInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onSubmit: (id: string, amount: number, method: string, note: string) => void;
}

export default function PayInvoiceModal({ isOpen, onClose, invoice, onSubmit }: PayInvoiceModalProps) {
  const [method, setMethod] = useState("transfer");
  const [note, setNote] = useState("");

  if (!invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(invoice.id, invoice.amount, method, note);
    onClose();
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1B2A4A] text-white border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-orange">Xác Nhận Thanh Toán</DialogTitle>
          <DialogDescription className="text-gray-400">
            Ghi nhận thanh toán học phí cho học viên <span className="font-bold text-white">{invoice.student?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          <div className="p-4 bg-[#0F1B33]/50 rounded-lg border border-white/5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Kỳ thu:</span>
              <span className="font-medium">Tháng {invoice.month}/{invoice.year}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-400">Số tiền cần đóng:</span>
              <span className="font-bold text-lg text-orange">{formatVND(invoice.amount)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Phương thức thanh toán</Label>
            <Select value={method} onValueChange={(v) => setMethod(v || "transfer")}>
              <SelectTrigger className="bg-[#0F1B33] border-white/10 text-white">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">Chuyển khoản</SelectItem>
                <SelectItem value="cash">Tiền mặt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ghi chú (Tùy chọn)</Label>
            <Input 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Chuyển khoản qua VCB" 
              className="bg-[#0F1B33] border-white/10 text-white" 
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/5">
              Hủy
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Xác nhận đã thu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
