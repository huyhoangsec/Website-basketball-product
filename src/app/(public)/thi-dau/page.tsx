import { Metadata } from "next";
import { getTournaments } from "@/lib/api-fetch";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { TournamentStatus } from "@/types";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Thi đấu & Giải đấu",
  description: "Hệ thống giải đấu bóng rổ nội bộ và liên CLB tại OceanBasketball. Rèn luyện bản lĩnh thi đấu cho học viên.",
};

function getStatusBadge(status: TournamentStatus) {
  switch (status) {
    case TournamentStatus.UPCOMING:
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-semibold">Sắp diễn ra</Badge>;
    case TournamentStatus.ONGOING:
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold">Đang diễn ra</Badge>;
    case TournamentStatus.COMPLETED:
      return <Badge variant="secondary" className="font-semibold">Đã kết thúc</Badge>;
  }
}

export default async function ThiDauPage() {
  const tournaments = await getTournaments();
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-gradient-navy" />
        <div className="container-ob relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange/20 text-orange text-sm font-semibold rounded-full mb-4">
            Thi đấu
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Hệ thống <span className="text-gradient-orange">giải đấu</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Rèn luyện bản lĩnh thi đấu, tinh thần đồng đội qua các giải đấu nội bộ và liên CLB được tổ chức định kỳ.
          </p>
        </div>
      </section>

      {/* Info */}
      <section className="section-padding bg-background">
        <div className="container-ob">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Trophy, title: "Giải nội bộ", desc: "Tổ chức hàng tháng theo lứa tuổi U10, U12, U14, U16" },
              { icon: CalendarDays, title: "Giải liên CLB", desc: "Giao lưu thi đấu với các CLB bóng rổ tại Hà Nội" },
              { icon: MapPin, title: "Giải quốc gia", desc: "Đội tuyển CLB tham gia các giải đấu cấp quốc gia" },
            ].map((item) => (
              <div key={item.title} className="bg-card p-6 rounded-xl border border-border/50 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-orange" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Tournament list */}
          <h2 className="text-2xl font-bold text-foreground mb-6">Lịch giải đấu bóng rổ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments.map((tournament, index) => {
              const bannerImg = tournament.banner || `/images/img${(index % 3) + 13}.jpg`;
              return (
                <div
                  key={tournament.id}
                  className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300"
                >
                  {/* Tournament Banner Image */}
                  <div className="relative aspect-[16/9] w-full bg-navy">
                    <Image
                      src={bannerImg}
                      alt={tournament.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                    <div className="absolute top-3 right-3 z-10">
                      {getStatusBadge(tournament.status)}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-2">{tournament.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tournament.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-3 border-t border-border/50">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-orange" />
                        {new Date(tournament.date).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange" />
                        {tournament.location}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
