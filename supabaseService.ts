import { supabase } from '../lib/supabase';
import { 
  InventoryItem, 
  StockActivity, 
  ApprovalTicket, 
  MaintenanceTask, 
  TechnicalDocument 
} from '../types';
import { 
  INITIAL_INVENTORY, 
  INITIAL_ACTIVITIES, 
  INITIAL_APPROVALS, 
  INITIAL_MAINTENANCE_TASKS, 
  INITIAL_DOCUMENTS 
} from '../mockData';

export const SUPABASE_SQL_SCHEMA = `-- BẢNG 1: QUẢN LÝ KHO VẬT TƯ & THIẾT BỊ (INVENTORY)
CREATE TABLE IF NOT EXISTS inventory_items (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    min_quantity NUMERIC NOT NULL DEFAULT 5,
    max_quantity NUMERIC NOT NULL DEFAULT 50,
    unit TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'normal',
    last_updated TEXT,
    specs TEXT,
    supplier TEXT,
    price_per_unit NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BẢNG 2: NHẬT KÝ HOẠT ĐỘNG XUẤT NHẬP KHO (STOCK ACTIVITIES)
CREATE TABLE IF NOT EXISTS stock_activities (
    id TEXT PRIMARY KEY,
    time TEXT NOT NULL,
    action TEXT NOT NULL,
    item TEXT NOT NULL,
    item_code TEXT,
    quantity NUMERIC,
    unit TEXT,
    user_name TEXT NOT NULL,
    user_initials TEXT,
    user_avatar_color TEXT,
    status TEXT NOT NULL,
    date_label TEXT,
    notes TEXT,
    ticket_code TEXT,
    plant TEXT DEFAULT 'Nhà máy thủy điện Sơn Trà 1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BẢNG 3: TRUNG TÂM PHÊ DUYỆT PHIẾU (APPROVAL TICKETS)
CREATE TABLE IF NOT EXISTS approval_tickets (
    id TEXT PRIMARY KEY,
    ticket_code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    requester TEXT NOT NULL,
    department TEXT NOT NULL,
    date TEXT NOT NULL,
    priority TEXT DEFAULT 'Trung bình',
    status TEXT DEFAULT 'pending',
    reason TEXT,
    items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BẢNG 4: BẢO DƯỠNG & SỬA CHỮA KỸ THUẬT (MAINTENANCE TASKS)
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    equipment TEXT NOT NULL,
    plant_area TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    assigned_to TEXT NOT NULL,
    start_date TEXT,
    estimated_completion TEXT,
    progress_percent INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BẢNG 5: THƯ VIỆN TÀI LIỆU & QUY TRÌNH (TECHNICAL DOCUMENTS)
CREATE TABLE IF NOT EXISTS technical_documents (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    file_format TEXT NOT NULL,
    file_size TEXT,
    updated_date TEXT,
    author TEXT,
    version TEXT,
    downloads_count INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật Row Level Security (RLS) & cho phép Public Read/Write đối với Demo Client Key
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all inventory" ON inventory_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all activities" ON stock_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all approvals" ON approval_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all maintenance" ON maintenance_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all documents" ON technical_documents FOR ALL USING (true) WITH CHECK (true);
`;

export interface TableStatus {
  name: string;
  count: number;
  exists: boolean;
  error?: string;
}

export interface SupabaseHealth {
  connected: boolean;
  message: string;
  hasTables: boolean;
  tables: Record<string, TableStatus>;
}

export const SupabaseService = {
  // Test connection to Supabase and inspect each table
  async checkConnection(): Promise<SupabaseHealth> {
    const tableNames = [
      'inventory_items',
      'stock_activities',
      'approval_tickets',
      'maintenance_tasks',
      'technical_documents'
    ];

    const tables: Record<string, TableStatus> = {};
    let anySuccess = false;
    let missingAnyTable = false;
    let authError = false;
    let lastErrorMessage = '';

    for (const tableName of tableNames) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          lastErrorMessage = error.message;
          if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
            missingAnyTable = true;
            tables[tableName] = { name: tableName, count: 0, exists: false, error: 'Chưa tạo bảng' };
          } else if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('apikey') || error.message?.includes('invalid')) {
            authError = true;
            tables[tableName] = { name: tableName, count: 0, exists: false, error: error.message };
          } else {
            tables[tableName] = { name: tableName, count: 0, exists: false, error: error.message };
          }
        } else {
          anySuccess = true;
          tables[tableName] = { name: tableName, count: count || 0, exists: true };
        }
      } catch (err: any) {
        lastErrorMessage = err?.message || 'Lỗi kết nối';
        tables[tableName] = { name: tableName, count: 0, exists: false, error: err?.message };
      }
    }

    if (authError) {
      return {
        connected: false,
        hasTables: false,
        message: `Lỗi xác thực API Key Supabase: ${lastErrorMessage}. Vui lòng kiểm tra lại URL hoặc Anon Key.`,
        tables
      };
    }

    const allTablesExist = tableNames.every(t => tables[t]?.exists);

    if (allTablesExist) {
      const totalRecords = Object.values(tables).reduce((acc, t) => acc + t.count, 0);
      return {
        connected: true,
        hasTables: true,
        message: `Kết nối thành công! Đang có tổng cộng ${totalRecords} bản ghi trong database.`,
        tables
      };
    }

    if (missingAnyTable || !anySuccess) {
      return {
        connected: true,
        hasTables: false,
        message: 'Máy chủ Supabase đã phản hồi, nhưng bạn chưa chạy mã SQL để tạo các bảng dữ liệu.',
        tables
      };
    }

    return {
      connected: true,
      hasTables: false,
      message: lastErrorMessage || 'Một số bảng chưa sẵn sàng trên Supabase',
      tables
    };
  },

  // 1. INVENTORY CRUD
  async getInventory(): Promise<InventoryItem[] | null> {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name', { ascending: true });

      if (error || !data || data.length === 0) return null;

      return data.map((d: any) => ({
        id: d.id,
        code: d.code,
        name: d.name,
        category: d.category,
        quantity: Number(d.quantity),
        minQuantity: Number(d.min_quantity || d.minQuantity || 5),
        maxQuantity: Number(d.max_quantity || d.maxQuantity || 50),
        unit: d.unit,
        location: d.location,
        status: d.status,
        lastUpdated: d.last_updated || d.lastUpdated || 'Hôm nay',
        specs: d.specs,
        supplier: d.supplier,
        pricePerUnit: d.price_per_unit
      }));
    } catch (e) {
      console.warn('Lỗi lấy dữ liệu kho từ Supabase:', e);
      return null;
    }
  },

  async saveInventoryItem(item: InventoryItem): Promise<boolean> {
    try {
      const payload = {
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        min_quantity: item.minQuantity,
        max_quantity: item.maxQuantity,
        unit: item.unit,
        location: item.location,
        status: item.status,
        last_updated: item.lastUpdated || 'Vừa xong',
        specs: item.specs || null,
        supplier: item.supplier || null,
        price_per_unit: item.pricePerUnit || null
      };

      const { error } = await supabase
        .from('inventory_items')
        .upsert(payload);

      return !error;
    } catch (e) {
      console.error('Lỗi lưu/sửa vật tư vào Supabase:', e);
      return false;
    }
  },

  async deleteInventoryItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);

      return !error;
    } catch (e) {
      console.error('Lỗi xóa vật tư trên Supabase:', e);
      return false;
    }
  },

  async updateInventoryQuantities(items: InventoryItem[]): Promise<boolean> {
    try {
      const payloads = items.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        min_quantity: item.minQuantity,
        max_quantity: item.maxQuantity,
        unit: item.unit,
        location: item.location,
        status: item.status,
        last_updated: item.lastUpdated,
        specs: item.specs,
        supplier: item.supplier,
        price_per_unit: item.pricePerUnit
      }));

      const { error } = await supabase
        .from('inventory_items')
        .upsert(payloads);

      return !error;
    } catch (e) {
      console.error('Lỗi cập nhật kho vào Supabase:', e);
      return false;
    }
  },

  // 2. STOCK ACTIVITIES CRUD
  async getActivities(): Promise<StockActivity[] | null> {
    try {
      const { data, error } = await supabase
        .from('stock_activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return null;

      return data.map((d: any) => ({
        id: d.id,
        time: d.time,
        action: d.action,
        item: d.item,
        itemCode: d.item_code || d.itemCode,
        quantity: d.quantity ? Number(d.quantity) : undefined,
        unit: d.unit,
        user: {
          name: d.user_name || d.user?.name || 'Kỹ sư KTSC',
          initials: d.user_initials || d.user?.initials || 'KT',
          avatarColor: d.user_avatar_color || d.user?.avatarColor || 'bg-[#d5e3ff] text-[#001b3c]'
        },
        status: d.status,
        dateLabel: d.date_label || d.dateLabel,
        notes: d.notes,
        ticketCode: d.ticket_code || d.ticketCode,
        plant: d.plant
      }));
    } catch (e) {
      console.warn('Lỗi lấy hoạt động kho từ Supabase:', e);
      return null;
    }
  },

  async addActivity(act: StockActivity): Promise<boolean> {
    try {
      const payload = {
        id: act.id,
        time: act.time,
        action: act.action,
        item: act.item,
        item_code: act.itemCode,
        quantity: act.quantity,
        unit: act.unit,
        user_name: act.user.name,
        user_initials: act.user.initials,
        user_avatar_color: act.user.avatarColor,
        status: act.status,
        date_label: act.dateLabel,
        notes: act.notes,
        ticket_code: act.ticketCode,
        plant: act.plant || 'Nhà máy thủy điện Sơn Trà 1'
      };

      const { error } = await supabase
        .from('stock_activities')
        .insert(payload);

      return !error;
    } catch (e) {
      console.error('Lỗi thêm hoạt động vào Supabase:', e);
      return false;
    }
  },

  async deleteActivity(activityId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('stock_activities')
        .delete()
        .eq('id', activityId);

      return !error;
    } catch (e) {
      console.error('Lỗi xóa hoạt động trên Supabase:', e);
      return false;
    }
  },

  // 3. APPROVAL TICKETS CRUD
  async getApprovals(): Promise<ApprovalTicket[] | null> {
    try {
      const { data, error } = await supabase
        .from('approval_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return null;

      return data.map((d: any) => ({
        id: d.id,
        ticketCode: d.ticket_code || d.ticketCode,
        type: d.type,
        title: d.title,
        requester: d.requester,
        department: d.department,
        date: d.date,
        priority: d.priority,
        status: d.status,
        reason: d.reason,
        items: Array.isArray(d.items) ? d.items : []
      }));
    } catch (e) {
      console.warn('Lỗi lấy danh sách phiếu từ Supabase:', e);
      return null;
    }
  },

  async saveApprovalTicket(ticket: ApprovalTicket): Promise<boolean> {
    try {
      const payload = {
        id: ticket.id,
        ticket_code: ticket.ticketCode,
        type: ticket.type,
        title: ticket.title,
        requester: ticket.requester,
        department: ticket.department,
        date: ticket.date,
        priority: ticket.priority,
        status: ticket.status,
        reason: ticket.reason,
        items: ticket.items
      };

      const { error } = await supabase
        .from('approval_tickets')
        .upsert(payload);

      return !error;
    } catch (e) {
      console.error('Lỗi lưu phiếu trên Supabase:', e);
      return false;
    }
  },

  async updateTicketStatus(ticketId: string, status: 'approved' | 'rejected'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('approval_tickets')
        .update({ status })
        .eq('id', ticketId);

      return !error;
    } catch (e) {
      console.error('Lỗi cập nhật phiếu trên Supabase:', e);
      return false;
    }
  },

  async deleteApprovalTicket(ticketId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('approval_tickets')
        .delete()
        .eq('id', ticketId);

      return !error;
    } catch (e) {
      console.error('Lỗi xóa phiếu trên Supabase:', e);
      return false;
    }
  },

  // 4. MAINTENANCE CRUD
  async getMaintenanceTasks(): Promise<MaintenanceTask[] | null> {
    try {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return null;

      return data.map((d: any) => ({
        id: d.id,
        code: d.code,
        title: d.title,
        equipment: d.equipment,
        plantArea: d.plant_area || d.plantArea,
        priority: d.priority,
        status: d.status,
        assignedTo: d.assigned_to || d.assignedTo,
        startDate: d.start_date || d.startDate,
        estimatedCompletion: d.estimated_completion || d.estimatedCompletion,
        progressPercent: Number(d.progress_percent || d.progressPercent || 0),
        description: d.description
      }));
    } catch (e) {
      console.warn('Lỗi lấy nhiệm vụ sửa chữa từ Supabase:', e);
      return null;
    }
  },

  async saveMaintenanceTask(task: MaintenanceTask): Promise<boolean> {
    try {
      const payload = {
        id: task.id,
        code: task.code,
        title: task.title,
        equipment: task.equipment,
        plant_area: task.plantArea,
        priority: task.priority,
        status: task.status,
        assigned_to: task.assignedTo,
        start_date: task.startDate,
        estimated_completion: task.estimatedCompletion,
        progress_percent: task.progressPercent,
        description: task.description
      };

      const { error } = await supabase
        .from('maintenance_tasks')
        .upsert(payload);

      return !error;
    } catch (e) {
      console.error('Lỗi lưu/sửa nhiệm vụ sửa chữa trên Supabase:', e);
      return false;
    }
  },

  async deleteMaintenanceTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('id', taskId);

      return !error;
    } catch (e) {
      console.error('Lỗi xóa nhiệm vụ sửa chữa trên Supabase:', e);
      return false;
    }
  },

  // 5. TECHNICAL DOCUMENTS
  async getDocuments(): Promise<TechnicalDocument[] | null> {
    try {
      const { data, error } = await supabase
        .from('technical_documents')
        .select('*')
        .order('title', { ascending: true });

      if (error || !data || data.length === 0) return null;

      return data.map((d: any) => ({
        id: d.id,
        code: d.code,
        title: d.title,
        category: d.category,
        fileFormat: d.file_format || d.fileFormat,
        fileSize: d.file_size || d.fileSize,
        updatedDate: d.updated_date || d.updatedDate,
        author: d.author,
        version: d.version,
        downloadsCount: Number(d.downloads_count || d.downloadsCount || 0),
        description: d.description
      }));
    } catch (e) {
      console.warn('Lỗi lấy tài liệu từ Supabase:', e);
      return null;
    }
  },

  async saveTechnicalDocument(doc: TechnicalDocument): Promise<boolean> {
    try {
      const payload = {
        id: doc.id,
        code: doc.code,
        title: doc.title,
        category: doc.category,
        file_format: doc.fileFormat,
        file_size: doc.fileSize,
        updated_date: doc.updatedDate || new Date().toISOString().slice(0, 10),
        author: doc.author,
        version: doc.version,
        downloads_count: doc.downloadsCount,
        description: doc.description
      };

      const { error } = await supabase
        .from('technical_documents')
        .upsert(payload);

      return !error;
    } catch (e) {
      console.error('Lỗi lưu/sửa tài liệu trên Supabase:', e);
      return false;
    }
  },

  async deleteTechnicalDocument(docId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('technical_documents')
        .delete()
        .eq('id', docId);

      return !error;
    } catch (e) {
      console.error('Lỗi xóa tài liệu trên Supabase:', e);
      return false;
    }
  },

  // Seed sample initial data into Supabase automatically
  async seedInitialDataToSupabase(): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Seed Inventory
      const invPayloads = INITIAL_INVENTORY.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        min_quantity: item.minQuantity,
        max_quantity: item.maxQuantity,
        unit: item.unit,
        location: item.location,
        status: item.status,
        last_updated: item.lastUpdated,
        specs: item.specs,
        supplier: item.supplier,
        price_per_unit: item.pricePerUnit
      }));
      const { error: errInv } = await supabase.from('inventory_items').upsert(invPayloads);
      if (errInv) {
        return {
          success: false,
          message: `Lỗi bảng Vật tư (inventory_items): ${errInv.message} (Code: ${errInv.code}). Hãy đảm bảo bạn đã tạo bảng trong SQL Editor.`
        };
      }

      // 2. Seed Activities
      const actPayloads = INITIAL_ACTIVITIES.map(act => ({
        id: act.id,
        time: act.time,
        action: act.action,
        item: act.item,
        item_code: act.itemCode,
        quantity: act.quantity,
        unit: act.unit,
        user_name: act.user.name,
        user_initials: act.user.initials,
        user_avatar_color: act.user.avatarColor,
        status: act.status,
        date_label: act.dateLabel,
        notes: act.notes,
        ticket_code: act.ticketCode,
        plant: act.plant || 'Nhà máy thủy điện Sơn Trà 1'
      }));
      const { error: errAct } = await supabase.from('stock_activities').upsert(actPayloads);
      if (errAct) {
        return {
          success: false,
          message: `Lỗi bảng Nhật ký (stock_activities): ${errAct.message} (Code: ${errAct.code}).`
        };
      }

      // 3. Seed Approvals
      const appPayloads = INITIAL_APPROVALS.map(t => ({
        id: t.id,
        ticket_code: t.ticketCode,
        type: t.type,
        title: t.title,
        requester: t.requester,
        department: t.department,
        date: t.date,
        priority: t.priority,
        status: t.status,
        reason: t.reason,
        items: t.items
      }));
      const { error: errApp } = await supabase.from('approval_tickets').upsert(appPayloads);
      if (errApp) {
        return {
          success: false,
          message: `Lỗi bảng Phê duyệt (approval_tickets): ${errApp.message} (Code: ${errApp.code}).`
        };
      }

      // 4. Seed Maintenance
      const mntPayloads = INITIAL_MAINTENANCE_TASKS.map(m => ({
        id: m.id,
        code: m.code,
        title: m.title,
        equipment: m.equipment,
        plant_area: m.plantArea,
        priority: m.priority,
        status: m.status,
        assigned_to: m.assignedTo,
        start_date: m.startDate,
        estimated_completion: m.estimatedCompletion,
        progress_percent: m.progressPercent,
        description: m.description
      }));
      const { error: errMnt } = await supabase.from('maintenance_tasks').upsert(mntPayloads);
      if (errMnt) {
        return {
          success: false,
          message: `Lỗi bảng Bảo dưỡng (maintenance_tasks): ${errMnt.message} (Code: ${errMnt.code}).`
        };
      }

      // 5. Seed Documents
      const docPayloads = INITIAL_DOCUMENTS.map(doc => ({
        id: doc.id,
        code: doc.code,
        title: doc.title,
        category: doc.category,
        file_format: doc.fileFormat,
        file_size: doc.fileSize,
        updated_date: doc.updatedDate,
        author: doc.author,
        version: doc.version,
        downloads_count: doc.downloadsCount,
        description: doc.description
      }));
      const { error: errDoc } = await supabase.from('technical_documents').upsert(docPayloads);
      if (errDoc) {
        return {
          success: false,
          message: `Lỗi bảng Tài liệu (technical_documents): ${errDoc.message} (Code: ${errDoc.code}).`
        };
      }

      return {
        success: true,
        message: 'Đã nạp toàn bộ danh mục vật tư & dữ liệu khởi tạo lên Supabase thành công!'
      };
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || 'Có lỗi khi đồng bộ dữ liệu ban đầu lên Supabase'
      };
    }
  }
};
