"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Star, Zap, Target, Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const levels = [
  {
    level: "Beginner",
    title: "Khởi đầu",
    age: "5-8 tuổi",
    icon: Star,
    color: "from-emerald-500 to-emerald-600",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    description: "Làm quen bóng rổ, phát triển vận động cơ bản",
  },
  {
    level: "Intermediate",
    title: "Phát triển",
    age: "9-12 tuổi",
    icon: Zap,
    color: "from-amber-500 to-amber-600",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    description: "Nâng cao kỹ thuật, chiến thuật thi đấu cơ bản",
  },
  {
    level: "Advanced",
    title: "Nâng cao",
    age: "13-16 tuổi",
    icon: Target,
    color: "from-orange to-orange-dark",
    borderColor: "border-orange/30",
    bgColor: "bg-orange/10",
    textColor: "text-orange",
    description: "Chuyên sâu chiến thuật, thể lực chuyên biệt",
  },
  {
    level: "Elite",
    title: "Chuyên nghiệp",
    age: "16-18 tuổi",
    icon: Crown,
    color: "from-navy to-navy-light",
    borderColor: "border-navy/30",
    bgColor: "bg-navy/10",
    textColor: "text-navy",
    description: "Thi đấu chuyên nghiệp, đội tuyển CLB",
  },
];

export default function TrainingRoadmapPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-muted/30" ref={ref}>
      <div className="container-ob">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 bg-orange/10 text-orange text-sm font-medium rounded-full mb-4">
            Lộ trình đào tạo
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Chương trình huấn luyện{" "}
            <span className="text-gradient-orange">4 cấp độ</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Từ người mới bắt đầu đến vận động viên chuyên nghiệp, lộ trình của chúng tôi 
            được thiết kế phù hợp với từng lứa tuổi và trình độ.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line — desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 via-orange to-navy rounded-full -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
            {levels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="relative"
              >
                {/* Timeline dot — desktop */}
                <div className="hidden md:flex absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r items-center justify-center z-10 shadow-lg"
                  style={{ top: "calc(50% - 12px)" }}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${level.color} shadow-md`} />
                </div>

                <div className={`bg-card rounded-xl p-6 border ${level.borderColor} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`w-12 h-12 rounded-xl ${level.bgColor} flex items-center justify-center mb-4`}>
                    <level.icon className={`w-6 h-6 ${level.textColor}`} />
                  </div>
                  <div className={`text-xs font-semibold ${level.textColor} mb-1`}>
                    {level.level}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {level.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">{level.age}</p>
                  <p className="text-sm text-muted-foreground">
                    {level.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-10"
        >
          <Button asChild variant="outline" className="group">
            <Link href="/lo-trinh-tap-luyen">
              Xem chi tiết lộ trình
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
