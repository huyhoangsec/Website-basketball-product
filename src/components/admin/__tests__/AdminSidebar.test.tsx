import { render, screen } from "@testing-library/react";
import AdminSidebar from "../AdminSidebar";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));



jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { name: "Admin", role: "admin" } }, status: "authenticated" }),
}));

describe("AdminSidebar", () => {
  it("renders correctly", () => {
    (usePathname as jest.Mock).mockReturnValue("/admin/dashboard");
    render(<AdminSidebar />);
    
    expect(screen.getByText("OCEAN BASKETBALL")).toBeInTheDocument();
    expect(screen.getByText("Tổng quan")).toBeInTheDocument();
  });
});
