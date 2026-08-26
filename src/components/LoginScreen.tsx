import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, AlertCircle, Sparkles, Shield, Package, Wrench, FileText } from 'lucide-react';
import { DatPhuongLogo } from './DatPhuongLogo';
import { SupabaseService } from '../services/supabaseService';
import { User } from '../types';
import sontraImage from '../assets/images/sontra_dam_1787727552538.jpg';

interface LoginScreenProps {
  onLogin: (user: User | string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      // Authenticate against Supabase database 'User' table
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

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] flex flex-col lg:grid lg:grid-cols-3 overflow-hidden">
      
      {/* LEFT 2 COLUMNS (2/3 width on desktop): Sơn Trà 1 Hydropower Dam Image & Branding */}
      <div className="hidden lg:flex lg:col-span-2 relative bg-[#001c38] text-white flex-col justify-between p-10 xl:p-14 overflow-hidden select-none">
        {/* Background Image: SƠn trà */}
        <div className="absolute inset-0 z-0">
          <img
            src={sontraImage}
            alt="Nhà máy Thủy điện Sơn Trà 1"
            className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* High quality gradient overlay for contrast and legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001830]/95 via-[#002448]/45 to-[#001830]/60" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#001c38]/30 to-[#001428]/80" />
        </div>

        {/* Top Branding with Official Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-lg border border-white/20">
            <DatPhuongLogo size="md" />
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-black/40 backdrop-blur-md border border-white/15 rounded-full text-xs font-semibold text-white/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hệ Thống Trực Tuyến 24/7</span>
          </div>
        </div>

        {/* Center & Bottom Information Overlay */}
        <div className="relative z-10 max-w-2xl mt-auto space-y-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider text-sky-200 border border-white/15">
              Đạt Phương Năng Lượng
            </span>
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
              Nhà Máy Thủy Điện Sơn Trà 1
            </h1>
            <p className="text-sm xl:text-base text-gray-200/90 leading-relaxed font-normal drop-shadow-xs max-w-xl">
              Hệ thống quản lý nội bộ tập trung cho <strong>Kho vật tư</strong>, <strong>Bảo dưỡng & Sửa chữa thiết bị</strong> và <strong>Hồ sơ tài liệu kỹ thuật</strong>.
            </p>
          </div>

          {/* 3 Core Functional Pillars Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-black/35 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-sky-300 flex items-center justify-center flex-shrink-0">
                <Package size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Quản Lý Kho</p>
                <p className="text-[11px] text-gray-300">Vật tư & Phụ tùng</p>
              </div>
            </div>

            <div className="bg-black/35 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Wrench size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sửa Chữa</p>
                <p className="text-[11px] text-gray-300">Lịch & Phiếu công tác</p>
              </div>
            </div>

            <div className="bg-black/35 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Hồ Sơ Tài Liệu</p>
                <p className="text-[11px] text-gray-300">Bản vẽ & Quy trình</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT 1 COLUMN (1/3 width on desktop): Modern Login Form */}
      <div className="w-full lg:col-span-1 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-8 xl:p-12 relative bg-white lg:bg-[#f8faff] lg:border-l border-[#e2eaf5] overflow-y-auto">
        
        {/* Top Mobile Brand Banner (Visible only on mobile/tablet) */}
        <div className="lg:hidden flex flex-col items-center text-center pt-2 pb-4">
          <DatPhuongLogo size="lg" className="mb-2" />
          <h2 className="text-xs font-bold text-[#005394] tracking-wider uppercase">
            Nhà máy thủy điện Sơn Trà 1
          </h2>
        </div>

        {/* Top Logo for Desktop Column */}
        <div className="hidden lg:flex flex-col items-center text-center pt-2">
          <DatPhuongLogo size="lg" className="mb-2 drop-shadow-2xs" />
          <span className="text-[11px] font-bold text-[#005394] tracking-widest uppercase mt-0.5">
            Nhà Máy Thủy Điện Sơn Trà 1
          </span>
        </div>

        {/* Main Login Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-[#002b55] uppercase tracking-tight">
              Đăng Nhập Hệ Thống
            </h1>
            <p className="text-xs text-[#5e7087] mt-1">
              Nhập email và mật khẩu tài khoản nội bộ của bạn
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div 
              id="login-error-alert"
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
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
                EMAIL ĐĂNG NHẬP
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
                  placeholder="nguyenhuuhoa0109@gmail.com"
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
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full pl-10 pr-11 py-3 bg-[#eef3fb] border border-transparent focus:border-[#005394] focus:bg-white focus:ring-2 focus:ring-[#005394]/15 rounded-xl text-sm text-[#111c2c] placeholder:text-[#8898aa] transition-all outline-none font-mono"
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

            {/* Remember me & Role indicator */}
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

              <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                <Shield size={12} className="text-[#005394]" />
                <span>Bảo mật Supabase</span>
              </div>
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
                  <span>Đang xác thực...</span>
                </div>
              ) : (
                <>
                  <span>ĐĂNG NHẬP</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Support Hotline */}
        <div className="text-center pt-4 pb-2">
          <a 
            href="tel:0976645116"
            id="technical-support-phone-link"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50/80 border border-[#d2dfef] hover:border-[#005394] rounded-full shadow-2xs text-xs font-bold text-[#003866] transition-all hover:shadow-xs group"
          >
            <div className="w-5 h-5 rounded-full bg-[#005394] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone size={11} />
            </div>
            <span>Hỗ trợ kỹ thuật: 0976645116</span>
          </a>
        </div>

      </div>

    </div>
  );
};
