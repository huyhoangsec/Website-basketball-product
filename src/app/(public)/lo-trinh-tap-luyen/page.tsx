import { Metadata } from "next";
import { Star, Zap, Target, Crown, Clock, Users, CheckCircle2 } from "lucide-react";
import TrialRegisterForm from "@/components/forms/TrialRegisterForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Lộ trình tập luyện",
  description: "Chương trình huấn luyện bóng rổ 4 cấp độ từ Beginner đến Elite. Phù hợp cho trẻ em từ 5-18 tuổi.",
};

const levels = [
  {
    level: "Beginner",
    title: "Khởi đầu",
    age: "5-8 tuổi",
    duration: "3-6 tháng",
    icon: Star,
    color: "border-l-emerald-500",
    bgIcon: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    image: "/images/img8.jpg",
    description: "Giai đoạn làm quen với bóng rổ thông qua các trò chơi vận động. Phát triển kỹ năng vận động cơ bản, phối hợp tay-mắt và yêu thích thể thao.",
    skills: ["Dribble cơ bản", "Ném bóng 2 tay", "Di chuyển trên sân", "Phối hợp đội nhóm", "Luật chơi cơ bản"],
  },
  {
    level: "Intermediate",
    title: "Phát triển",
    age: "9-12 tuổi",
    duration: "6-12 tháng",
    icon: Zap,
    color: "border-l-amber-500",
    bgIcon: "bg-amber-500/10",
    textColor: "text-amber-600",
    image: "/images/img9.jpg",
    description: "Nâng cao kỹ thuật cá nhân và bắt đầu học chiến thuật thi đấu. Tập trung phát triển sức bền, tốc độ và kỹ năng xử lý tình huống.",
    skills: ["Crossover & Behind-the-back", "Ném bóng 1 tay", "Layup trái/phải", "Phòng thủ 1-1", "Chiến thuật tấn công cơ bản"],
  },
  {
    level: "Advanced",
    title: "Nâng cao",
    age: "13-16 tuổi",
    duration: "12+ tháng",
    icon: Target,
    color: "border-l-orange",
    bgIcon: "bg-orange/10",
    textColor: "text-orange",
    image: "/images/img10.jpg",
    description: "Chuyên sâu chiến thuật đội hình, thể lực chuyên biệt cho bóng rổ. Chuẩn bị tham gia các giải đấu cấp thành phố và quốc gia.",
    skills: ["Pick & Roll", "Ném 3 điểm", "Phòng thủ khu vực", "Đọc trận đấu", "Thể lực chuyên biệt"],
  },
  {
    level: "Elite",
    title: "Chuyên nghiệp",
    age: "16-18 tuổi",
    duration: "Liên tục",
    icon: Crown,
    color: "border-l-navy",
    bgIcon: "bg-navy/10",
    textColor: "text-navy",
    image: "/images/img11.jpg",
    description: "Đào tạo đội tuyển CLB, thi đấu chuyên nghiệp. Hướng đến học bổng thể thao và sự nghiệp bóng rổ lâu dài.",
    skills: ["Chiến thuật nâng cao", "Phân tích video", "Mental training", "Scouting & Tuyển chọn", "Dinh dưỡng thể thao"],
  },
];

export default function LoTrinhPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-gradient-navy" />
        <div className="container-ob relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-orange/20 text-orange text-sm font-semibold rounded-full mb-4">
            Lộ trình đào tạo
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Chương trình huấn luyện <span className="text-gradient-orange">4 cấp độ</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Thiết kế khoa học, phù hợp từng lứa tuổi và trình độ. Từ người mới bắt đầu đến vận động viên chuyên nghiệp.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-background">
        <div className="container-ob max-w-4xl">
          <div className="space-y-8">
            {levels.map((level, index) => (
              <div
                key={level.level}
                className={`relative bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden border-l-4 ${level.color} flex flex-col md:flex-row`}
              >
                {/* Level Image */}
                <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-navy">
                  <Image
                    src={level.image}
                    alt={level.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-navy/80 via-transparent to-transparent" />
                </div>

                {/* Level Details */}
                <div className="p-6 md:p-8 flex-1">
                  {/* Level badge */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${level.bgIcon} flex items-center justify-center flex-shrink-0`}>
                      <level.icon className={`w-6 h-6 ${level.textColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-bold ${level.textColor} uppercase tracking-wide`}>
                          Level {index + 1} — {level.level}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{level.title}</h3>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-orange" />
                      {level.age}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-orange" />
                      {level.duration}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {level.description}
                  </p>

                  {/* Skills */}
                  <div>
                    <p className="text-sm font-bold text-foreground mb-2">Kỹ năng đạt được:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {level.skills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-ob max-w-xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Bắt đầu hành trình bóng rổ
          </h2>
          <p className="text-muted-foreground mb-8">
            Đăng ký học thử để chúng tôi đánh giá trình độ và tư vấn lộ trình phù hợp cho con bạn.
          </p>
          <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
            <TrialRegisterForm />
          </div>
        </div>
      </section>
    </>
  );
}
