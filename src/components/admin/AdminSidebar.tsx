"use client";

import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Globe,
  Users,
  MapPin,
  BookOpen,
  UserCheck,
  ClipboardCheck,
  Trophy,
  CreditCard,
  Receipt,
  BarChart3,
  LogOut,
  ChevronRight,
  Shield,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user as { name?: string; email?: string; role?: string };
  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).slice(-2).join("").toUpperCase() : "AD";

  const adminMenu = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { name: "Cấu hình Website", href: "/admin/website", icon: Globe },
    { name: "Quản lý HLV", href: "/admin/hlv", icon: Users },
    { name: "Quản lý Sân", href: "/admin/san", icon: MapPin },
    { name: "Quản lý Lớp học", href: "/admin/lop", icon: BookOpen },
    { name: "Quản lý Học viên", href: "/admin/hoc-vien", icon: UserCheck },
    { name: "Đăng ký Học thử", href: "/admin/hoc-thu", icon: ClipboardCheck },
    { name: "Quản lý Giải đấu", href: "/admin/giai-dau", icon: Trophy },
    { name: "Gói học phí", href: "/admin/hoc-phi", icon: CreditCard },
    { name: "Quản lý Hóa đơn", href: "/admin/hoa-don", icon: Receipt },
    { name: "Báo cáo thống kê", href: "/admin/bao-cao", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1B2A4A] text-white">
      {/* Brand header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#0F1B33]/40">
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Profile info */}
      <div className="p-5 flex items-center gap-3 border-b border-white/5 bg-[#0F1B33]/20">
        <Avatar className="h-10 w-10 border border-white/20">
          <AvatarFallback className="bg-orange text-white text-xs font-bold">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{user?.name || "Administrator"}</p>
          <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full font-bold uppercase">
            Quản trị viên
          </span>
        </div>
      </div>

      {/* Menu links list */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {adminMenu.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-orange text-white shadow-lg shadow-orange/15"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                }`} />
                <span>{item.name}</span>
              </div>
              <ChevronRight className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100" : ""}`} />
            </Link>
          );
        })}

        {/* Portal Portal redirect */}
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-dashed border-white/10 mt-6"
        >
          <div className="flex items-center gap-3">
            <UserCircle className="h-4 w-4 shrink-0" />
            <span>Kênh HLV (Coach)</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </nav>

      {/* Footer Log Out */}
      <div className="p-4 border-t border-white/5 bg-[#0F1B33]/40">
        <Button
          onClick={() => signOut({ callbackUrl: "/login" })}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5 gap-3 h-11"
        >
          <LogOut className="h-4 w-4 text-red-400" />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </div>
  );
}
