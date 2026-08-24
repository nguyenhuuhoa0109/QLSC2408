import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Smartphone, 
  Monitor, 
  ChevronDown,
  X,
  Database
} from 'lucide-react';
import { User, PlantLocation } from '../types';

interface HeaderProps {
  user: User;
  currentPlant: PlantLocation;
  onPlantChange: (plant: PlantLocation) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pendingApprovalsCount: number;
  unreadNotificationsCount: number;
  onOpenApprovals: () => void;
  onOpenDatabaseStatus: () => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentPlant,
  onPlantChange,
  onLogout,
  searchQuery,
  onSearchChange,
  pendingApprovalsCount,
  unreadNotificationsCount,
  onOpenApprovals,
  onOpenDatabaseStatus,
  isMobilePreview,
  onToggleMobilePreview
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Cảnh báo tồn kho khẩn cấp',
      desc: 'Cảm biến nhiệt độ Pt100 chỉ còn 2 chiếc (mức an toàn: 10)',
      time: '10 phút trước',
      type: 'warning'
    },
    {
      id: 'n2',
      title: 'Phiếu yêu cầu nhập mới',
      desc: `${pendingApprovalsCount} phiếu chờ phê duyệt từ Ban Vận Hành`,
      time: '25 phút trước',
      type: 'info'
    },
    {
      id: 'n3',
      title: 'Phiếu xuất hoàn thành',
      desc: 'Xuất 2 bộ Bơm mỡ tự động cho tổ máy H1 thành công',
      time: '1 giờ trước',
      type: 'success'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-[#e7eeff]/90 backdrop-blur-md border-b border-[#c1c7d2]/30 flex items-center justify-between px-4 sm:px-6">
        {/* Left Section: Plant name & Search */}
        <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
          {/* Plant Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPlantDropdown(!showPlantDropdown)}
              className="flex items-center gap-1.5 text-left group cursor-pointer focus:outline-none"
              title="Nhấp để đổi nhà máy"
            >
              <h1 className="text-base sm:text-lg font-bold text-[#111c2c] tracking-tight group-hover:text-[#005394] transition-colors truncate max-w-[200px] sm:max-w-none">
                {currentPlant}
              </h1>
              <ChevronDown size={16} className="text-[#727782] group-hover:text-[#005394] transition-transform flex-shrink-0" />
            </button>

            {showPlantDropdown && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95">
                <p className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Chọn nhà máy / Chi nhánh
                </p>
                <button
                  onClick={() => {
                    onPlantChange('Nhà máy thủy điện Sơn Trà 1');
                    setShowPlantDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentPlant === 'Nhà máy thủy điện Sơn Trà 1' 
                      ? 'bg-[#eef3fb] text-[#005394]' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-[#005394]" />
                    <div>
                      <p>Nhà máy thủy điện Sơn Trà 1</p>
                      <p className="text-[10px] font-normal text-gray-500">Quảng Ngãi • Công suất 60MW</p>
                    </div>
                  </div>
                  {currentPlant === 'Nhà máy thủy điện Sơn Trà 1' && <CheckCircle size={14} className="text-[#005394]" />}
                </button>

                <button
                  onClick={() => {
                    onPlantChange('Hòa Bình Plant');
                    setShowPlantDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors mt-1 ${
                    currentPlant === 'Hòa Bình Plant' 
                      ? 'bg-[#eef3fb] text-[#005394]' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-[#3a5f94]" />
                    <div>
                      <p>Hòa Bình Plant</p>
                      <p className="text-[10px] font-normal text-gray-500">Hòa Bình • Chi nhánh vận hành</p>
                    </div>
                  </div>
                  {currentPlant === 'Hòa Bình Plant' && <CheckCircle size={14} className="text-[#005394]" />}
                </button>
              </div>
            )}
          </div>

          {/* Search Input (Desktop) matching Image 1 */}
          <div className="hidden md:flex relative w-72 lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727782]" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm thông số, thiết bị..."
              className="w-full bg-[#d8e3fa] border-none rounded-full pl-10 pr-4 py-1.5 text-xs sm:text-sm text-[#111c2c] placeholder:text-[#636c7a] focus:ring-2 focus:ring-[#005394]/30 focus:bg-white transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons & User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 hover:bg-[#dee8ff] text-[#414750] rounded-full transition-colors cursor-pointer"
            title="Tìm kiếm"
          >
            <Search size={19} />
          </button>

          {/* View Mode Toggle (Desktop Mode vs Mobile Preview) */}
          <button
            onClick={onToggleMobilePreview}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isMobilePreview 
                ? 'bg-[#005394] text-white shadow-xs' 
                : 'bg-white/70 hover:bg-white text-[#414750] border border-[#c1c7d2]/50'
            }`}
            title="Chuyển chế độ xem Mobile / Desktop"
          >
            {isMobilePreview ? (
              <>
                <Smartphone size={14} />
                <span>Khung Mobile</span>
              </>
            ) : (
              <>
                <Monitor size={14} />
                <span>Giao diện Desktop</span>
              </>
            )}
          </button>

          {/* Database Live Connection Status Button */}
          <button
            onClick={onOpenDatabaseStatus}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Trạng thái kết nối Supabase Cloud Database"
          >
            <Database size={14} className="text-emerald-600" />
            <span className="hidden sm:inline">Supabase DB</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-[#dee8ff] text-[#414750] rounded-full relative transition-colors cursor-pointer"
              title="Thông báo"
            >
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111c2c]">Thông báo hệ thống</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                      {unreadNotificationsCount} mới
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto mt-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                      <div className="flex items-start gap-2.5">
                        {n.type === 'warning' ? (
                          <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle size={16} className="text-[#005394] flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800">{n.title}</p>
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{n.desc}</p>
                          <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
                            <Clock size={10} /> {n.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onOpenApprovals();
                    }}
                    className="text-[#005394] font-semibold hover:underline"
                  >
                    Xem tất cả phiếu chờ duyệt
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 hover:bg-[#dee8ff] text-[#414750] rounded-full transition-colors cursor-pointer"
            title="Cài đặt hệ thống"
          >
            <Settings size={20} />
          </button>

          {/* Divider */}
          <div className="h-7 w-[1px] bg-[#c1c7d2] mx-1 hidden sm:block" />

          {/* User Profile Badge */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1 sm:pl-2 py-1 pr-1.5 rounded-full hover:bg-white/50 transition-colors cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-[#111c2c] leading-tight">{user.name}</div>
                <div className="text-[10px] text-[#414750] uppercase font-semibold tracking-wider">
                  {user.roleBadge}
                </div>
              </div>
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#a2c9ff]"
              />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-2 border-b border-gray-100 flex items-center gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#a2c9ff]"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-[#005394] font-medium">{user.role}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.department}</p>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs text-gray-700">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowSettingsModal(true);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  >
                    <Settings size={15} className="text-gray-500" />
                    <span>Cấu hình thông số trạm</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenApprovals();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle size={15} className="text-[#005394]" />
                      <span>Phiếu chờ duyệt</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-[#005394] font-bold rounded-full text-[10px]">
                      {pendingApprovalsCount}
                    </span>
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors"
                  >
                    <LogOut size={15} />
                    <span>Đăng xuất hệ thống</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Input Overlay */}
      {showMobileSearch && (
        <div className="md:hidden px-4 py-2.5 bg-[#e7eeff] border-b border-[#c1c7d2]/30 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727782]" size={16} />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm thông số, thiết bị..."
              className="w-full bg-[#d8e3fa] rounded-full pl-9 pr-8 py-2 text-xs text-[#111c2c] focus:outline-none focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-xs font-semibold text-[#005394] px-2 py-1"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-[#005394]" />
                <h3 className="text-base font-bold text-[#111c2c]">Cấu hình hệ thống quản trị</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Cụm nhà máy đang quản lý</label>
                <select 
                  value={currentPlant}
                  onChange={(e) => onPlantChange(e.target.value as PlantLocation)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
                >
                  <option value="Nhà máy thủy điện Sơn Trà 1">Nhà máy thủy điện Sơn Trà 1 (Quảng Ngãi)</option>
                  <option value="Hòa Bình Plant">Hòa Bình Plant (Hòa Bình)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ngưỡng cảnh báo tồn kho tối thiểu</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-[11px] font-bold text-red-800">Mức Cao (Khẩn cấp)</p>
                    <p className="text-xs text-red-700 mt-1">Dưới 20% định mức tồn</p>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-[11px] font-bold text-amber-800">Mức Trung bình</p>
                    <p className="text-xs text-amber-700 mt-1">Từ 20% - 50% định mức</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Đơn vị chủ quản & Kỹ thuật</label>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                  <strong>Công ty CP Thủy điện Sơn Trà Energy (DAT PHUONG GROUP)</strong><br />
                  Hệ thống SCADA / DCS & Quản lý bảo trì CMMS nội bộ.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-[#005394] hover:bg-[#004278] text-white rounded-xl font-bold text-xs"
              >
                Lưu cấu hình & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
