"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote, Loader2 } from "lucide-react";
import { useReviews } from "@/hooks/usePublicData";
import { Review } from "@/types";

import "swiper/css";
import "swiper/css/pagination";

const defaultReviews: Review[] = [
  {
    id: "rev-fallback-1",
    parentName: "Chị Nguyễn Thu Trang",
    avatar: "/images/img18.jpg",
    rating: 5,
    content: "Bé nhà mình học ở Vinhomes Ocean Park được 6 tháng, con tự tin hẳn lên và chiều cao phát triển rất tốt. HLV rất kiên nhẫn và tận tâm!",
    studentName: "Bé Minh Trí (8 tuổi)",
    isVisible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "rev-fallback-2",
    parentName: "Anh Hoàng Văn Nam",
    avatar: "/images/img19.jpg",
    rating: 5,
    content: "Sân bãi sạch đẹp, an toàn. Thích nhất là trung tâm có các giải đấu nội bộ cho các con cọ xát hàng tháng.",
    studentName: "Bé Hoàng Anh (11 tuổi)",
    isVisible: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "rev-fallback-3",
    parentName: "Chị Trần Thanh Hà",
    avatar: "/images/img20.jpg",
    rating: 5,
    content: "Giáo trình bài bản, môi trường năng động lành mạnh giúp con tránh xa điện thoại sau giờ học.",
    studentName: "Bé Việt Cường (14 tuổi)",
    isVisible: true,
    createdAt: new Date().toISOString(),
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { data: apiReviews, isLoading } = useReviews();

  const displayReviews = (apiReviews && apiReviews.length > 0) ? apiReviews : defaultReviews;

  return (
    <section className="section-padding bg-background overflow-hidden" ref={ref}>
      <div className="container-ob">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 bg-orange/10 text-orange text-sm font-medium rounded-full mb-4">
            Đánh giá từ phụ huynh
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Phụ huynh nói gì về{" "}
            <span className="text-gradient-orange">OceanBasketball</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Niềm tin và sự hài lòng của phụ huynh là động lực lớn nhất để chúng tôi nâng tầm đào tạo.
          </p>
        </motion.div>

        {/* Reviews Carousel */}
        {isLoading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange" /></div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12"
            >
              {displayReviews.map((review) => (
                <SwiperSlide key={review.id}>
                  <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      {/* Quote icon */}
                      <Quote className="w-8 h-8 text-orange/30 mb-4" />

                      {/* Content */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        &ldquo;{review.content}&rdquo;
                      </p>
                    </div>

                    <div>
                      {/* Rating */}
                      <StarRating rating={review.rating} />

                      {/* Author */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {review.parentName ? review.parentName.charAt(review.parentName.lastIndexOf(" ") + 1) : "P"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {review.parentName}
                          </p>
                          {review.studentName && (
                            <p className="text-xs text-muted-foreground">
                              {review.studentName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </div>
    </section>
  );
}
