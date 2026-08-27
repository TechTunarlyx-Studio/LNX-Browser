import React, { useState } from 'react';
import { Bookmark, Folder, Plus, Trash2, Edit2, ExternalLink, Search, Download, Upload } from 'lucide-react';
import { BookmarkFolder, BookmarkItem } from '../../types';

interface BookmarksManagerProps {
  bookmarks?: BookmarkItem[];
  folders?: BookmarkFolder[];
  onNavigate: (url: string) => void;
  onAddBookmark: (title: string, url: string, folderId?: string) => void;
  onDeleteBookmark: (id: string) => void;
  onAddFolder: (name: string) => void;
}

export const BookmarksManager: React.FC<BookmarksManagerProps> = ({
  bookmarks = [],
  folders = [],
  onNavigate,
  onAddBookmark,
  onDeleteBookmark,
  onAddFolder,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [targetFolder, setTargetFolder] = useState('bar');

  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
  const safeFolders = Array.isArray(folders) ? folders : [];

  const filteredBookmarks = safeBookmarks.filter((b) => {
    const title = (b?.title || '').toLowerCase();
    const url = (b?.url || '').toLowerCase();
    const q = (search || '').toLowerCase();
    const matchesSearch = title.includes(q) || url.includes(q);
    if (!matchesSearch) return false;
    if (selectedFolderId === 'all') return true;
    return b?.folderId === selectedFolderId;
  });

  const handleSaveBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    onAddBookmark(newTitle.trim(), newUrl.trim(), targetFolder);
    setNewTitle('');
    setNewUrl('');
    setShowAddModal(false);
  };

  const handleSaveFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onAddFolder(newFolderName.trim());
    setNewFolderName('');
    setShowFolderModal(false);
  };

  return (
    <div id="lnx-bookmarks-manager" className="min-h-full flex bg-neutral-950 text-neutral-200 text-xs">
      {/* Folder Tree Sidebar */}
      <div className="w-64 border-r border-neutral-800 p-4 flex flex-col gap-1 select-none">
        <div className="flex items-center justify-between px-3 py-2 mb-2 text-white font-bold text-base">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <span>Yer İşaretleri</span>
          </div>
          <button
            onClick={() => setShowFolderModal(true)}
            title="Yeni Klasör Ekle"
            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setSelectedFolderId('all')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors font-medium ${
            selectedFolderId === 'all'
              ? 'bg-amber-500/20 text-amber-300 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Tüm Yer İmleri ({safeBookmarks.length})</span>
        </button>

        <div className="pt-2 text-[11px] font-semibold uppercase text-neutral-500 px-3">Klasörler</div>
        {safeFolders.map((folder) => {
          const count = safeBookmarks.filter((b) => b?.folderId === folder.id).length;
          return (
            <button
              key={folder.id}
              onClick={() => setSelectedFolderId(folder.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors font-medium ${
                selectedFolderId === folder.id
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="truncate">{folder.name}</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Bookmarks List */}
      <div className="flex-1 p-8 max-w-4xl overflow-y-auto space-y-6">
        {/* Top action bar */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Yer işaretlerinde ara..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow transition-colors ml-4"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Yer İşareti Ekle</span>
          </button>
        </div>

        {/* Bookmarks Grid/List */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
              <p>Bu klasörde yer işareti bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/40 hover:bg-neutral-800/70 transition-colors"
                >
                  <div
                    onClick={() => onNavigate(bm.url)}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <div className="truncate flex-1">
                      <div className="font-semibold text-white truncate hover:text-amber-300">{bm.title}</div>
                      <div className="text-[10px] text-neutral-400 truncate">{bm.url}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onNavigate(bm.url)}
                      title="Sekmede Aç"
                      className="p-1.5 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteBookmark(bm.id)}
                      title="Sil"
                      className="p-1.5 rounded hover:bg-neutral-700 text-neutral-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Bookmark Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl p-5 shadow-2xl text-xs">
            <h3 className="text-sm font-bold text-white mb-3">Yeni Yer İşareti</h3>
            <form onSubmit={handleSaveBookmark} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Başlık</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="örn: Google Docs"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">URL</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Klasör</label>
                <select
                  value={targetFolder}
                  onChange={(e) => setTargetFolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white outline-none"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl p-5 shadow-2xl text-xs">
            <h3 className="text-sm font-bold text-white mb-3">Yeni Yer İşareti Klasörü</h3>
            <form onSubmit={handleSaveFolder} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Klasör Adı</label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="örn: Proje Araçları"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
