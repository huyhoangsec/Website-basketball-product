import { renderHook, waitFor } from "@testing-library/react";
import { useAdminTrials, useAdminInvoices } from "../useAdmin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import React from "react";

jest.mock("@/lib/api", () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
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

describe("useAdmin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe("useAdminTrials", () => {
    it("fetches trials", async () => {
      const mockTrials = [{ id: "t1", status: "pending" }];
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockTrials });

      const { result } = renderHook(() => useAdminTrials(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.trials).toEqual(mockTrials);
      expect(api.get).toHaveBeenCalledWith("/admin/trials");
    });

    it("handles update status", async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });
      (api.put as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() => useAdminTrials(), { wrapper });

      result.current.updateStatus("t1", "approved");

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith("/admin/trials/t1/status", { status: "approved" });
      });
    });
  });

  describe("useAdminInvoices", () => {
    it("fetches invoices", async () => {
      const mockInvoices = [{ id: "inv1", status: "unpaid" }];
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockInvoices });

      const { result } = renderHook(() => useAdminInvoices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.invoices).toEqual(mockInvoices);
      expect(api.get).toHaveBeenCalledWith("/admin/invoices");
    });

    it("handles create invoice", async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });
      (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: "inv2" } });

      const { result } = renderHook(() => useAdminInvoices(), { wrapper });

      result.current.createInvoice({ amount: 100 });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith("/admin/invoices", { amount: 100 });
        expect(toast.success).toHaveBeenCalledWith("Đã tạo hóa đơn mới");
      });
    });

    it("handles pay invoice", async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });
      (api.put as jest.Mock).mockResolvedValueOnce({ data: { id: "inv1" } });

      const { result } = renderHook(() => useAdminInvoices(), { wrapper });

      result.current.payInvoice({ id: "inv1", amount: 100, method: "cash", note: "" });

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith("/admin/invoices/inv1/pay", { amount: 100, method: "cash", note: "" });
        expect(toast.success).toHaveBeenCalledWith("Đã thanh toán hóa đơn");
      });
    });
  });
});
