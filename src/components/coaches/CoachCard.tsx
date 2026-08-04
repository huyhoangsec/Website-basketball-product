"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coach } from "@/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface CoachCardProps {
  coach: Coach;
  index: number;
}

export default function CoachCard({ coach, index }: CoachCardProps) {
  const defaultImg = `/images/img${(index % 4) + 2}.jpg`;
  const [imgSrc, setImgSrc] = useState(coach.avatar || defaultImg);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Real Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-navy">
        <Image
          src={imgSrc}
          alt={coach.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(defaultImg)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <h3 className="text-lg font-bold text-white drop-shadow-sm">{coach.name}</h3>
          <p className="text-xs text-orange font-semibold drop-shadow">{coach.specialization}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-semibold text-slate-500 mb-2">{coach.experience}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {coach.bio}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(coach.achievements || []).slice(0, 2).map((achievement) => (
            <Badge key={achievement} variant="secondary" className="text-[11px] font-medium bg-muted">
              🏆 {achievement}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
