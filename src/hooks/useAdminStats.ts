import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface StatsOverview {
  studentCount: number;
  classCount: number;
  pendingTrials: number;
  coachCount: number;
  totalRevenue: number;
}

interface EnrollmentData {
  name: string;
  "Học viên mới": number;
  "Học thử": number;
}

interface DistributionData {
  name: string;
  "Số lớp": number;
}

interface CoachStatsData {
  name: string;
  "Chuyên cần (%)": number;
}

export function useAdminStats() {
  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ["admin-stats-overview"],
    queryFn: async () => {
      const res = await api.get("/admin/stats/overview");
      return res.data as StatsOverview;
    },
  });

  const { data: enrollmentData = [], isLoading: loadingEnrollment } = useQuery({
    queryKey: ["admin-stats-enrollment"],
    queryFn: async () => {
      const res = await api.get("/admin/stats/revenue");
      return res.data as EnrollmentData[];
    },
  });

  const { data: distributionData = [], isLoading: loadingDistribution } = useQuery({
    queryKey: ["admin-stats-distribution"],
    queryFn: async () => {
      const res = await api.get("/admin/stats/distribution");
      return res.data as DistributionData[];
    },
  });

  const { data: coachStatsData = [], isLoading: loadingCoachStats } = useQuery({
    queryKey: ["admin-stats-coach"],
    queryFn: async () => {
      const res = await api.get("/admin/stats/attendance");
      return res.data as CoachStatsData[];
    },
  });

  return {
    overview,
    loadingOverview,
    enrollmentData,
    loadingEnrollment,
    distributionData,
    loadingDistribution,
    coachStatsData,
    loadingCoachStats,
  };
}
