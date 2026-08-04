"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const CourtMap = dynamic(() => import("./CourtMap"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] md:h-[500px] rounded-2xl" />,
});

export default function CourtMapWrapper() {
  return <CourtMap />;
}
