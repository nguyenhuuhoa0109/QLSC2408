import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle, 
  FileSpreadsheet, 
  MapPin, 
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  Edit2,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';
import { InventoryItem } from '../types';

interface WarehouseScreenProps {
  inventory: InventoryItem[];
  onOpenNewTransaction: (type: 'import' | 'export', preselectedItem?: InventoryItem) => void;
  onAddNewItem: (item: InventoryItem) => void;
  onEditItem?: (item: InventoryItem) => void;
  onDeleteItem?: (itemId: string) => void;
}

export const WarehouseScreen: React.FC<WarehouseScreenProps> = ({
  inventory,
  onOpenNewTransaction,
  onAddNewItem,
  onEditItem,
  onDeleteItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'warning' | 'normal'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemCat, setNewItemCat] = useState<InventoryItem['category']>('Cơ khí');
  const [newItemQty, setNewItemQty] = useState<number>(10);
  const [newItemMin, setNewItemMin] = useState<number>(5);
  const [newItemMax, setNewItemMax] = useState<number>(50);
  const [newItemUnit, setNewItemUnit] = useState('bộ');
  const [newItemLoc, setNewItemLoc] = useState('Khu A - Kệ 01');
  const [newItemSpecs, setNewItemSpecs] = useState('');
  const [newItemSupplier, setNewItemSupplier] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number | undefined>(undefined);

  const categories = ['Cơ khí', 'Điện - Tự động hóa', 'Dầu mỡ nhờn', 'Vật tư tiêu hao', 'Cảm biến & Đo lường'];

  const filteredItems = inventory.filter((item) => {
    const matchSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.specs && item.specs.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemCode) return;

    const status: InventoryItem['status'] = 
      newItemQty <= newItemMin ? (newItemQty <= newItemMin / 2 ? 'critical' : 'warning') : 'normal';

    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      code: newItemCode,
      name: newItemName,
      category: newItemCat,
      quantity: Number(newItemQty),
      minQuantity: Number(newItemMin),
      maxQuantity: Number(newItemMax),
      unit: newItemUnit,
      location: newItemLoc,
      status,
      lastUpdated: 'Vừa xong',
      specs: newItemSpecs || undefined,
      supplier: newItemSupplier || undefined,
      pricePerUnit: newItemPrice ? Number(newItemPrice) : undefined
    };

    onAddNewItem(item);
    setShowAddModal(false);
    // Reset
    setNewItemName('');
    setNewItemCode('');
    setNewItemSpecs('');
    setNewItemSupplier('');
    setNewItemPrice(undefined);
  };

  const handleEditItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !onEditItem) return;

    const status: InventoryItem['status'] = 
      editingItem.quantity <= editingItem.minQuantity 
        ? (editingItem.quantity <= editingItem.minQuantity / 2 ? 'critical' : 'warning') 
        : 'normal';

    const updated: InventoryItem = {
      ...editingItem,
      status,
      lastUpdated: 'Hôm nay'
    };

    onEditItem(updated);
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete && onDeleteItem) {
      onDeleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Mã vật tư', 'Tên vật tư', 'Danh mục', 'Số lượng', 'Đơn vị', 'Tối thiểu', 'Vị trí', 'Trạng thái'];
    const rows = filteredItems.map(i => [
      i.code,
      `"${i.name}"`,
      i.category,
      i.quantity,
      i.unit,
      i.minQuantity,
      `"${i.location}"`,
      i.status === 'critical' ? 'Khẩn cấp' : i.status === 'warning' ? 'Cảnh báo' : 'Bình thường'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_muc_kho_sontra1_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-5 p-4 sm:p-6 bg-[#f9f9ff]">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111c2c] flex items-center gap-2">
            <Package className="text-[#005394]" size={22} />
            <span>Quản lý Kho Vật tư & Thiết bị Thủy điện</span>
          </h2>
          <p className="text-xs text-[#5e7087] mt-0.5">
            Tổng số: <strong className="text-[#005394]">{inventory.length}</strong> chủng loại vật tư lưu kho sẵn sàng vận hành
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#005394] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Xuất bảng kê Excel/CSV"
          >
            <FileSpreadsheet size={15} />
            <span>Xuất Excel</span>
          </button>
          
          <button
            onClick={() => onOpenNewTransaction('import')}
            className="px-3 py-2 bg-[#eef3fb] hover:bg-[#d8e3fa] text-[#005394] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowDownLeft size={15} />
            <span>Phiếu Nhập</span>
          </button>

          <button
            onClick={() => onOpenNewTransaction('export')}
            className="px-3 py-2 bg-[#eef3fb] hover:bg-[#d8e3fa] text-[#005394] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowUpRight size={15} />
            <span>Phiếu Xuất</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#005394] hover:bg-[#004278] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>Thêm vật tư</span>
          </button>
        </div>
      </div>

      {/* Filter & Category Toolbar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-[#e2eaf5] shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo mã, tên thiết bị, thông số, vị trí..."
              className="w-full pl-10 pr-4 py-2 bg-[#f0f4fa] rounded-xl text-xs sm:text-sm text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#005394]/20 border border-transparent focus:border-[#005394]"
            />
          </div>

          {/* Status Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#005394] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Tất cả ({inventory.length})
            </button>
            <button
              onClick={() => setStatusFilter('critical')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 flex items-center gap-1 cursor-pointer ${
                statusFilter === 'critical'
                  ? 'bg-[#ba1a1a] text-white'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              <AlertTriangle size={13} />
              <span>Khẩn cấp ({inventory.filter(i => i.status === 'critical').length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 flex items-center gap-1 cursor-pointer ${
                statusFilter === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              <span>Cảnh báo tồn ({inventory.filter(i => i.status === 'warning').length})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-gray-100 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex-shrink-0 cursor-pointer ${
              selectedCategory === 'all' ? 'bg-[#d8e3fa] text-[#005394] font-bold' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tất cả danh mục
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex-shrink-0 cursor-pointer ${
                selectedCategory === cat ? 'bg-[#d8e3fa] text-[#005394] font-bold' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#e2eaf5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#dee8ff]/50 text-[#414750] font-mono text-xs border-b border-[#e2eaf5]">
                <th className="py-3.5 px-4 font-bold">Mã VT</th>
                <th className="py-3.5 px-4 font-bold">Tên vật tư & Thông số</th>
                <th className="py-3.5 px-4 font-bold">Danh mục</th>
                <th className="py-3.5 px-4 font-bold text-center">Tồn / Định mức</th>
                <th className="py-3.5 px-4 font-bold">Vị trí</th>
                <th className="py-3.5 px-4 font-bold text-center">Trạng thái</th>
                <th className="py-3.5 px-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    Không có vật tư nào khớp với điều kiện tìm kiếm
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const percentage = Math.min(100, Math.round((item.quantity / item.maxQuantity) * 100));
                  return (
                    <tr key={item.id} className="hover:bg-[#f8faff] transition-colors group">
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#005394]">
                        {item.code}
                      </td>

                      {/* Name & Specs */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-gray-900 text-xs sm:text-[13px]">{item.name}</div>
                        {item.specs && (
                          <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            {item.specs}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">
                          {item.category}
                        </span>
                      </td>

                      {/* Quantity & Stock Level bar */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-sm text-gray-900">
                            {item.quantity} <span className="text-[11px] font-normal text-gray-500">{item.unit}</span>
                          </span>
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                item.status === 'critical' 
                                  ? 'bg-red-600' 
                                  : item.status === 'warning' 
                                  ? 'bg-amber-500' 
                                  : 'bg-[#005394]'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-gray-400 mt-0.5">
                            Min: {item.minQuantity} | Max: {item.maxQuantity}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {item.status === 'critical' ? (
                          <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full font-bold text-[10px] uppercase inline-flex items-center gap-1">
                            <AlertTriangle size={11} /> Khẩn cấp
                          </span>
                        ) : item.status === 'warning' ? (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] uppercase inline-flex items-center gap-1">
                            Cảnh báo tồn
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] uppercase inline-flex items-center gap-1">
                            <CheckCircle size={11} /> Đủ định mức
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenNewTransaction('import', item)}
                            className="p-1.5 bg-[#eef3fb] hover:bg-[#d8e3fa] text-[#005394] rounded-lg transition-colors cursor-pointer"
                            title="Nhập thêm vào kho"
                          >
                            <ArrowDownLeft size={15} />
                          </button>
                          <button
                            onClick={() => onOpenNewTransaction('export', item)}
                            className="p-1.5 bg-[#005394] hover:bg-[#004278] text-white rounded-lg transition-colors cursor-pointer"
                            title="Xuất kho thiết bị này"
                          >
                            <ArrowUpRight size={15} />
                          </button>
                          <button
                            onClick={() => setEditingItem({ ...item })}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors cursor-pointer"
                            title="Sửa thông tin vật tư"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Xóa vật tư khỏi hệ thống"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-base font-bold text-[#111c2c] flex items-center gap-2">
                <Plus className="text-[#005394]" size={18} />
                <span>Khai báo vật tư mới vào hệ thống</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mã vật tư *</label>
                  <input
                    type="text"
                    required
                    value={newItemCode}
                    onChange={(e) => setNewItemCode(e.target.value.toUpperCase())}
                    placeholder="VD: VB-SKF-7200"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Danh mục</label>
                  <select
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên vật tư / Thiết bị *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="VD: Vòng bi đũa đỡ trục tuabin"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Thông số kỹ thuật</label>
                <input
                  type="text"
                  value={newItemSpecs}
                  onChange={(e) => setNewItemSpecs(e.target.value)}
                  placeholder="VD: Kích thước d=120mm, D=260mm, B=55mm"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số lượng ban đầu</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Đơn vị tính</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="bộ / cái / mét"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tồn tối thiểu</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemMin}
                    onChange={(e) => setNewItemMin(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Vị trí lưu kho</label>
                <input
                  type="text"
                  value={newItemLoc}
                  onChange={(e) => setNewItemLoc(e.target.value)}
                  placeholder="VD: Khu A - Kệ 03 - Ngăn 2"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nhà cung cấp / Hãng sx</label>
                  <input
                    type="text"
                    value={newItemSupplier}
                    onChange={(e) => setNewItemSupplier(e.target.value)}
                    placeholder="VD: SKF Thụy Điển"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Đơn giá tham khảo (VNĐ)</label>
                  <input
                    type="number"
                    value={newItemPrice || ''}
                    onChange={(e) => setNewItemPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="VD: 15000000"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005394] hover:bg-[#004278] text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Lưu vào Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-base font-bold text-[#111c2c] flex items-center gap-2">
                <Edit2 className="text-amber-600" size={18} />
                <span>Chỉnh sửa thông tin vật tư</span>
              </h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditItemSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mã vật tư *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.code}
                    onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Danh mục</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên vật tư / Thiết bị *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Thông số kỹ thuật</label>
                <input
                  type="text"
                  value={editingItem.specs || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, specs: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số lượng hiện có</label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Đơn vị tính</label>
                  <input
                    type="text"
                    value={editingItem.unit}
                    onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tồn tối thiểu</label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.minQuantity}
                    onChange={(e) => setEditingItem({ ...editingItem, minQuantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Vị trí lưu kho</label>
                <input
                  type="text"
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nhà cung cấp / Hãng sx</label>
                  <input
                    type="text"
                    value={editingItem.supplier || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, supplier: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Đơn giá (VNĐ)</label>
                  <input
                    type="number"
                    value={editingItem.pricePerUnit || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, pricePerUnit: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Cập nhật thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Xác nhận xóa vật tư</h3>
                <p className="text-[11px] text-gray-500 font-mono">{itemToDelete.code}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa vật tư <strong className="text-gray-900">"{itemToDelete.name}"</strong> khỏi cơ sở dữ liệu Supabase không? Thao tác này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
