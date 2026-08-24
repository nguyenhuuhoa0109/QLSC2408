import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  FileCode, 
  FileCheck, 
  ShieldAlert, 
  BookOpen, 
  ExternalLink,
  X,
  Upload,
  Trash2,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { TechnicalDocument } from '../types';

interface DocumentsScreenProps {
  documents: TechnicalDocument[];
  onUploadDoc?: (doc: TechnicalDocument) => void;
  onDeleteDoc?: (docId: string) => void;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ 
  documents, 
  onUploadDoc,
  onDeleteDoc
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<TechnicalDocument | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState<TechnicalDocument | null>(null);

  // New Document Form
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCategory, setNewCategory] = useState('Quy trình vận hành');
  const [newFormat, setNewFormat] = useState('PDF');
  const [newAuthor, setNewAuthor] = useState('Ban Kỹ thuật Nhà máy');
  const [newDescription, setNewDescription] = useState('');

  const categories = [
    'Quy trình vận hành',
    'Bản vẽ kỹ thuật',
    'Sổ tay thiết bị',
    'Biên bản thử nghiệm',
    'Quy chuẩn an toàn'
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchSearch = !searchTerm || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCat === 'all' || doc.category === selectedCat;
    return matchSearch && matchCat;
  });

  const handleDownload = (doc: TechnicalDocument) => {
    setDownloadSuccess(`Đang tải về: ${doc.title} (${doc.fileFormat})`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !onUploadDoc) return;

    const doc: TechnicalDocument = {
      id: `doc-${Date.now()}`,
      code: newCode || `TL-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      category: newCategory,
      fileFormat: newFormat,
      fileSize: '2.4 MB',
      updatedDate: new Date().toISOString().slice(0, 10),
      author: newAuthor,
      version: 'v1.0',
      downloadsCount: 1,
      description: newDescription || 'Tài liệu hướng dẫn kỹ thuật phục vụ vận hành nhà máy thủy điện.'
    };

    onUploadDoc(doc);
    setShowUploadModal(false);
    setNewTitle('');
    setNewCode('');
    setNewDescription('');
  };

  const handleConfirmDelete = () => {
    if (docToDelete && onDeleteDoc) {
      onDeleteDoc(docToDelete.id);
      setDocToDelete(null);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5 p-4 sm:p-6 bg-[#f9f9ff]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#e2eaf5] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111c2c] flex items-center gap-2">
            <FileText className="text-[#005394]" size={22} />
            <span>Thư viện Tài liệu & Quy trình Vận hành Kỹ thuật</span>
          </h2>
          <p className="text-xs text-[#5e7087] mt-0.5">
            Lưu trữ bản vẽ CAD, sổ tay thiết bị tuabin máy phát và quy trình an toàn điện
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-[#005394] hover:bg-[#004278] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Upload size={15} />
            <span>Tải lên tài liệu</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <FileCheck size={16} />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-[#e2eaf5] shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tài liệu, mã quy trình, bản vẽ, tác giả..."
            className="w-full pl-10 pr-4 py-2 bg-[#f0f4fa] rounded-xl text-xs sm:text-sm text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#005394]/20 border border-transparent focus:border-[#005394]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 cursor-pointer ${
              selectedCat === 'all' ? 'bg-[#005394] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Tất cả ({documents.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 cursor-pointer ${
                selectedCat === cat ? 'bg-[#005394] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-2xl border border-[#e2eaf5] shadow-xs flex flex-col justify-between gap-4 hover:border-[#005394]/50 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[11px] font-bold text-[#005394] bg-[#eef3fb] px-2 py-0.5 rounded">
                  {doc.code}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] font-bold rounded uppercase">
                    {doc.fileFormat} • {doc.fileSize}
                  </span>
                  <button
                    onClick={() => setDocToDelete(doc)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    title="Xóa tài liệu"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-900 mt-2.5 group-hover:text-[#005394] transition-colors">
                {doc.title}
              </h3>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {doc.description}
              </p>

              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-[11px] text-gray-500">
                <span>Ban hành: {doc.author}</span>
                <span className="font-mono">Cập nhật: {doc.updatedDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-[11px] text-gray-400">
                Lượt tải: {doc.downloadsCount}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="px-2.5 py-1.5 bg-[#eef3fb] hover:bg-[#d8e3fa] text-[#005394] rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye size={13} />
                  <span>Xem</span>
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="px-2.5 py-1.5 bg-[#005394] hover:bg-[#004278] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Download size={13} />
                  <span>Tải về</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-base font-bold text-[#111c2c] flex items-center gap-2">
                <Upload className="text-[#005394]" size={18} />
                <span>Tải lên tài liệu kỹ thuật mới</span>
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mã tài liệu *</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="VD: QT-VH-105"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Định dạng</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DWG">DWG (CAD)</option>
                    <option value="DOCX">DOCX (Word)</option>
                    <option value="XLSX">XLSX (Excel)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tên tài liệu / Tiêu chuẩn *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Sơ đồ nguyên lý đấu nối trạm phân phối 110kV"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phân loại</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Đơn vị ban hành</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô tả tóm tắt nội dung</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Mô tả phạm vi áp dụng, điều kiện vận hành..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005394] hover:bg-[#004278] text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Lưu lên Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Xác nhận xóa tài liệu</h3>
                <p className="text-[11px] text-gray-500 font-mono">{docToDelete.code}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa tài liệu <strong className="text-gray-900">"{docToDelete.title}"</strong> khỏi cơ sở dữ liệu Supabase không? Thao tác này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDocToDelete(null)}
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

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#005394]">{previewDoc.code}</span>
                <h3 className="text-base font-bold text-[#111c2c] mt-1">{previewDoc.title}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-[#f0f4fa] rounded-xl border border-[#d8e3fa]">
                <p className="font-bold text-gray-700 mb-1">Mô tả quy trình:</p>
                <p className="text-gray-600 leading-relaxed">{previewDoc.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-[10px] uppercase font-bold">Định dạng</p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">{previewDoc.fileFormat}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-[10px] uppercase font-bold">Dung lượng</p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">{previewDoc.fileSize}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-[10px] uppercase font-bold">Phiên bản</p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">{previewDoc.version}</p>
                </div>
              </div>

              <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
                <BookOpen size={36} className="mx-auto text-[#005394] mb-2 opacity-80" />
                <p className="font-bold text-gray-800 text-sm">Xem trước tài liệu trực tuyến</p>
                <p className="text-gray-500 text-xs mt-1">Tài liệu đã được ký số và xác thực bởi Ban Giám đốc Nhà máy Thủy điện Sơn Trà 1.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-400">Tác giả: {previewDoc.author}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-2 bg-[#005394] hover:bg-[#004278] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download size={14} />
                  <span>Tải bản gốc</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
