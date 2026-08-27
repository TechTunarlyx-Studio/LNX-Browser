import React, { useState } from 'react';
import { Download, FolderOpen, Play, Pause, X, Trash2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { DownloadItem } from '../../types';

interface DownloadsPageProps {
  downloads?: DownloadItem[];
  isDark?: boolean;
  onToggleDownloadState: (id: string) => void;
  onCancelDownload: (id: string) => void;
  onClearDownloads: () => void;
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({
  downloads = [],
  isDark = true,
  onToggleDownloadState,
  onCancelDownload,
  onClearDownloads,
}) => {
  const [search, setSearch] = useState('');

  const safeDownloads = Array.isArray(downloads) ? downloads : [];

  const filtered = safeDownloads.filter((d) =>
    (d?.filename || '').toLowerCase().includes((search || '').toLowerCase())
  );

  return (
    <div
      id="lnx-downloads-page"
      className={`min-h-full p-8 text-xs transition-colors duration-200 ${
        isDark ? 'bg-neutral-950 text-neutral-200' : 'bg-[#F8FAFC] text-slate-800'
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>İndirilenler</h1>
              <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>LNX Çok Kanallı Hızlı İndirme Yöneticisi</p>
            </div>
          </div>

          <button
            onClick={onClearDownloads}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            İndirme Geçmişini Temizle
          </button>
        </div>

        {/* Downloads List */}
        <div className={`p-4 rounded-2xl border shadow-xs ${isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'}`}>
          {filtered.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
              <Download className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>İndirilen dosya yok.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => {
                const isDone = item.state === 'completed';
                const isPaused = item.state === 'paused';
                const percent = Math.min(100, Math.round((item.loadedBytes / (item.totalBytes || 1)) * 100));

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDark ? 'bg-neutral-800/40 border-neutral-700/40' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate flex-1">
                          <div className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.filename}</div>
                          <div className={`text-[11px] truncate ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{item.url}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {!isDone && (
                          <button
                            onClick={() => onToggleDownloadState(item.id)}
                            className={`p-1.5 rounded-lg ${
                              isDark ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            }`}
                          >
                            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <button
                          onClick={() => onCancelDownload(item.id)}
                          className={`p-1.5 rounded-lg ${
                            isDark
                              ? 'bg-neutral-700 hover:bg-red-600/30 hover:text-red-400 text-neutral-300'
                              : 'bg-slate-200 hover:bg-red-100 hover:text-red-600 text-slate-600'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {!isDone && (
                      <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-neutral-700' : 'bg-slate-200'}`}>
                        <div
                          className="bg-blue-500 h-1.5 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}

                    <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <span className="text-emerald-500 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            İndirme Tamamlandı ({item.fileSize})
                          </span>
                        ) : (
                          <span>
                            %{percent} • {item.speed} • {item.fileSize}
                          </span>
                        )}
                      </div>

                      {isDone && (
                        <button className="flex items-center gap-1 text-blue-500 hover:underline">
                          <FolderOpen className="w-3 h-3" />
                          <span>Klasörde Göster</span>
                        </button>
                      )}
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
