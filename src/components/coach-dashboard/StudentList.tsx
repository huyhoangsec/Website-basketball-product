"use client";

import { useState } from "react";
import { Student, StudentStatus } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserCheck, CalendarDays, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StudentListProps {
  students: Student[];
}

export default function StudentList({ students }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "trial">("all");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  // Filter students based on search term and active tab
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentPhone.includes(searchTerm);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && student.status === StudentStatus.ACTIVE) ||
      (activeTab === "trial" && student.status === StudentStatus.TRIAL);

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-4">
      {/* Filters and search bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "all" | "active" | "trial")}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-slate-100 border border-slate-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-navy data-[state=active]:text-white">
              Tất cả ({students.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-navy data-[state=active]:text-white">
              Chính thức ({students.filter((s) => s.status === StudentStatus.ACTIVE).length})
            </TabsTrigger>
            <TabsTrigger value="trial" className="data-[state=active]:bg-navy data-[state=active]:text-white">
              Học thử ({students.filter((s) => s.status === StudentStatus.TRIAL).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm học viên, phụ huynh, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-slate-200 focus-visible:ring-orange"
          />
        </div>
      </div>

      {/* Student list table */}
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-bold text-navy uppercase">STT</TableHead>
              <TableHead className="text-xs font-bold text-navy uppercase">Học viên</TableHead>
              <TableHead className="text-xs font-bold text-navy uppercase">Năm sinh</TableHead>
              <TableHead className="text-xs font-bold text-navy uppercase">Thông tin phụ huynh</TableHead>
              <TableHead className="text-xs font-bold text-navy uppercase">Ngày gia nhập</TableHead>
              <TableHead className="text-xs font-bold text-navy uppercase text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, idx) => (
                <TableRow key={student.id} className="hover:bg-slate-50/50">
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-navy text-white font-semibold">
                        <AvatarFallback className="bg-navy-light text-white text-xs">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm text-navy">{student.name}</p>
                        <p className="text-[11px] text-muted-foreground">ID: {student.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">{student.birthYear}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5 text-sm">
                      <p className="font-medium text-navy flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        {student.parentName}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-orange" />
                        {student.parentPhone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-orange" />
                      {student.joinDate}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`font-semibold text-[10px] px-2 py-0.5 border-none uppercase tracking-wider ${
                        student.status === StudentStatus.ACTIVE
                          ? "bg-green-100 text-green-800"
                          : student.status === StudentStatus.TRIAL
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status === StudentStatus.ACTIVE ? "Chính thức" : "Học thử"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                  Không tìm thấy học viên nào phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
