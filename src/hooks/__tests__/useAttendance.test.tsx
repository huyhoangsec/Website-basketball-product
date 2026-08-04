import { renderHook, waitFor } from "@testing-library/react";
import { useAttendance } from "../useAttendance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import React from "react";
import { AttendanceStatus } from "@/types";

jest.mock("@/lib/api", () => ({
  get: jest.fn(),
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

describe("useAttendance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("fetches attendance records", async () => {
    const mockRecords = [{ student_id: "s1", status: AttendanceStatus.PRESENT }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockRecords });

    const { result } = renderHook(() => useAttendance("c1", "2024-01-01"), { wrapper });

    await waitFor(() => {
      expect(result.current.records).toEqual(mockRecords);
    });

    expect(api.get).toHaveBeenCalledWith("/coach/classes/c1/attendance", { params: { date: "2024-01-01" } });
  });

  it("marks attendance successfully", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useAttendance("c1", "2024-01-01"), { wrapper });

    result.current.markAttendance("s1", "John", "c1", "2024-01-01", AttendanceStatus.PRESENT);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/coach/classes/c1/attendance", {
        student_id: "s1",
        status: AttendanceStatus.PRESENT,
        date: "2024-01-01",
      });
      expect(toast.success).toHaveBeenCalledWith("Đã cập nhật: đã có mặt");
    });
  });

  it("removes attendance successfully", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useAttendance("c1", "2024-01-01"), { wrapper });

    result.current.removeAttendanceRecord("s1", "c1", "2024-01-01");

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/coach/classes/c1/attendance", {
        student_id: "s1",
        status: AttendanceStatus.CANCELLED,
        date: "2024-01-01",
      });
      expect(toast.success).toHaveBeenCalledWith("Đã cập nhật: đã hủy điểm danh");
    });
  });
});
