import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { TrialRegistration, Court, Student, Coach, ClassInfo } from "@/types";
import { toast } from "sonner";

export function useAdminTrials() {
  const queryClient = useQueryClient();
  const queryKey = ["admin-trials"];

  const { data: trials = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get("/admin/trials");
      return res.data as TrialRegistration[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" | "converted" }) => {
      const res = await api.put(`/admin/trials/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  });

	return {
		trials,
		isLoading,
		updateStatus: (id: string, status: "approved" | "rejected" | "converted") => updateStatusMutation.mutate({ id, status }),
	};
}

export interface Invoice {
	id: string;
	studentId: string;
	amount: number;
	month: number;
	year: number;
	status: string;
	dueDate: string;
	student?: Student;
	createdAt: string;
}

export function useAdminInvoices() {
	const queryClient = useQueryClient();
	const queryKey = ["admin-invoices"];

	const { data: invoices = [], isLoading } = useQuery({
		queryKey,
		queryFn: async () => {
			const res = await api.get("/admin/invoices");
			return res.data as Invoice[];
		},
	});

	const createInvoiceMutation = useMutation({
		mutationFn: async (invoiceData: Partial<Invoice>) => {
			const res = await api.post("/admin/invoices", invoiceData);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
			toast.success("Đã tạo hóa đơn mới");
		},
		onError: () => {
			toast.error("Lỗi khi tạo hóa đơn");
		}
	});

	const payInvoiceMutation = useMutation({
		mutationFn: async ({ id, amount, method, note }: { id: string, amount: number, method: string, note: string }) => {
			const res = await api.put(`/admin/invoices/${id}/pay`, { amount, method, note });
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
			toast.success("Đã thanh toán hóa đơn");
		},
		onError: () => {
			toast.error("Lỗi khi thanh toán hóa đơn");
		}
	});

	const generateInvoicesMutation = useMutation({
		mutationFn: async () => {
			const res = await api.post("/admin/invoices/generate");
			return res.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey });
			toast.success(`Đã tự động tạo ${data.count} hóa đơn`);
		},
		onError: () => {
			toast.error("Lỗi khi tạo hóa đơn hàng tháng");
		}
	});

	return {
		invoices,
		isLoading,
		createInvoice: createInvoiceMutation.mutate,
		payInvoice: payInvoiceMutation.mutate,
		generateInvoices: generateInvoicesMutation.mutate,
		isGenerating: generateInvoicesMutation.isPending,
	};
}

export function useAdminCourts() {
  const queryClient = useQueryClient();
  const queryKey = ["admin-courts"];

  const { data: courts = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get("/public/courts");
      return res.data as Court[];
    },
  });

  const createCourtMutation = useMutation({
    mutationFn: async (courtData: Partial<Court>) => {
      const res = await api.post("/admin/courts", courtData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã thêm mới sân");
    },
    onError: () => {
      toast.error("Lỗi khi thêm mới sân");
    }
  });

  const updateCourtMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Court> }) => {
      const res = await api.put(`/admin/courts/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã cập nhật sân");
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật sân");
    }
  });

  const deleteCourtMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/courts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã xóa sân");
    },
    onError: () => {
      toast.error("Lỗi khi xóa sân");
    }
  });

  return {
    courts,
    isLoading,
    createCourt: createCourtMutation.mutate,
    updateCourt: updateCourtMutation.mutate,
    deleteCourt: deleteCourtMutation.mutate,
  };
}

export function useAdminClasses() {
  const queryClient = useQueryClient();
  const queryKey = ["public-classes"]; // We use public-classes so it invalidates the public hook too

  const { data: classes = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get("/public/classes");
      return res.data as ClassInfo[];
    },
  });

  const createClassMutation = useMutation({
    mutationFn: async (classData: Partial<ClassInfo>) => {
      const res = await api.post("/admin/classes", classData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã thêm mới lớp học");
    },
    onError: () => {
      toast.error("Lỗi khi thêm mới lớp học");
    }
  });

  const updateClassMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClassInfo> }) => {
      const res = await api.put(`/admin/classes/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã cập nhật lớp học");
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật lớp học");
    }
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/classes/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã xóa lớp học");
    },
    onError: () => {
      toast.error("Lỗi khi xóa lớp học");
    }
  });

  return {
    classes,
    isLoading,
    createClass: createClassMutation.mutate,
    updateClass: updateClassMutation.mutate,
    deleteClass: deleteClassMutation.mutate,
  };
}

export function useAdminStudents() {
  const queryClient = useQueryClient();
  const queryKey = ["admin-students"];

  const { data: students = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get("/admin/students");
      return res.data as Student[];
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (studentData: Partial<Student>) => {
      const res = await api.post("/admin/students", studentData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã thêm mới học viên");
    },
    onError: () => {
      toast.error("Lỗi khi thêm mới học viên");
    }
  });

  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Student> }) => {
      const res = await api.put(`/admin/students/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã cập nhật học viên");
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật học viên");
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/students/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã xóa học viên");
    },
    onError: () => {
      toast.error("Lỗi khi xóa học viên");
    }
  });

  return {
    students,
    isLoading,
    createStudent: createStudentMutation.mutate,
    updateStudent: updateStudentMutation.mutate,
    deleteStudent: deleteStudentMutation.mutate,
  };
}

export function useAdminCoaches() {
  const queryClient = useQueryClient();
  const queryKey = ["admin-coaches"]; // Actually we can use public-coaches or fetch from public API

  const { data: coaches = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get("/public/coaches");
      return res.data as Coach[];
    },
  });

  const createCoachMutation = useMutation({
    mutationFn: async (coachData: Partial<Coach>) => {
      const res = await api.post("/admin/coaches", coachData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã thêm mới HLV");
    },
    onError: () => {
      toast.error("Lỗi khi thêm mới HLV");
    }
  });

  const updateCoachMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Coach> }) => {
      const res = await api.put(`/admin/coaches/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Đã cập nhật HLV");
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật HLV");
    }
  });

  const deleteCoachMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/coaches/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      toast.success("Đã xóa HLV thành công");
    },
    onError: () => {
      toast.error("Lỗi khi xóa HLV");
    }
  });

  return {
    coaches,
    isLoading,
    createCoach: createCoachMutation.mutate,
    updateCoach: updateCoachMutation.mutate,
    deleteCoach: deleteCoachMutation.mutate,
  };
}
