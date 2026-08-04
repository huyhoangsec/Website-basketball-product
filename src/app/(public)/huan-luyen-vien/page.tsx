import { Metadata } from "next";
import CoachCard from "@/components/coaches/CoachCard";
import { getCoaches } from "@/lib/api-fetch";

export const metadata: Metadata = {
  title: "Đội ngũ huấn luyện viên",
  description: "Gặp gỡ đội ngũ HLV chuyên nghiệp, giàu kinh nghiệm tại OceanBasketball. Chứng chỉ FIBA, cựu VĐV quốc gia.",
};

export default async function HuanLuyenVienPage() {
  const coaches = await getCoaches();
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-gradient-navy" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-orange/10 blur-3xl" />
        </div>
        <div className="container-ob relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange/20 text-orange text-sm font-semibold rounded-full mb-4">
            Đội ngũ
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Huấn luyện viên <span className="text-gradient-orange">chuyên nghiệp</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Đội ngũ HLV giàu kinh nghiệm, tận tâm và đầy nhiệt huyết. Mỗi HLV đều có chứng chỉ chuyên môn và thành tích thi đấu ấn tượng.
          </p>
        </div>
      </section>

      {/* Coach Grid */}
      <section className="section-padding bg-background">
        <div className="container-ob">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coaches.map((coach, index) => (
              <CoachCard key={coach.id} coach={coach} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
