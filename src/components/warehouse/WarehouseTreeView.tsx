import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  LayoutDashboard, 
  Boxes, 
  BarChart3, 
  AlertTriangle, 
  DollarSign, 
  Plus, 
  Search, 
  ChevronsDown, 
  ChevronsUp,
  FolderPlus,
  Layers,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { WarehouseTreeNode } from './warehouseTreeData';
import { InventoryItem } from '../../types';

interface WarehouseTreeViewProps {
  treeData: WarehouseTreeNode;
  selectedNodeId: string;
  inventory: InventoryItem[];
  onSelectNode: (node: WarehouseTreeNode) => void;
  onAddCustomFolder?: (parentId: string, folderName: string) => void;
}

export const WarehouseTreeView: React.FC<WarehouseTreeViewProps> = ({
  treeData,
  selectedNodeId,
  inventory,
  onSelectNode,
  onAddCustomFolder
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root-warehouse': true,
    'node-dashboard': true,
    'cat-cokhi': true,
    'cat-dien': true,
    'cat-cambien': false,
    'cat-daumo': false,
    'cat-tieuhao': false,
  });
  const [treeSearch, setTreeSearch] = useState('');
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string>('cat-cokhi');
  const [newFolderName, setNewFolderName] = useState('');

  // Toggle expand/collapse
  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const expandAll = () => {
    const allIds: Record<string, boolean> = {};
    const traverse = (node: WarehouseTreeNode) => {
      allIds[node.id] = true;
      if (node.children) node.children.forEach(traverse);
    };
    traverse(treeData);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes({ 'root-warehouse': true });
  };

  // Helper to calculate item count for each node
  const getNodeItemCount = (node: WarehouseTreeNode): number => {
    if (node.type === 'dashboard') {
      if (node.dashboardSubView === 'critical') {
        return inventory.filter(i => i.status === 'critical' || i.status === 'warning').length;
      }
      return inventory.length;
    }
    if (node.type === 'all') {
      return inventory.length;
    }
    if (node.type === 'category' && node.categoryFilter) {
      return inventory.filter(i => i.category === node.categoryFilter).length;
    }
    if (node.type === 'subcategory') {
      if (!node.subFilterKeyword) {
        return inventory.filter(i => i.category === node.categoryFilter).length;
      }
      const keywords = node.subFilterKeyword.toLowerCase().split(',');
      return inventory.filter(i => {
        const matchCat = !node.categoryFilter || i.category === node.categoryFilter;
        if (!matchCat) return false;
        const text = `${i.name} ${i.specs || ''} ${i.code}`.toLowerCase();
        return keywords.some(kw => text.includes(kw.trim()));
      }).length;
    }
    return 0;
  };

  // Handle Add Folder Submit
  const handleAddFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !onAddCustomFolder) return;
    onAddCustomFolder(targetParentId, newFolderName.trim());
    setNewFolderName('');
    setShowAddFolderModal(false);
  };

  // Recursive Node Renderer
  const renderNode = (node: WarehouseTreeNode, level: number = 0) => {
    const isExpanded = !!expandedNodes[node.id];
    const isSelected = selectedNodeId === node.id;
    const hasChildren = !!node.children && node.children.length > 0;
    const itemCount = getNodeItemCount(node);

    // Search filter
    if (treeSearch.trim()) {
      const matchSelf = node.name.toLowerCase().includes(treeSearch.toLowerCase());
      const matchChildren = (n: WarehouseTreeNode): boolean => {
        if (n.name.toLowerCase().includes(treeSearch.toLowerCase())) return true;
        return !!n.children && n.children.some(matchChildren);
      };
      if (!matchSelf && !matchChildren(node)) {
        return null;
      }
    }

    // Node icon selection
    const renderNodeIcon = () => {
      if (node.id === 'root-warehouse') {
        return <Boxes size={16} className="text-[#005394] flex-shrink-0" />;
      }
      if (node.type === 'dashboard') {
        if (node.dashboardSubView === 'critical') {
          return <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />;
        }
        if (node.dashboardSubView === 'valuation') {
          return <DollarSign size={15} className="text-emerald-600 flex-shrink-0" />;
        }
        return <LayoutDashboard size={15} className="text-[#005394] flex-shrink-0" />;
      }
      if (hasChildren) {
        return isExpanded 
          ? <FolderOpen size={15} className="text-[#005394] flex-shrink-0" />
          : <Folder size={15} className="text-amber-600 flex-shrink-0" />;
      }
      return <Folder size={14} className="text-gray-400 flex-shrink-0" />;
    };

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => onSelectNode(node)}
          className={`flex items-center justify-between gap-1.5 px-2 py-1.5 my-0.5 rounded-xl cursor-pointer text-xs transition-all ${
            isSelected 
              ? 'bg-[#005394] text-white font-bold shadow-xs' 
              : 'text-gray-700 hover:bg-[#f0f4fa] hover:text-[#005394]'
          }`}
          style={{ paddingLeft: `${Math.max(8, level * 16 + 8)}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {/* Expand / Collapse Button */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className={`w-4 h-4 rounded hover:bg-black/10 flex items-center justify-center transition-transform flex-shrink-0 ${
                  isSelected ? 'text-white' : 'text-gray-400'
                }`}
              >
                {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
            ) : (
              <span className="w-4 flex-shrink-0" />
            )}

            {/* Icon */}
            {renderNodeIcon()}

            {/* Label */}
            <span className="truncate leading-tight">{node.name}</span>
          </div>

          {/* Badge count */}
          {node.type === 'dashboard' && node.dashboardSubView === 'critical' ? (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black flex-shrink-0 ${
              isSelected ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
            }`}>
              {itemCount}
            </span>
          ) : (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold flex-shrink-0 ${
              isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {itemCount}
            </span>
          )}
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col h-full overflow-hidden">
      {/* Tree Header */}
      <div className="p-3.5 border-b border-[#e2eaf5] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers size={16} className="text-[#005394]" />
            <h3 className="font-bold text-xs sm:text-sm text-gray-900">Danh mục Thư mục Kho</h3>
          </div>

          {/* Quick Expand / Collapse actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={expandAll}
              title="Mở rộng tất cả"
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              <ChevronsDown size={14} />
            </button>
            <button
              onClick={collapseAll}
              title="Thu gọn tất cả"
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              <ChevronsUp size={14} />
            </button>
            {onAddCustomFolder && (
              <button
                onClick={() => setShowAddFolderModal(true)}
                title="Thêm thư mục mới"
                className="p-1 text-[#005394] hover:bg-[#eef3fb] rounded-lg cursor-pointer transition-colors"
              >
                <FolderPlus size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Tree Search Input */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={treeSearch}
            onChange={(e) => setTreeSearch(e.target.value)}
            placeholder="Lọc tên thư mục..."
            className="w-full pl-7 pr-3 py-1.5 bg-[#f0f4fa] rounded-xl text-xs text-gray-800 outline-none focus:bg-white focus:ring-1 focus:ring-[#005394]/30 border border-transparent focus:border-[#005394]"
          />
          {treeSearch && (
            <button
              onClick={() => setTreeSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 max-h-[calc(100vh-280px)] min-h-[380px]">
        {renderNode(treeData, 0)}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-[#f8faff] border-t border-[#e2eaf5] text-[11px] text-gray-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>Sẵn sàng: <strong className="text-gray-800">{inventory.length}</strong> VT</span>
        </span>
        <button
          onClick={() => onSelectNode(treeData.children![0])} // Go to Dashboard
          className="text-[#005394] font-bold hover:underline cursor-pointer"
        >
          Dashboard &rarr;
        </button>
      </div>

      {/* Add Folder Modal */}
      {showAddFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-4 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
              <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <FolderPlus size={15} className="text-[#005394]" />
                <span>Thêm thư mục phân cấp mới</span>
              </h4>
              <button 
                onClick={() => setShowAddFolderModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddFolderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Thư mục cha</label>
                <select
                  value={targetParentId}
                  onChange={(e) => setTargetParentId(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs"
                >
                  <option value="cat-cokhi">Cơ khí & Thủy lực</option>
                  <option value="cat-dien">Điện & Tự động hóa</option>
                  <option value="cat-cambien">Cảm biến & Đo lường</option>
                  <option value="cat-daumo">Dầu mỡ nhờn & Hóa chất</option>
                  <option value="cat-tieuhao">Vật tư tiêu hao & Dự phòng</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tên thư mục mới *</label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="VD: Van xả đáy hồ chứa"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFolderModal(false)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#005394] text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Tạo thư mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
