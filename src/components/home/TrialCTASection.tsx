"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const benefits = [
  "Buổi học thử hoàn toàn miễn phí",
  "Huấn luyện viên chuyên nghiệp hướng dẫn",
  "Trang bị bóng và sân tập sẵn sàng",
  "Đánh giá trình độ và tư vấn lộ trình",
];

export default function TrialCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-orange/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full border border-white/5" />
        <div className="absolute top-10 right-1/3 text-8xl opacity-5">🏀</div>
        <div className="absolute bottom-10 left-1/4 text-6xl opacity-5">🏀</div>
      </div>

      <div className="container-ob section-padding relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 bg-orange/20 text-orange text-sm font-semibold rounded-full mb-6">
              🏀 Bắt đầu ngay hôm nay
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Cho con một cơ hội
              <br />
              <span className="text-gradient-orange">trải nghiệm bóng rổ</span>
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
              Đăng ký 1 buổi học thử miễn phí để con trải nghiệm không khí tập luyện 
              và khám phá niềm đam mê bóng rổ cùng OceanBasketball.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-lg mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 text-left"
                >
                  <CheckCircle2 className="w-4 h-4 text-orange flex-shrink-0" />
                  <span className="text-sm text-white/80">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-orange hover:opacity-90 text-white font-bold px-10 py-7 text-lg shadow-2xl shadow-orange/40 animate-pulse-orange"
              >
                <Link href="/hoc-thu">
                  Đăng ký học thử miễn phí
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <p className="text-xs text-white/40 mt-4">
                Không cần cam kết • Hoàn toàn miễn phí
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
