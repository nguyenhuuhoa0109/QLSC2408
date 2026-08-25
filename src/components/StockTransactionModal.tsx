import React, { useState } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Package, 
  User, 
  FileText,
  Building,
  Check
} from 'lucide-react';
import { InventoryItem, StockActivity } from '../types';

interface StockTransactionModalProps {
  type: 'import' | 'export';
  inventory: InventoryItem[];
  preselectedItem?: InventoryItem;
  onClose: () => void;
  onSubmit: (activity: StockActivity, updatedInventory: InventoryItem[]) => void;
}

export const StockTransactionModal: React.FC<StockTransactionModalProps> = ({
  type,
  inventory,
  preselectedItem,
  onClose,
  onSubmit
}) => {
  const isImport = type === 'import';
  const [selectedItemId, setSelectedItemId] = useState<string>(preselectedItem?.id || inventory[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [operatorName, setOperatorName] = useState('Nguyễn Văn A');
  const [notes, setNotes] = useState('');
  const [ticketCode, setTicketCode] = useState(
    `${isImport ? 'NK' : 'XK'}-2023-${new Date().getMonth() + 1}-${Math.floor(100 + Math.random() * 900)}`
  );

  const currentItem = inventory.find(i => i.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    const qty = Number(quantity);
    if (qty <= 0) return;

    if (!isImport && qty > currentItem.quantity) {
      alert(`Số lượng xuất (${qty}) không được vượt quá số lượng tồn kho hiện tại (${currentItem.quantity} ${currentItem.unit}).`);
      return;
    }

    const newQuantity = isImport ? currentItem.quantity + qty : currentItem.quantity - qty;
    const newStatus = 
      newQuantity <= currentItem.minQuantity 
        ? (newQuantity <= currentItem.minQuantity / 2 ? 'critical' : 'warning') 
        : 'normal';

    const updatedInventory = inventory.map(item => {
      if (item.id === currentItem.id) {
        return {
          ...item,
          quantity: newQuantity,
          status: newStatus,
          lastUpdated: 'Vừa xong'
        };
      }
      return item;
    });

    const newActivity: StockActivity = {
      id: `act-${Date.now()}`,
      time: 'Vừa xong',
      action: isImport ? 'Nhập kho' : 'Xuất kho',
      item: currentItem.name,
      itemCode: currentItem.code,
      quantity: qty,
      unit: currentItem.unit,
      user: {
        name: operatorName,
        initials: operatorName.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase() || 'KT',
        avatarColor: isImport ? 'bg-[#d5e3ff] text-[#001b3c]' : 'bg-[#d3e4ff] text-[#001c38]'
      },
      status: 'HOÀN THÀNH',
      dateLabel: 'Vừa xong',
      notes: notes || (isImport ? 'Nhập bổ sung kho thiết bị vận hành' : 'Xuất cấp cho tổ máy phục vụ sửa chữa định kỳ'),
      ticketCode,
    };

    onSubmit(newActivity, updatedInventory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isImport ? 'bg-blue-100 text-[#005394]' : 'bg-amber-100 text-amber-800'
            }`}>
              {isImport ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
            </div>
            <h3 className="text-base font-bold text-[#111c2c]">
              {isImport ? 'Lập Phiếu Nhập Kho' : 'Lập Phiếu Xuất Kho'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Mã phiếu giao dịch</label>
            <input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Chọn vật tư / Thiết bị *</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.code}] {item.name} (Tồn: {item.quantity} {item.unit})
                </option>
              ))}
            </select>
          </div>

          {currentItem && (
            <div className="p-2.5 bg-[#f0f4fa] rounded-xl text-[11px] text-gray-600 flex justify-between">
              <span>Định mức min: <strong>{currentItem.minQuantity} {currentItem.unit}</strong></span>
              <span>Vị trí: <strong>{currentItem.location}</strong></span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Số lượng {isImport ? 'nhập' : 'xuất'} *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Đơn vị tính</label>
              <input
                type="text"
                disabled
                value={currentItem?.unit || ''}
                className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Kỹ sư / Người thực hiện</label>
            <input
              type="text"
              required
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Lý do & Ghi chú sử dụng</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Cấp cho tổ máy H1 bảo dưỡng định kỳ..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#005394] hover:bg-[#004278] text-white rounded-xl font-bold flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Xác nhận {isImport ? 'Nhập kho' : 'Xuất kho'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
