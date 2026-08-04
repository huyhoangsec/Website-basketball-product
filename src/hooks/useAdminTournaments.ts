import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Tournament } from "@/types";
import { toast } from "sonner";

export function useAdminTournaments() {
  const queryClient = useQueryClient();
  const queryKey = ["admin-tournaments"];

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get("/admin/tournaments");
      return res.data as Tournament[];
    },
  });

  const createTournament = useMutation({
    mutationFn: async (data: Partial<Tournament>) => await api.post("/admin/tournaments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã thêm giải đấu mới");
    },
    onError: () => toast.error("Có lỗi xảy ra khi thêm giải đấu"),
  });

  const updateTournament = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Tournament> & { id: string }) => await api.put(`/admin/tournaments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã cập nhật giải đấu");
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật giải đấu"),
  });

  const deleteTournament = useMutation({
    mutationFn: async (id: string) => await api.delete(`/admin/tournaments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã xóa giải đấu");
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa giải đấu"),
  });

  return {
    tournaments,
    isLoading,
    createTournament: createTournament.mutate,
    updateTournament: updateTournament.mutate,
    deleteTournament: deleteTournament.mutate,
  };
}
