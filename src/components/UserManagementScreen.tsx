import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Building2, 
  Mail, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Lock,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { DbUserRecord, User } from '../types';
import { SupabaseService } from '../services/supabaseService';

interface UserManagementScreenProps {
  currentUser: User;
}

export const UserManagementScreen: React.FC<UserManagementScreenProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<DbUserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DbUserRecord | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState<DbUserRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form fields
  const [formData, setFormData] = useState<DbUserRecord>({
    Email: '',
    Mat_khau: '',
    Ho_ten: '',
    Chuc_vu: 'Kỹ sư Vận hành',
    Phong_ban: 'Ban Kỹ Thuật & Sửa Chữa (KTSC)'
  });

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await SupabaseService.getAllUsers();
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        // Fallback with default data if DB is empty
        setUsers([
          {
            ID: 1,
            Email: 'nguyenhuuhoa0109@gmail.com',
            Mat_khau: 'abc123',
            Ho_ten: 'Nguyễn Hữu Hòa',
            Chuc_vu: 'Quản trị viên (Admin)',
            Phong_ban: 'Ban Kỹ Thuật & Sửa Chữa (KTSC)'
          }
        ]);
      }
    } catch (e) {
      console.error('Lỗi khi tải danh sách người dùng:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      Email: '',
      Mat_khau: '',
      Ho_ten: '',
      Chuc_vu: 'Kỹ sư Vận hành',
      Phong_ban: 'Ban Kỹ Thuật & Sửa Chữa (KTSC)'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: DbUserRecord) => {
    setEditingUser(user);
    setFormData({
      ID: user.ID,
      id: user.id,
      Email: user.Email,
      Mat_khau: user.Mat_khau,
      Ho_ten: user.Ho_ten,
      Chuc_vu: user.Chuc_vu,
      Phong_ban: user.Phong_ban
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Email || !formData.Mat_khau || !formData.Ho_ten) {
      setFormError('Vui lòng điền đầy đủ Email, Mật khẩu và Họ tên');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (editingUser) {
        // Update user
        const idKey = editingUser.ID || editingUser.id || editingUser.Email;
        const res = await SupabaseService.updateDbUser(idKey, formData);
        if (res.success) {
          showToast('Cập nhật người dùng thành công!', 'success');
          setIsModalOpen(false);
          await loadUsers();
        } else {
          setFormError(res.message);
        }
      } else {
        // Create user
        const res = await SupabaseService.createDbUser(formData);
        if (res.success) {
          showToast('Thêm người dùng mới thành công!', 'success');
          setIsModalOpen(false);
          await loadUsers();
        } else {
          setFormError(res.message);
        }
      }
    } catch (err: any) {
      setFormError(err?.message || 'Có lỗi xảy ra trong quá trình xử lý');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!isDeletingUser) return;
    setIsSubmitting(true);
    try {
      const idKey = isDeletingUser.ID || isDeletingUser.id || isDeletingUser.Email;
      const res = await SupabaseService.deleteDbUser(idKey);
      if (res.success) {
        showToast(`Đã xóa người dùng "${isDeletingUser.Ho_ten}" thành công!`, 'success');
        setIsDeletingUser(null);
        await loadUsers();
      } else {
        showToast(res.message, 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Không thể xóa người dùng', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = (key: string) => {
    setShowPasswordMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = 
      !q || 
      u.Ho_ten.toLowerCase().includes(q) || 
      u.Email.toLowerCase().includes(q) || 
      u.Chuc_vu.toLowerCase().includes(q) || 
      u.Phong_ban.toLowerCase().includes(q);

    const matchDept = selectedDepartment === 'all' || u.Phong_ban === selectedDepartment;
    return matchQuery && matchDept;
  });

  const departments = Array.from(new Set(users.map(u => u.Phong_ban).filter(Boolean)));

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#e2eaf5] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#005394]/10 text-[#005394] flex items-center justify-center font-bold">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#111c2c]">Quản lý người dùng hệ thống</h1>
              <p className="text-xs text-[#5f6876] mt-0.5">
                Bảng phân quyền & tài khoản đăng nhập <span className="font-semibold text-[#005394]">(Bảng User trên Supabase)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#005394]' : ''} />
            <span>Làm mới</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#005394] hover:bg-[#004277] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
          <p className="text-xs font-medium text-gray-500">Tổng số tài khoản</p>
          <p className="text-2xl font-bold text-[#111c2c] mt-1">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
          <p className="text-xs font-medium text-gray-500">Quản trị viên (Admin)</p>
          <p className="text-2xl font-bold text-[#005394] mt-1">
            {users.filter(u => u.Chuc_vu.toLowerCase().includes('admin') || u.Chuc_vu.toLowerCase().includes('quản trị')).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
          <p className="text-xs font-medium text-gray-500">Kỹ sư Vận hành / KTSC</p>
          <p className="text-2xl font-bold text-sky-600 mt-1">
            {users.filter(u => u.Chuc_vu.toLowerCase().includes('kỹ sư') || u.Chuc_vu.toLowerCase().includes('vận hành')).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#e2eaf5] shadow-2xs">
          <p className="text-xs font-medium text-gray-500">Thủ kho / Khác</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {users.filter(u => !u.Chuc_vu.toLowerCase().includes('admin') && !u.Chuc_vu.toLowerCase().includes('kỹ sư')).length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e2eaf5] p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo họ tên, email, chức vụ..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111c2c] focus:bg-white focus:border-[#005394] focus:ring-2 focus:ring-[#005394]/10 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 whitespace-nowrap">Phòng ban:</span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:bg-white focus:border-[#005394]"
          >
            <option value="all">Tất cả phòng ban ({users.length})</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#e2eaf5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Họ và Tên</th>
                <th className="py-3.5 px-4">Email Đăng Nhập</th>
                <th className="py-3.5 px-4">Mật Khẩu (Mat_khau)</th>
                <th className="py-3.5 px-4">Chức Vụ</th>
                <th className="py-3.5 px-4">Phòng Ban</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw size={24} className="animate-spin text-[#005394]" />
                      <p className="text-xs">Đang tải danh sách người dùng từ Supabase...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={32} className="text-gray-300" />
                      <p className="text-sm font-medium text-gray-600">Không tìm thấy người dùng phù hợp</p>
                      <p className="text-xs text-gray-400">Thử thay đổi từ khóa tìm kiếm hoặc nhấn nút "Thêm người dùng".</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => {
                  const key = String(u.ID || u.id || u.Email || idx);
                  const isPwVisible = !!showPasswordMap[key];
                  const isAdmin = u.Chuc_vu.toLowerCase().includes('admin') || u.Chuc_vu.toLowerCase().includes('quản trị');

                  return (
                    <tr key={key} className="hover:bg-blue-50/40 transition-colors">
                      {/* Name & Initials */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#005394]/10 text-[#005394] font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {u.Ho_ten.split(' ').slice(-2).map(w => w[0]?.toUpperCase()).join('') || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{u.Ho_ten}</span>
                            {u.Email === currentUser.email && (
                              <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold bg-blue-100 text-[#005394] rounded-sm">
                                Tài khoản của bạn
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <Mail size={13} className="text-gray-400" />
                          <span>{u.Email}</span>
                        </div>
                      </td>

                      {/* Mat_khau */}
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                            {isPwVisible ? u.Mat_khau : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleShowPassword(key)}
                            className="text-gray-400 hover:text-gray-700 p-1 transition-colors"
                            title={isPwVisible ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                          >
                            {isPwVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.8 rounded-full text-[11px] font-bold tracking-wide ${
                          isAdmin 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : u.Chuc_vu.toLowerCase().includes('kỹ sư')
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          <ShieldCheck size={12} />
                          <span>{u.Chuc_vu}</span>
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-gray-400" />
                          <span>{u.Phong_ban}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-gray-500 hover:text-[#005394] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Sửa thông tin tài khoản"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setIsDeletingUser(u)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa tài khoản"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm / Chỉnh Sửa Người Dùng */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#005394] to-[#003763] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <h3 className="font-bold text-base">
                  {editingUser ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản người dùng'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Họ và Tên */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.Ho_ten}
                  onChange={(e) => setFormData({ ...formData, Ho_ten: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Hữu Hòa"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#005394] focus:ring-2 focus:ring-[#005394]/10 transition-all outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Đăng Nhập (Email) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  placeholder="Ví dụ: nguyenhuuhoa0109@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#005394] focus:ring-2 focus:ring-[#005394]/10 transition-all outline-none font-mono"
                />
              </div>

              {/* Mật Khẩu (Mat_khau) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mật Khẩu (Mat_khau) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.Mat_khau}
                    onChange={(e) => setFormData({ ...formData, Mat_khau: e.target.value })}
                    placeholder="Nhập mật khẩu cho tài khoản"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#005394] focus:ring-2 focus:ring-[#005394]/10 transition-all outline-none font-mono"
                  />
                  <KeyRound size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Chức Vụ */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Chức Vụ / Vai Trò <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.Chuc_vu}
                  onChange={(e) => setFormData({ ...formData, Chuc_vu: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:bg-white focus:border-[#005394] transition-all outline-none"
                >
                  <option value="Quản trị viên (Admin)">Quản trị viên (Admin)</option>
                  <option value="Kỹ sư trưởng KTSC">Kỹ sư trưởng KTSC</option>
                  <option value="Kỹ sư Vận hành">Kỹ sư Vận hành</option>
                  <option value="Thủ kho KTSC">Thủ kho KTSC</option>
                  <option value="Chuyên viên Kỹ thuật">Chuyên viên Kỹ thuật</option>
                  <option value="Trưởng ca Vận hành">Trưởng ca Vận hành</option>
                </select>
              </div>

              {/* Phòng Ban */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phòng Ban / Đội Công Tác <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.Phong_ban}
                  onChange={(e) => setFormData({ ...formData, Phong_ban: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:bg-white focus:border-[#005394] transition-all outline-none"
                >
                  <option value="Ban Kỹ Thuật & Sửa Chữa (KTSC)">Ban Kỹ Thuật & Sửa Chữa (KTSC)</option>
                  <option value="Đội Vận Hành Sơn Trà 1">Đội Vận Hành Sơn Trà 1</option>
                  <option value="Kho Vật Tư Thiết Bị">Kho Vật Tư Thiết Bị</option>
                  <option value="Ban Giám Đốc Nhà Máy">Ban Giám Đốc Nhà Máy</option>
                  <option value="Phòng Kế Hoạch - Vật Tư">Phòng Kế Hoạch - Vật Tư</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#005394] hover:bg-[#004277] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>{editingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa Người Dùng */}
      {isDeletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-base text-gray-900">Xác nhận xóa tài khoản?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Bạn có chắc chắn muốn xóa tài khoản <span className="font-bold text-gray-800">{isDeletingUser.Ho_ten}</span> ({isDeletingUser.Email}) khỏi bảng User trên Supabase?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletingUser(null)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Không, giữ lại
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
