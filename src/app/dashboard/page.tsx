import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getClasses } from "@/lib/api-fetch";
import ScheduleTable from "@/components/coach-dashboard/ScheduleTable";
import { CalendarRange, Sparkles, Flame } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Lịch dạy | HLV OceanBasketball",
  description: "Lịch dạy hàng tuần của Huấn luyện viên OceanBasketball",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as { name?: string; email?: string; role?: string };

  const classesData = await getClasses();
  
  // Filter classes where the coach email matches the logged-in user
  // For admin role, show all classes, for coach show only their classes
  const coachClasses = classesData.filter(
    (c) => user.role === "admin" || c.coach?.email === user.email
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-navy p-6 md:p-8 rounded-2xl text-white relative overflow-hidden shadow-lg shadow-navy/20">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 select-none pointer-events-none">
          <Flame className="h-44 w-44 text-white" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange animate-pulse" />
            <span className="text-xs font-bold text-orange uppercase tracking-wider">
              Bảng điều khiển HLV
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Xin chào, {user.name}!
          </h2>
          <p className="text-gray-300 text-sm max-w-xl">
            Chào mừng bạn quay trở lại. Chúc bạn có những buổi huấn luyện tràn đầy năng lượng cùng các học viên OceanBasketball hôm nay!
          </p>
        </div>
      </div>

      {/* Schedule Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-bold text-navy flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-orange" />
            Lịch dạy trong tuần
          </h3>
          <p className="text-xs text-muted-foreground">
            Lịch học hàng tuần được phân bổ tại các cụm sân Vinhomes Ocean Park
          </p>
        </div>
        <div className="text-xs font-semibold text-muted-foreground bg-white border border-border px-3 py-1.5 rounded-lg shadow-sm">
          Tuần hiện tại
        </div>
      </div>

      {/* Schedule Table Component */}
      <ScheduleTable classes={coachClasses} />
    </div>
  );
}
