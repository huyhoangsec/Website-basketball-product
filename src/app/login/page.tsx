"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound, Mail, Loader2, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1B33]">
        <div className="h-10 w-10 rounded-full border-4 border-orange border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Email hoặc mật khẩu không chính xác!");
      } else {
        toast.success("Đăng nhập thành công!");
        router.refresh();

        const res = await fetch("/api/auth/session");
        const session = await res.json();
        const role = session?.user?.role;

        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1B33] relative overflow-hidden px-4">
      {/* Background design elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF6B35]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#1B2A4A]/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative basket ball court lines in background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full" />
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l border-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] border border-white rounded-full" />
      </div>

      <div className="w-full max-w-md z-10">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại trang chủ
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-white/10 bg-[#1B2A4A]/80 backdrop-blur-md shadow-2xl text-white">
            <CardHeader className="space-y-2 text-center pb-8 border-b border-white/5">
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-[#FF6B35] rounded-full text-white shadow-lg animate-float">
                  <Trophy className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">OCEAN BASKETBALL</CardTitle>
              <CardDescription className="text-gray-300">
                Đăng nhập dành cho Quản trị viên & Huấn luyện viên
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-5 pt-8">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@oceanbasketball.vn"
                      className="pl-10 bg-[#0F1B33]/50 border-white/10 text-white placeholder-gray-500 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-0 focus:border-[#FF6B35]"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-200">
                      Mật khẩu
                    </Label>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-[#0F1B33]/50 border-white/10 text-white placeholder-gray-500 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-0 focus:border-[#FF6B35]"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {process.env.NODE_ENV === "development" && (
                  <div className="p-3 bg-[#0F1B33]/50 rounded-lg border border-white/5 space-y-1">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">
                      Tài khoản thử nghiệm (Dev Only):
                    </p>
                    <div className="text-xs text-gray-300 space-y-0.5">
                      <p>• Admin: <code className="text-orange">admin@oceanbasketball.vn</code> / <code className="text-orange">admin123</code></p>
                      <p>• Coach: <code className="text-orange">hung.nv@oceanbasketball.vn</code> / <code className="text-orange">coach123</code></p>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pb-8">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#FF6B35] hover:bg-[#E55520] text-white font-semibold py-6 transition-all duration-200 shadow-lg shadow-[#FF6B35]/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
