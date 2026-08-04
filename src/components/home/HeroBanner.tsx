"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useBanners } from "@/hooks/usePublicData";
import { Banner } from "@/types";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroBanner() {
  const { data: banners = [] } = useBanners();

  return (
    <section className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="w-full h-full"
      >
        {banners.map((banner: Banner, index: number) => {
          const imgSrc = banner.image || `/images/img${(index % 3) + 1}.jpg`;
          return (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full">
                {/* Real Background Image */}
                <Image
                  src={imgSrc}
                  alt={banner.title || "OceanBasketball Banner"}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />

                {/* Dark Gradient Overlay for optimal text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60" />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="container-ob text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs md:text-sm font-medium mb-6 shadow-lg">
                        <span className="text-lg">🏀</span>
                        Vinhomes Ocean Park
                      </div>

                      {/* Title */}
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                        {banner.title}
                      </h1>

                      {/* Subtitle */}
                      <p className="text-base md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
                        {banner.subtitle}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          asChild
                          size="lg"
                          className="bg-gradient-orange hover:opacity-90 text-white font-semibold px-8 py-6 text-base shadow-xl shadow-orange/30"
                        >
                          <Link href={banner.ctaLink || "/hoc-thu"}>
                            {banner.ctaText || "Đăng ký học thử"}
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base backdrop-blur-sm"
                        >
                          <Link href="/lo-trinh-tap-luyen">Xem lộ trình</Link>
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
