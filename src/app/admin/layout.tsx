"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShieldAlert, Key } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
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
        <p className="text-white text-sm font-semibold tracking-wider">ĐANG BẢO MẬT HỆ THỐNG...</p>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as { name?: string; email?: string; role?: string };

  // Strict admin role verification
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0F1B33] text-white px-4 text-center">
        <div className="p-4 bg-red-500/10 rounded-full text-red-500 border border-red-500/20 mb-5 animate-bounce">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white mb-2">QUYỀN TRUY CẬP BỊ TỪ CHỐI</h2>
        <p className="text-gray-300 text-sm max-w-md mb-6">
          Tài khoản của bạn không có đặc quyền để truy cập trang quản trị này. Vui lòng liên hệ với ban quản trị hoặc chuyển qua kênh HLV.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="border-white/10 text-white hover:bg-white/5">
            <Link href="/dashboard">
              Kênh HLV
            </Link>
          </Button>
          <Button asChild className="bg-orange hover:bg-orange-dark text-white">
            <Link href="/">
              Về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const initials = user.name ? user.name.split(" ").map((n) => n[0]).slice(-2).join("").toUpperCase() : "AD";

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 shadow-xl z-20">
        <AdminSidebar />
      </aside>

      {/* Main content body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 bg-white border-b border-border h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="lg:hidden text-navy border-slate-200">
                  <Menu className="h-6 w-6" />
                </Button>
              } />
              <SheetContent side="left" className="p-0 w-64 bg-[#1B2A4A] border-none text-white">
                <AdminSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="font-extrabold text-navy text-base md:text-lg tracking-tight uppercase lg:hidden block">
              OceanBasketball
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold bg-red-100 text-red-800 border border-red-200/50 px-2 py-0.5 rounded-full hidden sm:flex items-center gap-1">
              <Key className="h-3 w-3" /> Mode: Admin
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

        {/* Outer scrolling wrap */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
