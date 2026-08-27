import React from 'react';
import { ShieldCheck, ShieldAlert, X, Check, Lock, EyeOff, Zap } from 'lucide-react';
import { AdBlockLevel } from '../../types';

interface ShieldsPopoverProps {
  isOpen: boolean;
  blockedCount: number;
  adBlockLevel: AdBlockLevel;
  currentHost: string;
  onClose: () => void;
  onChangeLevel: (level: AdBlockLevel) => void;
}

export const ShieldsPopover: React.FC<ShieldsPopoverProps> = ({
  isOpen,
  blockedCount,
  adBlockLevel,
  currentHost,
  onClose,
  onChangeLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/50 backdrop-blur-xs">
      <div className="w-80 bg-[#121212] border border-[#262626] rounded-2xl shadow-2xl p-4 text-xs text-[#E0E0E0] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">LNX Shields Kalkanı</div>
              <div className="text-[10px] text-[#888] truncate max-w-[170px]">{currentHost || 'Bu Web Sitesi'}</div>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#262626] text-[#888] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Counter */}
        <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#262626] text-center">
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{blockedCount}</div>
          <div className="text-[11px] text-[#888] mt-1 font-medium">
            İzleyici, Reklam ve Parmak İzi Scripti Engellendi
          </div>
        </div>

        {/* Protection Metrics */}
        <div className="space-y-2 text-[11px]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A1A]">
            <span className="flex items-center gap-1.5 text-[#CCC]">
              <EyeOff className="w-3.5 h-3.5 text-indigo-400" />
              <span>Çapraz Site İzleyicileri:</span>
            </span>
            <span className="text-emerald-400 font-semibold">Engellendi</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A1A]">
            <span className="flex items-center gap-1.5 text-[#CCC]">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>HTTPS Yükseltmesi:</span>
            </span>
            <span className="text-emerald-400 font-semibold">Aktif</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A1A]">
            <span className="flex items-center gap-1.5 text-[#CCC]">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Zararlı Madencilik (Cryptojacking):</span>
            </span>
            <span className="text-emerald-400 font-semibold">Bloklandı</span>
          </div>
        </div>

        {/* Shield level selector */}
        <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
          <span className="font-medium text-[#888]">Koruma Seviyesi:</span>
          <select
            value={adBlockLevel}
            onChange={(e) => onChangeLevel(e.target.value as AdBlockLevel)}
            className="bg-[#1A1A1A] text-[#E0E0E0] px-2.5 py-1 rounded-lg border border-[#262626] outline-none text-xs cursor-pointer"
          >
            <option value="aggressive">Agresif (Tavsiye Edilen)</option>
            <option value="standard">Standart</option>
            <option value="off">Kalkanı Kapat</option>
          </select>
        </div>
      </div>
    </div>
  );
};
