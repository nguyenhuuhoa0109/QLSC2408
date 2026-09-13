import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Package, 
  Wrench, 
  FileText, 
  BarChart3, 
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  ClipboardCheck,
  Cpu,
  CalendarCheck,
  FileEdit,
  History
} from 'lucide-react';
import { NavigationTab, User, WarehouseSubTab, MaintenanceSubTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab, warehouseSubTab?: WarehouseSubTab, maintenanceSubTab?: MaintenanceSubTab) => void;
  plantName: string;
  user?: User;
  currentWarehouseSubTab?: WarehouseSubTab;
  onSelectWarehouseSubTab?: (subTab: WarehouseSubTab) => void;
  currentMaintenanceSubTab?: MaintenanceSubTab;
  onSelectMaintenanceSubTab?: (subTab: MaintenanceSubTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  plantName, 
  user,
  currentWarehouseSubTab = 'dashboard',
  onSelectWarehouseSubTab,
  currentMaintenanceSubTab = 'dashboard',
  onSelectMaintenanceSubTab
}) => {
  const [isWarehouseExpanded, setIsWarehouseExpanded] = useState<boolean>(true);
  const [isMaintenanceExpanded, setIsMaintenanceExpanded] = useState<boolean>(true);

  // Auto-expand sections if active
  useEffect(() => {
    if (currentTab === 'quan-ly-kho') {
      setIsWarehouseExpanded(true);
    } else if (currentTab === 'quan-ly-sua-chua') {
      setIsMaintenanceExpanded(true);
    }
  }, [currentTab]);

  const isAdmin = 
    user?.role?.toLowerCase().includes('admin') || 
    user?.role?.toLowerCase().includes('quản trị') ||
    user?.roleBadge?.toLowerCase().includes('admin') ||
    user?.roleBadge?.toLowerCase().includes('quản trị');

  // 4 Subfolders for Quản lý kho as requested by user
  const warehouseSubItems: Array<{
    id: WarehouseSubTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'KPI',
    },
    {
      id: 'danh-muc',
      label: 'Danh mục VT/TB',
      icon: Boxes,
    },
    {
      id: 'nhap-xuat',
      label: 'Nhập xuất kho',
      icon: ArrowLeftRight,
    },
    {
      id: 'kiem-ke',
      label: 'Kiểm kê',
      icon: ClipboardCheck,
      badge: 'Định kỳ',
    },
  ];

  // 5 Subfolders for Quản lý sửa chữa as requested by user: Dashboard, Danh mục hệ thống, Kế hoạch công tác, Đăng ký công tác, Lịch sử sửa chữa
  const maintenanceSubItems: Array<{
    id: MaintenanceSubTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'KPI',
    },
    {
      id: 'danh-muc-he-thong',
      label: 'Danh mục hệ thống',
      icon: Cpu,
    },
    {
      id: 'ke-hoach',
      label: 'Kế hoạch công tác',
      icon: CalendarCheck,
      badge: 'Lịch',
    },
    {
      id: 'dang-ky',
      label: 'Đăng ký công tác',
      icon: FileEdit,
      badge: 'Phiếu',
    },
    {
      id: 'lich-su',
      label: 'Lịch sử sửa chữa',
      icon: History,
    },
  ];

  const otherNavItems = [
    {
      id: 'quan-ly-tai-lieu' as NavigationTab,
      label: 'Quản lý tài liệu',
      icon: FileText,
    },
  ];

  const systemNavItems = [
    {
      id: 'bao-cao' as NavigationTab,
      label: 'Báo cáo thống kê',
      icon: BarChart3,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white z-50 flex flex-col shadow-[1px_0_12px_rgba(0,0,0,0.03)] border-r border-[#c1c7d2]/30 select-none">
      {/* User / Plant Info Header */}
      <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-gray-100/80 mb-2">
        <div className="w-11 h-11 bg-[#005394] rounded-xl flex items-center justify-center text-white shadow-xs overflow-hidden flex-shrink-0 border border-blue-200">
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="font-bold text-sm text-white">
              {user?.initials || 'DP'}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-[#005394] leading-tight truncate">
            HỆ THỐNG QUẢN LÝ NỘI BỘ
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
              isAdmin 
                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                : 'bg-blue-100 text-[#005394] border border-blue-200'
            }`}>
              {isAdmin ? 'ADMIN' : 'USER'}
            </span>
            <span className="text-[10px] text-gray-500 truncate">
              {user?.department || 'Kỹ thuật'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {/* Top Active Tab: Trang chủ */}
        <button
          onClick={() => onSelectTab('tong-quan')}
          className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-left font-medium cursor-pointer ${
            currentTab === 'tong-quan'
              ? 'bg-[#005394] text-white font-bold shadow-xs'
              : 'text-[#414750] hover:bg-[#dee8ff]/70 hover:text-[#111c2c]'
          }`}
        >
          <Home size={19} className="mr-3 flex-shrink-0" />
          <span className="text-sm">Trang chủ</span>
        </button>

        {/* Section Header: QUẢN LÝ NGHIỆP VỤ */}
        <div className="pt-5 pb-1 px-4 text-[11px] font-bold uppercase tracking-wider text-[#727782]">
          QUẢN LÝ NGHIỆP VỤ
        </div>

        {/* QUẢN LÝ KHO (CHA) VỚI 4 THƯ MỤC CON XỔ RA */}
        <div className="flex flex-col">
          <div
            onClick={() => {
              onSelectTab('quan-ly-kho', currentWarehouseSubTab);
              setIsWarehouseExpanded(prev => !prev);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all font-medium cursor-pointer ${
              currentTab === 'quan-ly-kho'
                ? 'bg-[#005394] text-white font-bold shadow-xs'
                : 'text-[#414750] hover:bg-[#dee8ff]/70 hover:text-[#111c2c]'
            }`}
          >
            <div className="flex items-center min-w-0">
              <Package size={19} className="mr-3 flex-shrink-0" />
              <span className="text-sm truncate">Quản lý kho</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsWarehouseExpanded(prev => !prev);
              }}
              className={`p-1 rounded-md hover:bg-black/10 transition-transform ${
                currentTab === 'quan-ly-kho' ? 'text-white' : 'text-gray-400'
              }`}
              title={isWarehouseExpanded ? 'Thu gọn danh mục kho' : 'Xổ ra 4 thư mục con'}
            >
              {isWarehouseExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* 4 THƯ MỤC CON XỔ RA: Dashboard, Danh mục VT/TB, Nhập xuất kho, Kiểm kê */}
          {isWarehouseExpanded && (
            <div className="mt-1 ml-4 pl-3 border-l-2 border-[#005394]/25 flex flex-col space-y-1 py-1">
              {warehouseSubItems.map((sub) => {
                const isSubActive = currentTab === 'quan-ly-kho' && currentWarehouseSubTab === sub.id;
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTab('quan-ly-kho', sub.id);
                      if (onSelectWarehouseSubTab) {
                        onSelectWarehouseSubTab(sub.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer group ${
                      isSubActive
                        ? 'bg-[#eef3fb] text-[#005394] font-bold shadow-2xs border-l-2 border-[#005394]'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-[#005394]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <SubIcon 
                        size={15} 
                        className={isSubActive ? 'text-[#005394]' : 'text-gray-400 group-hover:text-[#005394]'} 
                      />
                      <span className="truncate">{sub.label}</span>
                    </div>

                    {sub.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold tracking-tight ${
                        isSubActive 
                          ? 'bg-[#005394] text-white' 
                          : 'bg-gray-200/70 group-hover:bg-blue-100 text-gray-600 group-hover:text-[#005394]'
                      }`}>
                        {sub.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* QUẢN LÝ SỬA CHỮA (CHA) VỚI 5 THƯ MỤC CON XỔ RA */}
        <div className="flex flex-col">
          <div
            onClick={() => {
              onSelectTab('quan-ly-sua-chua', undefined, currentMaintenanceSubTab);
              setIsMaintenanceExpanded(prev => !prev);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all font-medium cursor-pointer ${
              currentTab === 'quan-ly-sua-chua'
                ? 'bg-[#005394] text-white font-bold shadow-xs'
                : 'text-[#414750] hover:bg-[#dee8ff]/70 hover:text-[#111c2c]'
            }`}
          >
            <div className="flex items-center min-w-0">
              <Wrench size={19} className="mr-3 flex-shrink-0" />
              <span className="text-sm truncate">Quản lý sửa chữa</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMaintenanceExpanded(prev => !prev);
              }}
              className={`p-1 rounded-md hover:bg-black/10 transition-transform ${
                currentTab === 'quan-ly-sua-chua' ? 'text-white' : 'text-gray-400'
              }`}
              title={isMaintenanceExpanded ? 'Thu gọn danh mục sửa chữa' : 'Xổ ra 5 thư mục con'}
            >
              {isMaintenanceExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* 5 THƯ MỤC CON XỔ RA: Dashboard, Danh mục hệ thống, Kế hoạch công tác, Đăng ký công tác, Lịch sử sửa chữa */}
          {isMaintenanceExpanded && (
            <div className="mt-1 ml-4 pl-3 border-l-2 border-[#005394]/25 flex flex-col space-y-1 py-1">
              {maintenanceSubItems.map((sub) => {
                const isSubActive = currentTab === 'quan-ly-sua-chua' && currentMaintenanceSubTab === sub.id;
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTab('quan-ly-sua-chua', undefined, sub.id);
                      if (onSelectMaintenanceSubTab) {
                        onSelectMaintenanceSubTab(sub.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer group ${
                      isSubActive
                        ? 'bg-[#eef3fb] text-[#005394] font-bold shadow-2xs border-l-2 border-[#005394]'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-[#005394]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <SubIcon 
                        size={15} 
                        className={isSubActive ? 'text-[#005394]' : 'text-gray-400 group-hover:text-[#005394]'} 
                      />
                      <span className="truncate">{sub.label}</span>
                    </div>

                    {sub.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold tracking-tight ${
                        isSubActive 
                          ? 'bg-[#005394] text-white' 
                          : 'bg-gray-200/70 group-hover:bg-blue-100 text-gray-600 group-hover:text-[#005394]'
                      }`}>
                        {sub.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* CÁC MỤC NGHIỆP VỤ KHÁC: TÀI LIỆU */}
        {otherNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-left font-medium cursor-pointer ${
                isActive
                  ? 'bg-[#005394] text-white font-bold shadow-xs'
                  : 'text-[#414750] hover:bg-[#dee8ff]/70 hover:text-[#111c2c]'
              }`}
            >
              <Icon size={19} className="mr-3 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}

        {/* Section Header: HỆ THỐNG */}
        <div className="pt-5 pb-1 px-4 text-[11px] font-bold uppercase tracking-wider text-[#727782]">
          BÁO CÁO & THỐNG KÊ
        </div>

        {systemNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-left font-medium cursor-pointer ${
                isActive
                  ? 'bg-[#005394] text-white font-bold shadow-xs'
                  : 'text-[#414750] hover:bg-[#dee8ff]/70 hover:text-[#111c2c]'
              }`}
            >
              <Icon size={19} className="mr-3 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}

        {/* Section Header & Tab: QUẢN TRỊ VIÊN (ADMIN) */}
        {isAdmin && (
          <>
            <div className="pt-5 pb-1 px-4 text-[11px] font-bold uppercase tracking-wider text-[#005394] flex items-center justify-between">
              <span>QUẢN TRỊ HỆ THỐNG</span>
              <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded text-[9px] font-bold">ADMIN</span>
            </div>

            <button
              onClick={() => onSelectTab('quan-ly-user')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-left font-medium cursor-pointer ${
                currentTab === 'quan-ly-user'
                  ? 'bg-purple-700 text-white font-bold shadow-xs'
                  : 'text-[#414750] hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <ShieldCheck size={19} className="mr-3 flex-shrink-0" />
              <span className="text-sm">Quản lý người dùng</span>
            </button>
          </>
        )}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-100 text-[11px] text-gray-500 bg-[#f8faff]">
        <div className="flex items-center gap-1.5 font-bold text-gray-700">
          <Building2 size={13} className="text-[#005394]" />
          <span className="truncate">{plantName}</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Phiên bản v2.4.0 • Enterprise</p>
      </div>
    </aside>
  );
};

