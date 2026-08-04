import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getClasses } from "@/lib/api-fetch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Lớp phụ trách | HLV OceanBasketball",
  description: "Danh sách các lớp bóng rổ phụ trách",
};

const getDayName = (day: number) => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return days[day];
};

export default async function CoachClassesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as { name?: string; email?: string; role?: string };

  const classesData = await getClasses();

  const coachClasses = classesData.filter(
    (c) => user.role === "admin" || c.coach?.email === user.email
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-navy flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-orange" />
          Danh sách lớp phụ trách
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Danh sách và thông tin chi tiết các lớp bạn đang chịu trách nhiệm giảng dạy
        </p>
      </div>

      {coachClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coachClasses.map((classItem) => (
            <Card key={classItem.id} className="border-border bg-white shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-orange/20 transition-all">
              <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100 flex flex-row justify-between items-start space-y-0">
                <div>
                  <Badge variant="outline" className="border-navy text-navy font-semibold text-[10px] uppercase mb-1.5">
                    Cấp độ: {classItem.level}
                  </Badge>
                  <CardTitle className="text-base font-bold text-navy">{classItem.name}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1 mt-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-orange shrink-0" />
                    <span className="line-clamp-1">{classItem.court?.name || "N/A"}</span>
                  </CardDescription>
                </div>
                <Badge className="bg-[#FF6B35] hover:bg-[#FF6B35] text-white border-none text-xs">
                  ID: {classItem.id}
                </Badge>
              </CardHeader>

              <CardContent className="py-4 space-y-3.5 flex-1">
                {/* Schedule list */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Lịch học tuần:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {classItem.schedule?.map((sched, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded-md gap-1"
                      >
                        <Clock className="h-3 w-3 text-orange" />
                        <span>Thứ {getDayName(sched.dayOfWeek)}: {sched.startTime} - {sched.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Class capacity metrics */}
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-muted-foreground font-medium">Học viên</p>
                    <p className="text-base font-bold text-navy mt-0.5">{classItem.currentStudents}</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-muted-foreground font-medium">Học thử</p>
                    <p className="text-base font-bold text-navy mt-0.5">{classItem.trialStudents}</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-[10px] text-muted-foreground font-medium">Tối đa</p>
                    <p className="text-base font-bold text-navy mt-0.5">{classItem.maxStudents}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-100 flex gap-2 justify-end">
                <Button variant="outline" size="sm" asChild className="text-navy hover:text-navy border-slate-200">
                  <Link href={`/dashboard/lop/${classItem.id}/diem-danh`}>
                    Điểm danh
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-navy hover:bg-navy-light text-white">
                  <Link href={`/dashboard/lop/${classItem.id}`} className="flex items-center gap-1">
                    Xem danh sách
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-border rounded-xl">
          <p className="text-muted-foreground text-sm">Bạn hiện chưa phụ trách lớp học nào.</p>
        </div>
      )}
    </div>
  );
}
