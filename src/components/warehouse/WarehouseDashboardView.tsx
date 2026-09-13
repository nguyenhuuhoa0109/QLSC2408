import React from 'react';
import { 
  BarChart3, 
  Package, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  DollarSign, 
  Boxes, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  FolderOpen
} from 'lucide-react';
import { InventoryItem } from '../../types';

interface WarehouseDashboardViewProps {
  inventory: InventoryItem[];
  subView?: 'overview' | 'critical' | 'valuation';
  onSelectCategoryFolder: (category: string) => void;
  onOpenNewTransaction: (type: 'import' | 'export', preselectedItem?: InventoryItem) => void;
  onViewAllItems: () => void;
}

export const WarehouseDashboardView: React.FC<WarehouseDashboardViewProps> = ({
  inventory,
  subView = 'overview',
  onSelectCategoryFolder,
  onOpenNewTransaction,
  onViewAllItems
}) => {
  // Calculations
  const totalItemsCount = inventory.length;
  const criticalItems = inventory.filter(i => i.status === 'critical');
  const warningItems = inventory.filter(i => i.status === 'warning');
  const normalItems = inventory.filter(i => i.status === 'normal');

  const totalValuation = inventory.reduce((sum, item) => {
    return sum + (item.quantity * (item.pricePerUnit || 0));
  }, 0);

  const readinessPercent = totalItemsCount > 0 
    ? Math.round((normalItems.length / totalItemsCount) * 100) 
    : 100;

  // Format currency
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Group by category
  const categories: InventoryItem['category'][] = [
    'Cơ khí', 
    'Điện - Tự động hóa', 
    'Cảm biến & Đo lường', 
    'Dầu mỡ nhờn', 
    'Vật tư tiêu hao'
  ];

  const categoryStats = categories.map(cat => {
    const itemsInCat = inventory.filter(i => i.category === cat);
    const count = itemsInCat.length;
    const catValuation = itemsInCat.reduce((sum, i) => sum + (i.quantity * (i.pricePerUnit || 0)), 0);
    const criticalInCat = itemsInCat.filter(i => i.status === 'critical').length;
    const warningInCat = itemsInCat.filter(i => i.status === 'warning').length;
    const totalQty = itemsInCat.reduce((sum, i) => sum + i.quantity, 0);

    return {
      category: cat,
      count,
      valuation: catValuation,
      criticalInCat,
      warningInCat,
      totalQty,
      percent: totalItemsCount > 0 ? Math.round((count / totalItemsCount) * 100) : 0
    };
  });

  // Group by location zones
  const locationZones = [
    { name: 'Khu A - Cơ khí & Thủy lực', prefix: 'Khu A', icon: '⚙️' },
    { name: 'Khu B - Vật tư tiêu hao & Dự phòng', prefix: 'Khu B', icon: '📦' },
    { name: 'Khu C - Điện, Đo lường & SCADA', prefix: 'Khu C', icon: '⚡' },
    { name: 'Kho Dầu số 1 - Dầu mỡ bôi trơn', prefix: 'Kho Dầu', icon: '🛢️' },
    { name: 'Phòng ắc quy DC 220V', prefix: 'Phòng ắc quy', icon: '🔋' },
    { name: 'Kho bãi cáp & Thiết bị nặng', prefix: 'Kho bãi', icon: '🏗️' }
  ].map(zone => {
    const itemsInZone = inventory.filter(i => i.location.toLowerCase().includes(zone.prefix.toLowerCase()));
    return {
      ...zone,
      count: itemsInZone.length,
      items: itemsInZone
    };
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-[#003c6c] via-[#005394] to-[#0d69b3] text-white p-5 sm:p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 text-[11px] font-semibold tracking-wide uppercase mb-2">
              <BarChart3 size={13} />
              <span>
                {subView === 'critical' ? 'Báo cáo Khẩn cấp & Cảnh báo tồn' : subView === 'valuation' ? 'Báo cáo Cơ cấu Giá trị Tài sản' : 'Báo cáo Điều hành Kho Tổng thể'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Dashboard Quản trị Kho Thủy điện</span>
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Theo dõi định mức tồn kho an toàn, cơ cấu giá trị tài sản vật tư, và cảnh báo thiếu hụt phục vụ vận hành 2 tổ máy H1-H2.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:self-center">
            <button
              onClick={() => onOpenNewTransaction('import')}
              className="px-3.5 py-2 bg-white text-[#005394] hover:bg-white/90 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <ArrowDownLeft size={15} />
              <span>Tạo phiếu nhập</span>
            </button>
            <button
              onClick={onViewAllItems}
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <FolderOpen size={15} />
              <span>Xem danh mục vật tư</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Tổng giá trị tồn kho */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Giá trị tồn kho</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-gray-900 leading-tight">
              {formatVND(totalValuation)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-0.5">
              <TrendingUp size={11} /> 100% tài sản hạch toán
            </span>
          </div>
        </div>

        {/* Tổng số vật tư */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Tổng chủng loại</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#005394] flex items-center justify-center">
              <Boxes size={16} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              {totalItemsCount} <span className="text-xs font-normal text-gray-500">mã VT</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-0.5 block">
              5 phân nhóm kỹ thuật
            </span>
          </div>
        </div>

        {/* Khẩn cấp */}
        <div className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between transition-colors ${
          criticalItems.length > 0 ? 'bg-red-50/70 border-red-200' : 'bg-white border-[#e2eaf5]'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-red-800">Cần nhập gấp</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-red-700 leading-tight">
              {criticalItems.length} <span className="text-xs font-normal text-red-600">vật tư</span>
            </div>
            <span className="text-[10px] text-red-600 font-semibold mt-0.5 block">
              Dưới 50% mức tồn tối thiểu
            </span>
          </div>
        </div>

        {/* Cảnh báo tồn */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-800">Cảnh báo chạm min</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 leading-tight">
              {warningItems.length} <span className="text-xs font-normal text-amber-600">vật tư</span>
            </div>
            <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block">
              Cần bổ sung trong kỳ
            </span>
          </div>
        </div>

        {/* Tỷ lệ an toàn */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Độ an toàn tồn</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-teal-700 leading-tight">
              {readinessPercent}%
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                style={{ width: `${readinessPercent}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Breakdown: Categories & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Category Valuation & Breakdown (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="text-[#005394]" size={18} />
                  <span>Cơ cấu Vật tư theo Chủng loại & Ngành kỹ thuật</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nhấp vào từng nhóm để mở nhanh danh mục vật tư tương ứng trong kho
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {categoryStats.map((item) => {
                const colorMap: Record<string, { bg: string; bar: string; text: string; lightBg: string }> = {
                  'Cơ khí': { bg: 'bg-blue-600', bar: 'bg-blue-500', text: 'text-blue-700', lightBg: 'bg-blue-50' },
                  'Điện - Tự động hóa': { bg: 'bg-purple-600', bar: 'bg-purple-500', text: 'text-purple-700', lightBg: 'bg-purple-50' },
                  'Cảm biến & Đo lường': { bg: 'bg-emerald-600', bar: 'bg-emerald-500', text: 'text-emerald-700', lightBg: 'bg-emerald-50' },
                  'Dầu mỡ nhờn': { bg: 'bg-amber-600', bar: 'bg-amber-500', text: 'text-amber-700', lightBg: 'bg-amber-50' },
                  'Vật tư tiêu hao': { bg: 'bg-cyan-600', bar: 'bg-cyan-500', text: 'text-cyan-700', lightBg: 'bg-cyan-50' }
                };
                const colors = colorMap[item.category] || { bg: 'bg-gray-600', bar: 'bg-gray-500', text: 'text-gray-700', lightBg: 'bg-gray-50' };

                return (
                  <div 
                    key={item.category}
                    onClick={() => onSelectCategoryFolder(item.category)}
                    className="p-3.5 rounded-xl border border-gray-100 hover:border-[#005394]/30 hover:bg-[#f8faff] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                        <span className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#005394] transition-colors">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          ({item.count} mã)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-gray-800">
                          {formatVND(item.valuation)}
                        </span>
                        <ArrowRight size={13} className="text-gray-400 group-hover:text-[#005394] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(5, (item.valuation / (totalValuation || 1)) * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>Tổng lượng: <strong className="text-gray-700">{item.totalQty}</strong> đơn vị</span>
                      <div className="flex items-center gap-2">
                        {item.criticalInCat > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                            {item.criticalInCat} khẩn cấp
                          </span>
                        )}
                        {item.warningInCat > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[10px]">
                            {item.warningInCat} cảnh báo
                          </span>
                        )}
                        <span className="font-semibold text-gray-600">
                          {Math.round((item.valuation / (totalValuation || 1)) * 100)}% giá trị
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Storage Zones Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="text-[#005394]" size={16} />
              <span>Bố trí Kho bãi & Khu vực lưu trữ thực địa</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {locationZones.map((zone) => (
                <div key={zone.name} className="p-3 bg-[#f8faff] rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{zone.icon}</span>
                    <div className="truncate">
                      <div className="font-bold text-gray-800 truncate">{zone.name}</div>
                      <div className="text-[10px] text-gray-400">Tiêu chuẩn bảo quản kỹ thuật</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-white border border-gray-200 text-[#005394] font-black rounded-lg text-xs flex-shrink-0">
                    {zone.count} VT
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Low Stock / Critical Alerts Action Center (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="text-red-600" size={18} />
                  <span>Cảnh báo Thiếu hụt & Đặt hàng</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Vật tư dưới mức tồn tối thiểu cần lập phiếu nhập
                </p>
              </div>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-full text-xs">
                {criticalItems.length + warningItems.length} cảnh báo
              </span>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
              {[...criticalItems, ...warningItems].length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Định mức an toàn tuyệt đối</p>
                  <p className="text-xs text-gray-400">Tất cả vật tư đều trên ngưỡng tồn kho tối thiểu</p>
                </div>
              ) : (
                [...criticalItems, ...warningItems].map((item) => {
                  const shortage = item.minQuantity - item.quantity;
                  const isCrit = item.status === 'critical';

                  return (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isCrit ? 'bg-red-50/40 border-red-200' : 'bg-amber-50/40 border-amber-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-[#005394]">{item.code}</span>
                            <span className={`px-1.5 py-0.2 text-[9px] font-black uppercase rounded ${
                              isCrit ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
                            }`}>
                              {isCrit ? 'Khẩn cấp' : 'Cảnh báo'}
                            </span>
                          </div>
                          <div className="font-bold text-xs text-gray-900 mt-0.5 line-clamp-1">{item.name}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin size={11} /> {item.location}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold text-gray-900">
                            Tồn: <span className={isCrit ? 'text-red-700' : 'text-amber-700'}>{item.quantity}</span> / Min: {item.minQuantity}
                          </div>
                          {shortage > 0 && (
                            <div className="text-[10px] text-red-600 font-bold mt-0.5">
                              Thiếu: -{shortage} {item.unit}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-gray-100/80 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          Cập nhật: {item.lastUpdated}
                        </span>
                        <button
                          onClick={() => onOpenNewTransaction('import', item)}
                          className="px-2.5 py-1 bg-[#005394] hover:bg-[#004278] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <ArrowDownLeft size={13} />
                          <span>Lập phiếu nhập</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 mt-3">
              <button
                onClick={onViewAllItems}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-gray-200"
              >
                <span>Chuyển sang Bảng chi tiết toàn bộ vật tư</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
