import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OceanBasketball — CLB Bóng Rổ Vinhomes Ocean Park",
    template: "%s | OceanBasketball",
  },
  description:
    "Câu lạc bộ bóng rổ chuyên nghiệp tại Vinhomes Ocean Park. Chương trình huấn luyện cho trẻ từ 5-18 tuổi với HLV giàu kinh nghiệm. Đăng ký học thử miễn phí!",
  keywords: [
    "bóng rổ",
    "basketball",
    "OceanPark",
    "Vinhomes",
    "CLB bóng rổ",
    "học bóng rổ",
    "huấn luyện bóng rổ",
    "Gia Lâm",
    "Hà Nội",
  ],
  authors: [{ name: "OceanBasketball" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://oceanbasketball.vn",
    siteName: "OceanBasketball",
    title: "OceanBasketball — CLB Bóng Rổ Vinhomes Ocean Park",
    description:
      "Câu lạc bộ bóng rổ chuyên nghiệp tại Vinhomes Ocean Park. Đăng ký học thử miễn phí!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <ErrorBoundary>
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
