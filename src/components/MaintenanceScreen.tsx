import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Cpu, 
  Zap,
  Activity,
  Check,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  LayoutDashboard,
  CalendarCheck,
  FileEdit,
  History,
  Layers,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MaintenanceTask, MaintenanceSubTab } from '../types';

interface MaintenanceScreenProps {
  tasks: MaintenanceTask[];
  onAddTask: (task: MaintenanceTask) => void;
  onEditTask?: (task: MaintenanceTask) => void;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: MaintenanceTask['status']) => void;
  currentSubTab?: MaintenanceSubTab;
  onSelectSubTab?: (subTab: MaintenanceSubTab) => void;
}

// 1. Dữ liệu Danh mục hệ thống kỹ thuật Nhà máy thủy điện Sơn Trà 1
interface TechnicalSystem {
  id: string;
  code: string;
  name: string;
  category: string;
  location: string;
  specifications: string;
  operatingHours: number;
  status: 'Đang vận hành tốt' | 'Cần kiểm tra định kỳ' | 'Đang bảo dưỡng' | 'Cảnh báo rung lắc';
  statusType: 'success' | 'warning' | 'info' | 'danger';
  lastMaintenance: string;
  nextMaintenance: string;
  engineerInCharge: string;
}

const INITIAL_SYSTEMS: TechnicalSystem[] = [
  {
    id: 'sys-01',
    code: 'HT-TB-01',
    name: 'Tổ máy 1 (Tuabin Francis & Bánh xe công tác)',
    category: 'Cơ khí Thủy lực',
    location: 'Gian máy chính - Cao trình +112m',
    specifications: 'Công suất 15MW, Cột nước H=48m, Lưu lượng Q=35m³/s, Tốc độ 375rpm',
    operatingHours: 18450,
    status: 'Đang vận hành tốt',
    statusType: 'success',
    lastMaintenance: '15/07/2026',
    nextMaintenance: '15/10/2026',
    engineerInCharge: 'KS. Nguyễn Văn A'
  },
  {
    id: 'sys-02',
    code: 'HT-TB-02',
    name: 'Tổ máy 2 (Tuabin Francis & Bánh xe công tác)',
    category: 'Cơ khí Thủy lực',
    location: 'Gian máy chính - Cao trình +112m',
    specifications: 'Công suất 15MW, Cột nước H=48m, Lưu lượng Q=35m³/s, Tốc độ 375rpm',
    operatingHours: 17920,
    status: 'Cần kiểm tra định kỳ',
    statusType: 'warning',
    lastMaintenance: '02/08/2026',
    nextMaintenance: '02/11/2026',
    engineerInCharge: 'KS. Hoàng Văn B'
  },
  {
    id: 'sys-03',
    code: 'HT-TBA-110',
    name: 'Trạm phân phối ngoài trời 110kV & MBA T1',
    category: 'Điện & Trạm cao thế',
    location: 'Sân trạm ngoài trời 110kV',
    specifications: 'MBA 35MVA - 110/10.5kV, Máy cắt khí SF6 GL312, Dao cách ly 110kV',
    operatingHours: 24500,
    status: 'Đang vận hành tốt',
    statusType: 'success',
    lastMaintenance: '10/06/2026',
    nextMaintenance: '10/12/2026',
    engineerInCharge: 'KS. Trần Văn C'
  },
  {
    id: 'sys-04',
    code: 'HT-DT-01',
    name: 'Hệ thống Điều tốc Điện - Thủy lực & Dầu áp lực',
    category: 'Tự động hóa & Thủy lực',
    location: 'Tầng điều tốc - Cao trình +116m',
    specifications: 'Áp lực vận hành 6.3 MPa, Bình tích năng dầu N2 1.6m³, Bộ vi xử lý kép',
    operatingHours: 19100,
    status: 'Đang vận hành tốt',
    statusType: 'success',
    lastMaintenance: '20/08/2026',
    nextMaintenance: '20/11/2026',
    engineerInCharge: 'KS. Lê Văn D'
  },
  {
    id: 'sys-05',
    code: 'HT-VAN-DT',
    name: 'Cửa van cung xả lũ, Đập dâng & Đập tràn',
    category: 'Công trình Thủy công',
    location: 'Khu vực Đập đầu mối Sơn Trà 1',
    specifications: '3 cửa van cung kích thước 8x10m, Tời xích dẫn động điện thủy lực 2x50 tấn',
    operatingHours: 8500,
    status: 'Đang vận hành tốt',
    statusType: 'success',
    lastMaintenance: '12/08/2026',
    nextMaintenance: '12/10/2026',
    engineerInCharge: 'KS. Phạm Văn E'
  },
  {
    id: 'sys-06',
    code: 'HT-SCADA-01',
    name: 'Hệ thống Giám sát Điều khiển SCADA / DCS',
    category: 'Điều khiển & Đo lường',
    location: 'Phòng Điều khiển Trung tâm (CCR)',
    specifications: 'Hệ thống máy chủ kép dự phòng nóng, Mạng cáp quang vòng Ring IEC 61850',
    operatingHours: 25000,
    status: 'Đang vận hành tốt',
    statusType: 'success',
    lastMaintenance: '05/09/2026',
    nextMaintenance: '05/03/2027',
    engineerInCharge: 'KS. Đỗ Văn F'
  },
  {
    id: 'sys-07',
    code: 'HT-TD-01',
    name: 'Hệ thống Nguồn tự dùng AC/DC & Diesel sự cố',
    category: 'Nguồn & Dự phòng',
    location: 'Nhà tự dùng & Trạm Ắc quy',
    specifications: 'Nguồn AC 400V, Giàn ắc quy kiềm 220VDC 300Ah, Máy phát Diesel Cummins 250kVA',
    operatingHours: 12000,
    status: 'Cần kiểm tra định kỳ',
    statusType: 'warning',
    lastMaintenance: '28/08/2026',
    nextMaintenance: '28/09/2026',
    engineerInCharge: 'KS. Nguyễn Văn A'
  }
];

// 2. Dữ liệu Kế hoạch công tác định kỳ
interface WorkPlanItem {
  id: string;
  code: string;
  title: string;
  type: 'Đại tu' | 'Tiểu tu' | 'Bảo dưỡng định kỳ' | 'Thí nghiệm hiệu chuẩn';
  systemName: string;
  plannedDate: string;
  durationDays: number;
  leader: string;
  teamSize: number;
  approvalStatus: 'Đã phê duyệt' | 'Chờ thẩm định' | 'Dự thảo';
  outageRequired: boolean;
}

const INITIAL_WORK_PLANS: WorkPlanItem[] = [
  {
    id: 'plan-01',
    code: 'KH-2026-Q4-01',
    title: 'Đại tu định kỳ Cụm bánh xe công tác và ổ đỡ Tổ máy H1',
    type: 'Đại tu',
    systemName: 'Tổ máy 1 (Tuabin Francis & Bánh xe công tác)',
    plannedDate: '15/10/2026 - 30/10/2026',
    durationDays: 15,
    leader: 'KS. Nguyễn Văn A',
    teamSize: 8,
    approvalStatus: 'Đã phê duyệt',
    outageRequired: true
  },
  {
    id: 'plan-02',
    code: 'KH-2026-T10-02',
    title: 'Thí nghiệm cao áp & phân tích sắc ký dầu MBA chính T1 110kV',
    type: 'Thí nghiệm hiệu chuẩn',
    systemName: 'Trạm phân phối ngoài trời 110kV & MBA T1',
    plannedDate: '01/10/2026 - 03/10/2026',
    durationDays: 3,
    leader: 'KS. Trần Văn C',
    teamSize: 5,
    approvalStatus: 'Đã phê duyệt',
    outageRequired: true
  },
  {
    id: 'plan-03',
    code: 'KH-2026-T09-03',
    title: 'Bảo dưỡng, vệ sinh và thay dầu trạm bơm áp lực hệ thống điều tốc',
    type: 'Bảo dưỡng định kỳ',
    systemName: 'Hệ thống Điều tốc Điện - Thủy lực & Dầu áp lực',
    plannedDate: '25/09/2026 - 27/09/2026',
    durationDays: 2,
    leader: 'KS. Lê Văn D',
    teamSize: 4,
    approvalStatus: 'Đã phê duyệt',
    outageRequired: false
  },
  {
    id: 'plan-04',
    code: 'KH-2026-T09-04',
    title: 'Kiểm định đồng hồ áp suất, cảm biến nhiệt độ RTD gối trục',
    type: 'Thí nghiệm hiệu chuẩn',
    systemName: 'Hệ thống Giám sát Điều khiển SCADA / DCS',
    plannedDate: '18/09/2026 - 19/09/2026',
    durationDays: 2,
    leader: 'KS. Đỗ Văn F',
    teamSize: 3,
    approvalStatus: 'Chờ thẩm định',
    outageRequired: false
  },
  {
    id: 'plan-05',
    code: 'KH-2026-T10-05',
    title: 'Vận hành thử nghiệm không tải và kiểm tra phanh hãm cơ khí cửa van cung',
    type: 'Bảo dưỡng định kỳ',
    systemName: 'Cửa van cung xả lũ, Đập dâng & Đập tràn',
    plannedDate: '05/10/2026 - 06/10/2026',
    durationDays: 2,
    leader: 'KS. Phạm Văn E',
    teamSize: 6,
    approvalStatus: 'Đã phê duyệt',
    outageRequired: false
  }
];

// 3. Dữ liệu Đăng ký công tác (Phiếu công tác PCT & Lệnh công tác LCT)
interface WorkPermitItem {
  id: string;
  permitNumber: string;
  workType: 'Phiếu công tác (PCT)' | 'Lệnh công tác (LCT)';
  jobTitle: string;
  equipmentLocation: string;
  issuerName: string; // Người cấp phiếu
  leaderName: string; // Người chỉ huy trực tiếp
  safetySupervisor: string; // Người giám sát an toàn
  validFrom: string;
  validTo: string;
  safetyMeasures: string[];
  status: 'Đã phê duyệt' | 'Chờ duyệt' | 'Đang thực hiện' | 'Đã khóa phiếu';
}

const INITIAL_PERMITS: WorkPermitItem[] = [
  {
    id: 'pm-01',
    permitNumber: 'PCT-ST1-2026-088',
    workType: 'Phiếu công tác (PCT)',
    jobTitle: 'Kiểm tra độ rung và bôi trơn bạc lót gối đỡ tuabin H2',
    equipmentLocation: 'Tổ máy số 2 - Cao trình +112m',
    issuerName: 'Hoàng Văn B (Phó GĐ Kỹ thuật)',
    leaderName: 'Nguyễn Văn A (Kỹ sư Cơ điện)',
    safetySupervisor: 'Đỗ Văn F (Cán bộ An toàn)',
    validFrom: '14/09/2026 07:30',
    validTo: '16/09/2026 17:00',
    safetyMeasures: ['Dừng máy H2', 'Khóa van đĩa đầu vào', 'Xả cạn nước buồng xoắn', 'Đặt biển cấm thao tác'],
    status: 'Đang thực hiện'
  },
  {
    id: 'pm-02',
    permitNumber: 'PCT-ST1-2026-089',
    workType: 'Phiếu công tác (PCT)',
    jobTitle: 'Thí nghiệm đo điện trở tiếp xúc dao cách ly 110kV ngăn lộ 171',
    equipmentLocation: 'Sân trạm phân phối 110kV',
    issuerName: 'Hoàng Văn B (Phó GĐ Kỹ thuật)',
    leaderName: 'Trần Văn C (Kỹ sư Điện)',
    safetySupervisor: 'Đỗ Văn F (Cán bộ An toàn)',
    validFrom: '18/09/2026 08:00',
    validTo: '18/09/2026 16:30',
    safetyMeasures: ['Cắt điện ngăn lộ 171', 'Đóng dao tiếp địa phía đường dây và thanh cái', 'Treo biển ĐÃ NỐI ĐẤT'],
    status: 'Chờ duyệt'
  },
  {
    id: 'pm-03',
    permitNumber: 'LCT-ST1-2026-034',
    workType: 'Lệnh công tác (LCT)',
    jobTitle: 'Vệ sinh công nghiệp và thay thế đèn chiếu sáng buồng máy phát H1',
    equipmentLocation: 'Gian máy phát số 1',
    issuerName: 'Trưởng ca Vận hành',
    leaderName: 'Lê Văn D (Kỹ thuật viên)',
    safetySupervisor: 'Lê Văn D (Kiêm nhiệm)',
    validFrom: '13/09/2026 13:30',
    validTo: '13/09/2026 17:00',
    safetyMeasures: ['Trang bị đầy đủ BHLĐ, nón bảo hộ, dây đai khi trèo cao'],
    status: 'Đã phê duyệt'
  },
  {
    id: 'pm-04',
    permitNumber: 'PCT-ST1-2026-090',
    workType: 'Phiếu công tác (PCT)',
    jobTitle: 'Bảo dưỡng cảm biến mức dầu bồn áp lực hệ thống điều tốc',
    equipmentLocation: 'Phòng Điều tốc - Tầng +116m',
    issuerName: 'Hoàng Văn B (Phó GĐ Kỹ thuật)',
    leaderName: 'Lê Văn D (Kỹ sư Tự động)',
    safetySupervisor: 'Đỗ Văn F (Cán bộ An toàn)',
    validFrom: '20/09/2026 08:00',
    validTo: '21/09/2026 17:00',
    safetyMeasures: ['Cô lập van áp lực cấp', 'Xả áp suất trong ống nhánh về 0', 'Treo biển CẤM MỞ VAN'],
    status: 'Chờ duyệt'
  }
];

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  currentSubTab = 'dashboard',
  onSelectSubTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<MaintenanceSubTab>(currentSubTab);

  // Keep in sync with prop if changed from Sidebar
  React.useEffect(() => {
    if (currentSubTab) {
      setActiveSubTab(currentSubTab);
    }
  }, [currentSubTab]);

  const handleTabChange = (tab: MaintenanceSubTab) => {
    setActiveSubTab(tab);
    if (onSelectSubTab) {
      onSelectSubTab(tab);
    }
  };

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<MaintenanceTask | null>(null);

  // Systems state
  const [systemsList] = useState<TechnicalSystem[]>(INITIAL_SYSTEMS);
  const [systemSearch, setSystemSearch] = useState('');
  const [selectedSystemCategory, setSelectedSystemCategory] = useState('all');

  // Work Plans state
  const [workPlans] = useState<WorkPlanItem[]>(INITIAL_WORK_PLANS);
  const [planSearch, setPlanSearch] = useState('');

  // Permits state
  const [permitsList, setPermitsList] = useState<WorkPermitItem[]>(INITIAL_PERMITS);
  const [showPermitModal, setShowPermitModal] = useState(false);
  const [newPermitJob, setNewPermitJob] = useState('');
  const [newPermitType, setNewPermitType] = useState<'Phiếu công tác (PCT)' | 'Lệnh công tác (LCT)'>('Phiếu công tác (PCT)');
  const [newPermitLocation, setNewPermitLocation] = useState('Gian máy chính - Tổ máy H1');
  const [newPermitLeader, setNewPermitLeader] = useState('Nguyễn Văn A (Kỹ sư Cơ điện)');
  const [newPermitSafetyMeasure, setNewPermitSafetyMeasure] = useState('');

  // Form state for Task creation
  const [title, setTitle] = useState('');
  const [equipment, setEquipment] = useState('Tổ máy số 1 (Turbine Francis)');
  const [area, setArea] = useState('Gian máy chính');
  const [priority, setPriority] = useState<MaintenanceTask['priority']>('Cao');
  const [assignedTo, setAssignedTo] = useState('Nguyễn Văn A (Kỹ sư Cơ điện)');
  const [desc, setDesc] = useState('');

  const runningCount = tasks.filter(t => t.status === 'Đang sửa chữa' || t.status === 'Đang vận hành').length;
  const waitingCount = tasks.filter(t => t.status === 'Chờ vật tư').length;
  const completedCount = tasks.filter(t => t.status === 'Hoàn thành').length;

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTask: MaintenanceTask = {
      id: `mnt-${Date.now()}`,
      code: `SC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      equipment,
      plantArea: area,
      priority,
      status: 'Đang sửa chữa',
      assignedTo,
      startDate: new Date().toISOString().slice(0, 10),
      estimatedCompletion: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
      progressPercent: 10,
      description: desc || 'Bảo dưỡng sửa chữa thiết bị theo kế hoạch kỹ thuật trạm.',
    };

    onAddTask(newTask);
    setShowAddModal(false);
    setTitle('');
    setDesc('');
  };

  const handleEditTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !onEditTask) return;

    onEditTask(editingTask);
    setEditingTask(null);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete && onDeleteTask) {
      onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleCreatePermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPermitJob) return;

    const newPermit: WorkPermitItem = {
      id: `pm-${Date.now()}`,
      permitNumber: newPermitType.includes('PCT') 
        ? `PCT-ST1-2026-${Math.floor(100 + Math.random() * 900)}` 
        : `LCT-ST1-2026-${Math.floor(10 + Math.random() * 90)}`,
      workType: newPermitType,
      jobTitle: newPermitJob,
      equipmentLocation: newPermitLocation,
      issuerName: 'Hoàng Văn B (Phó GĐ Kỹ thuật)',
      leaderName: newPermitLeader,
      safetySupervisor: 'Đỗ Văn F (Cán bộ An toàn)',
      validFrom: new Date().toLocaleDateString('vi-VN') + ' 08:00',
      validTo: new Date(Date.now() + 86400000 * 2).toLocaleDateString('vi-VN') + ' 17:00',
      safetyMeasures: newPermitSafetyMeasure 
        ? newPermitSafetyMeasure.split('\n').filter(Boolean)
        : ['Cắt điện, cô lập nguồn năng lượng', 'Treo biển báo cấm thao tác', 'Đặt tiếp địa di động'],
      status: 'Chờ duyệt'
    };

    setPermitsList([newPermit, ...permitsList]);
    setShowPermitModal(false);
    setNewPermitJob('');
    setNewPermitSafetyMeasure('');
  };

  return (
    <div className="flex flex-col w-full gap-5 p-4 sm:p-6 bg-[#f9f9ff]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-[#005394] text-[10px] font-extrabold uppercase tracking-wider">
              Phân hệ Kỹ thuật Thủy điện Sơn Trà 1
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111c2c] flex items-center gap-2 mt-1">
            <Wrench className="text-[#005394]" size={22} />
            <span>Quản lý Sửa chữa & Bảo dưỡng Kỹ thuật</span>
          </h2>
          <p className="text-xs text-[#5e7087] mt-0.5">
            Theo dõi kế hoạch đại tu, tiểu tu, danh mục hệ thống và đăng ký phiếu công tác an toàn
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPermitModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <FileEdit size={15} />
            <span>Đăng ký phiếu công tác</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#005394] hover:bg-[#004278] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>Tạo phiếu sửa chữa</span>
          </button>
        </div>
      </div>

      {/* 5 Thư mục con của Quản lý sửa chữa: Dashboard | Danh mục hệ thống | Kế hoạch công tác | Đăng ký công tác | Lịch sử sửa chữa */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'dashboard'
              ? 'bg-[#005394] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
          <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
            activeSubTab === 'dashboard' ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#005394]'
          }`}>
            KPI
          </span>
        </button>

        <button
          onClick={() => handleTabChange('danh-muc-he-thong')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'danh-muc-he-thong'
              ? 'bg-[#005394] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Cpu size={14} />
          <span>Danh mục hệ thống</span>
          <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
            activeSubTab === 'danh-muc-he-thong' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
          }`}>
            {systemsList.length} Cụm
          </span>
        </button>

        <button
          onClick={() => handleTabChange('ke-hoach')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'ke-hoach'
              ? 'bg-[#005394] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <CalendarCheck size={14} />
          <span>Kế hoạch công tác</span>
          <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
            activeSubTab === 'ke-hoach' ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#005394]'
          }`}>
            {workPlans.length} Kế hoạch
          </span>
        </button>

        <button
          onClick={() => handleTabChange('dang-ky')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'dang-ky'
              ? 'bg-[#005394] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileEdit size={14} />
          <span>Đăng ký công tác</span>
          <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
            activeSubTab === 'dang-ky' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {permitsList.length} Phiếu
          </span>
        </button>

        <button
          onClick={() => handleTabChange('lich-su')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'lich-su'
              ? 'bg-[#005394] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <History size={14} />
          <span>Lịch sử sửa chữa</span>
          <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
            activeSubTab === 'lich-su' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
          }`}>
            {completedCount} Đã xong
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. THƯ MỤC CON: DASHBOARD */}
      {/* ========================================================================= */}
      {activeSubTab === 'dashboard' && (
        <div className="flex flex-col gap-5">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
                <span>Đang thực hiện</span>
                <Activity size={16} className="text-[#005394]" />
              </div>
              <p className="text-2xl font-extrabold text-[#005394] mt-2">{runningCount}</p>
              <span className="text-[10px] text-gray-400">Phiếu sửa chữa</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
                <span>Chờ vật tư</span>
                <Clock size={16} className="text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold text-amber-600 mt-2">{waitingCount}</p>
              <span className="text-[10px] text-gray-400">Cần nhập phụ tùng</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
                <span>Đã hoàn thành</span>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-600 mt-2">{completedCount}</p>
              <span className="text-[10px] text-gray-400">Tháng hiện tại</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
                <span>Độ sẵn sàng (AF)</span>
                <Zap size={16} className="text-purple-600" />
              </div>
              <p className="text-2xl font-extrabold text-purple-600 mt-2">99.2%</p>
              <span className="text-[10px] text-emerald-600 font-medium">Đạt tiêu chuẩn EVN</span>
            </div>
          </div>

          {/* Plant Equipment Live Status Dashboard */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#111c2c] flex items-center gap-2">
                  <Cpu className="text-[#005394]" size={17} />
                  <span>Trạng thái Vận hành & Bảo dưỡng Cụm thiết bị trọng điểm</span>
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Giám sát độ rung, nhiệt độ bạc trục và chu kỳ bảo dưỡng kế tiếp của 2 tổ máy và trạm 110kV
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                2/2 Tổ máy phát điện
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-900">TỔ MÁY H1 (15MW)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Hoạt động tốt
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Nhiệt độ ổ đỡ:</span>
                    <strong className="text-gray-800">52.4°C (&lt; 65°C)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Độ rung gối trục:</span>
                    <strong className="text-gray-800">0.82 mm/s (Chuẩn A)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Đại tu kế tiếp:</span>
                    <strong className="text-[#005394]">15/10/2026</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/60 to-yellow-50/40 border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-950">TỔ MÁY H2 (15MW)</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Theo dõi rung lắc
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Nhiệt độ ổ đỡ:</span>
                    <strong className="text-gray-800">58.1°C</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Độ rung gối trục:</span>
                    <strong className="text-amber-800">1.25 mm/s (Đang xử lý)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Phiếu đang mở:</span>
                    <strong className="text-[#005394]">PCT-ST1-2026-088</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/60 to-pink-50/40 border border-purple-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-900">TRẠM BIẾN ÁP 110kV</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    100% Sẵn sàng
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>MBA chính T1:</span>
                    <strong className="text-gray-800">35MVA - Điện áp 115kV</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Khí SF6 máy cắt:</span>
                    <strong className="text-gray-800">0.62 MPa (Bình thường)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Thí nghiệm cao áp:</span>
                    <strong className="text-[#005394]">01/10/2026</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs for Tasks */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs bg-white p-2.5 rounded-xl border border-[#e2eaf5]">
            {[
              { id: 'all', label: 'Tất cả công việc' },
              { id: 'Đang sửa chữa', label: 'Đang sửa chữa' },
              { id: 'Đang vận hành', label: 'Thí nghiệm & Vận hành' },
              { id: 'Chờ vật tư', label: 'Chờ vật tư' },
              { id: 'Hoàn thành', label: 'Đã hoàn thành' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-[#005394] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Maintenance Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col justify-between gap-4 hover:border-[#005394]/40 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#005394] bg-[#eef3fb] px-2 py-0.5 rounded">
                      {task.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      task.priority === 'Cao' || task.priority === 'Khẩn cấp'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'Trung bình'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      Ưu tiên: {task.priority}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 mt-2.5">
                    {task.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <Cpu size={13} className="text-[#005394] flex-shrink-0" />
                      <span className="truncate">{task.equipment}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <User size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{task.assignedTo}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-medium text-gray-500">Tiến độ thực hiện</span>
                    <span className="font-bold text-[#005394]">{task.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#005394] rounded-full transition-all duration-300"
                      style={{ width: `${task.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      task.status === 'Hoàn thành'
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.status === 'Chờ vật tư'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.status}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingTask({ ...task })}
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa phiếu sửa chữa"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        onClick={() => setTaskToDelete(task)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Xóa phiếu sửa chữa"
                      >
                        <Trash2 size={13} />
                      </button>

                      {task.status !== 'Hoàn thành' && (
                        <button
                          onClick={() => onUpdateTaskStatus(task.id, 'Hoàn thành')}
                          className="ml-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Đánh dấu hoàn thành"
                        >
                          <Check size={13} />
                          <span>Xong</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THƯ MỤC CON: DANH MỤC HỆ THỐNG */}
      {/* ========================================================================= */}
      {activeSubTab === 'danh-muc-he-thong' && (
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-[#005394] to-[#003764] text-white p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  Thư mục con: Danh mục hệ thống kỹ thuật
                </span>
              </div>
              <h3 className="text-base font-bold mt-1">Cây Danh mục Cụm Thiết bị & Hệ thống Sơn Trà 1</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Quản lý lý lịch thiết bị, số giờ vận hành tích lũy và chu kỳ bảo dưỡng kế tiếp theo quy chuẩn nhà chế tạo.
              </p>
            </div>
            <button
              onClick={() => {
                setEquipment('Tổ máy 1 (Tuabin Francis)');
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-white text-[#005394] hover:bg-blue-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Plus size={15} />
              <span>Lập phiếu theo hệ thống</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-xl border border-[#e2eaf5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Tìm kiếm hệ thống, tuabin, MBA, SCADA..."
                value={systemSearch}
                onChange={(e) => setSystemSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['all', 'Cơ khí Thủy lực', 'Điện & Trạm cao thế', 'Tự động hóa & Thủy lực', 'Công trình Thủy công'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSystemCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedSystemCategory === cat
                      ? 'bg-[#005394] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả phân loại' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Systems Table */}
          <div className="bg-white rounded-2xl border border-[#e2eaf5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f0f4f9] text-[#414750] font-bold border-b border-[#e2eaf5]">
                    <th className="py-3 px-4">Mã hệ thống</th>
                    <th className="py-3 px-4">Tên Cụm Thiết bị / Hệ thống</th>
                    <th className="py-3 px-4">Khu vực đặt</th>
                    <th className="py-3 px-4">Thông số định mức</th>
                    <th className="py-3 px-4 text-center">Giờ vận hành</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">BD kế tiếp</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {systemsList
                    .filter(s => {
                      const matchSearch = s.name.toLowerCase().includes(systemSearch.toLowerCase()) || 
                                          s.code.toLowerCase().includes(systemSearch.toLowerCase()) ||
                                          s.location.toLowerCase().includes(systemSearch.toLowerCase());
                      const matchCat = selectedSystemCategory === 'all' || s.category === selectedSystemCategory;
                      return matchSearch && matchCat;
                    })
                    .map((system) => (
                      <tr key={system.id} className="hover:bg-[#f8faff] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#005394]">
                          {system.code}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">{system.name}</div>
                          <span className="text-[10px] text-gray-500 font-medium">{system.category}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {system.location}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 text-[11px] max-w-xs truncate" title={system.specifications}>
                          {system.specifications}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-700">
                          {system.operatingHours.toLocaleString()}h
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            system.statusType === 'success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : system.statusType === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {system.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-gray-700">
                          {system.nextMaintenance}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setEquipment(system.name);
                              setArea(system.location);
                              setShowAddModal(true);
                            }}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#005394] rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Lập phiếu
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. THƯ MỤC CON: KẾ HOẠCH CÔNG TÁC */}
      {/* ========================================================================= */}
      {activeSubTab === 'ke-hoach' && (
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  Thư mục con: Kế hoạch công tác định kỳ
                </span>
              </div>
              <h3 className="text-base font-bold mt-1">Lịch Kế hoạch Đại tu & Thí nghiệm Định kỳ 2026</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Các phương án bảo dưỡng đã được phê duyệt phối hợp điều độ Trung tâm Điều độ Hệ thống điện Quốc gia (A0/A2).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Xuất file kế hoạch công tác bảo dưỡng năm 2026 (Excel/PDF)...')}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
              >
                <Download size={15} />
                <span>Xuất kế hoạch EVN</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 bg-white text-[#005394] hover:bg-blue-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={15} />
                <span>Thêm kế hoạch</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white p-3 rounded-xl border border-[#e2eaf5] flex items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Tìm kế hoạch đại tu, tiểu tu, thí nghiệm..."
                value={planSearch}
                onChange={(e) => setPlanSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Hiển thị {workPlans.length} hạng mục trong kế hoạch
            </span>
          </div>

          {/* Work Plans List */}
          <div className="grid grid-cols-1 gap-3.5">
            {workPlans
              .filter(p => p.title.toLowerCase().includes(planSearch.toLowerCase()) || p.code.toLowerCase().includes(planSearch.toLowerCase()))
              .map((plan) => (
                <div 
                  key={plan.id}
                  className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-300 transition-all"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#005394] bg-blue-50 px-2.5 py-0.5 rounded">
                        {plan.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        plan.type === 'Đại tu' 
                          ? 'bg-purple-100 text-purple-800'
                          : plan.type === 'Thí nghiệm hiệu chuẩn'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {plan.type}
                      </span>
                      {plan.outageRequired && (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle size={11} /> Cần cắt điện / Dừng máy
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-gray-900">{plan.title}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-2 truncate">
                      <Cpu size={13} className="text-gray-400" />
                      <span>{plan.systemName}</span>
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-[#005394]" />
                        <strong>Thời gian:</strong> {plan.plannedDate} ({plan.durationDays} ngày)
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={13} className="text-gray-400" />
                        <strong>Chỉ huy:</strong> {plan.leader} ({plan.teamSize} nhân sự)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {plan.approvalStatus}
                    </span>
                    <button
                      onClick={() => {
                        setTitle(plan.title);
                        setEquipment(plan.systemName);
                        setAssignedTo(plan.leader);
                        setShowAddModal(true);
                      }}
                      className="px-3 py-1.5 bg-[#005394] hover:bg-[#004278] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-2xs"
                    >
                      Triển khai phiếu
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. THƯ MỤC CON: ĐĂNG KÝ CÔNG TÁC (PCT / LCT) */}
      {/* ========================================================================= */}
      {activeSubTab === 'dang-ky' && (
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  Thư mục con: Đăng ký Phiếu công tác (PCT) & Lệnh công tác (LCT)
                </span>
              </div>
              <h3 className="text-base font-bold mt-1">Đăng ký Cấp phép Công tác & Biện pháp An toàn Điện</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Tuân thủ nghiêm ngặt Quy chuẩn Kỹ thuật Quốc gia về An toàn Điện EVN khi làm việc tại Thủy điện Sơn Trà 1.
              </p>
            </div>
            <button
              onClick={() => setShowPermitModal(true)}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Plus size={15} />
              <span>Đăng ký phiếu mới</span>
            </button>
          </div>

          {/* Permits Table */}
          <div className="bg-white rounded-2xl border border-[#e2eaf5] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileEdit className="text-emerald-700" size={17} />
                <span>Danh sách Phiếu Công tác (PCT) & Lệnh Công tác (LCT) đang lưu hành</span>
              </h3>
              <span className="text-xs text-gray-500 font-medium">Tổng số: {permitsList.length} phiếu</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f0f4f9] text-[#414750] font-bold border-b border-[#e2eaf5]">
                    <th className="py-3 px-4">Số hiệu phiếu</th>
                    <th className="py-3 px-4">Loại hình</th>
                    <th className="py-3 px-4">Nội dung công việc & Vị trí</th>
                    <th className="py-3 px-4">Người chỉ huy / Cấp phiếu</th>
                    <th className="py-3 px-4">Thời gian hiệu lực</th>
                    <th className="py-3 px-4">Biện pháp an toàn</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {permitsList.map((permit) => (
                    <tr key={permit.id} className="hover:bg-[#f8faff] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                        {permit.permitNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          permit.workType.includes('PCT') ? 'bg-blue-100 text-[#005394]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {permit.workType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{permit.jobTitle}</div>
                        <span className="text-[10px] text-gray-500">{permit.equipmentLocation}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        <div><strong>CH:</strong> {permit.leaderName}</div>
                        <div className="text-[10px] text-gray-500"><strong>Cấp:</strong> {permit.issuerName}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                        <div>{permit.validFrom}</div>
                        <div className="text-gray-400">đến {permit.validTo}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {permit.safetyMeasures.slice(0, 2).map((m, idx) => (
                            <span key={idx} className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 text-[10px] truncate">
                              • {m}
                            </span>
                          ))}
                          {permit.safetyMeasures.length > 2 && (
                            <span className="text-[10px] text-blue-600 font-bold">+{permit.safetyMeasures.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          permit.status === 'Đang thực hiện'
                            ? 'bg-blue-100 text-blue-800'
                            : permit.status === 'Đã phê duyệt'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {permit.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => alert(`Xem chi tiết và in Phiếu Công Tác số: ${permit.permitNumber}`)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Chi tiết PCT
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. THƯ MỤC CON: LỊCH SỬ SỬA CHỮA */}
      {/* ========================================================================= */}
      {activeSubTab === 'lich-su' && (
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  Thư mục con: Lịch sử sửa chữa & Nghiệm thu
                </span>
              </div>
              <h3 className="text-base font-bold mt-1">Nhật ký Đã hoàn thành & Biên bản Nghiệm thu Kỹ thuật</h3>
              <p className="text-xs text-purple-100 mt-0.5">
                Tra cứu lại lịch sử xử lý sự cố, danh mục vật tư phụ tùng đã thay thế và thời gian đưa máy trở lại lưới điện.
              </p>
            </div>
            <button
              onClick={() => alert('Xuất báo cáo tổng kết lịch sử sửa chữa (PDF)...')}
              className="px-4 py-2 bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <FileSpreadsheet size={15} />
              <span>Xuất biên bản nghiệm thu</span>
            </button>
          </div>

          {/* Historical records */}
          <div className="bg-white rounded-2xl border border-[#e2eaf5] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" size={18} />
              <span>Các công trình sửa chữa & bảo dưỡng đã hoàn thành</span>
            </h3>

            <div className="space-y-3">
              {tasks.filter(t => t.status === 'Hoàn thành').map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-[#fbfcfe] flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                        {item.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Đã nghiệm thu đưa vào vận hành
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mt-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                      <span><strong>Thiết bị:</strong> {item.equipment}</span>
                      <span><strong>Kỹ sư chỉ huy:</strong> {item.assignedTo}</span>
                      <span><strong>Thời gian:</strong> {item.startDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center sm:items-end flex-col justify-center">
                    <span className="text-xs font-bold text-emerald-600">Tiến độ 100%</span>
                    <button 
                      onClick={() => alert(`In biên bản nghiệm thu kỹ thuật bàn giao số ${item.code}`)}
                      className="mt-1 text-xs text-[#005394] font-bold hover:underline"
                    >
                      Xem biên bản nghiệm thu →
                    </button>
                  </div>
                </div>
              ))}

              {/* Sample completed historical record if none */}
              {tasks.filter(t => t.status === 'Hoàn thành').length === 0 && (
                <div className="p-4 rounded-xl border border-gray-100 bg-[#fbfcfe] flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                        SC-2026-7890
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Đã nghiệm thu đưa vào vận hành
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mt-1">Thay thế bộ lọc dầu tinh trạm bơm dầu áp lực điều tốc H1</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Đã xuất 02 bộ lõi lọc dầu thủy lực Parker từ kho kỹ thuật, nghiệm thu áp lực dầu đạt 6.3 MPa chuẩn.</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                      <span><strong>Thiết bị:</strong> Hệ thống Điều tốc H1</span>
                      <span><strong>Kỹ sư:</strong> KS. Lê Văn D</span>
                      <span><strong>Ngày:</strong> 28/08/2026</span>
                    </div>
                  </div>
                  <div className="flex items-center sm:items-end flex-col justify-center">
                    <span className="text-xs font-bold text-emerald-600">Tiến độ 100%</span>
                    <button className="mt-1 text-xs text-[#005394] font-bold hover:underline">
                      Xem biên bản nghiệm thu →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ĐĂNG KÝ PHIẾU CÔNG TÁC MỚI */}
      {/* ========================================================================= */}
      {showPermitModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-base font-bold text-[#111c2c] flex items-center gap-2">
                <FileEdit className="text-emerald-600" size={18} />
                <span>Đăng ký Phiếu Công tác (PCT) / Lệnh (LCT)</span>
              </h3>
              <button 
                onClick={() => setShowPermitModal(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePermit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Loại hình văn bản an toàn *</label>
                <select
                  value={newPermitType}
                  onChange={(e) => setNewPermitType(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                >
                  <option value="Phiếu công tác (PCT)">Phiếu công tác (PCT) - Cần cắt điện/cô lập thiết bị</option>
                  <option value="Lệnh công tác (LCT)">Lệnh công tác (LCT) - Công việc không cắt điện trạm</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nội dung công việc đăng ký *</label>
                <input
                  type="text"
                  required
                  value={newPermitJob}
                  onChange={(e) => setNewPermitJob(e.target.value)}
                  placeholder="VD: Kiểm tra và hiệu chỉnh cảm biến áp lực dầu H1"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Vị trí thực hiện</label>
                  <input
                    type="text"
                    value={newPermitLocation}
                    onChange={(e) => setNewPermitLocation(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Người chỉ huy trực tiếp</label>
                  <input
                    type="text"
                    value={newPermitLeader}
                    onChange={(e) => setNewPermitLeader(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Biện pháp an toàn bắt buộc (Mỗi dòng 1 mục)</label>
                <textarea
                  rows={3}
                  value={newPermitSafetyMeasure}
                  onChange={(e) => setNewPermitSafetyMeasure(e.target.value)}
                  placeholder="VD: Cắt điện aptomat nguồn&#10;Treo biển CẤM ĐÓNG ĐIỆN&#10;Nối đất lưu động tại hiện trường"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPermitModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Gửi đăng ký phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TẠO PHIẾU SỬA CHỮA MỚI */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-base font-bold text-[#111c2c] flex items-center gap-2">
                <Plus className="text-[#005394]" size={18} />
                <span>Lập phiếu bảo dưỡng & sửa chữa mới</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên hạng mục sửa chữa *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Kiểm tra và bôi trơn bạc lót tuabin H2"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Thiết bị / Cụm máy</label>
                  <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mức độ ưu tiên</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  >
                    <option value="Cao">Cao</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Thấp">Thấp</option>
                    <option value="Khẩn cấp">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Khu vực nhà máy</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="VD: Gian máy chính / Trạm 110kV"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kỹ sư phụ trách</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô tả công việc & biện pháp an toàn</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ghi chú quy trình tháo lắp, phiếu thao tác..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005394] hover:bg-[#004278] text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Ban hành & Lưu hệ thống
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SỬA PHIẾU SỬA CHỮA */}
      {/* ========================================================================= */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-base font-bold text-[#111c2c] flex items-center gap-2">
                <Edit2 className="text-amber-600" size={18} />
                <span>Chỉnh sửa phiếu: {editingTask.code}</span>
              </h3>
              <button 
                onClick={() => setEditingTask(null)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên hạng mục sửa chữa *</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Thiết bị / Cụm máy</label>
                  <input
                    type="text"
                    value={editingTask.equipment}
                    onChange={(e) => setEditingTask({ ...editingTask, equipment: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mức độ ưu tiên</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  >
                    <option value="Cao">Cao</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Thấp">Thấp</option>
                    <option value="Khẩn cấp">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Trạng thái thực hiện</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as any })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  >
                    <option value="Đang sửa chữa">Đang sửa chữa</option>
                    <option value="Chờ vật tư">Chờ vật tư</option>
                    <option value="Đang vận hành">Đang vận hành</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tiến độ ({editingTask.progressPercent}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={editingTask.progressPercent}
                    onChange={(e) => setEditingTask({ ...editingTask, progressPercent: Number(e.target.value) })}
                    className="w-full mt-2 accent-[#005394]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kỹ sư phụ trách</label>
                  <input
                    type="text"
                    value={editingTask.assignedTo}
                    onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Khu vực trạm</label>
                  <input
                    type="text"
                    value={editingTask.plantArea}
                    onChange={(e) => setEditingTask({ ...editingTask, plantArea: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô tả công việc & ghi chú</label>
                <textarea
                  rows={3}
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Cập nhật thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: XÁC NHẬN XÓA */}
      {/* ========================================================================= */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Xác nhận xóa phiếu sửa chữa</h3>
                <p className="text-[11px] text-gray-500 font-mono">{taskToDelete.code}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa phiếu sửa chữa <strong className="text-gray-900">"{taskToDelete.title}"</strong> khỏi hệ thống? Thao tác này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
