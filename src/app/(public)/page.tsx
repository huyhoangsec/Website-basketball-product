import { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import Introduction from "@/components/home/Introduction";
import ClubGallery from "@/components/home/ClubGallery";
import TrainingRoadmapPreview from "@/components/home/TrainingRoadmapPreview";
import ReviewsSection from "@/components/home/ReviewsSection";
import TrialCTASection from "@/components/home/TrialCTASection";
import FAQSection from "@/components/home/FAQSection";

export const metadata: Metadata = {
  title: "OceanBasketball — CLB Bóng Rổ Vinhomes Ocean Park",
  description:
    "Câu lạc bộ bóng rổ chuyên nghiệp tại Vinhomes Ocean Park. Chương trình huấn luyện cho trẻ từ 5-18 tuổi. Đăng ký học thử miễn phí!",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <Introduction />
      <ClubGallery />
      <TrainingRoadmapPreview />
      <ReviewsSection />
      <TrialCTASection />
      <FAQSection />
    </>
  );
}
