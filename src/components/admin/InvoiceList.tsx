import { Invoice } from "@/hooks/useAdmin";
import DataTable from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface InvoiceListProps {
  invoices: Invoice[];
  onPay: (invoice: Invoice) => void;
}

export default function InvoiceList({ invoices, onPay }: InvoiceListProps) {
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "student",
      header: "Học viên",
      cell: ({ row }) => {
        const student = row.original.student;
        return (
          <div>
            <p className="font-semibold">{student?.name || "Không rõ"}</p>
            <p className="text-xs text-muted-foreground">{student?.parentPhone}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "period",
      header: "Kỳ thu",
      cell: ({ row }) => (
        <span className="font-medium">
          Tháng {row.original.month}/{row.original.year}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Số tiền",
      cell: ({ row }) => <span className="font-bold text-orange">{formatVND(row.original.amount)}</span>,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const s = row.original.status;
        if (s === "paid") {
          return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Đã thu</Badge>;
        }
        if (s === "overdue") {
          return <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/30">Quá hạn</Badge>;
        }
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/30">Chưa đóng</Badge>;
      },
    },
    {
      accessorKey: "dueDate",
      header: "Hạn nộp",
      cell: ({ row }) => {
        try {
          return format(new Date(row.original.dueDate), "dd/MM/yyyy", { locale: vi });
        } catch {
          return "N/A";
        }
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <div className="flex items-center gap-2">
            {s !== "paid" && (
              <Button size="sm" variant="outline" className="h-8 gap-1 border-orange text-orange hover:bg-orange hover:text-white" onClick={() => onPay(row.original)}>
                <Check className="h-4 w-4" /> Thanh toán
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={invoices} searchKey="period" />;
}
