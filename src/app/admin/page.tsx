"use client";

import { useAdminTrials } from "@/hooks/useAdmin";
import { useCourts } from "@/hooks/usePublicData";
import StatsCard from "@/components/admin/StatsCard";
import ReportChart from "@/components/admin/ReportChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  MapPin,
  ClipboardCheck,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useAdminStats } from "@/hooks/useAdminStats";

// Mock chart data representing student registration trend
const studentGrowthData = [
  { name: "Tháng 8", "Học viên": 35, "Học thử": 12 },
  { name: "Tháng 9", "Học viên": 50, "Học thử": 20 },
  { name: "Tháng 10", "Học viên": 68, "Học thử": 18 },
  { name: "Tháng 11", "Học viên": 92, "Học thử": 25 },
  { name: "Tháng 12", "Học viên": 120, "Học thử": 32 },
  { name: "Tháng 1", "Học viên": 150, "Học thử": 45 },
];

export default function AdminDashboardPage() {
  const { overview, enrollmentData, distributionData } = useAdminStats();

  // Real-time calculated statistics from api data
  const studentCount = overview?.studentCount || 0;
  const classCount = overview?.classCount || 0;
  const pendingTrials = overview?.pendingTrials || 0;
  const coachCount = overview?.coachCount || 0;
  const totalRevenue = overview?.totalRevenue || 0;

  const { trials = [] } = useAdminTrials();
  const recentTrials = trials.slice(0, 5);
  const { data: courts = [] } = useCourts();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-navy flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-orange" />
            Báo cáo tổng quan hệ thống
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dữ liệu tổng hợp tình hình hoạt động, tuyển sinh và tài chính của CLB
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" asChild className="border-slate-200 text-slate-700 bg-white">
            <Link href="/admin/bao-cao">
              <FileText className="mr-2 h-4 w-4 text-orange" />
              Chi tiết báo cáo
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          icon={<Users className="h-5 w-5" />}
          label="Tổng học viên"
          value={`${studentCount} HS`}
          trend={{ value: "+12.5%", isUp: true }}
          iconBgColor="bg-blue-100/50"
          iconColor="text-blue-600"
        />
        <StatsCard
          icon={<UserCheck className="h-5 w-5" />}
          label="Số Lớp học"
          value={`${classCount} Lớp`}
          trend={{ value: "+2 lớp", isUp: true }}
          iconBgColor="bg-green-100/50"
          iconColor="text-green-600"
        />
        <StatsCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          label="Học thử chờ duyệt"
          value={`${pendingTrials} Đăng ký`}
          trend={{ value: "-4.2%", isUp: false }}
          iconBgColor="bg-yellow-100/50"
          iconColor="text-yellow-600"
        />
        <StatsCard
          icon={<GraduationCap className="h-5 w-5" />}
          label="Tổng số HLV"
          value={`${coachCount} HLV`}
          iconBgColor="bg-purple-100/50"
          iconColor="text-purple-600"
        />
        <StatsCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Doanh thu"
          value={`${totalRevenue.toLocaleString("vi-VN")}đ`}
          iconBgColor="bg-orange/10"
          iconColor="text-orange"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration trend line chart */}
        <Card className="lg:col-span-2 border-border shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-navy">
              Biểu đồ tăng trưởng tuyển sinh
            </CardTitle>
            <CardDescription className="text-xs">
              Thống kê số lượng học viên chính thức và lượt học thử trong 6 tháng qua
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ReportChart
              type="line"
              data={(enrollmentData.length > 0 ? enrollmentData : studentGrowthData) as unknown as Record<string, unknown>[]}
              dataKeys={["Học viên mới", "Học thử"]}
              xAxisKey="name"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Court allocation pie chart */}
        <Card className="border-border shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-navy">Phân bổ lớp theo sân</CardTitle>
            <CardDescription className="text-xs">
              Tỉ lệ phân chia lớp học trên các điểm sân Vinhomes Ocean Park
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex justify-center items-center h-[300px]">
            <ReportChart
              type="pie"
              data={(distributionData.length > 0 ? distributionData : [{ name: "Đang tải", value: 1 }]) as unknown as Record<string, unknown>[]}
              dataKeys={["Số lớp"]}
              height={260}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recents section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent trials */}
        <Card className="lg:col-span-2 border-border shadow-sm bg-white">
          <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-slate-50">
            <div>
              <CardTitle className="text-sm font-bold text-navy">
                Đăng ký học thử mới nhất
              </CardTitle>
              <CardDescription className="text-xs">
                Danh sách các phụ huynh gửi đăng ký thử nghiệm gần đây
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs text-orange hover:text-orange hover:bg-orange/5">
              <Link href="/admin/hoc-thu" className="flex items-center gap-1">
                Xem tất cả
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-border text-navy font-bold uppercase">
                    <th className="p-4">Học viên</th>
                    <th className="p-4">Phụ huynh</th>
                    <th className="p-4">SĐT</th>
                    <th className="p-4">Sân mong muốn</th>
                    <th className="p-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentTrials.map((trial) => (
                    <tr key={trial.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-navy">{trial.studentName}</td>
                      <td className="p-4 font-medium text-slate-700">{trial.parentName}</td>
                      <td className="p-4 text-slate-600">{trial.parentPhone}</td>
                      <td className="p-4 text-slate-600">{trial.preferredCourt}</td>
                      <td className="p-4 text-center">
                        <Badge
                          className={`font-semibold text-[9px] px-2 py-0.5 border-none uppercase ${
                            trial.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : trial.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {trial.status === "pending" && "Chờ duyệt"}
                          {trial.status === "approved" && "Đã duyệt"}
                          {trial.status === "rejected" && "Từ chối"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Short info list */}
        <Card className="border-border shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-navy">Thông tin nhanh sân bãi</CardTitle>
            <CardDescription className="text-xs">
              Các cụm sân đang hoạt động trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3.5">
              {courts.map((court) => (
                <div key={court.id} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-navy flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-orange shrink-0" />
                      {court.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{court.address}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-slate-200 text-navy font-bold shrink-0">
                    {court.classCount || 0} Lớp
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
