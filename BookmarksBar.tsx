import React, { useState } from 'react';
import { Bookmark, Folder, ChevronRight, ExternalLink, Plus, Settings, History, Download, Puzzle, Globe } from 'lucide-react';
import { BookmarkFolder, BookmarkItem } from '../../types';

interface BookmarksBarProps {
  bookmarks?: BookmarkItem[];
  folders?: BookmarkFolder[];
  onNavigate: (url: string) => void;
  onAddBookmark?: (title: string, url: string, folderId?: string) => void;
  show: boolean;
  isDark?: boolean;
}

export const BookmarksBar: React.FC<BookmarksBarProps> = ({
  bookmarks = [],
  folders = [],
  onNavigate,
  onAddBookmark,
  show,
  isDark = true,
}) => {
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFolderId, setNewFolderId] = useState('bar');

  if (!show) return null;

  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
  const safeFolders = Array.isArray(folders) ? folders : [];

  const rootBookmarks = safeBookmarks.filter((b) => b?.folderId === 'bar' || !b?.folderId);
  const subFolders = safeFolders.filter((f) => f?.parentId === 'bar' || f?.id !== 'bar');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://') && !formattedUrl.startsWith('lnx://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    if (onAddBookmark) {
      onAddBookmark(newTitle.trim(), formattedUrl, newFolderId);
    }
    setNewTitle('');
    setNewUrl('');
    setShowQuickAddModal(false);
  };

  return (
    <>
      <div
        id="lnx-bookmarks-bar"
        className={`flex items-center px-4 py-1 border-b text-xs select-none overflow-x-auto no-scrollbar gap-1 transition-colors ${
          isDark
            ? 'bg-[#161616] border-[#262626] text-[#AAA]'
            : 'bg-[#ECEFF1] border-[#CFD6DD] text-neutral-600'
        }`}
        style={{ minHeight: '28px' }}
      >
        {/* Folder Buttons */}
        {subFolders.map((folder) => {
          const folderBookmarks = safeBookmarks.filter((b) => b?.folderId === folder.id);
          const isOpen = openFolderId === folder.id;

          return (
            <div key={folder.id} className="relative">
              <button
                onClick={() => setOpenFolderId(isOpen ? null : folder.id)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-colors text-[11px] ${
                  isDark
                    ? 'hover:bg-[#262626] text-[#AAA] hover:text-[#E0E0E0]'
                    : 'hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-amber-500" />
                <span>{folder.name}</span>
              </button>

              {/* Folder Dropdown */}
              {isOpen && (
                <div
                  className={`absolute left-0 top-6 w-56 rounded-xl shadow-xl py-1 z-50 text-xs border ${
                    isDark
                      ? 'bg-[#121212] border-[#262626] text-[#E0E0E0]'
                      : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                  onMouseLeave={() => setOpenFolderId(null)}
                >
                  {folderBookmarks.length === 0 ? (
                    <div className={`px-3 py-1 text-[11px] ${isDark ? 'text-[#666]' : 'text-neutral-400'}`}>(Klasör boş)</div>
                  ) : (
                    folderBookmarks.map((bm) => (
                      <button
                        key={bm.id}
                        onClick={() => {
                          onNavigate(bm.url);
                          setOpenFolderId(null);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-left truncate transition-colors ${
                          isDark
                            ? 'hover:bg-[#1A1A1A] text-[#E0E0E0]'
                            : 'hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <Bookmark className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span className="truncate">{bm.title}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Root Bookmark Items */}
        {rootBookmarks.map((bm) => (
          <button
            key={bm.id}
            onClick={() => onNavigate(bm.url)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-colors text-[11px] max-w-[160px] truncate ${
              isDark
                ? 'hover:bg-[#262626] text-[#AAA] hover:text-[#E0E0E0]'
                : 'hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900'
            }`}
            title={`${bm.title}\n${bm.url}`}
          >
            {bm.url.startsWith('lnx://') ? (
              bm.url === 'lnx://settings' ? (
                <Settings className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              ) : bm.url === 'lnx://history' ? (
                <History className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              ) : bm.url === 'lnx://bookmarks' ? (
                <Bookmark className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              ) : bm.url === 'lnx://downloads' ? (
                <Download className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              ) : bm.url === 'lnx://extensions' ? (
                <Puzzle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              )
            ) : (
              <img
                src={`https://www.google.com/s2/favicons?domain=${
                  bm.url.startsWith('http') ? new URL(bm.url).hostname : 'google.com'
                }&sz=16`}
                alt=""
                referrerPolicy="no-referrer"
                className="w-3.5 h-3.5 rounded-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <span className="truncate">{bm.title}</span>
          </button>
        ))}

        {/* Action Button: Quick Add & Manage from bookmarks bar */}
        <div className="flex items-center gap-0.5 ml-auto pl-2 border-l border-neutral-700/30">
          <button
            onClick={() => setShowQuickAddModal(true)}
            title="Çubuğa Yeni Yer İşareti Ekle"
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors text-[10px] font-medium ${
              isDark
                ? 'hover:bg-[#262626] text-neutral-400 hover:text-white'
                : 'hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Plus className="w-3 h-3 text-amber-500" />
            <span className="hidden sm:inline">Ekle</span>
          </button>
          <button
            onClick={() => onNavigate('lnx://settings?section=appearance')}
            title="Ayarları Aç"
            className={`p-1 rounded transition-colors ${
              isDark
                ? 'hover:bg-[#262626] text-neutral-400 hover:text-white'
                : 'hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Settings className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border text-xs ${
            isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Çubuğa Yer İşareti Ekle</span>
              </h3>
            </div>
            <form onSubmit={handleQuickAdd} className="space-y-3">
              <div>
                <label className={`block mb-1 text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Başlık</label>
                <input
                  type="text"
                  required
                  placeholder="örn: YouTube, GitHub, ChatGPT..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl outline-none border ${
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500' : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-amber-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block mb-1 text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>URL Adresi</label>
                <input
                  type="text"
                  required
                  placeholder="örn: https://youtube.com veya lnx://settings"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl outline-none border ${
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white focus:border-amber-500' : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-amber-500'
                  }`}
                />
              </div>
              {safeFolders.length > 0 && (
                <div>
                  <label className={`block mb-1 text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Hedef Konum</label>
                  <select
                    value={newFolderId}
                    onChange={(e) => setNewFolderId(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl outline-none border ${
                      isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                    }`}
                  >
                    <option value="bar">Yer İşaretleri Çubuğu (Doğrudan Çubuk)</option>
                    {safeFolders.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className={`px-3 py-1.5 rounded-xl ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow transition-colors"
                >
                  Çubuğa Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
