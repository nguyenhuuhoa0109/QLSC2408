import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, AlertCircle, Sparkles } from 'lucide-react';
import { DatPhuongLogo } from './DatPhuongLogo';
import { SupabaseService } from '../services/supabaseService';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User | string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('nguyenhuuhoa0109@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Vui lòng nhập mật khẩu');
      return;
    }

    setIsLoading(true);

    try {
      // Authenticate against Supabase database 'users' table
      const authResult = await SupabaseService.authenticateUser(email, password);

      if (authResult.success && authResult.user) {
        onLogin(authResult.user);
      } else {
        setErrorMessage(authResult.message || 'Bạn nhập sai email hoặc mật khẩu');
      }
    } catch (err: any) {
      setErrorMessage('Bạn nhập sai email hoặc mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (userType: 'hoa' | 'admin' | 'engineer' | 'manager') => {
    setErrorMessage('');
    if (userType === 'hoa') {
      setEmail('nguyenhuuhoa0109@gmail.com');
      setPassword('123456');
    } else if (userType === 'admin') {
      setEmail('admin@sontra.vn');
      setPassword('admin@123');
    } else if (userType === 'engineer') {
      setEmail('kysu.sontra@gmail.com');
      setPassword('sontra2023');
    } else {
      setEmail('thukho.sontra@gmail.com');
      setPassword('kho@2023');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-[#f5f8fc] relative overflow-hidden px-4 py-6 sm:py-10">
      {/* Background Subtle Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#b0c4de 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Spacer */}
      <div className="w-full max-w-md hidden sm:block" />

      {/* Main Login Card */}
      <div className="w-full max-w-[430px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_10px_35px_rgba(0,40,90,0.06)] border border-[#e2eaf5] p-7 sm:p-9 z-10 flex flex-col relative transition-all duration-300 my-auto">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <DatPhuongLogo size="lg" className="mb-4 drop-shadow-xs" />
          
          <h2 className="text-xs sm:text-[13px] font-bold text-[#005394] tracking-wider uppercase">
            Nhà máy thủy điện Sơn Trà 1
          </h2>
          
          <h1 className="text-xl sm:text-[22px] font-extrabold text-[#002b55] tracking-wide uppercase leading-tight mt-1">
            Hệ thống quản lý nội bộ
          </h1>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eef4fc] text-[#004b87] rounded-full text-[11px] font-semibold mt-3.5 border border-[#d6e4f7]">
            <Sparkles size={13} className="text-[#005394]" />
            <span>Cổng đăng nhập cán bộ kỹ thuật</span>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div 
            id="login-error-alert"
            className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">
              {errorMessage}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-[#4a586d] uppercase tracking-wider">
              EMAIL
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#5e7087] pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Nhập địa chỉ email"
                className="w-full pl-10 pr-4 py-3 bg-[#eef3fb] border border-transparent focus:border-[#005394] focus:bg-white focus:ring-2 focus:ring-[#005394]/15 rounded-xl text-sm text-[#111c2c] placeholder:text-[#8898aa] transition-all outline-none"
                required
                autoComplete="email"
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-11 py-3 bg-[#eef3fb] border border-transparent focus:border-[#005394] focus:bg-white focus:ring-2 focus:ring-[#005394]/15 rounded-xl text-sm text-[#111c2c] placeholder:text-[#8898aa] transition-all outline-none"
                required
                autoComplete="current-password"
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
              <span>Ghi nhớ đăng nhập</span>
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
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang kiểm tra...</span>
              </div>
            ) : (
              <>
                <span>ĐĂNG NHẬP</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="mt-5 pt-4 border-t border-[#edf2f9]">
          <p className="text-[10px] font-bold text-[#728399] uppercase tracking-wider mb-2 text-center">
            Chọn nhanh tài khoản mẫu
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('hoa')}
              className="py-1.5 px-2 bg-[#f0f4fa] hover:bg-[#dbe9ff] text-[#003d73] rounded-lg font-medium transition-colors text-left truncate flex items-center gap-1 border border-[#e2eaf5]"
              title="nguyenhuuhoa0109@gmail.com"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="truncate">Kỹ sư Hòa</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 bg-[#f0f4fa] hover:bg-[#dbe9ff] text-[#003d73] rounded-lg font-medium transition-colors text-left truncate flex items-center gap-1 border border-[#e2eaf5]"
              title="admin@sontra.vn"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
              <span className="truncate">Quản trị viên</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('engineer')}
              className="py-1.5 px-2 bg-[#f0f4fa] hover:bg-[#dbe9ff] text-[#003d73] rounded-lg font-medium transition-colors text-left truncate flex items-center gap-1 border border-[#e2eaf5]"
              title="kysu.sontra@gmail.com"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span className="truncate">Kỹ sư KTSC</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('manager')}
              className="py-1.5 px-2 bg-[#f0f4fa] hover:bg-[#dbe9ff] text-[#003d73] rounded-lg font-medium transition-colors text-left truncate flex items-center gap-1 border border-[#e2eaf5]"
              title="thukho.sontra@gmail.com"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
              <span className="truncate">Thủ kho</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer info: Hổ trợ kỹ thuật: 0976645116 */}
      <div className="mt-6 text-center z-10 pb-2">
        <a 
          href="tel:0976645116"
          id="technical-support-phone-link"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-[#d2dfef] hover:border-[#005394] rounded-full shadow-xs text-xs font-bold text-[#003866] transition-all hover:shadow-sm group"
        >
          <div className="w-5 h-5 rounded-full bg-[#005394] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone size={11} />
          </div>
          <span>Hổ trợ kỹ thuật: 0976645116</span>
        </a>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#002b55] mb-2">Khôi phục mật khẩu</h3>
            <p className="text-xs text-[#526071] mb-4">
              Vui lòng liên hệ trực tiếp Ban Kỹ thuật & Sửa chữa (KTSC) hoặc số điện thoại hỗ trợ kỹ thuật để được cấp lại mật khẩu truy cập nội bộ.
            </p>
            <div className="bg-[#f0f4fa] p-3 rounded-xl text-xs space-y-1.5 text-[#223b56] mb-5">
              <p>• <strong>Hỗ trợ kỹ thuật:</strong> <a href="tel:0976645116" className="text-[#005394] font-bold underline">0976645116</a></p>
              <p>• <strong>Phòng KTSC:</strong> Tầng 2 Nhà Điều hành Sơn Trà 1</p>
              <p>• <strong>Mã trạm:</strong> ST1-HYDRO-KTSC</p>
            </div>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="w-full py-2.5 bg-[#005394] hover:bg-[#004278] text-white rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
