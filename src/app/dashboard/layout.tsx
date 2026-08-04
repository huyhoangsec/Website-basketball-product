"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Calendar,
  Users,
  LogOut,
  Menu,
  Trophy,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface SidebarContentProps {
  user: { name?: string; email?: string; role?: string };
  initials: string;
  pathname: string;
  onSignOut: () => void;
  onNavigate: () => void;
}

function SidebarContent({ user, initials, pathname, onSignOut, onNavigate }: SidebarContentProps) {
  const menuItems = [
    { name: "Lịch dạy", href: "/dashboard", icon: Calendar },
    { name: "Lớp phụ trách", href: "/dashboard/classes", icon: Users },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1B2A4A] text-white">
      <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#0F1B33]/40">
        <div className="p-2 bg-orange rounded-lg">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-wider uppercase">OCEAN BASKETBALL</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">HLV PORTAL</p>
        </div>
      </div>

      <div className="p-5 flex items-center gap-3 border-b border-white/5 bg-[#0F1B33]/20">
        <Avatar className="h-10 w-10 border border-white/20 bg-[#FF6B35]">
          <AvatarFallback className="bg-orange text-white text-xs font-bold">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{user.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[9px] bg-orange/20 text-orange-light border border-orange/30 px-1.5 py-0.5 rounded-full font-bold uppercase">
              Huấn luyện viên
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
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

        {user.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-yellow-400 hover:bg-white/5 transition-all mt-4 border border-dashed border-yellow-400/35 bg-yellow-400/5"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Bảng quản trị (Admin)</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-white/5 bg-[#0F1B33]/40">
        <Button
          onClick={onSignOut}
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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0F1B33]">
        <div className="h-10 w-10 rounded-full border-4 border-orange border-t-transparent animate-spin mb-4" />
        <p className="text-white text-sm font-semibold tracking-wider">ĐANG TẢI HỆ THỐNG...</p>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as { name?: string; email?: string; role?: string };
  const initials = user.name ? user.name.split(" ").map((n) => n[0]).slice(-2).join("").toUpperCase() : "HLV";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const sidebarProps = { user, initials, pathname, onSignOut: handleSignOut, onNavigate: () => setIsMobileMenuOpen(false) };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden lg:block w-64 shrink-0 shadow-xl z-20">
        <SidebarContent {...sidebarProps} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 bg-white border-b border-border h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="lg:hidden text-navy border-slate-200">
                  <Menu className="h-6 w-6" />
                </Button>
              } />
              <SheetContent side="left" className="p-0 w-64 bg-[#1B2A4A] border-none text-white">
                <SidebarContent {...sidebarProps} />
              </SheetContent>
            </Sheet>
            <span className="font-extrabold text-navy text-base md:text-lg tracking-tight uppercase lg:hidden block">
              OceanBasketball
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Hệ thống quản lý nội bộ CLB
            </span>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <Avatar className="h-8 w-8 bg-orange text-white">
                <AvatarFallback className="bg-orange text-white text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-navy hidden md:block">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
