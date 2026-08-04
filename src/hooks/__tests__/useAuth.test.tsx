import { renderHook } from "@testing-library/react";
import { useAuth } from "../useAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("useAuth", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("handles loading state", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "loading" });
    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("redirects if unauthenticated", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });
    renderHook(() => useAuth());

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("redirects if role does not match required role", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { role: "coach" } },
    });
    renderHook(() => useAuth("admin"));

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("does not redirect if role matches required role", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { role: "admin" } },
    });
    renderHook(() => useAuth("admin"));

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("returns user roles correctly", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { role: "coach", name: "John" } },
    });
    const { result } = renderHook(() => useAuth());

    expect(result.current.isCoach()).toBe(true);
    expect(result.current.isAdmin()).toBe(false);
    expect(result.current.user?.name).toBe("John");
  });
});
