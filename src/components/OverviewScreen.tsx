import React, { useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  ArrowLeftRight, 
  Search, 
  Plus, 
  Wrench, 
  FileText, 
  ChevronRight, 
  FileEdit,
  History,
  CheckCircle2,
  Boxes
} from 'lucide-react';
import { 
  StockActivity, 
  PlantLocation, 
  InventoryItem, 
  MaintenanceTask, 
  TechnicalDocument, 
  UnifiedActivity,
  WarehouseSubTab,
  MaintenanceSubTab
} from '../types';

interface OverviewScreenProps {
  plantName: PlantLocation;
  activities: StockActivity[];
  inventory: InventoryItem[];
  maintenanceTasks: MaintenanceTask[];
  documents: TechnicalDocument[];
  pendingApprovalsCount: number;
  onOpenApprovals: () => void;
  onOpenNewTransaction: (type: 'import' | 'export', preselectedItem?: InventoryItem) => void;
  onSelectActivity: (activity: StockActivity | UnifiedActivity) => void;
  onNavigateToWarehouse: (subTab?: WarehouseSubTab) => void;
  onNavigateToMaintenance?: (subTab?: MaintenanceSubTab) => void;
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

    // 1. Stock Activities (Kho - Nhập/Xuất)
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

    // 2. Maintenance Tasks (Sửa chữa & Bảo dưỡng)
    maintenanceTasks.forEach((task, idx) => {
      const isDone = task.status === 'Hoàn thành';
      const isWaiting = task.status === 'Chờ vật tư';
      list.push({
        id: `mnt-act-${task.id || idx}`,
        domain: 'maintenance',
        time: task.startDate ? `${task.startDate}` : '08:30 AM',
        action: isDone ? 'Nghiệm thu bảo dưỡng' : isWaiting ? 'Chờ cấp vật tư' : 'Bảo dưỡng định kỳ',
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

    // 3. Technical Documents (Hồ sơ tài liệu)
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

  // 1. Vật tư cần nhập gấp: Đúng 3 dòng ưu tiên nhất
  const urgentItems = useMemo(() => {
    const lowStock = inventory
      .filter(i => i.quantity <= i.minQuantity)
      .sort((a, b) => (a.quantity / (a.minQuantity || 1)) - (b.quantity / (b.minQuantity || 1)));
    return (lowStock.length > 0 ? lowStock : inventory).slice(0, 3);
  }, [inventory]);

  // 2. Công tác sửa chữa & bảo dưỡng: Đúng 3 dòng đang làm / chờ vật tư
  const urgentTasks = useMemo(() => {
    const pending = maintenanceTasks
      .filter(t => t.status !== 'Hoàn thành')
      .sort((a, b) => {
        if (a.priority === 'Khẩn cấp' || a.priority === 'Cao') return -1;
        if (b.priority === 'Khẩn cấp' || b.priority === 'Cao') return 1;
        return 0;
      });
    return (pending.length > 0 ? pending : maintenanceTasks).slice(0, 3);
  }, [maintenanceTasks]);

  // 3. Nhật ký hoạt động gần đây: Đúng 3 dòng tương ứng với [Phiếu nhập xuất, Lịch sử sửa chữa, Hồ sơ tài liệu]
  const threeDomainActivities = useMemo(() => {
    const warehouseAct = unifiedActivities.find(a => a.domain === 'warehouse');
    const maintenanceAct = unifiedActivities.find(a => a.domain === 'maintenance');
    const documentAct = unifiedActivities.find(a => a.domain === 'document');

    const result: UnifiedActivity[] = [];
    if (warehouseAct) result.push(warehouseAct);
    if (maintenanceAct) result.push(maintenanceAct);
    if (documentAct) result.push(documentAct);

    // Fallback if any is missing
    if (result.length < 3) {
      for (const act of unifiedActivities) {
        if (!result.some(r => r.id === act.id)) {
          result.push(act);
        }
        if (result.length === 3) break;
      }
    }

    return result.slice(0, 3);
  }, [unifiedActivities]);

  return (
    <div className="flex flex-col w-full gap-3.5 sm:gap-4 p-4 sm:p-5 bg-[#f9f9ff]">

      {/* 1. 4 CARD THỐNG KÊ CHÍNH (HEADER MAIN) - Thu gọn tinh gọn, hài hòa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* CARD 1: TỔNG VẬT TƯ KHO */}
        <div 
          onClick={() => onNavigateToWarehouse('danh-muc')}
          className="bg-white rounded-xl p-3.5 sm:p-4 border border-blue-100/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              TỔNG VẬT TƯ KHO
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#005394] flex items-center justify-center group-hover:bg-[#005394] group-hover:text-white transition-colors">
              <Package size={15} />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#005394] tracking-tight">
              {totalItemsCount.toLocaleString('en-US')}
            </span>
            <span className="text-xs font-semibold text-gray-500">mặt hàng</span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#005394] font-medium">
            <span>Danh mục VT/TB</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 2: CẢNH BÁO TỒN KHO */}
        <div 
          onClick={() => onNavigateToWarehouse('nhap-xuat')}
          className="bg-white rounded-xl p-3.5 sm:p-4 border border-rose-100/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group hover:border-rose-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              CẢNH BÁO TỒN KHO
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertTriangle size={15} />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-rose-600 tracking-tight">
              {totalAlertsCount}
            </span>
            <span className="text-xs font-semibold text-rose-700">dưới định mức</span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-rose-700 font-medium">
            <span>{criticalItemsCount} mục khẩn cấp</span>
            <span className="font-mono text-[10px] bg-rose-50 px-1.5 py-0.2 rounded text-rose-700 font-bold">Cần nhập</span>
          </div>
        </div>

        {/* CARD 3: CÔNG TÁC SỬA CHỮA */}
        <div 
          onClick={() => onNavigateToMaintenance && onNavigateToMaintenance('dashboard')}
          className="bg-white rounded-xl p-3.5 sm:p-4 border border-amber-100/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group hover:border-amber-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              CÔNG TÁC SỬA CHỮA
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Wrench size={15} />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-amber-800 tracking-tight">
              {activeRepairsCount}
            </span>
            <span className="text-xs font-semibold text-amber-800">đang triển khai</span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-amber-800 font-medium">
            <span>{waitingSuppliesTasks.length} chờ cấp vật tư</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 4: HỒ SƠ & TÀI LIỆU */}
        <div 
          onClick={onNavigateToDocuments}
          className="bg-white rounded-xl p-3.5 sm:p-4 border border-purple-100/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group hover:border-purple-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
              HỒ SƠ & TÀI LIỆU
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileText size={15} />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-purple-800 tracking-tight">
              {totalDocsCount}
            </span>
            <span className="text-xs font-semibold text-purple-800">tài liệu lưu trữ</span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-purple-800 font-medium">
            <span>Bản vẽ & Quy trình</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* 2. THANH THAO TÁC NHANH (QUICK ACTIONS): ĐÚNG 4 Ô NÚT BẤM */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Ô 1: Tạo phiếu nhập xuất */}
        <button
          onClick={() => onOpenNewTransaction('import')}
          className="group flex items-center gap-2.5 sm:gap-3 p-3 bg-white hover:bg-blue-50/50 rounded-xl border border-gray-200/80 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-[#005394] group-hover:text-white text-[#005394] flex items-center justify-center transition-colors flex-shrink-0">
            <ArrowLeftRight size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 group-hover:text-[#005394] truncate transition-colors">
              Tạo phiếu nhập xuất
            </p>
            <p className="text-[11px] text-gray-400 truncate">Lập phiếu kho nhanh</p>
          </div>
        </button>

        {/* Ô 2: Đăng ký công tác */}
        <button
          onClick={() => onNavigateToMaintenance && onNavigateToMaintenance('dang-ky')}
          className="group flex items-center gap-2.5 sm:gap-3 p-3 bg-white hover:bg-emerald-50/50 rounded-xl border border-gray-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 flex items-center justify-center transition-colors flex-shrink-0">
            <FileEdit size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 truncate transition-colors">
              Đăng ký công tác
            </p>
            <p className="text-[11px] text-gray-400 truncate">Lập phiếu công tác</p>
          </div>
        </button>

        {/* Ô 3: Lịch sử sửa chữa */}
        <button
          onClick={() => onNavigateToMaintenance && onNavigateToMaintenance('lich-su')}
          className="group flex items-center gap-2.5 sm:gap-3 p-3 bg-white hover:bg-amber-50/50 rounded-xl border border-gray-200/80 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 group-hover:bg-amber-600 group-hover:text-white text-amber-800 flex items-center justify-center transition-colors flex-shrink-0">
            <History size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 group-hover:text-amber-800 truncate transition-colors">
              Lịch sử sửa chữa
            </p>
            <p className="text-[11px] text-gray-400 truncate">Biên bản & nghiệm thu</p>
          </div>
        </button>

        {/* Ô 4: Tra cứu tài liệu */}
        <button
          onClick={onNavigateToDocuments}
          className="group flex items-center gap-2.5 sm:gap-3 p-3 bg-white hover:bg-purple-50/50 rounded-xl border border-gray-200/80 hover:border-purple-300 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-700 flex items-center justify-center transition-colors flex-shrink-0">
            <Search size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 group-hover:text-purple-700 truncate transition-colors">
              Tra cứu tài liệu
            </p>
            <p className="text-[11px] text-gray-400 truncate">Bản vẽ & quy trình</p>
          </div>
        </button>
      </div>

      {/* 3. 2 CARD VẬN HÀNH TRUNG TÂM (Mỗi card đúng 3 dòng) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5">
        
        {/* CARD TRÁI: VẬT TƯ CẦN NHẬP GẤP (Đúng 3 dòng mặt hàng ưu tiên nhất) */}
        <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-2xs border border-gray-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertTriangle size={14} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">Vật tư cần nhập gấp</h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">Mức tồn kho dưới định mức an toàn tối thiểu</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateToWarehouse('nhap-xuat')}
                className="text-xs text-[#005394] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Xem kho</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Đúng 3 dòng */}
            <div className="divide-y divide-gray-50 mt-1">
              {urgentItems.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-gray-800 truncate">{item.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mt-0.5">
                      <span>Mã: {item.code}</span>
                      <span>•</span>
                      <span>Vị trí: {item.location}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] sm:text-[11px] ${
                      item.quantity <= item.minQuantity 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.quantity} / {item.minQuantity} {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[11px]">3 mặt hàng ưu tiên cấp bách nhất</span>
            <button
              onClick={() => onOpenNewTransaction('import')}
              className="text-[#005394] font-bold hover:underline flex items-center gap-1 cursor-pointer text-xs"
            >
              <Plus size={13} />
              <span>Tạo phiếu nhập</span>
            </button>
          </div>
        </div>

        {/* CARD PHẢI: CÔNG TÁC SỬA CHỮA & BẢO DƯỠNG (Đúng 3 dòng hạng mục đang làm/chờ xử lý) */}
        <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-2xs border border-gray-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Wrench size={14} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">Công tác sửa chữa & bảo dưỡng</h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">Các hạng mục đang thi công hoặc chờ vật tư</p>
                </div>
              </div>
              {onNavigateToMaintenance && (
                <button 
                  onClick={() => onNavigateToMaintenance('dashboard')}
                  className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>

            {/* Đúng 3 dòng */}
            <div className="divide-y divide-gray-50 mt-1">
              {urgentTasks.map((task) => (
                <div key={task.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
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
                      {task.equipment} • Phụ trách: <strong className="font-medium text-gray-700">{task.assignedTo}</strong>
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

          <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[11px]">Đội ngũ kỹ thuật trực ca 24/7</span>
            {onNavigateToMaintenance && (
              <button
                onClick={() => onNavigateToMaintenance('ke-hoach')}
                className="text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer text-xs"
              >
                <span>Xem kế hoạch</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 4. CARD NHẬT KÝ HOẠT ĐỘNG GẦN ĐÂY: Đúng 3 dòng tương ứng với [Phiếu nhập xuất, Lịch sử sửa chữa, Hồ sơ tài liệu] */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 shadow-2xs border border-gray-200/80">
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-100 text-[#005394] flex items-center justify-center">
              <Clock size={14} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                Nhật ký hoạt động gần đây
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-500">
                3 hoạt động mới nhất đại diện cho Phiếu nhập xuất, Sửa chữa & Hồ sơ tài liệu
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToWarehouse('nhap-xuat')}
            className="text-xs text-[#005394] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Toàn bộ nhật ký</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Đúng 3 dòng tương ứng với 3 phân hệ */}
        <div className="divide-y divide-gray-50 mt-1">
          {threeDomainActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="py-2.5 px-2 hover:bg-gray-50/80 rounded-lg flex items-center justify-between gap-3 transition-colors cursor-pointer group"
            >
              {/* Phân hệ & Hành động & Tiêu đề */}
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                  act.domain === 'warehouse'
                    ? 'bg-blue-100 text-[#005394]'
                    : act.domain === 'maintenance'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-purple-100 text-purple-900'
                }`}>
                  {act.domain === 'warehouse' ? 'NHẬP XUẤT' : act.domain === 'maintenance' ? 'SỬA CHỮA' : 'TÀI LIỆU'}
                </span>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-xs truncate group-hover:text-[#005394] transition-colors">
                      {act.title}
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal hidden sm:inline">•</span>
                    <span className="text-[11px] text-gray-600 hidden sm:inline truncate">
                      {act.action}
                    </span>
                  </div>
                  {act.subTitle && (
                    <span className="text-[10px] text-gray-400 truncate mt-0.5 font-mono">
                      {act.subTitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Người thực hiện, Trạng thái & Thời gian */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 text-right">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-medium text-gray-700">{act.user.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{act.time}</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  act.status === 'HOÀN THÀNH'
                    ? 'bg-emerald-100 text-emerald-800'
                    : act.status === 'ĐÃ DUYỆT'
                    ? 'bg-blue-100 text-[#005394]'
                    : act.status === 'ĐANG SỬA CHỮA'
                    ? 'bg-amber-100 text-amber-900'
                    : act.status === 'CHỜ XỬ LÝ'
                    ? 'bg-rose-100 text-rose-800 animate-pulse'
                    : act.status === 'CHỜ VẬT TƯ'
                    ? 'bg-amber-100 text-amber-800'
                    : act.status.startsWith('BAN HÀNH')
                    ? 'bg-purple-100 text-purple-900'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {act.status}
                </span>

                <ChevronRight size={14} className="text-gray-300 group-hover:text-[#005394] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
