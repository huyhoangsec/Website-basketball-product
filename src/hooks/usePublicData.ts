import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Review, FAQ, Coach, Court, ClassInfo, TuitionPlan, Banner, Tournament } from "@/types";

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await api.get("/public/reviews");
      return res.data as Review[];
    },
  });
}

export function useFAQs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await api.get("/public/faqs");
      return res.data as FAQ[];
    },
  });
}

export function useCoaches() {
  return useQuery({
    queryKey: ["coaches"],
    queryFn: async () => {
      const res = await api.get("/public/coaches");
      return res.data as Coach[];
    },
  });
}

export function useCourts() {
  return useQuery({
    queryKey: ["courts"],
    queryFn: async () => {
      const res = await api.get("/public/courts");
      return res.data as Court[];
    },
  });
}

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await api.get("/public/banners");
      return res.data as Banner[];
    },
  });
}

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await api.get("/public/classes");
      return res.data as ClassInfo[];
    },
  });
}

export function useTuitionPlans() {
  return useQuery({
    queryKey: ["tuition-plans"],
    queryFn: async () => {
      const res = await api.get("/public/tuition-plans");
      return res.data as TuitionPlan[];
    },
  });
}

export function useTournaments() {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const res = await api.get("/public/tournaments");
      return res.data as Tournament[];
    },
  });
}
