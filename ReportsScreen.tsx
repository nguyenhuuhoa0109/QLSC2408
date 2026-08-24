import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar
} from 'lucide-react';
import { InventoryItem, StockActivity } from '../types';

interface ReportsScreenProps {
  inventory: InventoryItem[];
  activities: StockActivity[];
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ inventory, activities }) => {
  // Mock monthly stats
  const monthlyData = [
    { month: 'Tháng 3', inVal: 45, outVal: 38 },
    { month: 'Tháng 4', inVal: 62, outVal: 50 },
    { month: 'Tháng 5', inVal: 78, outVal: 72 },
    { month: 'Tháng 6', inVal: 90, outVal: 84 },
    { month: 'Tháng 7', inVal: 65, outVal: 58 },
    { month: 'Tháng 8', inVal: 85, outVal: 79 },
  ];

  // Category counts
  const categoryStats = [
    { name: 'Cơ khí', count: 420, percent: 34, color: 'bg-blue-600' },
    { name: 'Điện - Tự động hóa', count: 380, percent: 30, color: 'bg-indigo-600' },
    { name: 'Dầu mỡ nhờn', count: 185, percent: 15, color: 'bg-amber-500' },
    { name: 'Vật tư tiêu hao', count: 160, percent: 13, color: 'bg-emerald-500' },
    { name: 'Cảm biến & Đo lường', count: 100, percent: 8, color: 'bg-rose-500' },
  ];

  return (
    <div className="flex flex-col w-full gap-5 p-4 sm:p-6 bg-[#f9f9ff]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111c2c] flex items-center gap-2">
            <BarChart3 className="text-[#005394]" size={22} />
            <span>Báo cáo Thống kê Vật tư & Vận hành Thủy điện</span>
          </h2>
          <p className="text-xs text-[#5e7087] mt-0.5">
            Dữ liệu tổng hợp tình hình luân chuyển kho và chi phí bảo trì quý 3/2023
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-500 flex items-center gap-1">
            <Calendar size={14} /> Kỳ báo cáo:
          </span>
          <select className="p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800">
            <option>Tháng 08/2023</option>
            <option>Quý 3/2023</option>
            <option>Năm 2023</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tổng giá trị lưu kho</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-gray-900">4.85 Tỷ</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <TrendingUp size={13} /> +3.2%
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Bao gồm thiết bị dự phòng tuabin</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lượt xuất kho tháng này</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-[#005394]">142</span>
            <span className="text-xs text-gray-500 font-medium">phiếu</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Cấp phát cho 18 ca trực bảo dưỡng</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lượt nhập kho tháng này</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-[#005394]">68</span>
            <span className="text-xs text-gray-500 font-medium">phiếu</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">100% đạt chuẩn nghiệm thu kỹ thuật</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tỷ lệ luân chuyển kho</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-emerald-600">94.8%</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Đảm bảo vật tư không tồn đọng quá 12 tháng</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Import/Export bar visualization */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Biểu đồ Xuất - Nhập kho qua các tháng</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Đơn vị: Triệu đồng (quy đổi)</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#005394] rounded-sm" />
                  <span className="text-gray-600">Nhập kho</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-amber-500 rounded-sm" />
                  <span className="text-gray-600">Xuất kho</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              {monthlyData.map((d) => (
                <div key={d.month} className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>{d.month}</span>
                    <span className="font-mono text-[11px]">Nhập: {d.inVal}tr | Xuất: {d.outVal}tr</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 h-3">
                    <div className="bg-gray-100 rounded-full overflow-hidden flex justify-end">
                      <div 
                        className="bg-[#005394] h-full rounded-full transition-all"
                        style={{ width: `${(d.inVal / 100) * 100}%` }}
                      />
                    </div>
                    <div className="bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${(d.outVal / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Cao điểm nhập kho vật tư thay thế: Tháng 6 & Tháng 8</span>
            <span className="text-[#005394] font-bold">Cân đối định mức đạt 98%</span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Cơ cấu chủng loại vật tư</h3>
            <p className="text-[11px] text-gray-400 mb-4">Phân bổ theo nhóm kỹ thuật chuyên trách</p>

            <div className="space-y-3">
              {categoryStats.map((c) => (
                <div key={c.name} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">{c.name}</span>
                    <span className="font-bold text-gray-900">{c.count} mục ({c.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${c.color} rounded-full`}
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#f0f4fa] rounded-xl text-[11px] text-[#005394] font-medium">
            Vật tư Cơ khí & Điện - Tự động hóa chiếm 64% tổng cơ cấu tồn kho.
          </div>
        </div>
      </div>
    </div>
  );
};
