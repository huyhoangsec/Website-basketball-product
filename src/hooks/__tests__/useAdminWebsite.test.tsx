import { renderHook, waitFor } from "@testing-library/react";
import { useAdminWebsite } from "../useAdminWebsite";
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

describe("useAdminWebsite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("fetches all website data on mount", async () => {
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === "/public/banners") return Promise.resolve({ data: [{ id: "b1", title: "Banner" }] });
      if (url === "/public/faqs") return Promise.resolve({ data: [{ id: "f1", question: "FAQ" }] });
      if (url === "/public/reviews") return Promise.resolve({ data: [{ id: "r1", author: "Author" }] });
      if (url === "/public/tuition-plans") return Promise.resolve({ data: [{ id: "tp1", name: "Plan" }] });
      return Promise.resolve({ data: [] });
    });

    const { result } = renderHook(() => useAdminWebsite(), { wrapper });

    await waitFor(() => {
      expect(result.current.loadingBanners).toBe(false);
      expect(result.current.loadingFaqs).toBe(false);
      expect(result.current.loadingReviews).toBe(false);
      expect(result.current.loadingTuitionPlans).toBe(false);
    });

    expect(result.current.banners).toHaveLength(1);
    expect(result.current.faqs).toHaveLength(1);
    expect(result.current.reviews).toHaveLength(1);
    expect(result.current.tuitionPlans).toHaveLength(1);
  });

  it("handles create banner", async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: "b2" } });

    const { result } = renderHook(() => useAdminWebsite(), { wrapper });

    result.current.createBanner({ title: "New Banner" } as Partial<import("@/types").Banner>);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/admin/banners", { title: "New Banner" });
      expect(toast.success).toHaveBeenCalledWith("Đã thêm Banner");
    });
  });
});
