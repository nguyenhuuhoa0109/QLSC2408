# Hệ Thống Quản Lý Kho & Vận Hành Nhà Máy Thủy Điện Sơn Trà 1

Ứng dụng web toàn diện phục vụ công tác quản lý kho vật tư thiết bị, lập phiếu đề xuất vật tư, theo dõi lịch bảo dưỡng sửa chữa định kỳ các tổ máy H1/H2/H3 và tra cứu hồ sơ tài liệu kỹ thuật cho Nhà máy Thủy điện Sơn Trà 1. Tích hợp trực tiếp với cơ sở dữ liệu **Supabase (PostgreSQL)** theo thời gian thực (Real-time).

---

## 🌟 Tính Năng Chính

1. **Quản Lý Kho Vật Tư & Thiết Bị (Warehouse Management)**:
   - Danh mục vật tư phân loại theo Cơ khí, Điện - Tự động hóa, Dầu mỡ nhờn, Cảm biến & Đo lường...
   - Theo dõi tồn kho thực tế, cảnh báo mức tồn tối thiểu / nguy cấp.
   - Thêm mới, chỉnh sửa thông số kỹ thuật, vị trí kho và đơn giá.
   - Lập phiếu Xuất / Nhập kho trực tiếp và xuất dữ liệu ra file Excel/CSV.

2. **Quy Trình Phê Duyệt Phiếu (Approval Workflow)**:
   - Tạo và luân chuyển phiếu đề xuất cấp phát vật tư / thiết bị thay thế.
   - Phân cấp phê duyệt (Kỹ sư trưởng / Trưởng ca / Ban Giám đốc).
   - Kiểm soát lý do cấp phát và khu vực sử dụng (Nhà máy Sơn Trà 1A / 1B).

3. **Quản Lý Bảo Dưỡng & Sửa Chữa (Maintenance & Overhaul)**:
   - Lập kế hoạch bảo dưỡng định kỳ các cụm tuabin, máy phát, máy biến áp 110kV, đập tràn.
   - Theo dõi tiến độ công việc (%), mức độ ưu tiên, kỹ sư phụ trách và ngày hoàn thành dự kiến.
   - Cập nhật trạng thái và nghiệm thu phiếu công tác.

4. **Thư Viện Hồ Sơ & Tài Liệu Kỹ Thuật (Technical Documents Library)**:
   - Lưu trữ bản vẽ thiết kế (CAD/DWG), quy trình vận hành (SOP), tài liệu hướng dẫn sử dụng (O&M manual).
   - Tra cứu nhanh theo mã tài liệu, tải tài liệu gốc hoặc đọc trực tiếp.

5. **Cơ Sở Dữ Liệu Supabase (Real-Time Cloud PostgreSQL)**:
   - Lưu trữ đồng bộ 5 bảng: `inventory_items`, `stock_activities`, `approval_tickets`, `maintenance_tasks`, `technical_documents`.
   - Cơ chế bảo mật Row Level Security (RLS).
   - Tự động đồng bộ thời gian thực giữa các thiết bị.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 18, TypeScript, Vite
- **Giao diện & Styling**: Tailwind CSS, Lucide Icons, Framer Motion
- **Database & Backend**: Supabase (@supabase/supabase-js), PostgreSQL Cloud
- **Quản lý biểu đồ**: Recharts / Canvas

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local Development)

### 1. Clone repository về máy:
```bash
git clone <URL_REPOSITORY_CUA_BAN>
cd son-tra-1-hydropower-management
```

### 2. Cài đặt các gói phụ thuộc (Dependencies):
```bash
npm install
```

### 3. Cấu hình biến môi trường:
Tạo file `.env` ở thư mục gốc với các thông số Supabase:
```env
VITE_SUPABASE_URL=https://pmesvcogcutfgvrjaaxj.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_qvqOXWQY6ojjXT4oDzSx-A_8_kJXn5o
```

### 4. Khởi chạy ứng dụng ở môi trường phát triển (Dev Server):
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

### 5. Build bản triển khai (Production):
```bash
npm run build
```

---

## 🗄️ Khởi Tạo Database Trên Supabase

Vào **Supabase Dashboard > SQL Editor**, chạy đoạn script SQL sau để khởi tạo cấu trúc 5 bảng:

```sql
-- 1. Bảng vật tư kho
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    min_quantity NUMERIC NOT NULL DEFAULT 5,
    max_quantity NUMERIC NOT NULL DEFAULT 100,
    unit TEXT NOT NULL DEFAULT 'bộ',
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'normal',
    last_updated TEXT,
    specs TEXT,
    supplier TEXT,
    price_per_unit NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Bảng nhật ký xuất nhập
CREATE TABLE IF NOT EXISTS public.stock_activities (
    id TEXT PRIMARY KEY,
    time TEXT NOT NULL,
    action TEXT NOT NULL,
    item TEXT NOT NULL,
    quantity NUMERIC,
    unit TEXT,
    user_name TEXT,
    user_initials TEXT,
    user_avatar_color TEXT,
    status TEXT NOT NULL DEFAULT 'HOÀN THÀNH',
    date_label TEXT,
    ticket_code TEXT,
    notes TEXT,
    plant TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Bảng phiếu đề xuất
CREATE TABLE IF NOT EXISTS public.approval_tickets (
    id TEXT PRIMARY KEY,
    ticket_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    plant TEXT NOT NULL,
    requested_by TEXT NOT NULL,
    role TEXT NOT NULL,
    date TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reason TEXT NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Bảng bảo dưỡng sửa chữa
CREATE TABLE IF NOT EXISTS public.maintenance_tasks (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    plant_area TEXT NOT NULL,
    equipment TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Đang sửa chữa',
    assigned_to TEXT NOT NULL,
    progress_percent NUMERIC NOT NULL DEFAULT 0,
    start_date TEXT,
    due_date TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Bảng tài liệu kỹ thuật
CREATE TABLE IF NOT EXISTS public.technical_documents (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    file_format TEXT NOT NULL,
    file_size TEXT,
    updated_date TEXT,
    author TEXT,
    version TEXT,
    downloads_count NUMERIC DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bật RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all inventory" ON public.inventory_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all activities" ON public.stock_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all approvals" ON public.approval_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all maintenance" ON public.maintenance_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all documents" ON public.technical_documents FOR ALL USING (true) WITH CHECK (true);
```
