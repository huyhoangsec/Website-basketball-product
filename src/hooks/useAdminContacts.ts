import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function useAdminContacts() {
  const queryClient = useQueryClient();
  const queryKey = ["admin-contacts"];

  const { data: contacts = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get("/admin/contacts");
      return res.data as Contact[];
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/admin/contacts/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Lỗi khi đánh dấu đã đọc");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/contacts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã xóa liên hệ");
    },
    onError: () => {
      toast.error("Lỗi khi xóa liên hệ");
    }
  });

  return {
    contacts,
    isLoading,
    markRead: markReadMutation.mutate,
    deleteContact: deleteMutation.mutate,
  };
}
