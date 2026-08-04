# 🏀 Ocean Basketball Center - Website Application

Hệ thống Website quản lý và hỗ trợ đào tạo bóng rổ chuyên nghiệp **Ocean Basketball Center**, được phát triển trên nền tảng **Next.js 15 (App Router)**, **TypeScript** và **Tailwind CSS**.

---

## 🚀 Tính năng chính

### 1. Giao diện Công khai (Public Portal)
- **Trang chủ**: Giới thiệu trung tâm, huấn luyện viên tiêu biểu, giải đấu và đối tác.
- **Đăng ký học thử**: Form đăng ký trải nghiệm lớp học bóng rổ dành cho học viên mới.
- **Thông tin học phí & Lộ trình**: Chi tiết các gói đào tạo cơ bản, nâng cao và chuyên nghiệp.
- **Danh sách Sân bóng & HLV**: Tra cứu địa điểm tập luyện và đội ngũ huấn luyện viên.

### 2. Trang Quản lý Học viên & HLV (Coach Dashboard)
- **Điểm danh tự động**: Huấn luyện viên điểm danh học viên theo buổi học.
- **Thống kê chuyên cần**: Thống kê tỉ lệ có mặt, đi muộn, vắng mặt theo thời gian thực.
- **Lịch huấn luyện**: Xem danh sách buổi tập và thông tin học viên từng lớp.

### 3. Trang Quản trị Hệ thống (Admin Portal)
- **Quản lý Học viên & Lớp học**: Thêm, sửa, xóa, phân lớp và theo dõi tình trạng học viên.
- **Quản lý Thu học phí & Hóa đơn**: Tạo hóa đơn, gán trạng thái thanh toán và thống kê doanh thu.
- **Quản lý Giải đấu & Tin tức**: Đăng tải sự kiện, bảng xếp hạng giải đấu nội bộ.

---

## 🛠️ Công nghệ sử dụng

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form / Custom Validators
- **API Integration**: RESTful API với Custom Fetch / Axios

---

## 📦 Hướng dẫn Cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
- **Node.js**: `v18.0.0` trở lên
- **npm** hoặc **yarn** / **pnpm** / **bun**

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Cấu hình Biến môi trường
Tạo file `.env.local` tại thư mục gốc của dự án:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 4. Chạy ở chế độ Development
```bash
npm run dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

### 5. Build cho Production
```bash
npm run build
npm run start
```
