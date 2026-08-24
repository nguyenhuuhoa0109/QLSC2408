import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  FileText, 
  BarChart3, 
  Factory,
  CheckCircle2
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  plantName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, plantName }) => {
  const mainNavItems = [
    {
      id: 'tong-quan' as NavigationTab,
      label: 'Tổng quan',
      icon: LayoutDashboard,
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
      {/* Brand Header matching Image 1 */}
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-[#005394] rounded-xl flex items-center justify-center text-white shadow-xs">
          <Factory size={22} />
        </div>
        <div>
          <div className="text-lg font-bold text-[#005394] leading-tight">
            {plantName.includes('Sơn Trà') ? 'Sơn Trà 1' : 'Hòa Bình'}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-[#414750] font-bold">
            HỆ THỐNG QUẢN TRỊ
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {/* Top Active Tab: Tổng quan */}
        <button
          onClick={() => onSelectTab('tong-quan')}
          className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-all text-left font-medium cursor-pointer ${
            currentTab === 'tong-quan'
              ? 'bg-[#005394] text-white font-bold shadow-xs'
              : 'text-[#414750] hover:bg-[#dee8ff]/70 hover:text-[#111c2c]'
          }`}
        >
          <LayoutDashboard size={20} className="mr-3 flex-shrink-0" />
          <span className="text-sm">Tổng quan</span>
        </button>

        {/* Section Header: VẬN HÀNH & KỸ THUẬT */}
        <div className="pt-5 pb-1 px-4 text-[11px] font-bold uppercase tracking-wider text-[#727782]">
          VẬN HÀNH & KỸ THUẬT
        </div>

        {mainNavItems.slice(1).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-all text-left font-medium cursor-pointer ${
                isActive
                  ? 'bg-[#005394] text-white font-bold shadow-xs'
                  : 'text-[#414750] hover:bg-[#dee8ff]/70 hover:text-[#111c2c]'
              }`}
            >
              <Icon size={20} className="mr-3 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}

        {/* Section Header: HỆ THỐNG */}
        <div className="pt-5 pb-1 px-4 text-[11px] font-bold uppercase tracking-wider text-[#727782]">
          HỆ THỐNG
        </div>

        {systemNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-all text-left font-medium cursor-pointer ${
                isActive
                  ? 'bg-[#005394] text-white font-bold shadow-xs'
                  : 'text-[#414750] hover:bg-[#dee8ff]/70 hover:text-[#111c2c]'
              }`}
            >
              <Icon size={20} className="mr-3 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Plant Status */}
      <div className="p-4 m-4 bg-[#f0f3ff] rounded-xl border border-[#d8e3fa]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#005394]">
          <CheckCircle2 size={16} className="text-[#005394]" />
          <span>Hệ thống trực tuyến</span>
        </div>
        <p className="text-[11px] text-[#414750] mt-1">
          SCADA & Kho vật tư kết nối ổn định 24/7.
        </p>
      </div>
    </aside>
  );
};
