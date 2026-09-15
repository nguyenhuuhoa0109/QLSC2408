import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  X,
  Database,
  ShieldCheck,
  Home,
  ChevronRight
} from 'lucide-react';
import { User, PlantLocation, NavigationTab, WarehouseSubTab, MaintenanceSubTab } from '../types';

interface HeaderProps {
  user: User;
  currentPlant?: PlantLocation;
  onPlantChange?: (plant: PlantLocation) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pendingApprovalsCount: number;
  unreadNotificationsCount: number;
  onOpenApprovals: () => void;
  onOpenDatabaseStatus: () => void;
  isMobilePreview?: boolean;
  onToggleMobilePreview?: () => void;
  currentTab?: NavigationTab;
  onSelectTab?: (tab: NavigationTab) => void;
  warehouseSubTab?: WarehouseSubTab;
  onSelectWarehouseSubTab?: (subTab: WarehouseSubTab) => void;
  maintenanceSubTab?: MaintenanceSubTab;
  onSelectMaintenanceSubTab?: (subTab: MaintenanceSubTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  searchQuery,
  onSearchChange,
  pendingApprovalsCount,
  unreadNotificationsCount,
  onOpenApprovals,
  onOpenDatabaseStatus,
  currentTab = 'tong-quan',
  onSelectTab,
  warehouseSubTab = 'dashboard',
  onSelectWarehouseSubTab,
  maintenanceSubTab = 'dashboard',
  onSelectMaintenanceSubTab
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Dynamic hierarchical Breadcrumb construction
  interface BreadcrumbItem {
    id: string;
    label: string;
    icon?: React.ElementType;
    onClick?: () => void;
    isActive: boolean;
  }

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    // 1. Trang chủ is always the root item
    if (currentTab === 'tong-quan') {
      return [
        {
          id: 'home',
          label: 'Trang chủ',
          icon: Home,
          onClick: () => onSelectTab && onSelectTab('tong-quan'),
          isActive: true,
        }
      ];
    }

    const items: BreadcrumbItem[] = [
      {
        id: 'home',
        label: 'Trang chủ',
        icon: Home,
        onClick: () => onSelectTab && onSelectTab('tong-quan'),
        isActive: false,
      }
    ];

    if (currentTab === 'quan-ly-kho') {
      // Danh mục chính
      items.push({
        id: 'quan-ly-kho',
        label: 'Quản lý kho',
        onClick: () => {
          onSelectTab && onSelectTab('quan-ly-kho');
          onSelectWarehouseSubTab && onSelectWarehouseSubTab('dashboard');
        },
        isActive: false,
      });

      // Thư mục/Trang con hiện tại
      const subTabMap: Record<WarehouseSubTab, string> = {
        'dashboard': 'Dashboard',
        'danh-muc': 'Danh mục VT/TB',
        'nhap-xuat': 'Nhập xuất kho',
        'kiem-ke': 'Kiểm kê',
      };
      const subLabel = subTabMap[warehouseSubTab] || 'Dashboard';
      items.push({
        id: `wh-${warehouseSubTab}`,
        label: subLabel,
        onClick: () => onSelectWarehouseSubTab && onSelectWarehouseSubTab(warehouseSubTab),
        isActive: true,
      });
    } else if (currentTab === 'quan-ly-sua-chua') {
      // Danh mục chính
      items.push({
        id: 'quan-ly-sua-chua',
        label: 'Quản lý sửa chữa',
        onClick: () => {
          onSelectTab && onSelectTab('quan-ly-sua-chua');
          onSelectMaintenanceSubTab && onSelectMaintenanceSubTab('dashboard');
        },
        isActive: false,
      });

      // Thư mục/Trang con hiện tại
      const subTabMap: Record<MaintenanceSubTab, string> = {
        'dashboard': 'Dashboard',
        'danh-muc-he-thong': 'Danh mục hệ thống',
        'ke-hoach': 'Kế hoạch công tác',
        'dang-ky': 'Đăng ký công tác',
        'lich-su': 'Lịch sử sửa chữa',
      };
      const subLabel = subTabMap[maintenanceSubTab] || 'Dashboard';
      items.push({
        id: `mt-${maintenanceSubTab}`,
        label: subLabel,
        onClick: () => onSelectMaintenanceSubTab && onSelectMaintenanceSubTab(maintenanceSubTab),
        isActive: true,
      });
    } else if (currentTab === 'quan-ly-tai-lieu') {
      items.push({
        id: 'quan-ly-tai-lieu',
        label: 'Quản lý tài liệu',
        onClick: () => onSelectTab && onSelectTab('quan-ly-tai-lieu'),
        isActive: false,
      });
      items.push({
        id: 'tai-lieu-ho-so',
        label: 'Hồ sơ kỹ thuật & Quy trình',
        isActive: true,
      });
    } else if (currentTab === 'bao-cao') {
      items.push({
        id: 'bao-cao',
        label: 'Báo cáo',
        onClick: () => onSelectTab && onSelectTab('bao-cao'),
        isActive: false,
      });
      items.push({
        id: 'bao-cao-thong-ke',
        label: 'Thống kê & Phân tích',
        isActive: true,
      });
    } else if (currentTab === 'quan-ly-user') {
      items.push({
        id: 'he-thong',
        label: 'Hệ thống',
        onClick: () => onSelectTab && onSelectTab('quan-ly-user'),
        isActive: false,
      });
      items.push({
        id: 'quan-ly-user-sub',
        label: 'Quản lý người dùng',
        isActive: true,
      });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  // Check if role is Admin or User
  const isAdmin = 
    user.role?.toLowerCase().includes('admin') || 
    user.role?.toLowerCase().includes('quản trị') ||
    user.roleBadge?.toLowerCase().includes('admin') ||
    user.roleBadge?.toLowerCase().includes('quản trị');

  const roleDisplay = isAdmin ? 'ADMIN' : 'USER';

  // Format today's date in Vietnamese: "Thứ ..., ngày DD tháng MM năm YYYY"
  const getFormattedDate = () => {
    const now = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[now.getDay()];
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${dayName}, ngày ${day} tháng ${month} năm ${year}`;
  };

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
    <div className="flex flex-col w-full sticky top-0 z-40">
      {/* 1. TOP MAIN HEADER */}
      <header className="h-16 bg-[#e7eeff]/95 backdrop-blur-md border-b border-[#c1c7d2]/30 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
        {/* Left Section: Dynamic Breadcrumb Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 pr-3">
          <nav 
            aria-label="Breadcrumb" 
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 max-w-full scrollbar-none text-xs"
          >
            {breadcrumbs.map((item, index) => {
              const Icon = item.icon;

              return (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <ChevronRight 
                      size={14} 
                      className="text-[#8c939e] flex-shrink-0 mx-0.5 select-none" 
                      aria-hidden="true"
                    />
                  )}

                  {item.isActive ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 font-semibold border border-blue-100/80 shadow-2xs whitespace-nowrap"
                      aria-current="page"
                    >
                      {Icon && <Icon size={14} className="text-blue-600 flex-shrink-0" />}
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[#555e6d] hover:text-[#005394] hover:bg-white/80 transition-colors cursor-pointer font-medium whitespace-nowrap"
                      title={`Quay lại ${item.label}`}
                    >
                      {Icon && <Icon size={14} className="text-[#555e6d] flex-shrink-0" />}
                      <span>{item.label}</span>
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="lg:hidden p-2 hover:bg-[#dee8ff] text-[#414750] rounded-full transition-colors cursor-pointer"
            title="Tìm kiếm"
          >
            <Search size={18} />
          </button>

          {/* Database Live Connection Status Button */}
          <button
            onClick={onOpenDatabaseStatus}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Trạng thái kết nối Supabase Cloud Database"
          >
            <Database size={14} className="text-emerald-600" />
            <span className="hidden sm:inline">Supabase</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-[#dee8ff] text-[#414750] rounded-full relative transition-colors cursor-pointer"
              title="Thông báo"
            >
              <Bell size={19} />
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
            <Settings size={19} />
          </button>

          {/* Divider */}
          <div className="h-7 w-[1px] bg-[#c1c7d2] mx-1 hidden sm:block" />

          {/* User Profile Badge with Explicit Role (Admin / User) */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1 sm:pl-2 py-1 pr-1.5 rounded-full hover:bg-white/70 transition-colors cursor-pointer border border-transparent hover:border-blue-200"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-[#111c2c] leading-tight">{user.name}</div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                    isAdmin 
                      ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                      : 'bg-blue-100 text-[#005394] border border-blue-300'
                  }`}>
                    {roleDisplay}
                  </span>
                </div>
              </div>
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#005394]/30"
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
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email || user.username}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        isAdmin 
                          ? 'bg-purple-100 text-purple-800 font-bold' 
                          : 'bg-blue-100 text-[#005394] font-bold'
                      }`}>
                        Vai trò: {roleDisplay}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs text-gray-700">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onSelectTab) onSelectTab('quan-ly-user');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-[#005394] font-bold rounded-lg flex items-center gap-2"
                    >
                      <ShieldCheck size={15} className="text-[#005394]" />
                      <span>Quản lý người dùng (Admin)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowSettingsModal(true);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  >
                    <Settings size={14} className="text-gray-500" />
                    <span>Cài đặt tài khoản</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenApprovals();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-gray-500" />
                      <span>Phiếu chờ duyệt</span>
                    </div>
                    {pendingApprovalsCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                        {pendingApprovalsCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="lg:hidden p-3 bg-white border-b border-gray-200 shadow-md animate-in slide-in-from-top-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm vật tư, sửa chữa, tài liệu..."
              className="w-full bg-gray-100 border-none rounded-xl pl-9 pr-9 py-2 text-xs text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#005394]"
              autoFocus
            />
            <button
              onClick={() => {
                setShowMobileSearch(false);
                onSearchChange('');
              }}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-[#005394]" />
                <h3 className="font-bold text-base text-gray-900">Cài đặt hệ thống</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100/80">
                <p className="font-bold text-gray-800 mb-1">Thông tin phiên bản</p>
                <p>Hệ thống Quản lý Kỹ thuật & Vật tư Thủy điện Sơn Trà 1</p>
                <p className="text-[11px] text-gray-500 mt-1">Phiên bản: <strong>v2.4.0 (Enterprise)</strong></p>
                <p className="text-[11px] text-gray-500">Cơ sở dữ liệu: <strong>Supabase Cloud DB (Bảng User, Vật tư, Sửa chữa, Tài liệu)</strong></p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-800 mb-1">Tài khoản hiện tại</p>
                <p className="text-gray-700">Họ và tên: <strong>{user.name}</strong></p>
                <p className="text-gray-700">Email: <strong>{user.email || user.username}</strong></p>
                <p className="text-gray-700">Vai trò: <strong className="text-[#005394]">{roleDisplay}</strong> ({user.roleBadge})</p>
                <p className="text-gray-700">Phòng ban: <strong>{user.department}</strong></p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-[#005394] hover:bg-[#004278] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
