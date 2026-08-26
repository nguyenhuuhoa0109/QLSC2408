import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, AlertCircle, Shield } from 'lucide-react';
import { DatPhuongLogo } from './DatPhuongLogo';
import { SupabaseService } from '../services/supabaseService';
import { User } from '../types';
import sontraImage from '../assets/images/sontra_lh_dam_1787730600580.jpg';

interface LoginScreenProps {
  onLogin: (user: User | string) => void;
}

const STORAGE_EMAIL_KEY = 'sontra_saved_email';
const STORAGE_PASSWORD_KEY = 'sontra_saved_password';
const STORAGE_REMEMBER_KEY = 'sontra_remember_me';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  // Load saved credentials from localStorage if remembered
  const [email, setEmail] = useState(() => {
    return localStorage.getItem(STORAGE_EMAIL_KEY) || 'nguyenhuuhoa0109@gmail.com';
  });
  const [password, setPassword] = useState(() => {
    return localStorage.getItem(STORAGE_PASSWORD_KEY) || '';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    const saved = localStorage.getItem(STORAGE_REMEMBER_KEY);
    return saved !== null ? saved === 'true' : true;
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync initial state if localStorage has credentials
  useEffect(() => {
    const savedRemember = localStorage.getItem(STORAGE_REMEMBER_KEY);
    if (savedRemember === 'true') {
      const savedEmail = localStorage.getItem(STORAGE_EMAIL_KEY);
      const savedPass = localStorage.getItem(STORAGE_PASSWORD_KEY);
      if (savedEmail) setEmail(savedEmail);
      if (savedPass) setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

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
        // Save or clear credentials in localStorage based on Remember Me
        if (rememberMe) {
          localStorage.setItem(STORAGE_EMAIL_KEY, email.trim());
          localStorage.setItem(STORAGE_PASSWORD_KEY, password);
          localStorage.setItem(STORAGE_REMEMBER_KEY, 'true');
        } else {
          localStorage.removeItem(STORAGE_EMAIL_KEY);
          localStorage.removeItem(STORAGE_PASSWORD_KEY);
          localStorage.setItem(STORAGE_REMEMBER_KEY, 'false');
        }

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
    <div className="min-h-screen w-full bg-[#f4f7fb] flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT SECTION (Expanded width on desktop): Pure original Sơn Trà 1 image */}
      <div className="hidden lg:flex flex-1 relative h-screen bg-slate-900 overflow-hidden select-none">
        <img
          src={sontraImage}
          alt="Nhà máy Thủy điện Sơn Trà 1"
          className="w-full h-full object-cover object-right"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* RIGHT LOGIN PANEL (Narrower, compact & modern): Width ~380px to 420px */}
      <div className="w-full lg:w-[380px] xl:w-[410px] 2xl:w-[430px] lg:flex-shrink-0 min-h-screen flex flex-col justify-between p-6 sm:p-8 lg:p-7 xl:p-8 relative bg-white lg:bg-[#f8faff] lg:border-l border-[#e2eaf5] overflow-y-auto">
        
        {/* Top Logo - DATPHUONG SON TRA ENERGY */}
        <div className="flex flex-col items-center text-center pt-2 pb-1">
          <DatPhuongLogo size="lg" showSubtitle={true} className="mb-1" />
        </div>

        {/* Main Login Form Container */}
        <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto my-auto py-3">
          <div className="text-center mb-5">
            <h1 className="text-lg sm:text-xl font-black text-[#002b55] uppercase tracking-tight">
              ĐĂNG NHẬP HỆ THỐNG
            </h1>
            <p className="text-xs text-[#5e7087] mt-1">
              Nhập email và mật khẩu tài khoản nội bộ
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div 
              id="login-error-alert"
              className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#4a586d] uppercase tracking-wider">
                EMAIL ĐĂNG NHẬP
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#5e7087] pointer-events-none">
                  <Mail size={16} />
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
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#eef3fb] border border-transparent focus:border-[#005394] focus:bg-white focus:ring-2 focus:ring-[#005394]/15 rounded-xl text-xs sm:text-sm text-[#111c2c] placeholder:text-[#8898aa] transition-all outline-none"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[#4a586d] uppercase tracking-wider">
                MẬT KHẨU
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#5e7087] pointer-events-none">
                  <Lock size={16} />
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
                  className="w-full pl-9 pr-10 py-2.5 bg-[#eef3fb] border border-transparent focus:border-[#005394] focus:bg-white focus:ring-2 focus:ring-[#005394]/15 rounded-xl text-xs sm:text-sm text-[#111c2c] placeholder:text-[#8898aa] transition-all outline-none font-mono"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  id="login-toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#6c7c93] hover:text-[#005394] transition-colors p-1 cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me & Security indicator */}
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#4a586d] font-medium text-[11px] sm:text-xs">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#005394] focus:ring-[#005394] border-[#cfdaf1] cursor-pointer"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                <Shield size={11} className="text-[#005394]" />
                <span>Bảo mật</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#005394] hover:bg-[#004278] active:bg-[#003460] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xác thực...</span>
                </div>
              ) : (
                <>
                  <span>ĐĂNG NHẬP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Support Hotline */}
        <div className="text-center pt-3 pb-1">
          <a 
            href="tel:0976645116"
            id="technical-support-phone-link"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-blue-50/80 border border-[#d2dfef] hover:border-[#005394] rounded-full shadow-2xs text-[11px] sm:text-xs font-bold text-[#003866] transition-all hover:shadow-xs group"
          >
            <div className="w-4 h-4 rounded-full bg-[#005394] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone size={10} />
            </div>
            <span>Hỗ trợ kỹ thuật: 0976645116</span>
          </a>
        </div>

      </div>

    </div>
  );
};

