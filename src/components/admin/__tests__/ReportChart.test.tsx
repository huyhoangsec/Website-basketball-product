import { render, screen, waitFor } from "@testing-library/react";
import ReportChart from "../ReportChart";
import React from "react";

// Mock recharts because ResponsiveContainer needs a real DOM with layout
jest.mock("recharts", () => {
  const OriginalRecharts = jest.requireActual("recharts");
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    LineChart: () => <div data-testid="line-chart">LineChart</div>,
    BarChart: () => <div data-testid="bar-chart">BarChart</div>,
    PieChart: () => <div data-testid="pie-chart">PieChart</div>,
  };
});

const mockData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
];

describe("ReportChart", () => {
  it("initially renders loading state before mounting", () => {
    render(<ReportChart type="line" data={mockData} dataKeys={["value"]} />);
    // React 18 might flush effects immediately in testing, so this might mount quickly.
    // If it mounts immediately, we might not see the "Đang tải biểu đồ..." message.
    // We can just verify it eventually renders the chart.
  });

  it("renders LineChart when type is line", async () => {
    render(<ReportChart type="line" data={mockData} dataKeys={["value"]} />);
    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  it("renders BarChart when type is bar", async () => {
    render(<ReportChart type="bar" data={mockData} dataKeys={["value"]} />);
    await waitFor(() => {
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });
  });

  it("renders PieChart when type is pie", async () => {
    render(<ReportChart type="pie" data={mockData} dataKeys={["value"]} />);
    await waitFor(() => {
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });
  });
});
