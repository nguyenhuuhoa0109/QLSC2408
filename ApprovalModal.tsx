import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Building, 
  User, 
  FileText,
  Check
} from 'lucide-react';
import { ApprovalTicket } from '../types';

interface ApprovalModalProps {
  tickets: ApprovalTicket[];
  onClose: () => void;
  onApproveTicket: (ticketId: string) => void;
  onRejectTicket: (ticketId: string) => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  tickets,
  onClose,
  onApproveTicket,
  onRejectTicket
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const pendingTickets = tickets.filter(t => t.status === 'pending');
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || pendingTickets[0];

  const handleApprove = (id: string) => {
    onApproveTicket(id);
    setActionSuccess('Đã phê duyệt thành công phiếu!');
    setTimeout(() => setActionSuccess(null), 2500);
  };

  const handleReject = (id: string) => {
    onRejectTicket(id);
    setActionSuccess('Đã từ chối phiếu yêu cầu.');
    setTimeout(() => setActionSuccess(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#e7eeff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#005394] text-white flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#111c2c]">
                Trung tâm Phê duyệt Phiếu Vật tư & Xuất Nhập
              </h2>
              <p className="text-xs text-[#414750]">
                Còn <strong>{pendingTickets.length}</strong> phiếu đang chờ Ban Giám đốc & Trưởng ca duyệt
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {actionSuccess && (
          <div className="px-5 py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border-b border-emerald-100">
            <Check size={16} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Content Body: Split list + detail */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Left Column: Tickets list */}
          <div className="overflow-y-auto p-3 space-y-2 max-h-48 md:max-h-none">
            {tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border text-xs ${
                    isSelected
                      ? 'bg-[#eef3fb] border-[#005394] shadow-xs'
                      : 'hover:bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-mono font-bold text-[#005394] text-[11px]">{t.ticketCode}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      t.priority === 'Cao' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 line-clamp-1 mt-1">{t.title}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                    <span>{t.requester}</span>
                    <span>{t.status === 'pending' ? 'Chờ duyệt' : t.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Ticket Details */}
          <div className="md:col-span-2 p-5 overflow-y-auto flex flex-col justify-between space-y-4">
            {selectedTicket ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#005394] bg-[#eef3fb] px-2.5 py-1 rounded-lg">
                      Mã phiếu: {selectedTicket.ticketCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Độ ưu tiên: {selectedTicket.priority}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#111c2c] mt-2">
                    {selectedTicket.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-gray-50 rounded-xl text-gray-600">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Người tạo yêu cầu</span>
                      <strong className="text-gray-800 text-xs">{selectedTicket.requester}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Đơn vị / Bộ phận</span>
                      <strong className="text-gray-800 text-xs">{selectedTicket.department}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Thời gian lập phiếu</span>
                      <span className="text-gray-800 text-xs font-mono">{selectedTicket.date}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Trạng thái</span>
                      <span className={`font-bold text-xs ${
                        selectedTicket.status === 'pending' ? 'text-amber-600' : selectedTicket.status === 'approved' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {selectedTicket.status === 'pending' ? 'Chờ phê duyệt' : selectedTicket.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-1.5">Lý do & Căn cứ kỹ thuật:</h4>
                  <p className="p-3 bg-[#f0f4fa] text-[#223b56] rounded-xl leading-relaxed">
                    {selectedTicket.reason}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-1.5">Danh mục vật tư trong phiếu:</h4>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 font-mono text-[11px]">
                        <tr>
                          <th className="p-2.5">Tên vật tư</th>
                          <th className="p-2.5 text-center">Số lượng</th>
                          <th className="p-2.5 text-right">Dự toán</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedTicket.items.map((it, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-2.5 font-medium text-gray-800">
                              <div>{it.name}</div>
                              <span className="text-[10px] font-mono text-gray-400">{it.code}</span>
                            </td>
                            <td className="p-2.5 text-center font-bold text-[#005394]">
                              {it.quantity} {it.unit}
                            </td>
                            <td className="p-2.5 text-right font-mono text-gray-700">
                              {it.estimatedCost || 'Theo định mức'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                  {selectedTicket.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleReject(selectedTicket.id)}
                        className="px-4 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Từ chối yêu cầu
                      </button>
                      <button
                        onClick={() => handleApprove(selectedTicket.id)}
                        className="px-5 py-2 bg-[#005394] hover:bg-[#004278] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle size={15} />
                        <span>Phê duyệt phiếu này</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium italic">
                      Phiếu này đã được xử lý ({selectedTicket.status === 'approved' ? 'Phê duyệt' : 'Từ chối'}).
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs">
                Chọn một phiếu trong danh sách bên trái để xem chi tiết
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
