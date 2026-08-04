import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AttendanceRecord, AttendanceStatus } from "@/types";
import { toast } from "sonner";

export function useAttendance(classId: string, date: string) {
  const queryClient = useQueryClient();
  const queryKey = ["attendance", classId, date];

  const { data: records = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get(`/coach/classes/${classId}/attendance`, { params: { date } });
      return res.data as AttendanceRecord[];
    },
    enabled: !!classId && !!date,
  });

  const markMutation = useMutation({
    mutationFn: async (data: { studentId: string; status: AttendanceStatus; date: string }) => {
      const res = await api.post(`/coach/classes/${classId}/attendance`, {
        student_id: data.studentId,
        status: data.status,
        date: data.date,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey });

      let statusText = "đã có mặt";
      if (variables.status === AttendanceStatus.CANCELLED) statusText = "đã hủy điểm danh";
      if (variables.status === AttendanceStatus.EXCUSED) statusText = "nghỉ có phép";
      if (variables.status === AttendanceStatus.UNEXCUSED) statusText = "nghỉ không phép";
      if (variables.status === AttendanceStatus.DROPPED) statusText = "nghỉ hẳn";

      toast.success(`Đã cập nhật: ${statusText}`);
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật điểm danh");
    }
  });

  const markAttendance = (
    studentId: string,
    _studentName: string,
    _clsId: string,
    d: string,
    status: AttendanceStatus,
    _markedBy?: string
  ) => {
    markMutation.mutate({ studentId, status, date: d });
  };

  const removeAttendanceRecord = (studentId: string, _clsId: string, d: string) => {
    markMutation.mutate({ studentId, status: AttendanceStatus.CANCELLED, date: d });
  };

  const getAttendanceForClassAndDate = (classIdFilter?: string, dateFilter?: string) => {
    if (classIdFilter && dateFilter) {
      return records.filter(r => r.classId === classIdFilter && r.date === dateFilter);
    }
    return records;
  };

  return {
    records,
    getAttendanceForClassAndDate,
    markAttendance,
    removeAttendanceRecord,
  };
}
