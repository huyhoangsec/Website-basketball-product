"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";

const contactSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
  subject: z.string().min(2, "Vui lòng nhập chủ đề"),
  message: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post("/public/contacts", data);
      toast.success("Gửi thành công!", {
        description: "Chúng tôi sẽ phản hồi trong vòng 24h.",
      });
      reset();
    } catch {
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Họ tên *</Label>
          <Input id="name" placeholder="Nguyễn Văn A" {...register("name")} className={errors.name ? "border-destructive" : ""} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="email@example.com" {...register("email")} className={errors.email ? "border-destructive" : ""} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input id="phone" placeholder="0901234567" {...register("phone")} className={errors.phone ? "border-destructive" : ""} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subject">Chủ đề *</Label>
          <Input id="subject" placeholder="VD: Hỏi về lịch học" {...register("subject")} className={errors.subject ? "border-destructive" : ""} />
          {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Nội dung *</Label>
        <Textarea id="message" placeholder="Nội dung tin nhắn..." rows={5} {...register("message")} className={errors.message ? "border-destructive" : ""} />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-orange hover:opacity-90 text-white font-semibold py-6">
        {isSubmitting ? (
          <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Đang gửi...</>
        ) : (
          <><Send className="mr-2 w-4 h-4" /> Gửi tin nhắn</>
        )}
      </Button>
    </form>
  );
}
