import { Metadata } from "next";
import CourtMapWrapper from "@/components/courts/CourtMapWrapper";
import CourtCard from "@/components/courts/CourtCard";
import { getCourts } from "@/lib/api-fetch";

export const metadata: Metadata = {
  title: "Sân bóng rổ",
  description: "Hệ thống sân bóng rổ hiện đại tại Vinhomes Ocean Park. Sân indoor và outdoor với đầy đủ tiện ích.",
};

export default async function SanBongRoPage() {
  const courts = await getCourts();
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-gradient-navy" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-orange/10 blur-3xl" />
        </div>
        <div className="container-ob relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange/20 text-orange text-sm font-semibold rounded-full mb-4">
            Cơ sở vật chất
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Hệ thống <span className="text-gradient-orange">sân bóng rổ</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {courts.length} điểm sân tại Vinhomes Ocean Park với trang thiết bị hiện đại và tiện ích đầy đủ.
          </p>
        </div>
      </section>

      {/* Courts Grid */}
      <section className="section-padding bg-background">
        <div className="container-ob">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {courts.map((court, index) => (
              <CourtCard key={court.id} court={court} index={index} />
            ))}
          </div>

          {/* Map */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Vị trí các sân trên bản đồ
            </h2>
            <CourtMapWrapper />
          </div>
        </div>
      </section>
    </>
  );
}
