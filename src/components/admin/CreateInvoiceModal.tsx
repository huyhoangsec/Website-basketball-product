import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminStudents } from "@/hooks/useAdmin";

interface InvoiceFormData {
  student_id: string;
  amount: number;
  month: number;
  year: number;
  due_date: string;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => void;
}

export default function CreateInvoiceModal({ isOpen, onClose, onSubmit }: CreateInvoiceModalProps) {
  const { students } = useAdminStudents();
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("1200000");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !amount || !dueDate) return;
    
    onSubmit({
      student_id: studentId,
      amount: Number(amount),
      month: Number(month),
      year: Number(year),
      due_date: dueDate,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1B2A4A] text-white border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-orange">Tạo Hóa Đơn Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Chọn Học Viên *</Label>
            <Select value={studentId} onValueChange={(val) => setStudentId(val || "")}>
              <SelectTrigger className="bg-[#0F1B33] border-white/10 text-white">
                <SelectValue placeholder="-- Chọn học viên cần tạo hóa đơn --" />
              </SelectTrigger>
              <SelectContent className="bg-[#1B2A4A] border-white/10 text-white max-h-60">
                {students.map((st) => (
                  <SelectItem key={st.id} value={st.id} className="text-white hover:bg-white/10">
                    {st.name} {st.birthYear ? `(${st.birthYear})` : ""} - {st.className || "Chưa xếp lớp"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kỳ thu (Tháng)</Label>
              <Input 
                type="number" 
                min={1} max={12} 
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-[#0F1B33] border-white/10 text-white" 
              />
            </div>
            <div className="space-y-2">
              <Label>Năm</Label>
              <Input 
                type="number" 
                min={2020} 
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-[#0F1B33] border-white/10 text-white" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Số tiền (VNĐ)</Label>
            <Input 
              type="number" 
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="VD: 1000000" 
              className="bg-[#0F1B33] border-white/10 text-white" 
            />
          </div>

          <div className="space-y-2">
            <Label>Hạn nộp</Label>
            <Input 
              type="date" 
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-[#0F1B33] border-white/10 text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/5">
              Hủy
            </Button>
            <Button type="submit" disabled={!studentId} className="bg-orange hover:bg-orange/90 text-white disabled:opacity-50">
              Tạo hóa đơn
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
