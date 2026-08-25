import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  RefreshCw,
  Search,
  Check,
  Plus
} from 'lucide-react';
import { StockActivity, PlantLocation, InventoryItem } from '../types';

interface OverviewScreenProps {
  plantName: PlantLocation;
  activities: StockActivity[];
  inventory: InventoryItem[];
  pendingApprovalsCount: number;
  onOpenApprovals: () => void;
  onOpenNewTransaction: (type: 'import' | 'export') => void;
  onSelectActivity: (activity: StockActivity) => void;
  onNavigateToWarehouse: () => void;
  isMobileLayout?: boolean;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  plantName,
  activities,
  inventory,
  pendingApprovalsCount,
  onOpenApprovals,
  onOpenNewTransaction,
  onSelectActivity,
  onNavigateToWarehouse,
  isMobileLayout = false
}) => {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  // Total inventory stats
  const totalItemsCount = plantName.includes('Sơn Trà') ? 1245 : 1248;
  const criticalItemsCount = inventory.filter(i => i.status === 'critical').length || (plantName.includes('Sơn Trà') ? 5 : 4);
  const warningItemsCount = inventory.filter(i => i.status === 'warning').length || (plantName.includes('Sơn Trà') ? 10 : 8);
  const totalAlertsCount = criticalItemsCount + warningItemsCount;

  // Filter activities
  const filteredActivities = activities.filter(act => {
    const matchAction = filterAction === 'all' || act.action === filterAction;
    const matchSearch = !tableSearch || 
      act.item.toLowerCase().includes(tableSearch.toLowerCase()) ||
      act.user.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      (act.ticketCode && act.ticketCode.toLowerCase().includes(tableSearch.toLowerCase()));
    return matchAction && matchSearch;
  });

  return (
    <div className="flex flex-col w-full gap-5 sm:gap-6 p-4 sm:p-6 bg-[#f9f9ff]">
      
      {/* Mobile Top Header Title (Image 3) */}
      <div className="md:hidden flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#111c2c]">Tổng quan kho</h2>
        <span className="text-xs text-[#005394] font-semibold bg-[#e7eeff] px-2.5 py-1 rounded-full">
          {plantName.includes('Sơn Trà') ? 'Sơn Trà 1' : 'Hòa Bình'}
        </span>
      </div>

      {/* TOP 3 SUMMARY CARDS - Exact Match to Image 1 (Desktop) & Image 3 (Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        
        {/* CARD 1: TỔNG VẬT TƯ */}
        <div 
          onClick={onNavigateToWarehouse}
          className="bg-[#e7eeff] rounded-2xl p-5 flex flex-col gap-2 shadow-xs relative overflow-hidden group hover:shadow-md transition-all cursor-pointer border border-[#d8e3fa]/60"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#005394]/10 rounded-full blur-xl group-hover:bg-[#005394]/20 transition-colors pointer-events-none" />
          
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-[#414750] uppercase tracking-wider">
              TỔNG VẬT TƯ
            </span>
            <div className="w-8 h-8 rounded-full bg-[#005394]/10 flex items-center justify-center text-[#005394]">
              <Package size={18} />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 z-10 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#005394] tracking-tight">
              {totalItemsCount.toLocaleString('en-US')}
            </span>
            <span className="text-xs font-semibold text-[#414750]">mục</span>
          </div>

          <div className="z-10 mt-auto pt-2">
            <div className="h-1.5 w-full bg-[#d8e3fa] rounded-full overflow-hidden">
              <div className="h-full bg-[#005394] w-3/4 rounded-full transition-all duration-500" />
            </div>
            <p className="font-mono text-[11px] text-[#414750] mt-2 flex items-center gap-1">
              <RefreshCw size={11} className="text-[#005394]" />
              <span>Đã cập nhật 5 phút trước</span>
            </p>
          </div>
        </div>

        {/* CARD 2: CẢNH BÁO TỒN KHO */}
        <div 
          onClick={onNavigateToWarehouse}
          className="bg-[#ffdad6] rounded-2xl p-5 flex flex-col gap-2 shadow-xs relative overflow-hidden group hover:shadow-md transition-all cursor-pointer border border-[#ffb4ab]/40"
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

          <div className="flex items-baseline gap-1.5 z-10 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#ba1a1a] tracking-tight">
              {totalAlertsCount}
            </span>
            <span className="text-xs font-bold text-[#93000a]">mục cần nhập</span>
          </div>

          <div className="z-10 mt-auto pt-2">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-[#ba1a1a]/15 text-[#93000a] rounded-md font-mono text-[10px] font-bold">
                Cao: {criticalItemsCount}
              </span>
              <span className="px-2 py-0.5 bg-[#ba1a1a]/15 text-[#93000a] rounded-md font-mono text-[10px] font-bold">
                Trung bình: {warningItemsCount}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: PHIẾU CHỜ DUYỆT */}
        <div 
          onClick={onOpenApprovals}
          className="bg-[#e7eeff] sm:col-span-2 md:col-span-1 rounded-2xl p-5 flex flex-col gap-2 shadow-xs relative overflow-hidden group hover:shadow-md transition-all cursor-pointer border border-[#d8e3fa]/60"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#03519f]/10 rounded-full blur-xl group-hover:bg-[#03519f]/20 transition-colors pointer-events-none" />
          
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-[#414750] uppercase tracking-wider">
              PHIẾU CHỜ DUYỆT
            </span>
            <div className="w-8 h-8 rounded-full bg-[#03519f]/10 flex items-center justify-center text-[#03519f]">
              <Clock size={18} />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 z-10 my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#03519f] tracking-tight">
              {pendingApprovalsCount}
            </span>
            <span className="text-xs font-semibold text-[#414750]">phiếu</span>
          </div>

          <div className="z-10 mt-auto pt-2">
            <button 
              type="button"
              className="font-mono text-xs font-semibold text-[#03519f] group-hover:text-[#005394] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACTION SHORTCUTS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#414750] uppercase">Thao tác nhanh:</span>
          <span className="text-xs text-gray-500 hidden sm:inline">Tạo phiếu điều chuyển hoặc nhập xuất kho tức thì</span>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* RECENT ACTIVITIES SECTION - Exact match to Image 1 & Image 3 */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-[#e2eaf5] flex-1">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#111c2c]">
              Hoạt động gần đây về xuất nhập kho
            </h2>
            <p className="text-xs text-[#5e7087] mt-0.5">
              Nhật ký giao dịch vật tư thiết bị thời gian thực
            </p>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Search filter */}
            <div className="relative">
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Tìm vật tư, mã phiếu..."
                className="w-44 sm:w-56 pl-7 pr-3 py-1.5 bg-[#f0f3ff] border border-transparent focus:border-[#005394] rounded-lg text-xs outline-none"
              />
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-3 py-1.5 bg-[#dee8ff] hover:bg-[#cfdaf1] text-[#111c2c] rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Filter size={14} />
                <span>Lọc {filterAction !== 'all' ? `(${filterAction})` : ''}</span>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-30 animate-in fade-in zoom-in-95">
                  <p className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase">Loại thao tác</p>
                  {[
                    { id: 'all', label: 'Tất cả hoạt động' },
                    { id: 'Xuất kho', label: 'Xuất kho' },
                    { id: 'Nhập kho', label: 'Nhập kho' },
                    { id: 'Duyệt phiếu nhập', label: 'Duyệt phiếu' },
                    { id: 'Yêu cầu nhập gấp', label: 'Yêu cầu nhập gấp' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFilterAction(f.id);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        filterAction === f.id ? 'bg-[#eef3fb] text-[#005394] font-bold' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{f.label}</span>
                      {filterAction === f.id && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DESKTOP TABLE VIEW - Exact Match to Image 1 */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#dee8ff]/60 text-[#414750] font-mono text-xs">
                <th className="py-3 px-4 font-semibold rounded-l-xl">Thời gian</th>
                <th className="py-3 px-4 font-semibold">Hành động</th>
                <th className="py-3 px-4 font-semibold">Vật tư</th>
                <th className="py-3 px-4 font-semibold">Người thực hiện</th>
                <th className="py-3 px-4 font-semibold rounded-r-xl">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-xs text-[#111c2c] divide-y divide-gray-50">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Không tìm thấy hoạt động nào phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredActivities.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => onSelectActivity(row)}
                    className="hover:bg-[#f0f4fa]/70 transition-colors cursor-pointer group"
                  >
                    {/* Thời gian */}
                    <td className="py-3.5 px-4 text-[#414750] font-mono text-[11px]">
                      {row.time}
                    </td>

                    {/* Hành động */}
                    <td className="py-3.5 px-4 font-medium">
                      <span className={row.action === 'Yêu cầu nhập gấp' ? 'text-[#ba1a1a] font-bold' : 'text-[#111c2c]'}>
                        {row.action}
                      </span>
                    </td>

                    {/* Vật tư */}
                    <td className="py-3.5 px-4 font-semibold text-[#005394] group-hover:underline">
                      <div className="flex items-center gap-1.5">
                        <span>{row.item}</span>
                        {row.quantity && (
                          <span className="text-[10px] text-gray-500 font-mono">
                            ({row.quantity} {row.unit})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Người thực hiện */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${row.user.avatarColor} flex items-center justify-center font-bold text-[10px]`}>
                          {row.user.initials}
                        </div>
                        <span className="font-medium text-gray-800">{row.user.name}</span>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4">
                      {row.status === 'HOÀN THÀNH' && (
                        <span className="px-2.5 py-1 bg-[#d8e3fa] text-[#414750] rounded-full text-[10px] font-bold tracking-wider uppercase">
                          Hoàn thành
                        </span>
                      )}
                      {row.status === 'ĐÃ DUYỆT' && (
                        <span className="px-2.5 py-1 bg-[#005394]/10 text-[#005394] rounded-full text-[10px] font-bold tracking-wider uppercase">
                          Đã duyệt
                        </span>
                      )}
                      {row.status === 'CHỜ XỬ LÝ' && (
                        <span className="px-2.5 py-1 bg-[#ffdad6] text-[#93000a] rounded-full text-[10px] font-bold tracking-wider uppercase animate-pulse">
                          Chờ xử lý
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

        {/* MOBILE CARD LIST VIEW - Exact Match to Image 3 */}
        <div className="sm:hidden flex flex-col gap-2.5">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="bg-[#ffffff] p-3.5 rounded-xl border border-[#e2eaf5] shadow-2xs flex gap-3 items-center hover:bg-[#f0f4fa] transition-colors cursor-pointer"
            >
              {/* Icon Box */}
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                act.action === 'Xuất kho'
                  ? 'bg-[#9fc2fe] text-[#001b3c]'
                  : act.action === 'Nhập kho'
                  ? 'bg-[#d3e4ff] text-[#001c38]'
                  : act.action === 'Yêu cầu nhập gấp'
                  ? 'bg-[#ffdad6] text-[#93000a]'
                  : 'bg-[#d8e3fa] text-[#005394]'
              }`}>
                {act.action === 'Xuất kho' ? (
                  <ArrowUpRight size={20} />
                ) : act.action === 'Nhập kho' ? (
                  <ArrowDownLeft size={20} />
                ) : act.action === 'Yêu cầu nhập gấp' ? (
                  <AlertTriangle size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
              </div>

              {/* Info Body */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-xs font-bold text-[#111c2c] truncate">
                    {act.action}: {act.item}
                  </span>
                  <span className="font-mono text-[10px] text-[#414750] flex-shrink-0">
                    {act.dateLabel || act.time}
                  </span>
                </div>
                <span className="text-[11px] text-[#414750] truncate mt-0.5">
                  Mã phiếu: {act.ticketCode || 'XK-2023-08-01'}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
                  <span>Thực hiện: {act.user.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
