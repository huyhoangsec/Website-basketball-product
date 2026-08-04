"use client";

import { useState } from "react";
import ReportChart from "@/components/admin/ReportChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAdminStats } from "@/hooks/useAdminStats";

// Mock reporting data arrays (fallbacks)
const monthlyEnrollment = [
  { name: "T8/2024", "Học viên mới": 12, "Học thử": 30 },
  { name: "T9/2024", "Học viên mới": 20, "Học thử": 45 },
  { name: "T10/2024", "Học viên mới": 18, "Học thử": 32 },
  { name: "T11/2024", "Học viên mới": 28, "Học thử": 40 },
  { name: "T12/2024", "Học viên mới": 35, "Học thử": 55 },
  { name: "T1/2025", "Học viên mới": 42, "Học thử": 60 },
];

const classDistribution = [
  { name: "The Pavilion", "Số lớp": 4 },
  { name: "The Zenpark", "Số lớp": 3 },
  { name: "The Manhattan", "Số lớp": 5 },
];

const coachPerformance = [
  { name: "HLV Hùng", "Chuyên cần (%)": 94 },
  { name: "HLV Đức", "Chuyên cần (%)": 91 },
  { name: "HLV Hạnh", "Chuyên cần (%)": 89 },
  { name: "HLV Bảo", "Chuyên cần (%)": 92 },
];

export default function AdminReportsPage() {
  const { enrollmentData, distributionData, coachStatsData } = useAdminStats();
  const [reportYear, setReportYear] = useState("2024-2025");

  const handleExportReport = () => {
    toast.success("Hệ thống đang xuất file báo cáo tổng hợp PDF/Excel...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-navy flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-orange" />
            Báo cáo thống kê chi tiết
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Báo cáo tăng trưởng, phân bổ lớp học và kết quả kiểm tra chuyên cần của HLV & học viên
          </p>
        </div>

        {/* Date / Year selectors */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={reportYear} onValueChange={(val) => setReportYear(val || "")}>
            <SelectTrigger className="w-40 bg-white border-slate-200 text-navy font-semibold">
              <Calendar className="mr-2 h-4 w-4 text-orange" />
              <SelectValue placeholder="Năm học..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="2024-2025">Năm học 2024 - 2025</SelectItem>
              <SelectItem value="2023-2024">Năm học 2023 - 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleExportReport}
            className="bg-[#FF6B35] hover:bg-[#E55520] text-white font-semibold flex items-center gap-1.5 shrink-0"
          >
            <Download className="h-4 w-4" />
            Tải báo cáo
          </Button>
        </div>
      </div>

      {/* Primary Chart section */}
      <Card className="border-border bg-white shadow-sm">
        <CardHeader className="pb-2 border-b border-slate-50">
          <CardTitle className="text-sm font-bold text-navy">Tình hình tuyển sinh & Học thử theo tháng</CardTitle>
          <CardDescription className="text-xs">
            Theo dõi hiệu quả chiến dịch chiêu sinh học viên mới và lượt đăng ký trải nghiệm thực tế
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ReportChart
            type="bar"
            data={(enrollmentData.length > 0 ? enrollmentData : monthlyEnrollment) as unknown as Record<string, unknown>[]}
            dataKeys={["Học viên mới", "Học thử"]}
            xAxisKey="name"
            height={320}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coach Performance metrics */}
        <Card className="border-border bg-white shadow-sm">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-navy">Tỉ lệ chuyên cần theo lớp HLV phụ trách</CardTitle>
            <CardDescription className="text-xs">
              Đánh giá tỉ lệ đi học đầy đủ của học sinh trong các lớp của từng HLV
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ReportChart
              type="bar"
              data={(coachStatsData.length > 0 ? coachStatsData : coachPerformance) as unknown as Record<string, unknown>[]}
              dataKeys={["Chuyên cần (%)"]}
              xAxisKey="name"
              colors={["#10B981"]}
              height={260}
            />
          </CardContent>
        </Card>

        {/* Location division */}
        <Card className="border-border bg-white shadow-sm">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-navy">Số lớp học phân bổ theo cụm sân</CardTitle>
            <CardDescription className="text-xs">
              Độ bao phủ các lớp học trên từng cơ sở khu vực của Vinhomes Ocean Park
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex justify-center items-center h-[260px]">
            <ReportChart
              type="pie"
              data={(distributionData.length > 0 ? distributionData : classDistribution) as unknown as Record<string, unknown>[]}
              dataKeys={["Số lớp"]}
              height={220}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
