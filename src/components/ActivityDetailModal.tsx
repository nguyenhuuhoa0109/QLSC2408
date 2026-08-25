import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle, 
  Clock, 
  FileText, 
  User, 
  Package, 
  Building2,
  Wrench,
  Download,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers
} from 'lucide-react';
import { StockActivity, PlantLocation, UnifiedActivity } from '../types';

interface ActivityDetailModalProps {
  activity: StockActivity | UnifiedActivity;
  plantName: PlantLocation;
  onClose: () => void;
  onNavigateTab?: (tabName: 'quan-ly-kho' | 'quan-ly-sua-chua' | 'quan-ly-tai-lieu') => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  plantName,
  onClose,
  onNavigateTab
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Determine domain
  const isUnified = 'domain' in activity;
  const domain = isUnified ? (activity as UnifiedActivity).domain : 'warehouse';

  const title = isUnified ? (activity as UnifiedActivity).title : (activity as StockActivity).item;
  const code = isUnified ? (activity as UnifiedActivity).code : (activity as StockActivity).ticketCode;
  const actionName = activity.action;
  const time = activity.time;
  const user = activity.user;
  const status = activity.status;
  const notes = isUnified ? ((activity as UnifiedActivity).details || (activity as UnifiedActivity).subTitle) : (activity as StockActivity).notes;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#005394] bg-[#eef3fb] px-2.5 py-1 rounded-lg">
              {code || (domain === 'warehouse' ? 'XK-2023-08-01' : domain === 'maintenance' ? 'BD-ST1-01' : 'TL-KT-01')}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase ${
              domain === 'warehouse'
                ? 'bg-blue-100 text-[#005394]'
                : domain === 'maintenance'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-purple-100 text-purple-900'
            }`}>
              {domain === 'warehouse' ? 'Kho Vật Tư' : domain === 'maintenance' ? 'Bảo Dưỡng Sửa Chữa' : 'Hồ Sơ Tài Liệu'}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3.5 text-xs text-gray-700">
          <div className="text-center py-1">
            <h3 className="text-base font-extrabold text-[#002b55] uppercase">
              {domain === 'warehouse' 
                ? (actionName === 'Xuất kho' ? 'PHIẾU XUẤT KHO VẬT TƯ' : actionName === 'Nhập kho' ? 'PHIẾU NHẬP KHO THIẾT BỊ' : 'PHIẾU GIAO DỊCH KHO')
                : domain === 'maintenance'
                ? 'PHIẾU CÔNG TÁC BẢO DƯỠNG SỬA CHỮA'
                : 'HỒ SƠ TÀI LIỆU KỸ THUẬT VẬN HÀNH'}
            </h3>
            <p className="text-[11px] text-gray-500">{plantName}</p>
          </div>

          <div className="bg-[#f0f4fa] p-4 rounded-2xl space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Thời gian ghi nhận:</span>
              <strong className="text-gray-900 font-mono">{time}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Hành động:</span>
              <span className="font-bold text-[#005394] flex items-center gap-1">
                {domain === 'warehouse' ? <Package size={13} /> : domain === 'maintenance' ? <Wrench size={13} /> : <FileText size={13} />}
                <span>{actionName}</span>
              </span>
            </div>

            <div className="flex justify-between items-start gap-2">
              <span className="text-gray-500 flex-shrink-0">
                {domain === 'warehouse' ? 'Tên vật tư:' : domain === 'maintenance' ? 'Thiết bị / Hạng mục:' : 'Tên tài liệu:'}
              </span>
              <strong className="text-[#005394] text-right">{title}</strong>
            </div>

            {!isUnified && (activity as StockActivity).quantity && (
              <div className="flex justify-between">
                <span className="text-gray-500">Số lượng:</span>
                <strong className="text-gray-900">{(activity as StockActivity).quantity} {(activity as StockActivity).unit || 'đơn vị'}</strong>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Người thực hiện:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900">{user.name}</span>
                <span className={`w-5 h-5 rounded-full ${user.avatarColor} text-[9px] font-bold flex items-center justify-center`}>
                  {user.initials}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Trạng thái:</span>
              <span className="px-2.5 py-0.5 bg-white text-[#005394] font-bold rounded-md text-[10px] shadow-2xs">
                {status}
              </span>
            </div>
          </div>

          {notes && (
            <div>
              <span className="font-bold text-gray-800 block mb-1">Chi tiết & Ghi chú nghiệp vụ:</span>
              <p className="p-3 bg-gray-50 rounded-xl text-gray-600 leading-relaxed border border-gray-100">
                {notes}
              </p>
            </div>
          )}

          {/* Signatures block */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-center text-[11px]">
            <div>
              <p className="font-bold text-gray-700">Người lập / Phụ trách</p>
              <p className="text-gray-400 italic text-[10px] mt-0.5">(Ký, họ tên)</p>
              <div className="h-9 flex items-center justify-center text-[#005394] font-serif italic">
                {user.name}
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-700">Trưởng ca / Ban Giám đốc</p>
              <p className="text-gray-400 italic text-[10px] mt-0.5">(Đã xác nhận điện tử)</p>
              <div className="h-9 flex items-center justify-center text-emerald-600 font-serif italic text-xs font-semibold">
                ✓ Đã xác thực
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>In phiếu</span>
            </button>
            {onNavigateTab && (
              <button
                onClick={() => {
                  onClose();
                  if (domain === 'warehouse') onNavigateTab('quan-ly-kho');
                  else if (domain === 'maintenance') onNavigateTab('quan-ly-sua-chua');
                  else onNavigateTab('quan-ly-tai-lieu');
                }}
                className="px-3 py-2 bg-[#eef3fb] hover:bg-[#d8e3fa] text-[#005394] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Đến trang {domain === 'warehouse' ? 'Kho' : domain === 'maintenance' ? 'Sửa chữa' : 'Tài liệu'}</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#005394] hover:bg-[#004278] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

