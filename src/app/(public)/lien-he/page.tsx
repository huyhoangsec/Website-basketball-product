import { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ OceanBasketball. Địa chỉ: Vinhomes Ocean Park, Gia Lâm, Hà Nội. Hotline: 0901 234 567.",
};

const contactInfo = [
  { icon: MapPin, label: "Địa chỉ cụ thể", value: "Biệt thự Ngọc Trai 08, Vinhomes Ocean Park 1, Gia Lâm, Hà Nội", href: undefined },
  { icon: Phone, label: "Hotline tư vấn", value: "0901 234 567", href: "tel:0901234567" },
  { icon: Mail, label: "Email phản hồi", value: "info@oceanbasketball.vn", href: "mailto:info@oceanbasketball.vn" },
  { icon: MessageCircle, label: "Hỗ trợ Zalo OA", value: "OceanBasketball Official", href: "https://zalo.me/oceanbasketball" },
  { icon: Clock, label: "Giờ làm việc", value: "T2-T6: 16:00-20:00 | T7-CN: 07:00-12:00", href: undefined },
];

export default function LienHePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-gradient-navy" />
        <div className="container-ob relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange/20 text-orange text-sm font-semibold rounded-full mb-4">
            Liên hệ
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Liên hệ <span className="text-gradient-orange">chúng tôi</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ qua bất kỳ kênh nào dưới đây.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-ob">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Thông tin liên hệ trụ sở</h2>
              <div className="space-y-4 mb-8">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-orange" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-bold text-foreground hover:text-orange transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Real Office / Court Photo */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-border/50 bg-navy">
                <Image
                  src="/images/img7.jpg"
                  alt="Văn phòng OceanBasketball"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-orange shrink-0" />
                    <span className="font-bold text-sm">Văn phòng Điều hành & Cụm Sân Trung tâm</span>
                  </div>
                  <p className="text-xs text-white/80">Khu Biệt thự Ngọc Trai, Vinhomes Ocean Park 1, Hà Nội</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Gửi tin nhắn trực tiếp</h2>
              <div className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
