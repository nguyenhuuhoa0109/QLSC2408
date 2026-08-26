import React from 'react';
import { 
  Home, 
  Package, 
  Wrench, 
  FileText, 
  BarChart3, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { NavigationTab, User } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  plantName: string;
  user?: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, plantName, user }) => {
  const isAdmin = 
    user?.role?.toLowerCase().includes('admin') || 
    user?.role?.toLowerCase().includes('quản trị') ||
    user?.roleBadge?.toLowerCase().includes('admin') ||
    user?.roleBadge?.toLowerCase().includes('quản trị');

  const mainNavItems = [
    {
      id: 'tong-quan' as NavigationTab,
      label: 'Trang chủ',
      icon: Home,
    },
    {
      id: 'quan-ly-kho' as NavigationTab,
      label: 'Quản lý kho',
      icon: Package,
    },
    {
      id: 'quan-ly-sua-chua' as NavigationTab,
      label: 'Quản lý sửa chữa',
      icon: Wrench,
    },
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
            {user?.name || (plantName.includes('Sơn Trà') ? 'Sơn Trà 1' : 'Hòa Bình')}
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

        {mainNavItems.slice(1).map((item) => {
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
