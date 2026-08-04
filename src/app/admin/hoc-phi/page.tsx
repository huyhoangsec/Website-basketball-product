"use client";

import { useState } from "react";
import { useAdminInvoices, Invoice } from "@/hooks/useAdmin";
import { useAdminWebsite } from "@/hooks/useAdminWebsite";
import { TuitionPlan } from "@/types";
import DataTable from "@/components/admin/DataTable";
import InvoiceList from "@/components/admin/InvoiceList";
import CreateInvoiceModal from "@/components/admin/CreateInvoiceModal";
import PayInvoiceModal from "@/components/admin/PayInvoiceModal";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Edit, Trash, Plus, CreditCard, Sparkles, Receipt } from "lucide-react";

export default function AdminTuitionPage() {
  const { invoices, isLoading: loadingInvoices, createInvoice, payInvoice, generateInvoices, isGenerating } = useAdminInvoices();
  const { tuitionPlans, loadingTuitionPlans, createTuitionPlan, updateTuitionPlan, deleteTuitionPlan } = useAdminWebsite();
  
  const [activeTab, setActiveTab] = useState("invoices");

  // Invoices Modals
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isPayInvoiceOpen, setIsPayInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Tuition Plan Modals
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TuitionPlan | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [sessionsPerWeek, setSessionsPerWeek] = useState("2");
  const [featuresStr, setFeaturesStr] = useState("");
  const [isPopular, setIsPopular] = useState<"yes" | "no">("no");

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setName("");
    setPrice("");
    setDuration("1 tháng");
    setSessionsPerWeek("2");
    setFeaturesStr("Đào tạo theo giáo án tiêu chuẩn, Đồng phục CLB, Đầy đủ thiết bị tập luyện");
    setIsPopular("no");
    setIsPlanDialogOpen(true);
  };

  const handleOpenEditPlan = (plan: TuitionPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setPrice(String(plan.price));
    setDuration(plan.duration);
    setSessionsPerWeek(String(plan.sessionsPerWeek));
    setFeaturesStr(plan.features.join(", "));
    setIsPopular(plan.isPopular ? "yes" : "no");
    setIsPlanDialogOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !duration || !sessionsPerWeek) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    const features = featuresStr
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    if (editingPlan) {
      updateTuitionPlan(
        {
          id: editingPlan.id,
          name,
          price: Number(price),
          duration,
          sessionsPerWeek: Number(sessionsPerWeek),
          features,
          isPopular: isPopular === "yes",
        },
        {
          onSuccess: () => setIsPlanDialogOpen(false),
        }
      );
    } else {
      createTuitionPlan(
        {
          name,
          price: Number(price),
          duration,
          sessionsPerWeek: Number(sessionsPerWeek),
          features,
          isPopular: isPopular === "yes",
        },
        {
          onSuccess: () => setIsPlanDialogOpen(false),
        }
      );
    }
  };

  const planColumns: ColumnDef<TuitionPlan>[] = [
    {
      accessorKey: "name",
      header: "Tên gói",
      cell: ({ row }) => (
        <div className="font-semibold flex items-center gap-2">
          {row.original.name}
          {row.original.isPopular && (
            <Badge className="bg-orange text-white text-[10px] uppercase">Phổ biến</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Học phí",
      cell: ({ row }) => <span className="text-orange font-bold">{formatVND(row.original.price)}</span>,
    },
    {
      accessorKey: "duration",
      header: "Thời hạn",
    },
    {
      accessorKey: "sessionsPerWeek",
      header: "Buổi/tuần",
      cell: ({ row }) => <span>{row.original.sessionsPerWeek} buổi</span>,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handleOpenEditPlan(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 w-8 p-0 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border-0"
              onClick={() => {
                setEditingPlan(row.original);
                setIsDeleteOpen(true);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản lý Tài chính & Học phí</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Theo dõi hóa đơn thu tiền hàng tháng và quản lý các gói học phí
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#0F1B33] border border-white/5 mb-6">
          <TabsTrigger value="invoices" className="data-[state=active]:bg-orange data-[state=active]:text-white">
            <Receipt className="w-4 h-4 mr-2" />
            Danh sách Hóa đơn
          </TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-orange data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Cấu hình Gói học phí
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Hóa đơn tháng này</h2>
            <div className="flex gap-3">
              <Button onClick={() => generateInvoices()} disabled={isGenerating} variant="outline" className="border-orange text-orange hover:bg-orange hover:text-white">
                <Sparkles className="w-4 h-4 mr-2" /> 
                {isGenerating ? "Đang tạo..." : "Tự động tạo hóa đơn"}
              </Button>
              <Button onClick={() => setIsCreateInvoiceOpen(true)} className="bg-orange hover:bg-orange/90 text-white">
                <Plus className="w-4 h-4 mr-2" /> Tạo thủ công
              </Button>
            </div>
          </div>
          
          <div className="bg-[#1B2A4A] border border-white/5 rounded-xl overflow-hidden shadow-xl p-4">
            {loadingInvoices ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-8 h-8 rounded-full border-2 border-orange border-t-transparent animate-spin"></div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                Chưa có hóa đơn nào
              </div>
            ) : (
              <InvoiceList 
                invoices={invoices} 
                onPay={(invoice) => {
                  setSelectedInvoice(invoice);
                  setIsPayInvoiceOpen(true);
                }} 
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Các gói học phí đang áp dụng</h2>
            <Button onClick={handleOpenAddPlan} className="bg-orange hover:bg-orange/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Thêm gói mới
            </Button>
          </div>
          <div className="bg-[#1B2A4A] border border-white/5 rounded-xl overflow-hidden shadow-xl p-4">
            {loadingTuitionPlans ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-8 h-8 rounded-full border-2 border-orange border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <DataTable columns={planColumns} data={tuitionPlans} searchKey="name" />
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Invoice Modals */}
      <CreateInvoiceModal 
        isOpen={isCreateInvoiceOpen} 
        onClose={() => setIsCreateInvoiceOpen(false)} 
        onSubmit={(data) => createInvoice(data)} 
      />
      <PayInvoiceModal 
        isOpen={isPayInvoiceOpen} 
        onClose={() => setIsPayInvoiceOpen(false)} 
        invoice={selectedInvoice}
        onSubmit={(id, amount, method, note) => payInvoice({ id, amount, method, note })}
      />

      {/* Plan Dialogs */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="bg-[#1B2A4A] text-white border-white/10 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-orange">
              {editingPlan ? "Cập nhật Gói Học Phí" : "Thêm Gói Học Phí"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePlan} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên gói</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Lớp cơ bản"
                className="bg-[#0F1B33] border-white/10 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Học phí (VNĐ)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="VD: 1500000"
                  className="bg-[#0F1B33] border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Thời hạn</Label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="VD: 1 tháng"
                  className="bg-[#0F1B33] border-white/10 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số buổi / tuần</Label>
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={sessionsPerWeek}
                  onChange={(e) => setSessionsPerWeek(e.target.value)}
                  className="bg-[#0F1B33] border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Gói Phổ biến?</Label>
                <Select value={isPopular} onValueChange={(v) => setIsPopular((v as "yes" | "no") || "no")}>
                  <SelectTrigger className="bg-[#0F1B33] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Bình thường</SelectItem>
                    <SelectItem value="yes">Gói nổi bật</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Quyền lợi (Cách nhau bởi dấu phẩy)</Label>
              <Input
                value={featuresStr}
                onChange={(e) => setFeaturesStr(e.target.value)}
                placeholder="VD: Được tặng đồng phục, Bóng rổ riêng..."
                className="bg-[#0F1B33] border-white/10 text-white"
              />
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsPlanDialogOpen(false)} className="hover:bg-white/5">
                Hủy
              </Button>
              <Button type="submit" className="bg-orange hover:bg-orange/90 text-white">
                {editingPlan ? "Lưu thay đổi" : "Thêm gói"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Plan Confirm */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[#1B2A4A] text-white border-white/10 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-500">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-gray-400">
              Bạn có chắc chắn muốn xóa gói học phí <span className="text-white font-bold">{editingPlan?.name}</span>? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="hover:bg-white/5">
              Hủy
            </Button>
            <Button
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (editingPlan) {
                  deleteTuitionPlan(editingPlan.id, {
                    onSuccess: () => setIsDeleteOpen(false),
                  });
                }
              }}
            >
              Xóa gói này
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
