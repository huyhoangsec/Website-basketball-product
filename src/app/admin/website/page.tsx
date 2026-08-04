"use client";

import { useState } from "react";
import { useAdminWebsite } from "@/hooks/useAdminWebsite";
import { Banner, FAQ, Review } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash, Plus, Globe, Eye, EyeOff, Star } from "lucide-react";

export default function AdminWebsitePage() {
  const {
    banners,
    createBanner,
    updateBanner,
    deleteBanner,
    faqs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    reviews,
    createReview,
    updateReview,
    deleteReview,
  } = useAdminWebsite();

  const [activeTab, setActiveTab] = useState("banners");

  // Dialog & Edit control states
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Form states - Banner
  const [bTitle, setBTitle] = useState("");
  const [bSubtitle, setBSubtitle] = useState("");
  const [bCtaText, setBCtaText] = useState("");
  const [bCtaLink, setBCtaLink] = useState("");
  const [bOrder, setBOrder] = useState("1");

  // Form states - FAQ
  const [fQuestion, setFQuestion] = useState("");
  const [fAnswer, setFAnswer] = useState("");
  const [fOrder, setFOrder] = useState("1");

  // Form states - Review
  const [rParentName, setRParentName] = useState("");
  const [rStudentName, setRStudentName] = useState("");
  const [rRating, setRRating] = useState("5");
  const [rContent, setRContent] = useState("");

  // ==========================================
  // BANNER HANDLERS
  // ==========================================
  const handleOpenBannerAdd = () => {
    setEditingBanner(null);
    setBTitle("");
    setBSubtitle("");
    setBCtaText("");
    setBCtaLink("");
    setBOrder("1");
    setIsBannerOpen(true);
  };

  const handleOpenBannerEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setBTitle(banner.title || "");
    setBSubtitle(banner.subtitle || "");
    setBCtaText(banner.ctaText || "");
    setBCtaLink(banner.ctaLink || "");
    setBOrder(String(banner.order));
    setIsBannerOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner(
        {
          id: editingBanner.id,
          title: bTitle,
          subtitle: bSubtitle,
          ctaText: bCtaText,
          ctaLink: bCtaLink,
          order: Number(bOrder),
        },
        {
          onSuccess: () => setIsBannerOpen(false),
        }
      );
    } else {
      createBanner(
        {
          title: bTitle,
          subtitle: bSubtitle,
          ctaText: bCtaText,
          ctaLink: bCtaLink,
          order: Number(bOrder),
          image: "/images/banner-placeholder.jpg",
          isActive: true,
        },
        {
          onSuccess: () => setIsBannerOpen(false),
        }
      );
    }
  };

  const handleDeleteBanner = (id: string) => {
    deleteBanner(id);
  };

  const toggleBannerStatus = (banner: Banner) => {
    updateBanner({ id: banner.id, isActive: !banner.isActive });
  };

  // ==========================================
  // FAQ HANDLERS
  // ==========================================
  const handleOpenFaqAdd = () => {
    setEditingFaq(null);
    setFQuestion("");
    setFAnswer("");
    setFOrder("1");
    setIsFaqOpen(true);
  };

  const handleOpenFaqEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFQuestion(faq.question);
    setFAnswer(faq.answer);
    setFOrder(String(faq.order));
    setIsFaqOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fQuestion || !fAnswer) {
      toast.error("Vui lòng điền câu hỏi và câu trả lời!");
      return;
    }
    if (editingFaq) {
      updateFAQ(
        {
          id: editingFaq.id,
          question: fQuestion,
          answer: fAnswer,
          order: Number(fOrder),
        },
        {
          onSuccess: () => setIsFaqOpen(false),
        }
      );
    } else {
      createFAQ(
        {
          question: fQuestion,
          answer: fAnswer,
          order: Number(fOrder),
          category: "general",
        },
        {
          onSuccess: () => setIsFaqOpen(false),
        }
      );
    }
  };

  const handleDeleteFaq = (id: string) => {
    deleteFAQ(id);
  };

  // ==========================================
  // REVIEWS HANDLERS
  // ==========================================
  const handleToggleReviewVisibility = (review: Review) => {
    updateReview({ id: review.id, isVisible: !review.isVisible });
  };

  const handleDeleteReview = (id: string) => {
    deleteReview(id);
  };

  const handleOpenReviewAdd = () => {
    setEditingReview(null);
    setRParentName("");
    setRStudentName("");
    setRRating("5");
    setRContent("");
    setIsReviewOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rParentName || !rContent) {
      toast.error("Vui lòng điền thông tin phụ huynh và đánh giá!");
      return;
    }
    if (editingReview) {
      updateReview(
        {
          id: editingReview.id,
          parentName: rParentName,
          studentName: rStudentName,
          rating: Number(rRating),
          content: rContent,
        },
        {
          onSuccess: () => setIsReviewOpen(false),
        }
      );
    } else {
      createReview(
        {
          parentName: rParentName,
          studentName: rStudentName,
          rating: Number(rRating),
          content: rContent,
          isVisible: true,
        },
        {
          onSuccess: () => setIsReviewOpen(false),
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-navy flex items-center gap-2">
          <Globe className="h-6 w-6 text-orange" />
          Cấu hình Giao diện & Nội dung Website
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Quản lý banner trang chủ, sửa đổi danh mục FAQ hỏi đáp và kiểm duyệt đánh giá từ phụ huynh học viên
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100 border border-slate-200 w-full md:w-auto grid grid-cols-3">
          <TabsTrigger value="banners" className="data-[state=active]:bg-navy data-[state=active]:text-white">
            Banner Trang chủ ({banners.length})
          </TabsTrigger>
          <TabsTrigger value="faqs" className="data-[state=active]:bg-navy data-[state=active]:text-white">
            Hỏi đáp FAQ ({faqs.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-navy data-[state=active]:text-white">
            Đánh giá Phụ huynh ({reviews.length})
          </TabsTrigger>
        </TabsList>

        {/* BANNERS TAB CONTENT */}
        <TabsContent value="banners" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleOpenBannerAdd} className="bg-orange hover:bg-orange-dark text-white font-semibold">
              <Plus className="h-4.5 w-4.5 mr-1" /> Thêm Banner mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banners.map((b) => (
              <Card key={b.id} className="border-border overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                <div className="aspect-video bg-slate-200 relative flex items-center justify-center text-slate-400 font-bold select-none text-xs">
                  [Banner Image Placeholder]
                  <Badge className="absolute top-2 right-2 bg-navy text-white text-[9px] border-none">
                    Thứ tự: {b.order}
                  </Badge>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold text-navy line-clamp-1">{b.title || "Không có tiêu đề"}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{b.subtitle || "Không có mô tả"}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-2 text-xs space-y-1">
                  <p>CTA: <strong className="text-navy">{b.ctaText || "Trống"}</strong></p>
                  <p>Link: <code className="text-orange text-[10px]">{b.ctaLink || "Trống"}</code></p>
                </CardContent>
                <div className="bg-slate-50 border-t p-3 flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-slate-200 text-slate-600 hover:text-navy text-xs"
                    onClick={() => toggleBannerStatus(b)}
                  >
                    {b.isActive ? (
                      <>
                        <Eye className="h-3.5 w-3.5 mr-1 text-green-600" /> Hiển thị
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5 mr-1 text-slate-400" /> Ẩn
                      </>
                    )}
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-navy" onClick={() => handleOpenBannerEdit(b)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDeleteBanner(b.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQS TAB CONTENT */}
        <TabsContent value="faqs" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleOpenFaqAdd} className="bg-orange hover:bg-orange-dark text-white font-semibold">
              <Plus className="h-4.5 w-4.5 mr-1" /> Thêm Hỏi đáp FAQ
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-border text-navy font-bold uppercase">
                  <th className="p-4 w-16 text-center">Thứ tự</th>
                  <th className="p-4">Câu hỏi</th>
                  <th className="p-4">Câu trả lời</th>
                  <th className="p-4 text-end w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-700">
                {faqs.sort((a, b) => a.order - b.order).map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-50/50">
                    <td className="p-4 text-center font-bold text-slate-500">{faq.order}</td>
                    <td className="p-4 font-bold text-navy text-xs max-w-xs">{faq.question}</td>
                    <td className="p-4 text-xs text-slate-600 line-clamp-2 mt-2">{faq.answer}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-navy" onClick={() => handleOpenFaqEdit(faq)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDeleteFaq(faq.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* REVIEWS TAB CONTENT */}
        <TabsContent value="reviews" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleOpenReviewAdd} className="bg-orange hover:bg-orange-dark text-white font-semibold">
              <Plus className="h-4.5 w-4.5 mr-1" /> Thêm Đánh giá mới
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-border text-navy font-bold uppercase">
                  <th className="p-4">Phụ huynh</th>
                  <th className="p-4">Sao</th>
                  <th className="p-4">Nội dung đánh giá</th>
                  <th className="p-4 text-center">Hiển thị</th>
                  <th className="p-4 text-end w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-700">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <p className="font-bold text-navy text-xs">{rev.parentName}</p>
                      {rev.studentName && <p className="text-[10px] text-muted-foreground">{rev.studentName}</p>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-0.5 text-yellow-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-500" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-600 max-w-sm">{rev.content}</td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleReviewVisibility(rev)}
                        className={`h-8 w-8 rounded-full ${rev.isVisible ? "text-green-600 hover:text-green-700" : "text-slate-400"}`}
                        title="Click để ẩn/hiển thị"
                      >
                        {rev.isVisible ? <Eye className="h-4.5 w-4.5" /> : <EyeOff className="h-4.5 w-4.5" />}
                      </Button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDeleteReview(rev.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Banner Dialog */}
      <Dialog open={isBannerOpen} onOpenChange={setIsBannerOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <form onSubmit={handleSaveBanner}>
            <DialogHeader>
              <DialogTitle className="text-navy flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange" />
                {editingBanner ? "Cập nhật Banner" : "Tạo Banner mới"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700 text-sm">
              <div className="space-y-1">
                <Label htmlFor="b-title" className="text-xs font-bold text-navy">
                  Tiêu đề chính
                </Label>
                <Input id="b-title" value={bTitle} onChange={(e) => setBTitle(e.target.value)} placeholder="Chào mừng đến với CLB..." className="border-slate-200" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="b-sub" className="text-xs font-bold text-navy">
                  Mô tả phụ
                </Label>
                <Textarea id="b-sub" value={bSubtitle} onChange={(e) => setBSubtitle(e.target.value)} placeholder="Cụm sân bóng rổ Vinhomes..." rows={2} className="border-slate-200 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="b-cta-t" className="text-xs font-bold text-navy">
                    Nhãn nút CTA
                  </Label>
                  <Input id="b-cta-t" value={bCtaText} onChange={(e) => setBCtaText(e.target.value)} placeholder="Đăng ký học thử" className="border-slate-200" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="b-cta-l" className="text-xs font-bold text-navy">
                    Link liên kết CTA
                  </Label>
                  <Input id="b-cta-l" value={bCtaLink} onChange={(e) => setBCtaLink(e.target.value)} placeholder="/hoc-thu" className="border-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="b-order" className="text-xs font-bold text-navy">
                  Thứ tự hiển thị
                </Label>
                <Input id="b-order" type="number" value={bOrder} onChange={(e) => setBOrder(e.target.value)} className="border-slate-200" />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBannerOpen(false)} className="border-slate-200">Hủy</Button>
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white">Lưu lại</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={isFaqOpen} onOpenChange={setIsFaqOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <form onSubmit={handleSaveFaq}>
            <DialogHeader>
              <DialogTitle className="text-navy flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange" />
                {editingFaq ? "Cập nhật Hỏi đáp FAQ" : "Thêm mới Hỏi đáp FAQ"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700 text-sm">
              <div className="space-y-1">
                <Label htmlFor="f-q" className="text-xs font-bold text-navy">
                  Câu hỏi đặt ra *
                </Label>
                <Input id="f-q" value={fQuestion} onChange={(e) => setFQuestion(e.target.value)} placeholder="Học thử có mất phí không?" className="border-slate-200" required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="f-a" className="text-xs font-bold text-navy">
                  Câu trả lời chi tiết *
                </Label>
                <Textarea id="f-a" value={fAnswer} onChange={(e) => setFAnswer(e.target.value)} placeholder="Hoàn toàn miễn phí..." rows={3} className="border-slate-200 resize-none" required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="f-order" className="text-xs font-bold text-navy">
                  Thứ tự hiển thị
                </Label>
                <Input id="f-order" type="number" value={fOrder} onChange={(e) => setFOrder(e.target.value)} className="border-slate-200" />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFaqOpen(false)} className="border-slate-200">Hủy</Button>
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white">Lưu lại</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <form onSubmit={handleSaveReview}>
            <DialogHeader>
              <DialogTitle className="text-navy flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange" />
                Thêm Đánh giá Phụ huynh
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="r-parent" className="text-xs font-bold text-navy">
                    Tên phụ huynh *
                  </Label>
                  <Input id="r-parent" value={rParentName} onChange={(e) => setRParentName(e.target.value)} placeholder="Chị Nguyễn Thu Hà" className="border-slate-200" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="r-student" className="text-xs font-bold text-navy">
                    Tên học viên con
                  </Label>
                  <Input id="r-student" value={rStudentName} onChange={(e) => setRStudentName(e.target.value)} placeholder="Bé Gia Bảo" className="border-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="r-rating" className="text-xs font-bold text-navy">
                  Số điểm đánh giá (sao) *
                </Label>
                <Select value={rRating} onValueChange={(val) => setRRating(val || "5")}>
                  <SelectTrigger className="bg-white border-slate-200 text-navy font-semibold">
                    <SelectValue placeholder="5 sao" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border">
                    {["5", "4", "3", "2", "1"].map((s) => (
                      <SelectItem key={s} value={s}>{s} Sao</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="r-content" className="text-xs font-bold text-navy">
                  Ý kiến đánh giá *
                </Label>
                <Textarea id="r-content" value={rContent} onChange={(e) => setRContent(e.target.value)} placeholder="Cảm nghĩ của phụ huynh về khóa học..." rows={3} className="border-slate-200 resize-none" required />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReviewOpen(false)} className="border-slate-200">Hủy</Button>
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white">Lưu lại</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
