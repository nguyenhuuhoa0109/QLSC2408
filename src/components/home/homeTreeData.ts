export interface HomeTreeNode {
  id: string;
  name: string;
  type: 'all' | 'domain' | 'warehouse-dashboard' | 'warehouse-category' | 'maintenance-status' | 'doc-category' | 'custom';
  domain?: 'warehouse' | 'maintenance' | 'document';
  dashboardSubView?: 'overview' | 'critical' | 'valuation';
  categoryFilter?: string;
  statusFilter?: string;
  icon?: string;
  badge?: string | number;
  children?: HomeTreeNode[];
  isExpanded?: boolean;
  isCustom?: boolean;
}

export const createDefaultHomeTree = (plantName: string): HomeTreeNode => ({
  id: 'root-home',
  name: plantName || 'Nhà máy Thủy điện Sơn Trà 1',
  type: 'all',
  isExpanded: true,
  children: [
    {
      id: 'node-home-overview',
      name: 'Tổng quan toàn hệ thống',
      type: 'all',
      badge: 'Trang chủ',
    },
    {
      id: 'node-home-warehouse',
      name: 'Quản lý kho',
      type: 'domain',
      domain: 'warehouse',
      isExpanded: true,
      children: [
        {
          id: 'node-home-warehouse-dashboard',
          name: 'Dashboard Kho',
          type: 'warehouse-dashboard',
          dashboardSubView: 'overview',
          isExpanded: true,
          children: [
            {
              id: 'node-home-dash-overview',
              name: 'Tổng quan & Chỉ số KPI Kho',
              type: 'warehouse-dashboard',
              dashboardSubView: 'overview',
            },
            {
              id: 'node-home-dash-critical',
              name: 'Cảnh báo tồn kho khẩn cấp',
              type: 'warehouse-dashboard',
              dashboardSubView: 'critical',
            },
            {
              id: 'node-home-dash-valuation',
              name: 'Cơ cấu giá trị vật tư',
              type: 'warehouse-dashboard',
              dashboardSubView: 'valuation',
            },
          ],
        },
        {
          id: 'node-home-wh-all',
          name: 'Danh mục vật tư lưu kho',
          type: 'domain',
          domain: 'warehouse',
          isExpanded: true,
          children: [
            {
              id: 'node-home-cat-cokhi',
              name: 'Cơ khí & Thủy lực',
              type: 'warehouse-category',
              categoryFilter: 'Cơ khí',
            },
            {
              id: 'node-home-cat-dien',
              name: 'Điện & Tự động hóa',
              type: 'warehouse-category',
              categoryFilter: 'Điện - Tự động hóa',
            },
            {
              id: 'node-home-cat-cambien',
              name: 'Cảm biến & Đo lường',
              type: 'warehouse-category',
              categoryFilter: 'Cảm biến & Đo lường',
            },
            {
              id: 'node-home-cat-daumo',
              name: 'Dầu mỡ nhờn & Hóa chất',
              type: 'warehouse-category',
              categoryFilter: 'Dầu mỡ nhờn',
            },
            {
              id: 'node-home-cat-tieuhao',
              name: 'Vật tư tiêu hao & Dự phòng',
              type: 'warehouse-category',
              categoryFilter: 'Vật tư tiêu hao',
            },
          ],
        },
      ],
    },
    {
      id: 'node-home-maintenance',
      name: 'Quản lý sửa chữa & bảo dưỡng',
      type: 'domain',
      domain: 'maintenance',
      isExpanded: true,
      children: [
        {
          id: 'node-home-maint-active',
          name: 'Đang triển khai thi công',
          type: 'maintenance-status',
          statusFilter: 'Đang thực hiện',
        },
        {
          id: 'node-home-maint-waiting',
          name: 'Chờ cấp vật tư thay thế',
          type: 'maintenance-status',
          statusFilter: 'Chờ vật tư',
        },
        {
          id: 'node-home-maint-done',
          name: 'Hạng mục đã hoàn thành',
          type: 'maintenance-status',
          statusFilter: 'Hoàn thành',
        },
      ],
    },
    {
      id: 'node-home-documents',
      name: 'Hồ sơ & Tài liệu kỹ thuật',
      type: 'domain',
      domain: 'document',
      isExpanded: true,
      children: [
        {
          id: 'node-home-doc-quytrinh',
          name: 'Quy trình vận hành & An toàn',
          type: 'doc-category',
          categoryFilter: 'Quy trình vận hành',
        },
        {
          id: 'node-home-doc-banve',
          name: 'Bản vẽ kỹ thuật & Sơ đồ',
          type: 'doc-category',
          categoryFilter: 'Bản vẽ kỹ thuật',
        },
        {
          id: 'node-home-doc-tailieu',
          name: 'Tài liệu hướng dẫn thiết bị',
          type: 'doc-category',
          categoryFilter: 'Tài liệu thiết bị',
        },
      ],
    },
  ],
});
