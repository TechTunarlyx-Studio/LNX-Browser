import React, { useState } from 'react';
import { Trash2, X, AlertTriangle, Check } from 'lucide-react';

interface ClearDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClear: (options: {
    history: boolean;
    cookies: boolean;
    cache: boolean;
    downloads: boolean;
    passwords: boolean;
  }) => void;
}

export const ClearDataModal: React.FC<ClearDataModalProps> = ({
  isOpen,
  onClose,
  onConfirmClear,
}) => {
  const [timeRange, setTimeRange] = useState('all');
  const [clearHistory, setClearHistory] = useState(true);
  const [clearCookies, setClearCookies] = useState(true);
  const [clearCache, setClearCache] = useState(true);
  const [clearDownloads, setClearDownloads] = useState(false);
  const [clearPasswords, setClearPasswords] = useState(false);

  if (!isOpen) return null;

  const handleClear = () => {
    onConfirmClear({
      history: clearHistory,
      cookies: clearCookies,
      cache: clearCache,
      downloads: clearDownloads,
      passwords: clearPasswords,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-xs select-none">
      <div className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-2xl shadow-2xl p-6 text-[#E0E0E0] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-white text-base">Tarama Verilerini Temizle</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#262626] text-[#888] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time Range Selector */}
        <div>
          <label className="block text-[#888] font-medium mb-1.5">Zaman Aralığı</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#262626] text-white outline-none focus:border-red-500"
          >
            <option value="1h">Son 1 saat</option>
            <option value="24h">Son 24 saat</option>
            <option value="7d">Son 7 gün</option>
            <option value="4w">Son 4 hafta</option>
            <option value="all">Tüm Zamanlar</option>
          </select>
        </div>

        {/* Checkbox Options */}
        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={clearHistory}
              onChange={(e) => setClearHistory(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded mt-0.5"
            />
            <div>
              <div className="font-semibold text-white">Tarama Geçmişi</div>
              <div className="text-[11px] text-[#888]">Tüm cihazlardaki arama ve ziyaret geçmişi temizlenir</div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={clearCookies}
              onChange={(e) => setClearCookies(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded mt-0.5"
            />
            <div>
              <div className="font-semibold text-white">Çerezler ve Diğer Site Verileri</div>
              <div className="text-[11px] text-[#888]">Web sitelerindeki oturumlarınız kapatılır</div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={clearCache}
              onChange={(e) => setClearCache(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded mt-0.5"
            />
            <div>
              <div className="font-semibold text-white">Önbelleğe Alınan Resimler ve Dosyalar</div>
              <div className="text-[11px] text-[#888]">Disk alanı boşaltılır ve sayfalar yeniden indirilir</div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={clearDownloads}
              onChange={(e) => setClearDownloads(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded mt-0.5"
            />
            <div>
              <div className="font-semibold text-white">İndirme Geçmişi</div>
              <div className="text-[11px] text-[#888]">İndirilen dosyaların kayıt listesi silinir</div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={clearPasswords}
              onChange={(e) => setClearPasswords(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded mt-0.5"
            />
            <div>
              <div className="font-semibold text-red-400">Şifreler ve Otomatik Doldurma Verileri</div>
              <div className="text-[11px] text-[#888]">Kayıtlı kullanıcı adı ve şifreler silinir</div>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#262626]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] text-[#AAA] font-medium transition-colors"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Verileri Temizle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
