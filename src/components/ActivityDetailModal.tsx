import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle, 
  Clock, 
  FileText, 
  User, 
  Package, 
  Building2 
} from 'lucide-react';
import { StockActivity, PlantLocation } from '../types';

interface ActivityDetailModalProps {
  activity: StockActivity;
  plantName: PlantLocation;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  plantName,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 flex flex-col space-y-4">
        
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#005394] bg-[#eef3fb] px-2.5 py-1 rounded-lg">
              {activity.ticketCode || 'XK-2023-08-01'}
            </span>
            <span className="text-xs font-bold text-gray-500 uppercase">
              Chi tiết chứng từ kho
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Slip content */}
        <div className="space-y-3.5 text-xs text-gray-700">
          <div className="text-center py-1">
            <h3 className="text-base font-extrabold text-[#002b55] uppercase">
              {activity.action === 'Xuất kho' ? 'PHIẾU XUẤT KHO VẬT TƯ' : 'PHIẾU NHẬP KHO THIẾT BỊ'}
            </h3>
            <p className="text-[11px] text-gray-500">{plantName}</p>
          </div>

          <div className="bg-[#f0f4fa] p-3.5 rounded-2xl space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Thời gian thực hiện:</span>
              <strong className="text-gray-900 font-mono">{activity.time}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tên vật tư / Thiết bị:</span>
              <strong className="text-[#005394]">{activity.item}</strong>
            </div>
            {activity.quantity && (
              <div className="flex justify-between">
                <span className="text-gray-500">Số lượng:</span>
                <strong className="text-gray-900">{activity.quantity} {activity.unit || 'đơn vị'}</strong>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Người phụ trách:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900">{activity.user.name}</span>
                <span className={`w-5 h-5 rounded-full ${activity.user.avatarColor} text-[9px] font-bold flex items-center justify-center`}>
                  {activity.user.initials}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Trạng thái:</span>
              <span className="px-2 py-0.5 bg-white text-[#005394] font-bold rounded-md text-[10px]">
                {activity.status}
              </span>
            </div>
          </div>

          {activity.notes && (
            <div>
              <span className="font-bold text-gray-800 block mb-1">Ghi chú vận hành:</span>
              <p className="p-3 bg-gray-50 rounded-xl text-gray-600 leading-relaxed border border-gray-100">
                {activity.notes}
              </p>
            </div>
          )}

          {/* Signatures block */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-center text-[11px]">
            <div>
              <p className="font-bold text-gray-700">Người lập phiếu</p>
              <p className="text-gray-400 italic text-[10px] mt-0.5">(Ký, họ tên)</p>
              <div className="h-10 flex items-center justify-center text-[#005394] font-serif italic">
                {activity.user.name}
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-700">Thủ kho / Trưởng ca</p>
              <p className="text-gray-400 italic text-[10px] mt-0.5">(Đã xác nhận điện tử)</p>
              <div className="h-10 flex items-center justify-center text-emerald-600 font-serif italic text-xs font-semibold">
                ✓ Đã ký duyệt
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={14} />
            <span>In phiếu</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#005394] hover:bg-[#004278] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
