import React, { useState } from 'react';
import { Flag, Search, RotateCcw, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { ChromiumFlag } from '../../types';

interface FlagsPageProps {
  flags?: ChromiumFlag[];
  onToggleFlag: (id: string) => void;
  onResetAllFlags: () => void;
}

export const FlagsPage: React.FC<FlagsPageProps> = ({
  flags = [],
  onToggleFlag,
  onResetAllFlags,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [restartPending, setRestartPending] = useState(false);

  const categories = ['all', 'Performance', 'Graphics', 'AI & Productivity', 'Privacy'];
  const safeFlags = Array.isArray(flags) ? flags : [];

  const filtered = safeFlags.filter((f) => {
    const name = (f?.name || '').toLowerCase();
    const desc = (f?.description || '').toLowerCase();
    const q = (search || '').toLowerCase();
    const matchesSearch = name.includes(q) || desc.includes(q);
    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    return f?.category === selectedCategory;
  });

  const handleToggle = (id: string) => {
    onToggleFlag(id);
    setRestartPending(true);
  };

  return (
    <div id="lnx-flags-page" className="min-h-full bg-neutral-950 text-neutral-200 p-8 text-xs">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Warning Banner */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Deneyler (Deneysel Bayraklar - Flags)</h1>
              <p className="text-neutral-400 text-[11px]">
                Chromium çekirdeğindeki deneysel özellikleri etkinleştirin veya yapılandırın
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onResetAllFlags();
              setRestartPending(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tümünü Sıfırla</span>
          </button>
        </div>

        {/* Warning card */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold">UYARI: DENEYSEL ÖZELLİKLER ÖNÜNÜZDEDİR!</span> Bu özellikleri etkinleştirerek
            tarayıcı verilerini kaybedebilir veya güvenlik/gizlilik ayarlarınızı tehlikeye atabilirsiniz. Etkinleştirilen
            özellikler bu tarayıcının tüm sekmeleri için geçerlidir.
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Bayraklarda ara (örn: GPU, Memory, Parallel)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 outline-none focus:border-red-500 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-red-600/30 text-red-300 font-semibold border border-red-500/40'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat === 'all' ? 'Tümü' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Flags List */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">Eşleşen bayrak bulunamadı.</p>
          ) : (
            filtered.map((flag) => (
              <div
                key={flag.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-neutral-800/40 border border-neutral-700/40 gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{flag.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">#{flag.id}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] mt-1 leading-relaxed">{flag.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
                    {flag.category}
                  </span>

                  <select
                    value={flag.enabled ? 'Enabled' : 'Disabled'}
                    onChange={() => handleToggle(flag.id)}
                    className={`px-3 py-1.5 rounded-lg border outline-none font-semibold ${
                      flag.enabled
                        ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    <option value="Enabled">Enabled (Etkin)</option>
                    <option value="Disabled">Disabled (Devre Dışı)</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Restart Sticky Banner */}
        {restartPending && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4">
            <span className="text-xs">Değişiklikleriniz LNX Browser yeniden başlatıldığında geçerli olacak.</span>
            <button
              onClick={() => {
                setRestartPending(false);
                window.location.reload();
              }}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs shadow transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Yeniden Başlat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
