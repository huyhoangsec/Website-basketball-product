"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCourts } from "@/hooks/usePublicData";
import api from "@/lib/api";

const trialSchema = z.object({
  parentName: z.string().min(2, "Vui lòng nhập họ tên phụ huynh"),
  parentPhone: z
    .string()
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
  studentName: z.string().min(2, "Vui lòng nhập họ tên học viên"),
  studentBirthYear: z
    .number({ message: "Năm sinh không hợp lệ" })
    .min(2006, "Năm sinh không hợp lệ")
    .max(2021, "Năm sinh không hợp lệ"),
  preferredCourt: z.string().min(1, "Vui lòng chọn sân"),
  notes: z.string().optional(),
});

type TrialFormValues = z.infer<typeof trialSchema>;

export default function TrialRegisterForm() {
  const { data: courts = [] } = useCourts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TrialFormValues>({
    resolver: zodResolver(trialSchema),
    defaultValues: {
      parentName: "",
      parentPhone: "",
      studentName: "",
      studentBirthYear: undefined,
      preferredCourt: "",
      notes: "",
    },
  });

  const onSubmit = async (data: TrialFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post("/public/trials", data);
      toast.success("Đăng ký thành công!", {
        description: "Chúng tôi sẽ liên hệ bạn trong vòng 24h để xác nhận lịch học thử.",
      });
      reset();
    } catch (error) {
      toast.error("Đăng ký thất bại", {
        description: "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.",
      });
      console.error("Trial registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Parent Name */}
        <div className="space-y-1.5">
          <Label htmlFor="parentName">Họ tên phụ huynh *</Label>
          <Input
            id="parentName"
            placeholder="Nguyễn Văn A"
            {...register("parentName")}
            className={errors.parentName ? "border-destructive" : ""}
          />
          {errors.parentName && (
            <p className="text-xs text-destructive">{errors.parentName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="parentPhone">Số điện thoại *</Label>
          <Input
            id="parentPhone"
            placeholder="0901234567"
            {...register("parentPhone")}
            className={errors.parentPhone ? "border-destructive" : ""}
          />
          {errors.parentPhone && (
            <p className="text-xs text-destructive">{errors.parentPhone.message}</p>
          )}
        </div>

        {/* Student Name */}
        <div className="space-y-1.5">
          <Label htmlFor="studentName">Họ tên học viên *</Label>
          <Input
            id="studentName"
            placeholder="Nguyễn Gia Bảo"
            {...register("studentName")}
            className={errors.studentName ? "border-destructive" : ""}
          />
          {errors.studentName && (
            <p className="text-xs text-destructive">{errors.studentName.message}</p>
          )}
        </div>

        {/* Birth Year */}
        <div className="space-y-1.5">
          <Label htmlFor="studentBirthYear">Năm sinh học viên *</Label>
          <Input
            id="studentBirthYear"
            type="number"
            placeholder="2014"
            {...register("studentBirthYear")}
            className={errors.studentBirthYear ? "border-destructive" : ""}
          />
          {errors.studentBirthYear && (
            <p className="text-xs text-destructive">{errors.studentBirthYear.message}</p>
          )}
        </div>
      </div>

      {/* Preferred Court */}
      <div className="space-y-1.5">
        <Label>Sân muốn học *</Label>
        <Select onValueChange={(val: string | null) => setValue("preferredCourt", val || "")}>
          <SelectTrigger className={errors.preferredCourt ? "border-destructive" : ""}>
            <SelectValue placeholder="Chọn sân" />
          </SelectTrigger>
          <SelectContent>
            {courts.map((court) => (
              <SelectItem key={court.id} value={court.name}>
                {court.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.preferredCourt && (
          <p className="text-xs text-destructive">{errors.preferredCourt.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Ghi chú (không bắt buộc)</Label>
        <Textarea
          id="notes"
          placeholder="VD: Bé đã chơi bóng rổ được 6 tháng..."
          rows={3}
          {...register("notes")}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-orange hover:opacity-90 text-white font-semibold py-6 text-base shadow-lg shadow-orange/30"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Send className="mr-2 w-4 h-4" />
            Đăng ký học thử miễn phí
          </>
        )}
      </Button>
    </form>
  );
}
