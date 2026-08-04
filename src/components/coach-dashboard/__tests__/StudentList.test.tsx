import { render, screen, fireEvent } from "@testing-library/react";
import StudentList from "../StudentList";
import { Student, StudentStatus } from "@/types";

const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    birthYear: 2010,
    parentName: "Jane Doe",
    parentPhone: "0123456789",
    classId: "cls-1",
    status: StudentStatus.ACTIVE,
    joinDate: "2023-01-01",
  },
  {
    id: "2",
    name: "Alice Smith",
    birthYear: 2011,
    parentName: "Bob Smith",
    parentPhone: "0987654321",
    classId: "cls-1",
    status: StudentStatus.TRIAL,
    joinDate: "2023-02-01",
  },
];

describe("StudentList", () => {
  it("renders all students initially", () => {
    render(<StudentList students={mockStudents} />);
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  it("filters students by search term", () => {
    render(<StudentList students={mockStudents} />);
    
    const searchInput = screen.getByPlaceholderText(/Tìm học viên/i);
    fireEvent.change(searchInput, { target: { value: "Alice" } });
    
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  it("filters students by active tab", () => {
    render(<StudentList students={mockStudents} />);
    
    const activeTab = screen.getByRole("tab", { name: /Chính thức/i });
    fireEvent.click(activeTab);
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
  });
  
  it("filters students by trial tab", () => {
    render(<StudentList students={mockStudents} />);
    
    const trialTab = screen.getByRole("tab", { name: /Học thử/i });
    fireEvent.click(trialTab);
    
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });
});
