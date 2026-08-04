import { renderHook, waitFor } from "@testing-library/react";
import { useAdminTournaments } from "../useAdminTournaments";
import { Tournament } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import React from "react";

jest.mock("@/lib/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useAdminTournaments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("fetches tournaments on mount", async () => {
    const mockTournaments = [{ id: "t-1", name: "Winter Cup" }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockTournaments });

    const { result } = renderHook(() => useAdminTournaments(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tournaments).toEqual(mockTournaments);
    expect(api.get).toHaveBeenCalledWith("/admin/tournaments");
  });

  it("handles create tournament", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: "t-2" } });

    const { result } = renderHook(() => useAdminTournaments(), { wrapper });

    result.current.createTournament({ name: "Summer Cup" } as Partial<Tournament>);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/admin/tournaments", { name: "Summer Cup" });
      expect(toast.success).toHaveBeenCalledWith("Đã thêm giải đấu mới");
    });
  });

  it("handles error on create tournament", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useAdminTournaments(), { wrapper });

    result.current.createTournament({ name: "Summer Cup" } as Partial<Tournament>);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Có lỗi xảy ra khi thêm giải đấu");
    });
  });

  it("handles update tournament", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    (api.put as jest.Mock).mockResolvedValueOnce({ data: { id: "t-1" } });

    const { result } = renderHook(() => useAdminTournaments(), { wrapper });

    result.current.updateTournament({ id: "t-1", name: "Updated Cup" } as Partial<Tournament> & { id: string });

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/admin/tournaments/t-1", { name: "Updated Cup" });
      expect(toast.success).toHaveBeenCalledWith("Đã cập nhật giải đấu");
    });
  });

  it("handles delete tournament", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    (api.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useAdminTournaments(), { wrapper });

    result.current.deleteTournament("t-1");

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/admin/tournaments/t-1");
      expect(toast.success).toHaveBeenCalledWith("Đã xóa giải đấu");
    });
  });
});
