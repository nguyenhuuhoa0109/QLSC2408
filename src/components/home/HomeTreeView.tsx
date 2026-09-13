import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  LayoutDashboard, 
  Package, 
  Wrench, 
  FileText, 
  AlertTriangle,
  Plus, 
  Search, 
  Layers, 
  Sparkles,
  X
} from 'lucide-react';
import { HomeTreeNode } from './homeTreeData';
import { InventoryItem, MaintenanceTask, TechnicalDocument } from '../../types';

interface HomeTreeViewProps {
  treeData: HomeTreeNode;
  selectedNodeId: string;
  inventory: InventoryItem[];
  maintenanceTasks: MaintenanceTask[];
  documents: TechnicalDocument[];
  onSelectNode: (node: HomeTreeNode) => void;
  onAddCustomFolder?: (parentId: string, folderName: string) => void;
}

export const HomeTreeView: React.FC<HomeTreeViewProps> = ({
  treeData,
  selectedNodeId,
  inventory,
  maintenanceTasks,
  documents,
  onSelectNode,
  onAddCustomFolder
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root-home': true,
    'node-home-warehouse': true,
    'node-home-warehouse-dashboard': true,
    'node-home-wh-all': true,
    'node-home-maintenance': true,
    'node-home-documents': true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [addingToParentId, setAddingToParentId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  // Toggle node expansion
  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Expand or Collapse All
  const handleExpandAll = (expand: boolean) => {
    const newExpanded: Record<string, boolean> = {};
    const traverse = (node: HomeTreeNode) => {
      newExpanded[node.id] = expand;
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    traverse(treeData);
    setExpandedNodes(newExpanded);
  };

  // Compute live counts
  const getNodeCount = (node: HomeTreeNode): number | string | null => {
    if (node.type === 'all') {
      return null;
    }
    if (node.type === 'warehouse-dashboard') {
      if (node.dashboardSubView === 'critical') {
        return inventory.filter(i => i.status === 'critical').length;
      }
      return inventory.length;
    }
    if (node.type === 'domain') {
      if (node.domain === 'warehouse') return inventory.length;
      if (node.domain === 'maintenance') return maintenanceTasks.length;
      if (node.domain === 'document') return documents.length;
    }
    if (node.type === 'warehouse-category' && node.categoryFilter) {
      return inventory.filter(i => i.category === node.categoryFilter).length;
    }
    if (node.type === 'maintenance-status' && node.statusFilter) {
      return maintenanceTasks.filter(t => t.status === node.statusFilter).length;
    }
    if (node.type === 'doc-category' && node.categoryFilter) {
      return documents.filter(d => d.category === node.categoryFilter).length;
    }
    return null;
  };

  // Select appropriate icon
  const renderNodeIcon = (node: HomeTreeNode, isExpanded: boolean, isSelected: boolean) => {
    if (node.type === 'all') {
      return <Layers size={15} className={isSelected ? 'text-[#005394]' : 'text-blue-600'} />;
    }
    if (node.type === 'warehouse-dashboard') {
      return <LayoutDashboard size={15} className={isSelected ? 'text-[#005394]' : 'text-emerald-600'} />;
    }
    if (node.domain === 'warehouse' || node.type === 'warehouse-category') {
      return isExpanded 
        ? <FolderOpen size={15} className={isSelected ? 'text-[#005394]' : 'text-[#005394]/80'} />
        : <Package size={15} className={isSelected ? 'text-[#005394]' : 'text-blue-500'} />;
    }
    if (node.domain === 'maintenance' || node.type === 'maintenance-status') {
      return <Wrench size={15} className={isSelected ? 'text-[#005394]' : 'text-amber-600'} />;
    }
    if (node.domain === 'document' || node.type === 'doc-category') {
      return <FileText size={15} className={isSelected ? 'text-[#005394]' : 'text-purple-600'} />;
    }
    return isExpanded 
      ? <FolderOpen size={15} className="text-gray-500" />
      : <Folder size={15} className="text-gray-400" />;
  };

  // Submit custom folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (addingToParentId && newFolderName.trim()) {
      if (onAddCustomFolder) {
        onAddCustomFolder(addingToParentId, newFolderName.trim());
      }
      setExpandedNodes(prev => ({ ...prev, [addingToParentId]: true }));
      setNewFolderName('');
      setAddingToParentId(null);
    }
  };

  // Render individual tree item recursively
  const renderTreeNode = (node: HomeTreeNode, depth = 0) => {
    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNodeId === node.id;
    const count = getNodeCount(node);

    // Search query matching
    const matchesSearch = !searchQuery || node.name.toLowerCase().includes(searchQuery.toLowerCase());
    const hasMatchingDescendant = (n: HomeTreeNode): boolean => {
      if (n.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
      if (n.children) return n.children.some(hasMatchingDescendant);
      return false;
    };
    if (searchQuery && !matchesSearch && !hasMatchingDescendant(node)) {
      return null;
    }

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => onSelectNode(node)}
          style={{ paddingLeft: `${Math.max(depth * 14 + 6, 6)}px` }}
          className={`group flex items-center justify-between py-1.5 pr-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
            isSelected
              ? 'bg-[#005394] text-white font-bold shadow-xs'
              : 'text-gray-700 hover:bg-[#f0f4fa] hover:text-[#005394]'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {/* Expand / Collapse Chevron */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className={`p-0.5 rounded-md hover:bg-black/10 transition-colors flex-shrink-0 ${
                  isSelected ? 'text-white' : 'text-gray-400'
                }`}
              >
                {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
            ) : (
              <span className="w-4 flex-shrink-0" />
            )}

            {/* Folder / File Icon */}
            <span className="flex-shrink-0">
              {renderNodeIcon(node, isExpanded, isSelected)}
            </span>

            {/* Node Name */}
            <span className="truncate flex-1 tracking-tight">
              {node.name}
            </span>
          </div>

          {/* Right badges & Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-1.5">
            {node.type === 'warehouse-dashboard' && !node.dashboardSubView && (
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Live
              </span>
            )}

            {count !== null && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-gray-100 group-hover:bg-white text-gray-600'
                }`}
              >
                {count}
              </span>
            )}

            {/* Quick Add Subfolder button */}
            {hasChildren && onAddCustomFolder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddingToParentId(node.id);
                  setNewFolderName('');
                }}
                title="Thêm thư mục con"
                className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/10 transition-all ${
                  isSelected ? 'text-white' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                <Plus size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Inline Add Custom Folder Input */}
        {addingToParentId === node.id && (
          <form
            onSubmit={handleCreateFolder}
            style={{ paddingLeft: `${(depth + 1) * 14 + 10}px` }}
            className="py-1.5 pr-2 flex items-center gap-1.5 bg-blue-50/70 rounded-xl my-0.5"
          >
            <Folder size={13} className="text-[#005394] flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Tên thư mục con mới..."
              className="flex-1 text-xs px-2 py-1 bg-white border border-[#005394] rounded-md outline-none"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-[#005394] text-white rounded text-[11px] font-bold"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setAddingToParentId(null)}
              className="p-1 text-gray-500 hover:text-gray-800"
            >
              <X size={12} />
            </button>
          </form>
        )}

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {/* Subtle guide line */}
            <div 
              className="absolute left-0 top-0 bottom-1 w-px bg-gray-200/80" 
              style={{ left: `${depth * 14 + 13}px` }}
            />
            <div className="flex flex-col gap-0.5">
              {node.children!.map((child) => renderTreeNode(child, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e2eaf5] shadow-xs p-3.5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#e7eeff] text-[#005394] flex items-center justify-center font-bold">
            <FolderOpen size={15} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Danh mục cây hệ thống
            </h3>
            <p className="text-[10px] text-gray-500">Phân cấp thư mục & Lọc nhanh</p>
          </div>
        </div>

        {/* Expand / Collapse All */}
        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => handleExpandAll(true)}
            className="px-1.5 py-0.5 text-gray-500 hover:text-[#005394] hover:bg-gray-100 rounded text-[10px] font-semibold transition-colors cursor-pointer"
            title="Mở tất cả"
          >
            Mở hết
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => handleExpandAll(false)}
            className="px-1.5 py-0.5 text-gray-500 hover:text-[#005394] hover:bg-gray-100 rounded text-[10px] font-semibold transition-colors cursor-pointer"
            title="Thu gọn"
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm thư mục, kho, dashboard..."
          className="w-full pl-7 pr-3 py-1.5 bg-[#f0f4fa] rounded-xl text-xs text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:ring-1 focus:ring-[#005394] border border-transparent focus:border-[#005394] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Tree Content */}
      <div className="flex flex-col gap-0.5 max-h-[620px] overflow-y-auto pr-1">
        {renderTreeNode(treeData, 0)}
      </div>

      {/* Tree Footer / Quick Tip */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <Sparkles size={11} className="text-amber-500" />
          <span>Click thư mục để lọc dữ liệu tương ứng</span>
        </span>
      </div>
    </div>
  );
};
