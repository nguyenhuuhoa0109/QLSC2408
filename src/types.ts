export interface User {
  id: string;
  name: string;
  email?: string;
  username: string;
  role: string;
  roleBadge: string;
  initials: string;
  avatarUrl: string;
  department: string;
  plant: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Cơ khí' | 'Điện - Tự động hóa' | 'Dầu mỡ nhờn' | 'Vật tư tiêu hao' | 'Cảm biến & Đo lường';
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  location: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  specs?: string;
  supplier?: string;
  pricePerUnit?: number;
}

export interface StockActivity {
  id: string;
  time: string;
  action: 'Xuất kho' | 'Nhập kho' | 'Duyệt phiếu nhập' | 'Yêu cầu nhập gấp' | 'Kiểm kê';
  item: string;
  itemCode?: string;
  quantity?: number;
  unit?: string;
  user: {
    name: string;
    initials: string;
    avatarColor: string;
  };
  status: 'HOÀN THÀNH' | 'ĐÃ DUYỆT' | 'CHỜ XỬ LÝ' | 'ĐÃ TỪ CHỐI';
  dateLabel?: string;
  notes?: string;
  ticketCode?: string;
  plant?: string;
}

export interface ApprovalTicket {
  id: string;
  ticketCode: string;
  type: 'import' | 'export' | 'urgent_purchase' | 'repair';
  title: string;
  requester: string;
  department: string;
  date: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  items: Array<{
    name: string;
    code: string;
    quantity: number;
    unit: string;
    estimatedCost?: string;
  }>;
}

export interface MaintenanceTask {
  id: string;
  code: string;
  title: string;
  equipment: string;
  plantArea: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp' | 'Khẩn cấp';
  status: 'Đang vận hành' | 'Đang sửa chữa' | 'Chờ vật tư' | 'Hoàn thành';
  assignedTo: string;
  startDate: string;
  estimatedCompletion: string;
  progressPercent: number;
  description: string;
}

export interface TechnicalDocument {
  id: string;
  code: string;
  title: string;
  category: 'Quy trình vận hành' | 'Bản vẽ kỹ thuật' | 'Sổ tay thiết bị' | 'Biên bản thử nghiệm' | 'Quy chuẩn an toàn';
  fileFormat: 'PDF' | 'DWG' | 'DOCX' | 'XLSX';
  fileSize: string;
  updatedDate: string;
  author: string;
  version: string;
  downloadsCount: number;
  description: string;
}

export type NavigationTab = 'tong-quan' | 'quan-ly-kho' | 'quan-ly-sua-chua' | 'quan-ly-tai-lieu' | 'bao-cao';

export type PlantLocation = 'Nhà máy thủy điện Sơn Trà 1' | 'Hòa Bình Plant';

export type ActivityDomain = 'warehouse' | 'maintenance' | 'document';

export interface UnifiedActivity {
  id: string;
  domain: ActivityDomain;
  time: string;
  action: string;
  title: string;
  subTitle?: string;
  code?: string;
  user: {
    name: string;
    initials: string;
    avatarColor: string;
    role?: string;
  };
  status: string;
  statusType?: 'success' | 'warning' | 'info' | 'danger';
  details?: string;
  meta?: any;
}
