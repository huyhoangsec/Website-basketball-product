import { render, screen, fireEvent } from "@testing-library/react";
import AttendanceRow from "../AttendanceRow";
import { Student, StudentStatus, AttendanceStatus } from "@/types";

const mockStudent: Student = {
  id: "1",
  name: "John Doe",
  birthYear: 2010,
  parentName: "Jane Doe",
  parentPhone: "0123456789",
  classId: "cls-1",
  status: StudentStatus.ACTIVE,
  joinDate: "2023-01-01",
};

describe("AttendanceRow", () => {
  it("renders student information", () => {
    render(
      <table>
        <tbody>
          <AttendanceRow
            student={mockStudent}
            currentStatus={undefined}
            onMarkStatus={jest.fn()}
            onUndo={jest.fn()}
            index={0}
          />
        </tbody>
      </table>
    );
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/2010/)).toBeInTheDocument();
  });

  it("calls onMarkStatus when a status button is clicked", () => {
    const mockOnMarkStatus = jest.fn();
    render(
      <table>
        <tbody>
          <AttendanceRow
            student={mockStudent}
            currentStatus={undefined}
            onMarkStatus={mockOnMarkStatus}
            onUndo={jest.fn()}
            index={0}
          />
        </tbody>
      </table>
    );
    
    // There are buttons for Có mặt, Có phép, Không phép, Nghỉ luôn.
    // "Có mặt" should be one of them.
    const presentButton = screen.getByTitle("Có mặt");
    fireEvent.click(presentButton);
    
    expect(mockOnMarkStatus).toHaveBeenCalledWith(AttendanceStatus.PRESENT);
  });

  it("calls onUndo when undo button is clicked", () => {
    const mockOnUndo = jest.fn();
    render(
      <table>
        <tbody>
          <AttendanceRow
            student={mockStudent}
            currentStatus={AttendanceStatus.PRESENT}
            onMarkStatus={jest.fn()}
            onUndo={mockOnUndo}
            index={0}
          />
        </tbody>
      </table>
    );
    
    const undoButton = screen.getByTitle("Hoàn tác điểm danh");
    fireEvent.click(undoButton);
    
    expect(mockOnUndo).toHaveBeenCalledTimes(1);
  });
});
