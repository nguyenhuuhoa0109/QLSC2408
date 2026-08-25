import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USER, 
  INITIAL_ACTIVITIES, 
  INITIAL_INVENTORY, 
  INITIAL_APPROVALS, 
  INITIAL_MAINTENANCE_TASKS, 
  INITIAL_DOCUMENTS 
} from './mockData';
import { 
  NavigationTab, 
  PlantLocation, 
  StockActivity, 
  InventoryItem, 
  ApprovalTicket, 
  MaintenanceTask, 
  TechnicalDocument 
} from './types';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OverviewScreen } from './components/OverviewScreen';
import { WarehouseScreen } from './components/WarehouseScreen';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { DocumentsScreen } from './components/DocumentsScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { ApprovalModal } from './components/ApprovalModal';
import { StockTransactionModal } from './components/StockTransactionModal';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { DatabaseStatusModal } from './components/DatabaseStatusModal';
import { SupabaseService } from './services/supabaseService';
import { supabase } from './lib/supabase';

export default function App() {
  // App state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(INITIAL_USER);
  const [currentPlant, setCurrentPlant] = useState<PlantLocation>('Nhà máy thủy điện Sơn Trà 1');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('tong-quan');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Data states
  const [activities, setActivities] = useState<StockActivity[]>(INITIAL_ACTIVITIES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [approvals, setApprovals] = useState<ApprovalTicket[]>(INITIAL_APPROVALS);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(INITIAL_MAINTENANCE_TASKS);
  const [documents, setDocuments] = useState<TechnicalDocument[]>(INITIAL_DOCUMENTS);

  // Modal states
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [transactionModalConfig, setTransactionModalConfig] = useState<{
    isOpen: boolean;
    type: 'import' | 'export';
    preselectedItem?: InventoryItem;
  }>({
    isOpen: false,
    type: 'import'
  });
  const [selectedActivityForDetail, setSelectedActivityForDetail] = useState<StockActivity | null>(null);

  // Load live data from Supabase
  const loadDataFromSupabase = async () => {
    try {
      const [dbInventory, dbActivities, dbApprovals, dbTasks, dbDocs] = await Promise.all([
        SupabaseService.getInventory(),
        SupabaseService.getActivities(),
        SupabaseService.getApprovals(),
        SupabaseService.getMaintenanceTasks(),
        SupabaseService.getDocuments()
      ]);

      if (dbInventory && dbInventory.length > 0) setInventory(dbInventory);
      if (dbActivities && dbActivities.length > 0) setActivities(dbActivities);
      if (dbApprovals && dbApprovals.length > 0) setApprovals(dbApprovals);
      if (dbTasks && dbTasks.length > 0) setMaintenanceTasks(dbTasks);
      if (dbDocs && dbDocs.length > 0) setDocuments(dbDocs);
    } catch (e) {
      console.warn('Supabase fetch notice:', e);
    }
  };

  useEffect(() => {
    loadDataFromSupabase();

    // Subscribe to realtime database changes on Supabase
    const invChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory_items' },
        () => {
          SupabaseService.getInventory().then(res => {
            if (res && res.length > 0) setInventory(res);
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stock_activities' },
        () => {
          SupabaseService.getActivities().then(res => {
            if (res && res.length > 0) setActivities(res);
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'approval_tickets' },
        () => {
          SupabaseService.getApprovals().then(res => {
            if (res && res.length > 0) setApprovals(res);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(invChannel);
    };
  }, []);

  // Unread badge counts
  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;
  const unreadNotificationsCount = pendingApprovalsCount > 0 ? pendingApprovalsCount + 1 : 1;

  // Handlers
  const handleLogin = (username: string) => {
    setUser({
      ...INITIAL_USER,
      name: username.includes('ky') ? 'Nguyễn Văn A' : username.includes('kho') ? 'Trần Thị B' : 'Admin User',
      role: username.includes('ky') ? 'Kỹ sư Vận hành' : username.includes('kho') ? 'Thủ kho KTSC' : 'Quản trị viên',
      roleBadge: username.includes('ky') ? 'KỸ SƯ TRỰC CA' : username.includes('kho') ? 'THỦ KHO KỸ THUẬT' : 'QUẢN TRỊ VIÊN'
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handlePlantChange = (plant: PlantLocation) => {
    setCurrentPlant(plant);
  };

  const handleApproveTicket = (ticketId: string) => {
    const ticket = approvals.find(t => t.id === ticketId);
    if (!ticket) return;

    setApprovals(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'approved' } : t));
    SupabaseService.updateTicketStatus(ticketId, 'approved');

    // Create activity record
    const newAct: StockActivity = {
      id: `act-${Date.now()}`,
      time: 'Vừa xong',
      action: 'Duyệt phiếu nhập',
      item: ticket.items[0]?.name || ticket.title,
      quantity: ticket.items[0]?.quantity,
      unit: ticket.items[0]?.unit,
      user: {
        name: user.name,
        initials: user.initials,
        avatarColor: 'bg-[#d6e3ff] text-[#001b3d]'
      },
      status: 'ĐÃ DUYỆT',
      dateLabel: 'Vừa xong',
      ticketCode: ticket.ticketCode,
      notes: `Phê duyệt yêu cầu: ${ticket.reason}`,
      plant: currentPlant
    };

    setActivities(prev => [newAct, ...prev]);
    SupabaseService.addActivity(newAct);
  };

  const handleRejectTicket = (ticketId: string) => {
    setApprovals(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'rejected' } : t));
    SupabaseService.updateTicketStatus(ticketId, 'rejected');
  };

  const handleStockTransactionSubmit = (newActivity: StockActivity, updatedInventory: InventoryItem[]) => {
    setInventory(updatedInventory);
    setActivities(prev => [newActivity, ...prev]);
    SupabaseService.updateInventoryQuantities(updatedInventory);
    SupabaseService.addActivity(newActivity);
  };

  const handleAddNewInventoryItem = (newItem: InventoryItem) => {
    setInventory(prev => [newItem, ...prev]);
    SupabaseService.saveInventoryItem(newItem);
  };

  const handleEditInventoryItem = (updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    SupabaseService.saveInventoryItem(updatedItem);
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
    SupabaseService.deleteInventoryItem(itemId);
  };

  const handleAddMaintenanceTask = (newTask: MaintenanceTask) => {
    setMaintenanceTasks(prev => [newTask, ...prev]);
    SupabaseService.saveMaintenanceTask(newTask);
  };

  const handleEditMaintenanceTask = (updatedTask: MaintenanceTask) => {
    setMaintenanceTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    SupabaseService.saveMaintenanceTask(updatedTask);
  };

  const handleDeleteMaintenanceTask = (taskId: string) => {
    setMaintenanceTasks(prev => prev.filter(t => t.id !== taskId));
    SupabaseService.deleteMaintenanceTask(taskId);
  };

  const handleUploadDocument = (doc: TechnicalDocument) => {
    setDocuments(prev => [doc, ...prev]);
    SupabaseService.saveTechnicalDocument(doc);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    SupabaseService.deleteTechnicalDocument(docId);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: MaintenanceTask['status']) => {
    const updated = maintenanceTasks.find(t => t.id === taskId);
    if (updated) {
      const mod = {
        ...updated,
        status: newStatus,
        progressPercent: newStatus === 'Hoàn thành' ? 100 : updated.progressPercent
      };
      SupabaseService.saveMaintenanceTask(mod);
    }

    setMaintenanceTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          progressPercent: newStatus === 'Hoàn thành' ? 100 : t.progressPercent
        };
      }
      return t;
    }));
  };

  // If not logged in, render the login screen (Image 5 & Image 7)
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Active view content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'tong-quan':
        return (
          <OverviewScreen
            plantName={currentPlant}
            activities={activities}
            inventory={inventory}
            pendingApprovalsCount={pendingApprovalsCount}
            onOpenApprovals={() => setShowApprovalModal(true)}
            onOpenNewTransaction={(type, item) => setTransactionModalConfig({ isOpen: true, type, preselectedItem: item })}
            onSelectActivity={(act) => setSelectedActivityForDetail(act)}
            onNavigateToWarehouse={() => setCurrentTab('quan-ly-kho')}
            isMobileLayout={isMobilePreview}
          />
        );
      case 'quan-ly-kho':
        return (
          <WarehouseScreen
            inventory={inventory}
            onOpenNewTransaction={(type, item) => setTransactionModalConfig({ isOpen: true, type, preselectedItem: item })}
            onAddNewItem={handleAddNewInventoryItem}
            onEditItem={handleEditInventoryItem}
            onDeleteItem={handleDeleteInventoryItem}
          />
        );
      case 'quan-ly-sua-chua':
        return (
          <MaintenanceScreen
            tasks={maintenanceTasks}
            onAddTask={handleAddMaintenanceTask}
            onEditTask={handleEditMaintenanceTask}
            onDeleteTask={handleDeleteMaintenanceTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        );
      case 'quan-ly-tai-lieu':
        return (
          <DocumentsScreen
            documents={documents}
            onUploadDoc={handleUploadDocument}
            onDeleteDoc={handleDeleteDocument}
          />
        );
      case 'bao-cao':
        return (
          <ReportsScreen
            inventory={inventory}
            activities={activities}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#111c2c] flex flex-col font-['Inter',sans-serif]">
      {/* MOBILE FRAME WRAPPER IF PREVIEW TOGGLED */}
      {isMobilePreview ? (
        <div className="min-h-screen bg-gray-900/90 p-2 sm:p-6 flex flex-col items-center justify-center">
          <div className="mb-3 text-white text-xs flex items-center gap-3">
            <span className="font-bold">Đang xem chế độ Mô phỏng Điện thoại (Mobile Frame - Image 3)</span>
            <button
              onClick={() => setIsMobilePreview(false)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold"
            >
              Chuyển về Desktop đầy đủ
            </button>
          </div>

          <div className="w-full max-w-[420px] h-[860px] bg-[#f9f9ff] rounded-[36px] overflow-hidden shadow-2xl border-[8px] border-gray-800 flex flex-col relative">
            <Header
              user={user}
              currentPlant={currentPlant}
              onPlantChange={handlePlantChange}
              onLogout={handleLogout}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              pendingApprovalsCount={pendingApprovalsCount}
              unreadNotificationsCount={unreadNotificationsCount}
              onOpenApprovals={() => setShowApprovalModal(true)}
              onOpenDatabaseStatus={() => setShowDatabaseModal(true)}
              isMobilePreview={isMobilePreview}
              onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
            />

            <main className="flex-1 overflow-y-auto pb-20">
              {renderTabContent()}
            </main>

            <BottomNav
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
            />
          </div>
        </div>
      ) : (
        /* STANDARD RESPONSIVE WEB APP (DESKTOP WITH SIDEBAR + MOBILE RESPONSIVE) */
        <div className="min-h-screen flex flex-col">
          {/* Desktop Sidebar (hidden on mobile) */}
          <div className="hidden lg:block">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              plantName={currentPlant}
            />
          </div>

          {/* Main Layout Container */}
          <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
            {/* Header */}
            <Header
              user={user}
              currentPlant={currentPlant}
              onPlantChange={handlePlantChange}
              onLogout={handleLogout}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              pendingApprovalsCount={pendingApprovalsCount}
              unreadNotificationsCount={unreadNotificationsCount}
              onOpenApprovals={() => setShowApprovalModal(true)}
              onOpenDatabaseStatus={() => setShowDatabaseModal(true)}
              isMobilePreview={isMobilePreview}
              onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
            />

            {/* Content Area */}
            <main className="flex-1 pb-20 lg:pb-10">
              {renderTabContent()}
            </main>

            {/* Mobile Bottom Navigation (shown on mobile only) */}
            <div className="lg:hidden">
              <BottomNav
                currentTab={currentTab}
                onSelectTab={setCurrentTab}
              />
            </div>
          </div>
        </div>
      )}

      {/* APPROVAL TICKETS MODAL */}
      {showApprovalModal && (
        <ApprovalModal
          tickets={approvals}
          onClose={() => setShowApprovalModal(false)}
          onApproveTicket={handleApproveTicket}
          onRejectTicket={handleRejectTicket}
        />
      )}

      {/* STOCK IN / OUT TRANSACTION MODAL */}
      {transactionModalConfig.isOpen && (
        <StockTransactionModal
          type={transactionModalConfig.type}
          inventory={inventory}
          preselectedItem={transactionModalConfig.preselectedItem}
          onClose={() => setTransactionModalConfig({ isOpen: false, type: 'import' })}
          onSubmit={handleStockTransactionSubmit}
        />
      )}

      {/* RECENT ACTIVITY DETAIL SLIP MODAL */}
      {selectedActivityForDetail && (
        <ActivityDetailModal
          activity={selectedActivityForDetail}
          plantName={currentPlant}
          onClose={() => setSelectedActivityForDetail(null)}
        />
      )}

      {/* SUPABASE DATABASE LIVE STATUS & MIGRATION HELPER MODAL */}
      <DatabaseStatusModal
        isOpen={showDatabaseModal}
        onClose={() => setShowDatabaseModal(false)}
        onDataSyncFinished={() => loadDataFromSupabase()}
      />
    </div>
  );
}
