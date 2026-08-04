import { render, screen } from "@testing-library/react";
import ScheduleTable from "../ScheduleTable";
import { ClassInfo, TrainingLevel } from "@/types";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockClasses: ClassInfo[] = [
  {
    id: "cls-1",
    name: "U12 Basic",
    coachId: "c-1",
    courtId: "crt-1",
    court: { id: "crt-1", name: "Sân 1", address: "Địa chỉ 1", latitude: 20.9, longitude: 105.9, images: [], facilities: [], classCount: 1 },
    coach: { id: "c-1", name: "Coach X", email: "coach@test.com", phone: "123", avatar: "", specialization: "", experience: "", achievements: [], bio: "", isActive: true },
    level: "beginner" as TrainingLevel,
    schedule: [
      {
        dayOfWeek: 2, // Thứ Ba
        startTime: "17:30",
        endTime: "19:00",
      },
    ],
    maxStudents: 20,
    currentStudents: 15,
    trialStudents: 3,
  },
];

describe("ScheduleTable", () => {
  it("renders the table with schedule data", () => {
    render(<ScheduleTable classes={mockClasses} />);
    
    // Test if class name is rendered
    expect(screen.getAllByText("U12 Basic").length).toBeGreaterThan(0);
    // Test if court name is rendered
    expect(screen.getAllByText("Sân 1").length).toBeGreaterThan(0);
  });

  it("renders empty schedule properly without crashing", () => {
    render(<ScheduleTable classes={[]} />);
    
    // There shouldn't be any "U12 Basic" if classes is empty
    expect(screen.queryByText("U12 Basic")).not.toBeInTheDocument();
  });
});
