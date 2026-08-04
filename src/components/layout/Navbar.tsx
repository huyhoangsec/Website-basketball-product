"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Logo from "@/components/ui/Logo";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/hoc-thu", label: "Học thử" },
  { href: "/huan-luyen-vien", label: "Huấn luyện viên" },
  { href: "/san-bong-ro", label: "Sân bóng rổ" },
  { href: "/lo-trinh-tap-luyen", label: "Lộ trình" },
  { href: "/thi-dau", label: "Thi đấu" },
  { href: "/hoc-phi", label: "Học phí" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-dark ${
        isScrolled
          ? "shadow-lg shadow-navy-dark/40 py-2 border-b border-white/10"
          : "border-b border-white/10 py-3.5"
      }`}
    >
      <nav className="container-ob">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-orange font-semibold"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/lien-he" className="text-white/90 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              <Phone className="w-4 h-4" />
            </Link>
            <Button
              asChild
              className="bg-gradient-orange hover:opacity-90 text-white font-semibold shadow-lg shadow-orange/30 animate-pulse-orange"
            >
              <Link href="/hoc-thu">Đăng ký học thử</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="w-6 h-6" />
                </Button>
              } />
              <SheetContent side="right" className="w-80 bg-navy border-navy-light p-0">
                <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-orange rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        🏀
                      </div>
                      <span className="text-white font-bold">OceanBasketball</span>
                    </div>
                  </div>

                  {/* Mobile Nav Items */}
                  <div className="flex-1 py-4">
                    <AnimatePresence>
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className={`flex items-center px-6 py-3.5 text-base font-medium transition-colors ${
                              isActive(item.href)
                                ? "text-orange bg-white/5 border-r-2 border-orange font-semibold"
                                : "text-white/80 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Mobile CTA */}
                  <div className="p-4 border-t border-white/10">
                    <Button
                      asChild
                      className="w-full bg-gradient-orange hover:opacity-90 text-white font-semibold py-6"
                    >
                      <Link href="/hoc-thu">Đăng ký học thử miễn phí</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
