import React, { useState } from 'react';
import { History, Search, Trash2, ExternalLink, Calendar, Clock } from 'lucide-react';
import { HistoryItem } from '../../types';

interface HistoryPageProps {
  history?: HistoryItem[];
  onNavigate: (url: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onOpenClearDataModal: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history = [],
  onNavigate,
  onDeleteItem,
  onClearAll,
  onOpenClearDataModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const safeHistory = Array.isArray(history) ? history : [];

  const filtered = safeHistory.filter((h) => {
    const title = (h?.title || '').toLowerCase();
    const url = (h?.url || '').toLowerCase();
    const q = (search || '').toLowerCase();
    return title.includes(q) || url.includes(q);
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const deleteSelected = () => {
    selectedIds.forEach((id) => onDeleteItem(id));
    setSelectedIds([]);
  };

  return (
    <div id="lnx-history-page" className="min-h-full bg-neutral-950 text-neutral-200 p-8 text-xs">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Geçmiş</h1>
              <p className="text-neutral-400 text-[11px]">Ziyaret edilen web sayfaları ve sekmeler</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={deleteSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium shadow transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Seçilenleri Sil ({selectedIds.length})</span>
              </button>
            )}

            <button
              onClick={onOpenClearDataModal}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors"
            >
              Tarama Verilerini Temizle...
            </button>
          </div>
        </div>

        {/* Search in history */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Geçmişte ara..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700/80 text-white placeholder-neutral-500 outline-none focus:border-blue-500 text-xs"
          />
        </div>

        {/* History Items List */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Geçmiş kaydı bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((item) => {
                const date = new Date(item.timestamp);
                const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                const isSelected = selectedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`group flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                      isSelected ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />

                      <span className="text-neutral-500 font-mono text-[11px] w-12 flex-shrink-0">
                        {timeStr}
                      </span>

                      <div
                        onClick={() => onNavigate(item.url)}
                        className="cursor-pointer truncate flex-1"
                      >
                        <div className="font-medium text-neutral-200 group-hover:text-blue-400 truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-neutral-500 truncate">{item.url}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => onNavigate(item.url)}
                        title="Sekmede Aç"
                        className="p-1.5 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        title="Geçmişten Kaldır"
                        className="p-1.5 rounded hover:bg-neutral-700 text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
