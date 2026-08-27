import React, { useState } from 'react';
import { Search, X, Globe, Volume2, Shield, Pin } from 'lucide-react';
import { TabItem } from '../../types';

interface TabSearchModalProps {
  isOpen: boolean;
  tabs?: TabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onClose: () => void;
}

export const TabSearchModal: React.FC<TabSearchModalProps> = ({
  isOpen,
  tabs = [],
  activeTabId,
  onSelectTab,
  onCloseTab,
  onClose,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const safeTabs = Array.isArray(tabs) ? tabs : [];

  const filtered = safeTabs.filter((t) => {
    const title = (t?.title || '').toLowerCase();
    const url = (t?.url || '').toLowerCase();
    const q = (search || '').toLowerCase();
    return title.includes(q) || url.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-xs p-4 text-xs select-none">
      <div className="w-full max-w-lg bg-[#121212] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search input header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#262626] bg-[#1A1A1A]">
          <Search className="w-4 h-4 text-[#888]" />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Açık sekmelerde ara..."
            className="flex-1 bg-transparent text-[#E0E0E0] text-xs outline-none placeholder-[#666]"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#262626] text-[#888] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((t) => {
            const isActive = t.id === activeTabId;

            return (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTab(t.id);
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                  isActive ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 rounded-lg bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 text-indigo-400">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate flex-1">
                    <div className="font-semibold text-white truncate flex items-center gap-1.5">
                      <span>{t.title || 'Yeni Sekme'}</span>
                      {t.isPinned && <Pin className="w-3 h-3 text-indigo-400 fill-indigo-400" />}
                    </div>
                    <div className="text-[10px] text-[#888] truncate">{t.url}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  <span className="text-[10px] text-[#666] font-mono">
                    {t.memoryUsageMb.toFixed(0)} MB
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(t.id, e);
                    }}
                    className="p-1 rounded-lg hover:bg-[#262626] text-[#888] hover:text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
