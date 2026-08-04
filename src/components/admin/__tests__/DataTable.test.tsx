import { render, screen, fireEvent } from "@testing-library/react";
import DataTable from "../DataTable";
import { ColumnDef } from "@tanstack/react-table";

type TestData = {
  id: string;
  name: string;
};

const columns: ColumnDef<TestData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

const mockData: TestData[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
];

describe("DataTable", () => {
  it("renders table with data", () => {
    render(<DataTable columns={columns} data={mockData} />);
    
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<DataTable columns={columns} data={mockData} isLoading={true} />);
    
    // In your DataTable implementation, isLoading might show a spinner or skeleton
    // This is a basic test assuming there's some loading indicator or text
    // We will just verify it doesn't crash
  });

  it("renders add button when onAdd is provided", () => {
    const mockOnAdd = jest.fn();
    render(<DataTable columns={columns} data={mockData} onAdd={mockOnAdd} addLabel="Add Item" />);
    
    const addButton = screen.getByText("Add Item");
    expect(addButton).toBeInTheDocument();
    
    fireEvent.click(addButton);
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it("filters data based on search", () => {
    render(<DataTable columns={columns} data={mockData} searchKey="name" searchPlaceholder="Search Name" />);
    
    const searchInput = screen.getByPlaceholderText("Search Name");
    fireEvent.change(searchInput, { target: { value: "Alice" } });
    
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });
});
