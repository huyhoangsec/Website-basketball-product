"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

const initialGalleryItems = [
  { id: 1, image: "/images/img2.jpg", label: "Tập luyện kỹ thuật", span: "col-span-2 row-span-2" },
  { id: 2, image: "/images/img3.jpg", label: "Thi đấu giao hữu", span: "col-span-1 row-span-1" },
  { id: 3, image: "/images/img4.jpg", label: "Đội hình HLV & Học viên", span: "col-span-1 row-span-1" },
  { id: 4, image: "/images/img5.jpg", label: "Giải thưởng & Cúp", span: "col-span-1 row-span-1" },
  { id: 5, image: "/images/img6.jpg", label: "Hoạt động ngoại khóa", span: "col-span-1 row-span-2" },
  { id: 6, image: "/images/img7.jpg", label: "Sân tập Vinhomes Ocean Park", span: "col-span-1 row-span-1" },
];

export default function ClubGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [items, setItems] = useState(initialGalleryItems);

  const handleImageError = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, image: `/images/img${(id % 5) + 1}.jpg` } : item
      )
    );
  };

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
            Hình ảnh thực tế
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Hoạt động tại{" "}
            <span className="text-gradient-orange">OceanBasketball</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Hình ảnh chân thực các buổi tập luyện, giải đấu và môi trường đào tạo năng động tại các điểm sân Vinhomes Ocean Park.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[200px]">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
              className={`${item.span} relative rounded-xl overflow-hidden cursor-pointer group border border-border/50 shadow-md bg-navy`}
            >
              {/* Real Image */}
              <Image
                src={item.image}
                alt={item.label}
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => handleImageError(item.id)}
              />

              {/* Hover Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Label */}
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <div className="bg-navy/80 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/10 opacity-90 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-xs md:text-sm font-semibold flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className="text-orange text-xs">🏀</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
