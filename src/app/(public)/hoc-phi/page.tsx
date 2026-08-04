import { Metadata } from "next";
import { getTuitionPlans } from "@/lib/api-fetch";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Học phí",
  description: "Bảng giá học phí bóng rổ tại OceanBasketball. Nhiều gói linh hoạt phù hợp nhu cầu.",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

export default async function HocPhiPage() {
  const plans = await getTuitionPlans();
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-gradient-navy" />
        <div className="container-ob relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange/20 text-orange text-sm font-semibold rounded-full mb-4">
            Học phí
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Bảng giá <span className="text-gradient-orange">học phí</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Nhiều gói học phí linh hoạt, phù hợp với nhu cầu và ngân sách của gia đình.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding bg-background">
        <div className="container-ob">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-card rounded-2xl border shadow-sm p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.isPopular
                    ? "border-orange shadow-orange/10 ring-2 ring-orange/20"
                    : "border-border/50"
                }`}
              >
                {/* Popular badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-orange rounded-full text-white text-xs font-semibold shadow-lg">
                      <Star className="w-3 h-3 fill-white" />
                      Phổ biến nhất
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6 pt-2">
                  <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{plan.duration}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-3xl font-bold ${plan.isPopular ? "text-orange" : "text-foreground"}`}>
                      {formatPrice(plan.price)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {plan.sessionsPerWeek} buổi/tuần
                  </p>
                </div>

                {/* Features */}
                <div className="flex-1 space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.isPopular ? "text-orange" : "text-emerald-500"}`} />
                      <span className="text-xs text-muted-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  asChild
                  className={`w-full ${
                    plan.isPopular
                      ? "bg-gradient-orange hover:opacity-90 text-white shadow-lg shadow-orange/30 font-bold"
                      : "font-semibold"
                  }`}
                  variant={plan.isPopular ? "default" : "outline"}
                >
                  <Link href="/hoc-thu">Đăng ký ngay</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Promotional Image & Notes */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-card rounded-2xl p-6 border border-border/50 shadow-sm overflow-hidden">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-navy shrink-0 md:col-span-1">
              <Image
                src="/images/img4.jpg"
                alt="Đồng phục và quà tặng OceanBasketball"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 text-[11px] font-bold text-white z-10">
                🎁 Tặng Full Combo Đồng phục & Bóng rổ FIBA
              </div>
            </div>

            <div className="md:col-span-2 space-y-2 text-sm text-muted-foreground">
              <h3 className="font-bold text-foreground text-base mb-2">Chính sách ưu đãi & Quyền lợi học viên:</h3>
              <ul className="space-y-1.5 text-xs font-medium">
                <li>• Học phí đã bao gồm đầy đủ trang bị bóng và dụng cụ tập luyện chuyên dụng.</li>
                <li>• Hỗ trợ thanh toán linh hoạt qua Chuyển khoản ngân hàng, MoMo hoặc ZaloPay.</li>
                <li>• Hỗ trợ bảo lưu tối đa 2 tuần/tháng đối với lý do sức khỏe hoặc việc gia đình.</li>
                <li>• Giảm thêm 5% tổng học phí khi đăng ký cho 2 anh chị em ruột cùng theo học.</li>
                <li>• Miễn phí 100% 01 buổi học thử trải nghiệm trước khi chính thức nhập học.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
