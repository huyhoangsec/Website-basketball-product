import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Banner, FAQ, Review, TuitionPlan } from "@/types";
import { toast } from "sonner";

export function useAdminWebsite() {
  const queryClient = useQueryClient();

  // --- BANNERS ---
  const { data: banners = [], isLoading: loadingBanners } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const res = await api.get("/admin/banners");
      return res.data as Banner[];
    },
  });

  const createBanner = useMutation({
    mutationFn: async (data: Partial<Banner>) => await api.post("/admin/banners", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast.success("Đã thêm Banner");
    },
  });

  const updateBanner = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Banner> & { id: string }) => await api.put(`/admin/banners/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast.success("Đã cập nhật Banner");
    },
  });

  const deleteBanner = useMutation({
    mutationFn: async (id: string) => await api.delete(`/admin/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast.success("Đã xóa Banner");
    },
  });

  // --- FAQs ---
  const { data: faqs = [], isLoading: loadingFaqs } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const res = await api.get("/admin/faqs");
      return res.data as FAQ[];
    },
  });

  const createFAQ = useMutation({
    mutationFn: async (data: Partial<FAQ>) => await api.post("/admin/faqs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      toast.success("Đã thêm FAQ");
    },
  });

  const updateFAQ = useMutation({
    mutationFn: async ({ id, ...data }: Partial<FAQ> & { id: string }) => await api.put(`/admin/faqs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      toast.success("Đã cập nhật FAQ");
    },
  });

  const deleteFAQ = useMutation({
    mutationFn: async (id: string) => await api.delete(`/admin/faqs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      toast.success("Đã xóa FAQ");
    },
  });

  // --- REVIEWS ---
  const { data: reviews = [], isLoading: loadingReviews } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await api.get("/admin/reviews");
      return res.data as Review[];
    },
  });

  const createReview = useMutation({
    mutationFn: async (data: Partial<Review>) => await api.post("/admin/reviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Đã thêm đánh giá");
    },
  });

  const updateReview = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Review> & { id: string }) => await api.put(`/admin/reviews/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Đã cập nhật đánh giá");
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => await api.delete(`/admin/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Đã xóa đánh giá");
    },
  });

  // --- TUITION PLANS ---
  const { data: tuitionPlans = [], isLoading: loadingTuitionPlans } = useQuery({
    queryKey: ["admin-tuition-plans"],
    queryFn: async () => {
      const res = await api.get("/admin/tuition-plans");
      return res.data as TuitionPlan[];
    },
  });

  const createTuitionPlan = useMutation({
    mutationFn: async (data: Partial<TuitionPlan>) => await api.post("/admin/tuition-plans", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tuition-plans"] });
      toast.success("Đã thêm gói học phí");
    },
  });

  const updateTuitionPlan = useMutation({
    mutationFn: async ({ id, ...data }: Partial<TuitionPlan> & { id: string }) => await api.put(`/admin/tuition-plans/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tuition-plans"] });
      toast.success("Đã cập nhật gói học phí");
    },
  });

  const deleteTuitionPlan = useMutation({
    mutationFn: async (id: string) => await api.delete(`/admin/tuition-plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tuition-plans"] });
      toast.success("Đã xóa gói học phí");
    },
  });

  return {
    banners, loadingBanners, createBanner: createBanner.mutate, updateBanner: updateBanner.mutate, deleteBanner: deleteBanner.mutate,
    faqs, loadingFaqs, createFAQ: createFAQ.mutate, updateFAQ: updateFAQ.mutate, deleteFAQ: deleteFAQ.mutate,
    reviews, loadingReviews, createReview: createReview.mutate, updateReview: updateReview.mutate, deleteReview: deleteReview.mutate,
    tuitionPlans, loadingTuitionPlans, createTuitionPlan: createTuitionPlan.mutate, updateTuitionPlan: updateTuitionPlan.mutate, deleteTuitionPlan: deleteTuitionPlan.mutate,
  };
}

export function useUploadImage() {
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await api.post("/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [(data) => data], // Keep FormData intact
      });
      return res.data;
    },
    onError: () => {
      toast.error("Tải ảnh thất bại");
    }
  });

  return { upload: uploadMutation.mutateAsync, isUploading: uploadMutation.isPending };
}
