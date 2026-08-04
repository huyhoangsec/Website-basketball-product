"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFAQs } from "@/hooks/usePublicData";
import { FAQ } from "@/types";

const defaultFAQs: FAQ[] = [
  {
    id: "faq-fallback-1",
    question: "Độ tuổi nào có thể tham gia các lớp học tại OceanBasketball?",
    answer: "OceanBasketball tiếp nhận học viên từ 5 đến 18 tuổi, phân chia thành các nhóm tuổi U8, U10, U14, U18 với giáo trình huấn luyện phù hợp từng giai đoạn phát triển.",
    category: "Chung",
    order: 1,
  },
  {
    id: "faq-fallback-2",
    question: "Học viên chưa từng chơi bóng rổ có theo học được không?",
    answer: "Hoàn toàn được! Giáo trình U8 và lớp Cơ bản được thiết kế riêng dành cho học viên mới bắt đầu để làm quen với bóng, tư thế nhồi và kỹ thuật ném rổ chuẩn.",
    category: "Khóa học",
    order: 2,
  },
  {
    id: "faq-fallback-3",
    question: "Trung tâm có hỗ trợ học thử miễn phí không?",
    answer: "OceanBasketball hỗ trợ 01 buổi học thử trải nghiệm miễn phí 100% để phụ huynh và các em học viên trực tiếp trải nghiệm sân tập và phương pháp giảng dạy.",
    category: "Đăng ký",
    order: 3,
  },
  {
    id: "faq-fallback-4",
    question: "Lịch học và địa điểm tập luyện tại các cụm sân ra sao?",
    answer: "CLB tổ chức các ca học vào chiều tối ngày thường và các ca sáng/chính chiều cuối tuần tại 3 cụm sân Vinhomes Ocean Park 1, 2 và 3.",
    category: "Lịch học",
    order: 4,
  },
];

export default function FAQSection() {
  const { data: apiFaqs = [] } = useFAQs();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = (apiFaqs && apiFaqs.length > 0) ? apiFaqs : defaultFAQs;

  return (
    <section className="section-padding bg-background" ref={ref}>
      <div className="container-ob">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            <span className="inline-block px-3 py-1 bg-orange/10 text-orange text-sm font-medium rounded-full mb-4">
              Giải đáp thắc mắc
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Câu hỏi{" "}
              <span className="text-gradient-orange">thường gặp</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Tìm câu trả lời cho những thắc mắc phổ biến nhất về chương trình 
              huấn luyện, lịch học, và chính sách của CLB.
            </p>
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                Không tìm thấy câu trả lời?{" "}
                <a href="/lien-he" className="text-orange font-medium hover:underline">
                  Liên hệ chúng tôi
                </a>{" "}
                để được hỗ trợ trực tiếp.
              </p>
            </div>
          </motion.div>

          {/* Right — Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion className="w-full space-y-3">
              {faqs.map((faq: FAQ, index: number) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                >
                  <AccordionItem
                    value={faq.id}
                    className="bg-card rounded-xl border border-border/50 px-5 shadow-sm data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:text-orange transition-colors py-4 [&[data-state=open]]:text-orange">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
