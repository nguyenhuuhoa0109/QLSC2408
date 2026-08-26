import React, { useState, useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  RefreshCw,
  Search,
  Plus,
  Wrench,
  FileText,
  Layers,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Boxes,
  CheckCircle,
  FileCheck,
  Download,
  Flame,
  AlertCircle
} from 'lucide-react';
import { 
  StockActivity, 
  PlantLocation, 
  InventoryItem, 
  MaintenanceTask, 
  TechnicalDocument, 
  UnifiedActivity,
  ActivityDomain 
} from '../types';

interface OverviewScreenProps {
  plantName: PlantLocation;
  activities: StockActivity[];
  inventory: InventoryItem[];
  maintenanceTasks: MaintenanceTask[];
  documents: TechnicalDocument[];
  pendingApprovalsCount: number;
  onOpenApprovals: () => void;
  onOpenNewTransaction: (type: 'import' | 'export') => void;
  onSelectActivity: (activity: StockActivity | UnifiedActivity) => void;
  onNavigateToWarehouse: () => void;
  onNavigateToMaintenance?: () => void;
  onNavigateToDocuments?: () => void;
  isMobileLayout?: boolean;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  plantName,
  activities,
  inventory,
  maintenanceTasks,
  documents,
  pendingApprovalsCount,
  onOpenApprovals,
  onOpenNewTransaction,
  onSelectActivity,
  onNavigateToWarehouse,
  onNavigateToMaintenance,
  onNavigateToDocuments,
  isMobileLayout = false
}) => {
  const [selectedDomain, setSelectedDomain] = useState<'all' | ActivityDomain>('all');
  const [tableSearch, setTableSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  // Total inventory stats
  const totalItemsCount = inventory.length || (plantName.includes('Sơn Trà') ? 1245 : 1248);
  const criticalItems = inventory.filter(i => i.status === 'critical');
  const warningItems = inventory.filter(i => i.status === 'warning');
  const criticalItemsCount = criticalItems.length || (plantName.includes('Sơn Trà') ? 5 : 4);
  const warningItemsCount = warningItems.length || (plantName.includes('Sơn Trà') ? 10 : 8);
  const totalAlertsCount = criticalItemsCount + warningItemsCount;

  // Active maintenance & documents stats
  const activeRepairs = maintenanceTasks.filter(t => t.status !== 'Hoàn thành');
  const waitingSuppliesTasks = maintenanceTasks.filter(t => t.status === 'Chờ vật tư');
  const activeRepairsCount = activeRepairs.length || 4;
  const totalDocsCount = documents.length || 18;

  // Build unified activities list combining Kho, Sửa chữa, and Tài liệu
  const unifiedActivities: UnifiedActivity[] = useMemo(() => {
    const list: UnifiedActivity[] = [];

    // 1. Convert Stock Activities (Kho)
    activities.forEach(act => {
      list.push({
        id: act.id,
        domain: 'warehouse',
        time: act.time,
        action: act.action,
        title: act.item,
        subTitle: act.quantity ? `${act.quantity} ${act.unit || ''}` : undefined,
        code: act.ticketCode || 'XK-2023-08-01',
        user: {
          name: act.user.name,
          initials: act.user.initials,
          avatarColor: act.user.avatarColor,
          role: 'Thủ kho / Kỹ sư'
        },
        status: act.status,
        statusType: act.status === 'HOÀN THÀNH' ? 'success' : act.status === 'CHỜ XỬ LÝ' ? 'warning' : 'info',
        details: act.notes || `Giao dịch ${act.action} vật tư ${act.item} tại ${act.plant || plantName}`,
        meta: act
      });
    });

    // 2. Convert Maintenance Tasks (Sửa chữa)
    maintenanceTasks.forEach((task, idx) => {
      const isDone = task.status === 'Hoàn thành';
      const isWaiting = task.status === 'Chờ vật tư';
      list.push({
        id: `mnt-act-${task.id || idx}`,
        domain: 'maintenance',
        time: task.startDate ? `${task.startDate}` : '08:30 AM, Hôm nay',
        action: isDone ? 'Nghiệm thu bảo dưỡng' : isWaiting ? 'Chờ cấp vật tư SC' : 'Bảo dưỡng định kỳ',
        title: `${task.title} - ${task.equipment}`,
        subTitle: `Khu vực: ${task.plantArea} (Tiến độ: ${task.progressPercent}%)`,
        code: task.code,
        user: {
          name: task.assignedTo,
          initials: task.assignedTo.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase(),
          avatarColor: 'bg-amber-100 text-amber-900',
          role: 'Kỹ sư Cơ Điện'
        },
        status: task.status === 'Hoàn thành' ? 'HOÀN THÀNH' : task.status === 'Chờ vật tư' ? 'CHỜ VẬT TƯ' : 'ĐANG SỬA CHỮA',
        statusType: isDone ? 'success' : isWaiting ? 'warning' : 'info',
        details: `${task.description} - Dự kiến hoàn thành: ${task.estimatedCompletion}. Độ ưu tiên: ${task.priority}`,
        meta: task
      });
    });

    // 3. Convert Technical Documents (Tài liệu)
    documents.forEach((doc, idx) => {
      list.push({
        id: `doc-act-${doc.id || idx}`,
        domain: 'document',
        time: doc.updatedDate ? `${doc.updatedDate}` : 'Hôm qua',
        action: doc.category === 'Bản vẽ kỹ thuật' ? 'Cập nhật bản vẽ' : 'Ban hành quy trình',
        title: doc.title,
        subTitle: `Định dạng: ${doc.fileFormat} (${doc.fileSize}) - ${doc.category}`,
        code: doc.code,
        user: {
          name: doc.author || 'KS. Trưởng Ca',
          initials: (doc.author || 'TC').split(' ').map(n => n[0]).slice(-2).join('').toUpperCase(),
          avatarColor: 'bg-purple-100 text-purple-900',
          role: 'Kỹ sư trưởng'
        },
        status: `BAN HÀNH (v${doc.version})`,
        statusType: 'info',
        details: `${doc.description} - Số lượt tải: ${doc.downloadsCount} lượt`,
        meta: doc
      });
    });

    return list;
  }, [activities, maintenanceTasks, documents, plantName]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return unifiedActivities.filter(act => {
      const matchDomain = selectedDomain === 'all' || act.domain === selectedDomain;
      const matchAction = filterAction === 'all' || act.action === filterAction;
      const matchSearch = !tableSearch || 
        act.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
        act.action.toLowerCase().includes(tableSearch.toLowerCase()) ||
        act.user.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        (act.code && act.code.toLowerCase().includes(tableSearch.toLowerCase())) ||
        (act.subTitle && act.subTitle.toLowerCase().includes(tableSearch.toLowerCase()));
      return matchDomain && matchAction && matchSearch;
    });
  }, [unifiedActivities, selectedDomain, filterAction, tableSearch]);

  // Counts by domain
  const warehouseCount = unifiedActivities.filter(a => a.domain === 'warehouse').length;
  const maintenanceCount = unifiedActivities.filter(a => a.domain === 'maintenance').length;
  const documentCount = unifiedActivities.filter(a => a.domain === 'document').length;

  return (
    <div className="flex flex-col w-full gap-5 sm:gap-6 p-4 sm:p-6 bg-[#f9f9ff]">
      
      {/* 1. TOP 4 SUMMARY STATS CARDS: KHO, CẢNH BÁO, SỬA CHỮA, TÀI LIỆU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: TỔNG VẬT TƯ KHO */}
        <div 
          onClick={onNavigateToWarehouse}
          className="bg-[#e7eeff] rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:shadow-md transition-all cursor-pointer border border-[#d8e3fa]"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#005394]/10 rounded-full blur-xl group-hover:bg-[#005394]/20 transition-colors pointer-events-none" />
          
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-[#414750] uppercase tracking-wider">
              TỔNG VẬT TƯ KHO
            </span>
            <div className="w-8 h-8 rounded-full bg-[#005394]/10 flex items-center justify-center text-[#005394]">
              <Package size={18} />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 z-10 my-2">
            <span className="text-3xl font-extrabold text-[#005394] tracking-tight">
              {totalItemsCount.toLocaleString('en-US')}
            </span>
            <span className="text-xs font-semibold text-[#414750]">mặt hàng</span>
          </div>

          <div className="z-10 pt-2 border-t border-[#d8e3fa]/80 flex items-center justify-between text-[11px] text-[#005394] font-medium">
            <span>Tra cứu & Kiểm kê</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 2: CẢNH BÁO TỒN KHO */}
        <div 
          onClick={onNavigateToWarehouse}
          className="bg-[#ffdad6] rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:shadow-md transition-all cursor-pointer border border-[#ffb4ab]/40"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ba1a1a]/10 rounded-full blur-xl group-hover:bg-[#ba1a1a]/20 transition-colors pointer-events-none" />
          
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-[#93000a] uppercase tracking-wider">
              CẢNH BÁO TỒN KHO
            </span>
            <div className="w-8 h-8 rounded-full bg-[#ba1a1a]/15 flex items-center justify-center text-[#ba1a1a]">
              <AlertTriangle size={18} />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 z-10 my-2">
            <span className="text-3xl font-extrabold text-[#ba1a1a] tracking-tight">
              {totalAlertsCount}
            </span>
            <span className="text-xs font-bold text-[#93000a]">mục dưới định mức</span>
          </div>

          <div className="z-10 pt-2 border-t border-[#ffb4ab]/60 flex items-center justify-between text-[11px] text-[#93000a] font-medium">
            <span>{criticalItemsCount} mục khẩn cấp</span>
            <span className="font-mono text-[10px] bg-white/70 px-1.5 py-0.2 rounded font-bold">Cần nhập</span>
          </div>
        </div>

        {/* CARD 3: CÔNG TÁC BẢO DƯỠNG & SỬA CHỮA */}
        <div 
          onClick={onNavigateToMaintenance || onOpenApprovals}
          className="bg-[#fef3c7] rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:shadow-md transition-all cursor-pointer border border-[#fde68a]"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors pointer-events-none" />
          
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              CÔNG TÁC SỬA CHỮA
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800">
              <Wrench size={18} />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 z-10 my-2">
            <span className="text-3xl font-extrabold text-amber-900 tracking-tight">
              {activeRepairsCount}
            </span>
            <span className="text-xs font-bold text-amber-800">hạng mục đang làm</span>
          </div>

          <div className="z-10 pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-900 font-medium">
            <span>{waitingSuppliesTasks.length} chờ cấp vật tư</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 4: HỒ SƠ & TÀI LIỆU KỸ THUẬT */}
        <div 
          onClick={onNavigateToDocuments}
          className="bg-[#f3e8ff] rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:shadow-md transition-all cursor-pointer border border-[#e9d5ff]"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors pointer-events-none" />
          
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
              HỒ SƠ & TÀI LIỆU
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-800">
              <FileText size={18} />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 z-10 my-2">
            <span className="text-3xl font-extrabold text-purple-900 tracking-tight">
              {totalDocsCount}
            </span>
            <span className="text-xs font-bold text-purple-800">tài liệu lưu trữ</span>
          </div>

          <div className="z-10 pt-2 border-t border-purple-200/80 flex items-center justify-between text-[11px] text-purple-900 font-medium">
            <span>Bản vẽ & Quy trình</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* 2. QUICK ACTION SHORTCUTS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#414750] uppercase">Thao tác nhanh:</span>
          <span className="text-xs text-gray-500 hidden md:inline">Lập phiếu kho, theo dõi bảo dưỡng sửa chữa và tra cứu hồ sơ</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenNewTransaction('import')}
            className="px-3 py-1.5 bg-[#eef3fb] hover:bg-[#d8e3fa] text-[#005394] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowDownLeft size={14} />
            <span>Tạo phiếu nhập</span>
          </button>
          <button
            onClick={() => onOpenNewTransaction('export')}
            className="px-3 py-1.5 bg-[#005394] hover:bg-[#004278] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowUpRight size={14} />
            <span>Tạo phiếu xuất</span>
          </button>
          {onNavigateToMaintenance && (
            <button
              onClick={onNavigateToMaintenance}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-200"
            >
              <Wrench size={14} />
              <span>Lịch sửa chữa</span>
            </button>
          )}
          {onNavigateToDocuments && (
            <button
              onClick={onNavigateToDocuments}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-200"
            >
              <BookOpen size={14} />
              <span>Hồ sơ tài liệu</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. TWO-COLUMN OPERATIONAL SUMMARY: CẢNH BÁO VẬT TƯ & CÔNG TÁC SỬA CHỮA TRỌNG ĐIỂM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* LEFT COLUMN: VẬT TƯ CẦN BỔ SUNG GẤP */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e2eaf5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Vật tư cần nhập gấp</h3>
                  <p className="text-[11px] text-gray-500">Mức tồn kho dưới định mức an toàn tối thiểu</p>
                </div>
              </div>
              <button 
                onClick={onNavigateToWarehouse}
                className="text-xs text-[#005394] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem kho</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-gray-50 mt-2">
              {inventory.slice(0, 4).map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-gray-800 truncate">{item.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mt-0.5">
                      <span>Mã: {item.code}</span>
                      <span>•</span>
                      <span>Vị trí: {item.location}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                      item.quantity <= item.minQuantity 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.quantity} / {item.minQuantity} {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 text-[11px]">Đã tự động gửi thông báo đến phòng Kế hoạch</span>
            <button
              onClick={() => onOpenNewTransaction('import')}
              className="text-[#005394] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Tạo phiếu mua/nhập</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: CÔNG TÁC SỬA CHỮA ĐANG TRIỂN KHAI */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e2eaf5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Wrench size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Công tác sửa chữa & bảo dưỡng</h3>
                  <p className="text-[11px] text-gray-500">Các hạng mục đang thi công hoặc chờ vật tư</p>
                </div>
              </div>
              {onNavigateToMaintenance && (
                <button 
                  onClick={onNavigateToMaintenance}
                  className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>

            <div className="divide-y divide-gray-50 mt-2">
              {maintenanceTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 truncate">{task.title}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        task.priority === 'Khẩn cấp' || task.priority === 'Cao' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      {task.equipment} • Phụ trách: <strong>{task.assignedTo}</strong>
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 flex flex-col items-end">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.status === 'Hoàn thành' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : task.status === 'Chờ vật tư' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 mt-0.5">
                      {task.progressPercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 text-[11px]">Đội ngũ kỹ thuật viên đang trực 24/7</span>
            <button
              onClick={onNavigateToMaintenance}
              className="text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tiến độ chi tiết</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

      </div>

      {/* 4. UNIFIED ACTIVITIES SECTION - KHO, SỬA CHỮA, TÀI LIỆU */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-[#e2eaf5] flex-1">
        
        {/* Table Header & Multi-domain Tabs */}
        <div className="flex flex-col gap-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#111c2c]">
                  Nhật ký hoạt động tổng hợp
                </h2>
                <span className="px-2 py-0.5 bg-[#e7eeff] text-[#005394] rounded-full text-[11px] font-bold">
                  {filteredActivities.length} sự kiện
                </span>
              </div>
              <p className="text-xs text-[#5e7087] mt-0.5">
                Theo dõi các hoạt động gần nhất của <strong>Kho vật tư</strong>, <strong>Bảo dưỡng sửa chữa</strong> và <strong>Tài liệu kỹ thuật</strong>
              </p>
            </div>

            {/* Search filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Tìm vật tư, thiết bị, mã số, người thực hiện..."
                  className="w-52 sm:w-64 pl-7 pr-3 py-1.5 bg-[#f0f3ff] border border-transparent focus:border-[#005394] rounded-lg text-xs outline-none"
                />
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Domain Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setSelectedDomain('all'); setFilterAction('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                selectedDomain === 'all'
                  ? 'bg-[#005394] text-white shadow-2xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Layers size={14} />
              <span>Tất cả hoạt động</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedDomain === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {unifiedActivities.length}
              </span>
            </button>

            <button
              onClick={() => { setSelectedDomain('warehouse'); setFilterAction('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                selectedDomain === 'warehouse'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-900'
              }`}
            >
              <Package size={14} />
              <span>Kho vật tư</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedDomain === 'warehouse' ? 'bg-white/20 text-white' : 'bg-blue-200 text-blue-900'}`}>
                {warehouseCount}
              </span>
            </button>

            <button
              onClick={() => { setSelectedDomain('maintenance'); setFilterAction('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                selectedDomain === 'maintenance'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900'
              }`}
            >
              <Wrench size={14} />
              <span>Bảo dưỡng & Sửa chữa</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedDomain === 'maintenance' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'}`}>
                {maintenanceCount}
              </span>
            </button>

            <button
              onClick={() => { setSelectedDomain('document'); setFilterAction('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                selectedDomain === 'document'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-900'
              }`}
            >
              <FileText size={14} />
              <span>Hồ sơ & Tài liệu</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedDomain === 'document' ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'}`}>
                {documentCount}
              </span>
            </button>
          </div>
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#dee8ff]/60 text-[#414750] font-mono text-xs">
                <th className="py-3 px-4 font-semibold rounded-l-xl">Thời gian</th>
                <th className="py-3 px-4 font-semibold">Phân hệ & Hành động</th>
                <th className="py-3 px-4 font-semibold">Nội dung / Thiết bị / Tài liệu</th>
                <th className="py-3 px-4 font-semibold">Người thực hiện</th>
                <th className="py-3 px-4 font-semibold rounded-r-xl">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-xs text-[#111c2c] divide-y divide-gray-100">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    <Layers size={32} className="mx-auto text-gray-300 mb-2" />
                    <p>Không tìm thấy hoạt động nào phù hợp với bộ lọc</p>
                  </td>
                </tr>
              ) : (
                filteredActivities.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => onSelectActivity(row)}
                    className="hover:bg-[#f0f4fa]/80 transition-colors cursor-pointer group"
                  >
                    {/* Thời gian */}
                    <td className="py-3.5 px-4 text-[#414750] font-mono text-[11px] whitespace-nowrap">
                      {row.time}
                    </td>

                    {/* Phân hệ & Hành động */}
                    <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {/* Domain Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          row.domain === 'warehouse'
                            ? 'bg-blue-100 text-[#005394]'
                            : row.domain === 'maintenance'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-purple-100 text-purple-900'
                        }`}>
                          {row.domain === 'warehouse' ? 'KHO' : row.domain === 'maintenance' ? 'SỬA CHỮA' : 'TÀI LIỆU'}
                        </span>
                        <span className="font-semibold text-gray-900">{row.action}</span>
                      </div>
                    </td>

                    {/* Nội dung / Thiết bị / Tài liệu */}
                    <td className="py-3.5 px-4 font-semibold text-[#005394] group-hover:underline">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span>{row.title}</span>
                          {row.code && (
                            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                              {row.code}
                            </span>
                          )}
                        </div>
                        {row.subTitle && (
                          <span className="text-[11px] font-normal text-[#5e7087] mt-0.5">
                            {row.subTitle}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Người thực hiện */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${row.user.avatarColor} flex items-center justify-center font-bold text-[10px]`}>
                          {row.user.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{row.user.name}</span>
                          {row.user.role && <span className="text-[10px] text-gray-400">{row.user.role}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {row.status === 'HOÀN THÀNH' && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold tracking-wider uppercase">
                          Hoàn thành
                        </span>
                      )}
                      {row.status === 'ĐÃ DUYỆT' && (
                        <span className="px-2.5 py-1 bg-[#005394]/10 text-[#005394] rounded-full text-[10px] font-bold tracking-wider uppercase">
                          Đã duyệt
                        </span>
                      )}
                      {row.status === 'ĐANG SỬA CHỮA' && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold tracking-wider uppercase">
                          Đang sửa chữa
                        </span>
                      )}
                      {row.status === 'CHỜ XỬ LÝ' && (
                        <span className="px-2.5 py-1 bg-[#ffdad6] text-[#93000a] rounded-full text-[10px] font-bold tracking-wider uppercase animate-pulse">
                          Chờ xử lý
                        </span>
                      )}
                      {row.status === 'CHỜ VẬT TƯ' && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold tracking-wider uppercase">
                          Chờ vật tư
                        </span>
                      )}
                      {row.status.startsWith('BAN HÀNH') && (
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-900 rounded-full text-[10px] font-bold tracking-wider uppercase">
                          {row.status}
                        </span>
                      )}
                      {row.status === 'ĐÃ TỪ CHỐI' && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold tracking-wider uppercase">
                          Từ chối
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD LIST VIEW */}
        <div className="sm:hidden flex flex-col gap-2.5">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="bg-[#ffffff] p-3.5 rounded-xl border border-[#e2eaf5] shadow-2xs flex gap-3 items-center hover:bg-[#f0f4fa] transition-colors cursor-pointer"
            >
              {/* Icon Box */}
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                act.domain === 'warehouse'
                  ? 'bg-[#d3e4ff] text-[#001c38]'
                  : act.domain === 'maintenance'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-purple-100 text-purple-900'
              }`}>
                {act.domain === 'warehouse' ? (
                  act.action === 'Xuất kho' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />
                ) : act.domain === 'maintenance' ? (
                  <Wrench size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>

              {/* Info Body */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-xs font-bold text-[#111c2c] truncate">
                    [{act.domain === 'warehouse' ? 'Kho' : act.domain === 'maintenance' ? 'Sửa chữa' : 'Tài liệu'}] {act.action}
                  </span>
                  <span className="font-mono text-[10px] text-[#414750] flex-shrink-0">
                    {act.time}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#005394] truncate mt-0.5">
                  {act.title}
                </span>
                {act.subTitle && (
                  <span className="text-[10px] text-gray-500 truncate">
                    {act.subTitle}
                  </span>
                )}
                <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
                  <span>Phụ trách: {act.user.name}</span>
                  <span className="font-bold text-[#005394]">{act.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
