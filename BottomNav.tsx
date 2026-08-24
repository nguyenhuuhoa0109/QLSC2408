import React from 'react';
import { 
  Package, 
  Wrench, 
  FileText,
  LayoutDashboard
} from 'lucide-react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const items = [
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
      label: 'Sửa chữa',
      icon: Wrench,
    },
    {
      id: 'quan-ly-tai-lieu' as NavigationTab,
      label: 'Tài liệu',
      icon: FileText,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#e7eeff]/95 backdrop-blur-xl border-t border-[#c1c7d2]/40 shadow-[0_-2px_10px_rgba(0,51,102,0.06)] pb-safe select-none">
      <div className="flex justify-around items-center h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all cursor-pointer ${
                isActive 
                  ? 'text-[#005394] font-bold' 
                  : 'text-[#414750] hover:text-[#111c2c]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#d3e4ff]' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[11px] font-medium leading-tight text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
