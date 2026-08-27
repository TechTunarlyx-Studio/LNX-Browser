import React, { useState, useEffect } from 'react';
import {
  ArrowUpCircle,
  X,
  Bug,
  Zap,
  CheckCircle2,
  ExternalLink,
  RotateCw,
  Server,
  Radio,
} from 'lucide-react';
import { BrowserUpdateInfo } from '../../types';

interface UpdateNotificationToastProps {
  isOpen: boolean;
  update?: BrowserUpdateInfo | null;
  isDark?: boolean;
  accentColor?: string;
  onClose: () => void;
  onViewDetails: () => void;
  onApplyUpdate?: (version: string) => void;
}

export const UpdateNotificationToast: React.FC<UpdateNotificationToastProps> = ({
  isOpen,
  update,
  isDark = true,
  accentColor = '#3b82f6',
  onClose,
  onViewDetails,
  onApplyUpdate,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const version = update?.version || '152.0.7977.65';
  const title = update?.title || 'LNX Browser Kararlılık Paketi';
  const releaseNotes = update?.releaseNotes || 'Sekme geçişleri, bellek yönetimi ve arama çubuğundaki bilinen kararsızlıklar giderildi.';
  const fixes = update?.fixes && update.fixes.length > 0 ? update.fixes : [
    'Sekmeler arası hızlı geçişlerde yaşanan takılmalar ve bellek sızıntıları giderildi.',
    'Omnibox arama çubuğu URL ayrıştırması optimize edildi.',
    'LNX Shields reklam ve izleyici engelleyici filtreleri güncellendi.',
    'V8 JavaScript derleme optimizasyonları yapıldı.'
  ];

  useEffect(() => {
    if (!isOpen) {
      setIsApplying(false);
      setIsApplied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsApplied(true);
      onApplyUpdate?.(version);
      setTimeout(() => {
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <aside
      id="lnx-update-notification-toast"
      aria-label="LNX Browser Güncelleme Bildirimi"
      className={`fixed bottom-5 right-5 z-50 w-[380px] max-w-[calc(100vw-2.5rem)] rounded-2xl shadow-2xl border transition-all duration-300 transform animate-in slide-in-from-bottom-5 fade-in ${
        isDark
          ? 'bg-[#141822]/95 border-blue-500/30 text-white backdrop-blur-md shadow-blue-950/40'
          : 'bg-white/95 border-blue-200 text-slate-900 backdrop-blur-md shadow-slate-400/30'
      }`}
      style={{
        boxShadow: isDark
          ? '0 12px 35px -8px rgba(0, 0, 0, 0.7), 0 0 20px -5px rgba(59, 130, 246, 0.25)'
          : '0 12px 35px -8px rgba(0, 0, 0, 0.15), 0 0 20px -5px rgba(59, 130, 246, 0.15)',
      }}
    >
      {/* Top Accent Gradient Bar */}
      <div
        className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
      />

      <div className="p-4 space-y-3">
        {/* Header with Live Server Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-xs">
                <ArrowUpCircle className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#141822] animate-pulse flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-xs font-bold leading-none">Sunucudan Güncelleme Geldi</h4>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  v{version}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  <span>OTA</span>
                </span>
              </div>
              <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                {title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Kapat"
            className={`p-1 rounded-lg transition-colors text-neutral-400 hover:text-neutral-200 ${
              isDark ? 'hover:bg-neutral-800' : 'hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content / Bug Fix Summary */}
        {isApplied ? (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">Güncelleme başarıyla uygulandı! LNX v{version} aktif.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div
              className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                isDark ? 'bg-neutral-850/60 border-neutral-750' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1 text-[11px]">
                <Bug className="w-3.5 h-3.5" />
                <span>Çoğu Bug ve Çökme Sorunları Fixlendi</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                {releaseNotes}
              </p>

              {isExpanded && (
                <ul className={`mt-2 space-y-1 text-[10px] list-disc list-inside pt-2 border-t ${
                  isDark ? 'border-neutral-700/60 text-neutral-400' : 'border-slate-200 text-slate-500'
                }`}>
                  {fixes.map((fixItem, idx) => (
                    <li key={idx}>{fixItem}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] px-0.5">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`text-[11px] underline hover:no-underline transition-colors ${
                  isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isExpanded ? 'Daha az göster' : `${fixes.length} Düzeltmeyi İncele`}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewDetails();
                }}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Hakkında & Sunucu Paneli</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isApplied && (
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplying}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                isApplying ? 'opacity-75 cursor-wait' : 'hover:opacity-90'
              }`}
              style={{ backgroundColor: accentColor }}
            >
              {isApplying ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Yeniden Başlatılıyor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Şimdi Yeniden Başlat</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                isDark
                  ? 'bg-neutral-800/80 hover:bg-neutral-700 border-neutral-700 text-neutral-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              Daha Sonra
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

