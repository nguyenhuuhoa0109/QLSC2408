export interface WarehouseTreeNode {
  id: string;
  name: string;
  type: 'dashboard' | 'all' | 'category' | 'subcategory' | 'custom';
  categoryFilter?: string;
  subFilterKeyword?: string;
  dashboardSubView?: 'overview' | 'critical' | 'valuation';
  icon?: string;
  badge?: string | number;
  children?: WarehouseTreeNode[];
  isExpanded?: boolean;
  isCustom?: boolean;
}

export const DEFAULT_WAREHOUSE_TREE: WarehouseTreeNode = {
  id: 'root-warehouse',
  name: 'Kho Thủy điện Sơn Trà 1',
  type: 'all',
  isExpanded: true,
  children: [
    {
      id: 'node-dashboard',
      name: 'Dashboard Kho',
      type: 'dashboard',
      dashboardSubView: 'overview',
      isExpanded: true,
      children: [
        {
          id: 'dash-overview',
          name: 'Tổng quan & KPI Kho',
          type: 'dashboard',
          dashboardSubView: 'overview',
        },
        {
          id: 'dash-critical',
          name: 'Cảnh báo tồn kho tối thiểu',
          type: 'dashboard',
          dashboardSubView: 'critical',
        },
        {
          id: 'dash-valuation',
          name: 'Cơ cấu giá trị tồn kho',
          type: 'dashboard',
          dashboardSubView: 'valuation',
        },
      ],
    },
    {
      id: 'node-all-items',
      name: 'Tất cả vật tư lưu kho',
      type: 'all',
    },
    {
      id: 'cat-cokhi',
      name: 'Cơ khí & Thủy lực',
      type: 'category',
      categoryFilter: 'Cơ khí',
      isExpanded: true,
      children: [
        {
          id: 'sub-cokhi-tuabin',
          name: 'Tuabin, Bơm & Trục máy',
          type: 'subcategory',
          categoryFilter: 'Cơ khí',
          subFilterKeyword: 'bơm,tuabin,trục',
        },
        {
          id: 'sub-cokhi-vongbi',
          name: 'Vòng bi & Bạc đỡ',
          type: 'subcategory',
          categoryFilter: 'Cơ khí',
          subFilterKeyword: 'vòng bi,skf,bạc',
        },
        {
          id: 'sub-cokhi-van',
          name: 'Van & Đường ống áp lực',
          type: 'subcategory',
          categoryFilter: 'Cơ khí',
          subFilterKeyword: 'van,ống,bướm',
        },
      ],
    },
    {
      id: 'cat-dien',
      name: 'Điện & Tự động hóa',
      type: 'category',
      categoryFilter: 'Điện - Tự động hóa',
      isExpanded: true,
      children: [
        {
          id: 'sub-dien-role',
          name: 'Rơ le bảo vệ & Tủ SCADA',
          type: 'subcategory',
          categoryFilter: 'Điện - Tự động hóa',
          subFilterKeyword: 'rơ le,sel,relay,tủ,scada',
        },
        {
          id: 'sub-dien-cap',
          name: 'Cáp điện & Hệ thống 22kV',
          type: 'subcategory',
          categoryFilter: 'Điện - Tự động hóa',
          subFilterKeyword: 'cáp,dây,cadivi,22kv,24kv',
        },
        {
          id: 'sub-dien-acquy',
          name: 'Nguồn DC & Dàn ắc quy',
          type: 'subcategory',
          categoryFilter: 'Điện - Tự động hóa',
          subFilterKeyword: 'ắc quy,pin,dc,12v',
        },
      ],
    },
    {
      id: 'cat-cambien',
      name: 'Cảm biến & Đo lường',
      type: 'category',
      categoryFilter: 'Cảm biến & Đo lường',
      isExpanded: true,
      children: [
        {
          id: 'sub-cambien-nhietdo',
          name: 'Cảm biến nhiệt độ Pt100',
          type: 'subcategory',
          categoryFilter: 'Cảm biến & Đo lường',
          subFilterKeyword: 'nhiệt độ,pt100,endress',
        },
        {
          id: 'sub-cambien-apsuat',
          name: 'Cảm biến áp suất & Mực nước',
          type: 'subcategory',
          categoryFilter: 'Cảm biến & Đo lường',
          subFilterKeyword: 'áp suất,mực nước,yokogawa,druk',
        },
      ],
    },
    {
      id: 'cat-daumo',
      name: 'Dầu mỡ nhờn & Hóa chất',
      type: 'category',
      categoryFilter: 'Dầu mỡ nhờn',
      isExpanded: true,
      children: [
        {
          id: 'sub-daumo-dau',
          name: 'Dầu thủy lực & Tuabin',
          type: 'subcategory',
          categoryFilter: 'Dầu mỡ nhờn',
          subFilterKeyword: 'dầu,nhớt,castrol,vg,hyspin',
        },
        {
          id: 'sub-daumo-mo',
          name: 'Mỡ bôi trơn chuyên dụng',
          type: 'subcategory',
          categoryFilter: 'Dầu mỡ nhờn',
          subFilterKeyword: 'mỡ,mobil,shc,grease',
        },
      ],
    },
    {
      id: 'cat-tieuhao',
      name: 'Vật tư tiêu hao & Dự phòng',
      type: 'category',
      categoryFilter: 'Vật tư tiêu hao',
      isExpanded: true,
      children: [
        {
          id: 'sub-tieuhao-gioang',
          name: 'Gioăng & Phớt làm kín',
          type: 'subcategory',
          categoryFilter: 'Vật tư tiêu hao',
          subFilterKeyword: 'gioăng,phớt,nbr,vòng đệm',
        },
        {
          id: 'sub-tieuhao-loc',
          name: 'Lọc gió & Phụ kiện định kỳ',
          type: 'subcategory',
          categoryFilter: 'Vật tư tiêu hao',
          subFilterKeyword: 'lọc,gió,camfil,filter',
        },
      ],
    },
  ],
};
