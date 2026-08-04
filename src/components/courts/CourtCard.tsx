"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Court } from "@/types";
import { MapPin, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface CourtCardProps {
  court: Court;
  index: number;
}

export default function CourtCard({ court, index }: CourtCardProps) {
  const defaultImg = `/images/img${(index % 4) + 5}.jpg`;
  const initialImg = court.images?.[0] || defaultImg;
  const [imgSrc, setImgSrc] = useState(initialImg);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* Real Image */}
      <div className="relative aspect-video overflow-hidden bg-navy">
        <Image
          src={imgSrc}
          alt={court.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(defaultImg)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 z-10">
          <div className="px-3 py-1 bg-orange/90 backdrop-blur-md rounded-lg text-white text-xs font-bold shadow-lg">
            {court.classCount || 4} Lớp đang dạy
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-orange transition-colors">
          {court.name}
        </h3>
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-snug">{court.address}</p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          {(court.facilities || []).slice(0, 3).map((facility) => (
            <div key={facility} className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {facility}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
