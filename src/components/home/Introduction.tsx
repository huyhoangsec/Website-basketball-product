"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Users, Trophy, Calendar, MapPin } from "lucide-react";

const stats = [
  { icon: Users, value: 150, suffix: "+", label: "Học viên" },
  { icon: Trophy, value: 4, suffix: "", label: "HLV chuyên nghiệp" },
  { icon: Calendar, value: 3, suffix: "", label: "Năm hoạt động" },
  { icon: MapPin, value: 3, suffix: "", label: "Điểm sân" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-bold text-orange">
      {count}
      {suffix}
    </span>
  );
}

export default function Introduction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [imgSrc, setImgSrc] = useState("/images/img1.jpg");

  return (
    <section className="section-padding bg-background overflow-hidden" ref={ref}>
      <div className="container-ob">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-orange/10 text-orange text-sm font-medium rounded-full mb-4">
              Về chúng tôi
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Phát triển tài năng bóng rổ{" "}
              <span className="text-gradient-orange">toàn diện</span> cho thế hệ trẻ
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              OceanBasketball là câu lạc bộ bóng rổ chuyên nghiệp tại Vinhomes Ocean Park, 
              được thành lập với sứ mệnh mang đến môi trường tập luyện bóng rổ chất lượng cao 
              cho trẻ em từ 5 đến 18 tuổi.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Với đội ngũ huấn luyện viên giàu kinh nghiệm, hệ thống sân hiện đại và chương trình 
              đào tạo bài bản từ cơ bản đến nâng cao, chúng tôi cam kết giúp mỗi học viên phát triển 
              không chỉ kỹ năng bóng rổ mà còn rèn luyện thể chất, tinh thần đồng đội và bản lĩnh thi đấu.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-card border border-border/50 shadow-sm"
                >
                  <stat.icon className="w-6 h-6 text-orange mx-auto mb-2" />
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image / Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border/50 group bg-navy">
              {/* Real Basketball Image */}
              <Image
                src={imgSrc}
                alt="Hoạt động bóng rổ OceanBasketball Since 2022"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgSrc("/images/img2.jpg")}
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

              {/* Decorative elements */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-navy/80 backdrop-blur-md rounded-lg text-white text-sm font-semibold border border-white/10 shadow-lg z-10">
                Since 2022 🏀
              </div>
              <div className="absolute bottom-4 right-4 px-3.5 py-1.5 bg-orange/90 backdrop-blur-md rounded-lg text-white text-sm font-semibold shadow-lg z-10">
                Vinhomes Ocean Park
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-navy/95 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-white/10 hidden md:block z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-orange rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  🏆
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Đào tạo chuyên nghiệp</p>
                  <p className="text-xs text-orange font-medium">Chứng chỉ HLV FIBA</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
