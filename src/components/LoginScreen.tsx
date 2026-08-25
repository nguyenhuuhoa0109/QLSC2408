import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { DatPhuongLogo } from './DatPhuongLogo';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin.sontra');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Vui lòng nhập mật khẩu');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(username);
    }, 450);
  };

  const handleQuickFill = (userType: 'admin' | 'engineer' | 'manager') => {
    if (userType === 'admin') {
      setUsername('admin.sontra');
      setPassword('admin@123');
    } else if (userType === 'engineer') {
      setUsername('kysu.nguyen');
      setPassword('sontra2023');
    } else {
      setUsername('thukho.tran');
      setPassword('kho@2023');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f5f8fc] relative overflow-hidden px-4 py-8">
      {/* Background Subtle Dot Pattern matching Image 5 & 7 */}
      <div 
        className="absolute inset-0 opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#b0c4de 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Main Login Card */}
      <div className="w-full max-w-[430px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_10px_35px_rgba(0,40,90,0.06)] border border-[#e2eaf5] p-7 sm:p-10 z-10 flex flex-col relative transition-all duration-300">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <DatPhuongLogo size="lg" className="mb-4" />
          
          <h1 className="text-xl sm:text-[22px] font-bold text-[#002b55] tracking-wide uppercase leading-tight">
            HỆ THỐNG QUẢN LÝ NỘI BỘ
          </h1>
          
          <h2 className="text-xs sm:text-[13px] font-semibold text-[#005394] tracking-wider uppercase mt-1">
            NHÀ MÁY THỦY ĐIỆN SƠN TRÀ 1
          </h2>

          <p className="text-xs text-[#526071] font-medium mt-3">
            Đăng nhập hệ thống
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span className="font-semibold">Lỗi:</span> {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#4a586d] uppercase tracking-wider">
              TÊN ĐĂNG NHẬP
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#5e7087] pointer-events-none">
                <User size={18} />
              </div>
              <input
                id="login-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tài khoản kỹ sư"
                className="w-full pl-10 pr-4 py-3 bg-[#eef3fb] border border-transparent focus:border-[#005394] focus:bg-white focus:ring-2 focus:ring-[#005394]/15 rounded-xl text-sm text-[#111c2c] placeholder:text-[#8898aa] transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#4a586d] uppercase tracking-wider">
              MẬT KHẨU
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#5e7087] pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-11 py-3 bg-[#eef3fb] border border-transparent focus:border-[#005394] focus:bg-white focus:ring-2 focus:ring-[#005394]/15 rounded-xl text-sm text-[#111c2c] placeholder:text-[#8898aa] transition-all outline-none"
                required
              />
              <button
                type="button"
                id="login-toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#6c7c93] hover:text-[#005394] transition-colors p-1"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#4a586d] font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#005394] focus:ring-[#005394] border-[#cfdaf1]"
              />
              <span>Ghi nhớ mật khẩu</span>
            </label>

            <button
              type="button"
              id="login-forgot-password-btn"
              onClick={() => setForgotModalOpen(true)}
              className="text-[#005394] hover:text-[#003b6a] font-medium transition-colors hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 px-4 bg-[#005394] hover:bg-[#004278] active:bg-[#003460] text-white font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>ĐĂNG NHẬP</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="mt-6 pt-4 border-t border-[#edf2f9]">
          <p className="text-[11px] font-semibold text-[#728399] uppercase tracking-wider mb-2 text-center">
            Tài khoản mẫu thử nghiệm
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 bg-[#f0f4fa] hover:bg-[#e1ecff] text-[#004881] rounded-lg font-medium transition-colors text-center truncate"
              title="Quản trị viên"
            >
              Quản trị viên
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('engineer')}
              className="py-1.5 px-2 bg-[#f0f4fa] hover:bg-[#e1ecff] text-[#004881] rounded-lg font-medium transition-colors text-center truncate"
              title="Kỹ sư vận hành"
            >
              Kỹ sư KTSC
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('manager')}
              className="py-1.5 px-2 bg-[#f0f4fa] hover:bg-[#e1ecff] text-[#004881] rounded-lg font-medium transition-colors text-center truncate"
              title="Thủ kho"
            >
              Thủ kho
            </button>
          </div>
        </div>
      </div>

      {/* Footer info matching Image 5 / Image 7 */}
      <div className="mt-6 text-center z-10">
        <p className="text-xs font-semibold text-[#5a6b82] tracking-wider uppercase flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-[#005394]" />
          <span>HỖ TRỢ KỸ THUẬT: BAN KTSC</span>
        </p>
        <p className="text-[11px] text-[#8696ab] mt-1">
          Hotline nội bộ: Ext 102 - 104 • Email: ktsc@sontraenergy.vn
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#002b55] mb-2">Khôi phục mật khẩu</h3>
            <p className="text-xs text-[#526071] mb-4">
              Vui lòng liên hệ trực tiếp Ban Kỹ thuật & Sửa chữa (KTSC) hoặc quản trị hệ thống phòng SCADA để được cấp lại mật khẩu truy cập nội bộ.
            </p>
            <div className="bg-[#f0f4fa] p-3 rounded-xl text-xs space-y-1 text-[#223b56] mb-5">
              <p>• <strong>Phòng KTSC:</strong> Tầng 2 Nhà Điều hành</p>
              <p>• <strong>Điện thoại:</strong> (0255) 3.824.114</p>
              <p>• <strong>Mã trạm:</strong> ST1-HYDRO-2023</p>
            </div>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="w-full py-2.5 bg-[#005394] hover:bg-[#004278] text-white rounded-xl text-xs font-bold uppercase transition-colors"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
