import { renderHook, waitFor } from "@testing-library/react";
import { useReviews, useFAQs, useCoaches, useCourts } from "../usePublicData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "@/lib/api";
import React from "react";

jest.mock("@/lib/api", () => ({
  get: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("usePublicData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("useReviews fetches reviews", async () => {
    const mockData = [{ id: "1", author: "A" }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useReviews(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith("/public/reviews");
  });

  it("useFAQs fetches faqs", async () => {
    const mockData = [{ id: "1", question: "Q" }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useFAQs(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith("/public/faqs");
  });

  it("useCoaches fetches coaches", async () => {
    const mockData = [{ id: "1", name: "Coach" }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useCoaches(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith("/public/coaches");
  });

  it("useCourts fetches courts", async () => {
    const mockData = [{ id: "1", name: "Court" }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useCourts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith("/public/courts");
  });
});
