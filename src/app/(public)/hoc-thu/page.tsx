import { Metadata } from "next";
import TrialRegisterForm from "@/components/forms/TrialRegisterForm";
import ReviewsSection from "@/components/home/ReviewsSection";
import FAQSection from "@/components/home/FAQSection";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Đăng ký học thử miễn phí",
  description: "Đăng ký 1 buổi học thử bóng rổ miễn phí tại OceanBasketball. Trải nghiệm không khí tập luyện chuyên nghiệp tại Vinhomes Ocean Park.",
};

const benefits = [
  "Buổi học thử hoàn toàn miễn phí 100%",
  "HLV chuyên nghiệp có chứng chỉ hướng dẫn tận tình",
  "Đánh giá thể trạng, trình độ và tư vấn lộ trình phù hợp",
  "Trang bị bóng và dụng cụ tập luyện đầy đủ",
  "Sân tập thảm tiêu chuẩn FIBA hiện đại, an toàn",
  "Không bắt buộc đăng ký sau khi kết thúc buổi học thử",
];

export default function HocThuPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-gradient-navy" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-orange/10 blur-3xl" />
        </div>
        <div className="container-ob relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange/20 text-orange text-sm font-semibold rounded-full mb-4">
            Miễn phí 100%
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Đăng ký <span className="text-gradient-orange">học thử</span> ngay
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Cho con một cơ hội trải nghiệm bóng rổ cùng đội ngũ HLV chuyên nghiệp tại Vinhomes Ocean Park.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-background">
        <div className="container-ob">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Benefits & Image */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Tại sao nên cho bé học thử tại OceanBasketball?
              </h2>

              {/* Real Training Photo */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md border border-border/50 bg-navy mb-6">
                <Image
                  src="/images/img3.jpg"
                  alt="Học thử bóng rổ miễn phí"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 z-10 text-white font-bold text-sm">
                  🏀 Không khí tập luyện sôi nổi & truyền cảm hứng
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground font-medium">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                <h3 className="font-bold text-foreground mb-1 text-sm">📞 Liên hệ hotline tư vấn nhanh</h3>
                <p className="text-xs text-muted-foreground mb-1">
                  Hotline: <a href="tel:0901234567" className="text-orange font-bold">0901 234 567</a>
                </p>
                <p className="text-xs text-muted-foreground">
                  Zalo: <a href="https://zalo.me/oceanbasketball" className="text-orange font-bold">OceanBasketball Official</a>
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-lg">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Điền thông tin đăng ký cho học viên
              </h2>
              <TrialRegisterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Reuse sections */}
      <ReviewsSection />
      <FAQSection />
    </>
  );
}
