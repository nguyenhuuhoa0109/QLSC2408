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
  AlertTriangle
} from 'lucide-react';
import { MaintenanceTask } from '../types';

interface MaintenanceScreenProps {
  tasks: MaintenanceTask[];
  onAddTask: (task: MaintenanceTask) => void;
  onEditTask?: (task: MaintenanceTask) => void;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: MaintenanceTask['status']) => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<MaintenanceTask | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [equipment, setEquipment] = useState('Tổ máy số 1 (Turbine Francis)');
  const [area, setArea] = useState('Nhà máy chính');
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
      code: `SC-2023-${Math.floor(1000 + Math.random() * 9000)}`,
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

  return (
    <div className="flex flex-col w-full gap-5 p-4 sm:p-6 bg-[#f9f9ff]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111c2c] flex items-center gap-2">
            <Wrench className="text-[#005394]" size={22} />
            <span>Quản lý Sửa chữa & Bảo dưỡng Kỹ thuật</span>
          </h2>
          <p className="text-xs text-[#5e7087] mt-0.5">
            Theo dõi kế hoạch đại tu, tiểu tu và xử lý sự cố thiết bị thủy điện
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#005394] hover:bg-[#004278] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Tạo phiếu sửa chữa</span>
        </button>
      </div>

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

      {/* Filter Tabs */}
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

      {/* Add Task Modal */}
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
                  Ban hành & Lưu Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
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

      {/* Delete Confirmation Modal */}
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
              Bạn có chắc chắn muốn xóa phiếu sửa chữa <strong className="text-gray-900">"{taskToDelete.title}"</strong> khỏi cơ sở dữ liệu Supabase? Thao tác này không thể hoàn tác.
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
