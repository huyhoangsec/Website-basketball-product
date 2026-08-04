"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/ui/Logo";

const quickLinks = [
  { href: "/hoc-thu", label: "Đăng ký học thử" },
  { href: "/huan-luyen-vien", label: "Huấn luyện viên" },
  { href: "/san-bong-ro", label: "Sân bóng rổ" },
  { href: "/lo-trinh-tap-luyen", label: "Lộ trình tập luyện" },
  { href: "/thi-dau", label: "Thi đấu" },
  { href: "/hoc-phi", label: "Học phí" },
];

const socialLinks = [
  { href: "https://facebook.com/oceanbasketball", label: "Facebook", icon: "📘" },
  { href: "https://instagram.com/oceanbasketball", label: "Instagram", icon: "📸" },
  { href: "https://tiktok.com/@oceanbasketball", label: "TikTok", icon: "🎵" },
  { href: "https://youtube.com/@oceanbasketball", label: "YouTube", icon: "▶️" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="container-ob section-padding !pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Câu lạc bộ bóng rổ chuyên nghiệp tại Vinhomes Ocean Park. 
              Đào tạo và phát triển tài năng bóng rổ cho trẻ em từ 5-18 tuổi 
              với chương trình huấn luyện bài bản và HLV giàu kinh nghiệm.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-orange/20 flex items-center justify-center transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">
                  Vinhomes Ocean Park, Đa Tốn, Gia Lâm, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange flex-shrink-0" />
                <a href="tel:0901234567" className="text-sm text-white/60 hover:text-orange transition-colors">
                  0901 234 567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange flex-shrink-0" />
                <a href="mailto:info@oceanbasketball.vn" className="text-sm text-white/60 hover:text-orange transition-colors">
                  info@oceanbasketball.vn
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">
                  T2-T6: 16:00 – 20:00<br />
                  T7-CN: 07:00 – 12:00
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Đăng ký nhận tin</h3>
            <p className="text-sm text-white/60 mb-4">
              Nhận thông tin về lịch học, giải đấu và khuyến mãi mới nhất.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-orange transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-orange rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} OceanBasketball. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            <Link href="/lien-he" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/lien-he" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
