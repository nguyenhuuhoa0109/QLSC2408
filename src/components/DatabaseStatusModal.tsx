import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Server, 
  UploadCloud, 
  ShieldCheck, 
  Zap,
  Key,
  Layers,
  AlertCircle
} from 'lucide-react';
import { SUPABASE_URL, SUPABASE_ANON_KEY, updateSupabaseCredentials } from '../lib/supabase';
import { SupabaseService, SUPABASE_SQL_SCHEMA, SupabaseHealth } from '../services/supabaseService';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataSyncFinished?: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
  onDataSyncFinished
}) => {
  const [health, setHealth] = useState<SupabaseHealth | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  // Edit Credentials
  const [showConfigEdit, setShowConfigEdit] = useState(false);
  const [inputUrl, setInputUrl] = useState(SUPABASE_URL);
  const [inputKey, setInputKey] = useState(SUPABASE_ANON_KEY);
  const [saveKeySuccess, setSaveKeySuccess] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    const result = await SupabaseService.checkConnection();
    setHealth(result);
    setIsChecking(false);
  };

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    const res = await SupabaseService.seedInitialDataToSupabase();
    setSeedResult(res);
    setIsSeeding(false);
    checkHealth();
    if (res.success && onDataSyncFinished) {
      onDataSyncFinished();
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || !inputKey) return;
    updateSupabaseCredentials(inputUrl, inputKey);
    setSaveKeySuccess(true);
    setTimeout(() => setSaveKeySuccess(false), 2000);
    checkHealth();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#005394] text-white flex items-center justify-center shadow-xs">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#111c2c]">
                Trạng thái Kết nối Supabase Database
              </h2>
              <p className="text-xs text-[#5e7087]">
                Giám sát đồng bộ dữ liệu thời gian thực (Real-time Cloud PostgreSQL)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Credentials & Connection Status Box */}
        <div className="space-y-4 py-4 text-xs">
          
          {/* Status Indicator */}
          <div className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
            health?.connected && health?.hasTables
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : health?.connected && !health?.hasTables
              ? 'bg-amber-50/80 border-amber-200 text-amber-900'
              : 'bg-red-50/80 border-red-200 text-red-900'
          }`}>
            <div className="flex items-start gap-3">
              {health?.connected && health?.hasTables ? (
                <CheckCircle2 size={22} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : health?.connected && !health?.hasTables ? (
                <AlertTriangle size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {health?.connected && health?.hasTables
                    ? 'Đang kết nối Trực tuyến với Supabase (Sẵn sàng 100%)'
                    : health?.connected && !health?.hasTables
                    ? 'Đã kết nối Server nhưng chưa khởi tạo Bảng SQL'
                    : 'Chưa thể kết nối tới Supabase'}
                </p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {health?.message || 'Đang kiểm tra trạng thái các bảng dữ liệu...'}
                </p>
              </div>
            </div>

            <button
              onClick={checkHealth}
              disabled={isChecking}
              className="px-2.5 py-1.5 bg-white rounded-lg font-bold border border-current shadow-2xs hover:opacity-80 flex items-center gap-1 cursor-pointer flex-shrink-0"
              title="Kiểm tra lại kết nối"
            >
              <RefreshCw size={12} className={isChecking ? 'animate-spin' : ''} />
              <span>{isChecking ? 'Đang test...' : 'Kiểm tra lại'}</span>
            </button>
          </div>

          {/* Table by Table Breakdown */}
          {health?.tables && (
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-gray-700 font-bold text-[11px] pb-1 border-b border-gray-200">
                <span className="flex items-center gap-1">
                  <Layers size={13} className="text-[#005394]" />
                  <span>Chi tiết 5 bảng cơ sở dữ liệu:</span>
                </span>
                <span>Số bản ghi</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {Object.entries(health.tables).map(([tblName, status]) => {
                  const tableInfo = status as { exists: boolean; count: number; error?: string };
                  return (
                    <div key={tblName} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-200">
                      <span className="font-mono font-medium text-gray-700">{tblName}</span>
                      {tableInfo.exists ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          {tableInfo.count} dòng
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold text-[10px]">
                          Chưa tạo bảng
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Config Details */}
          <div className="bg-[#f0f4fa] p-4 rounded-2xl border border-[#d8e3fa] space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="font-bold text-gray-700">Project URL:</span>
              <span className="font-mono text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200 truncate">
                {SUPABASE_URL}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span className="font-bold text-gray-700">Public Anon Key:</span>
              <span className="font-mono text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200 truncate max-w-xs">
                {SUPABASE_ANON_KEY.slice(0, 18)}...{SUPABASE_ANON_KEY.slice(-8)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-[#005394]">
                <ShieldCheck size={14} />
                <span>Bảo mật an toàn: Xác thực qua PostgreSQL RLS</span>
              </div>
              <button
                onClick={() => setShowConfigEdit(!showConfigEdit)}
                className="text-[#005394] font-bold text-[11px] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Key size={12} />
                <span>{showConfigEdit ? 'Ẩn cấu hình Key' : 'Đổi URL / Anon Key'}</span>
              </button>
            </div>

            {/* Custom URL & Key Input Form */}
            {showConfigEdit && (
              <form onSubmit={handleSaveCredentials} className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-0.5">Supabase Project URL:</label>
                  <input
                    type="url"
                    required
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg font-mono text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-0.5">Supabase Anon Key (hoặc Service Role):</label>
                  <input
                    type="text"
                    required
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg font-mono text-gray-800"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#005394] text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    {saveKeySuccess ? <Check size={13} /> : null}
                    <span>{saveKeySuccess ? 'Đã lưu & áp dụng!' : 'Lưu & Thử kết nối lại'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Seed Action Feedback */}
          {seedResult && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-2 ${
              seedResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              {seedResult.success ? (
                <Zap size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{seedResult.success ? 'Thành công!' : 'Chưa thể nạp dữ liệu:'}</p>
                <p className="text-[11px] mt-0.5">{seedResult.message}</p>
              </div>
            </div>
          )}

          {/* Step-by-step Setup instructions */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
              <span>Hướng dẫn kích hoạt Supabase (Nếu dữ liệu chưa xuất hiện):</span>
            </h3>

            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/60 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#005394] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    Truy cập trang quản trị Supabase SQL Editor:
                  </p>
                  <a
                    href="https://supabase.com/dashboard/project/pmesvcogcutfgvrjaaxj/sql/new"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#005394] hover:underline font-bold mt-1"
                  >
                    <span>Mở SQL Editor của Project</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#005394] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    Sao chép toàn bộ lệnh tạo bảng & chính sách bảo mật (RLS):
                  </p>
                  <button
                    onClick={handleCopySql}
                    className="mt-1.5 px-3 py-1.5 bg-[#005394] hover:bg-[#004278] text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedSql ? 'Đã sao chép SQL!' : 'Sao chép toàn bộ mã SQL'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#005394] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    Dán vào SQL Editor và nhấn <strong>Run</strong>, sau đó bấm nút bên dưới:
                  </p>
                  <button
                    onClick={handleSeedData}
                    disabled={isSeeding}
                    className="mt-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <UploadCloud size={14} className={isSeeding ? 'animate-bounce' : ''} />
                    <span>{isSeeding ? 'Đang nạp dữ liệu lên Supabase...' : 'Nạp dữ liệu mẫu lên Supabase ngay'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400 font-mono">
            Supabase Client SDK v2.x
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
