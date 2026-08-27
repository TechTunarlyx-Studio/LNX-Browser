import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  X,
  Home,
  Shield,
  Moon,
  Sparkles,
  KeyRound,
  Download,
  MoreVertical,
  User,
  Plus,
  History,
  Bookmark,
  Settings,
  Code2,
  Activity,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  FolderOpen,
  Info,
  Check,
  Search,
} from 'lucide-react';
import { BookmarkItem, DownloadItem, ExtensionItem, HistoryItem, LnxUserAccount, SearchEngineType, TabItem } from '../../types';
import { Omnibox } from './Omnibox';
import { LnxLogo } from '../Common/LnxLogo';

interface NavigationToolbarProps {
  activeTab: TabItem;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  isIncognito: boolean;
  isDark?: boolean;
  searchEngine: SearchEngineType;
  account?: LnxUserAccount;
  bookmarks?: BookmarkItem[];
  history?: HistoryItem[];
  extensions?: ExtensionItem[];
  downloads?: DownloadItem[];
  shieldsBlockedCount?: number;
  isBookmarked?: boolean;
  zoomLevel?: number;
  showHomeButton?: boolean;
  accentColor?: string;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onGoHome: () => void;
  onNavigate: (url: string) => void;
  onToggleBookmark: (tab: TabItem) => void;
  onToggleReaderMode: () => void;
  onOpenQrModal: () => void;
  onOpenShields: () => void;
  onToggleExtension: (id: string) => void;
  onOpenDevTools: () => void;
  onOpenTaskManager: () => void;
  onOpenFindInPage: () => void;
  onOpenClearData: () => void;
  onOpenWelcomeModal?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onNewIncognitoWindow: () => void;
  onNewTab: () => void;
}

export const NavigationToolbar: React.FC<NavigationToolbarProps> = ({
  activeTab,
  canGoBack,
  canGoForward,
  isLoading,
  isIncognito,
  isDark = true,
  searchEngine,
  account,
  bookmarks = [],
  history = [],
  extensions = [],
  downloads = [],
  shieldsBlockedCount = 0,
  isBookmarked = false,
  zoomLevel = 100,
  showHomeButton = true,
  accentColor = '#3b82f6',
  onGoBack,
  onGoForward,
  onReload,
  onGoHome,
  onNavigate,
  onToggleBookmark,
  onToggleReaderMode,
  onOpenQrModal,
  onOpenShields,
  onToggleExtension,
  onOpenDevTools,
  onOpenTaskManager,
  onOpenFindInPage,
  onOpenClearData,
  onOpenWelcomeModal,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onNewIncognitoWindow,
  onNewTab,
}) => {

  const [showChromiumMenu, setShowChromiumMenu] = useState(false);
  const [showDownloadsMenu, setShowDownloadsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const downloadsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowChromiumMenu(false);
      }
      if (downloadsRef.current && !downloadsRef.current.contains(e.target as Node)) {
        setShowDownloadsMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeDownloads = Array.isArray(downloads) ? downloads : [];
  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
  const safeHistory = Array.isArray(history) ? history : [];
  const safeExtensions = Array.isArray(extensions) ? extensions : [];

  const activeDownloads = safeDownloads.filter((d) => d?.state === 'in_progress').length;
  const effectiveIsDark = isIncognito || isDark;

  return (
    <div
      id="lnx-navigation-toolbar"
      className={`flex items-center px-4 h-12 border-b select-none relative gap-1.5 transition-colors ${
        effectiveIsDark
          ? 'bg-[#1A1A1A] border-[#262626] text-[#E0E0E0]'
          : 'bg-[#F8F9FA] border-[#CFD6DD] text-neutral-800'
      }`}
    >
      {/* Navigation Buttons: Back, Forward, Reload, Home */}
      <div className="flex items-center gap-1 mr-1">
        <button
          id="btn-nav-back"
          onClick={onGoBack}
          disabled={!canGoBack}
          title="Geri Dön (Alt+Sol Ok)"
          className={`p-1.5 rounded-lg transition-all ${
            canGoBack
              ? effectiveIsDark
                ? 'hover:bg-[#262626] text-[#E0E0E0] hover:text-white'
                : 'hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900'
              : effectiveIsDark
              ? 'text-[#555] cursor-not-allowed'
              : 'text-neutral-400 cursor-not-allowed opacity-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          id="btn-nav-forward"
          onClick={onGoForward}
          disabled={!canGoForward}
          title="İleri Git (Alt+Sağ Ok)"
          className={`p-1.5 rounded-lg transition-all ${
            canGoForward
              ? effectiveIsDark
                ? 'hover:bg-[#262626] text-[#E0E0E0] hover:text-white'
                : 'hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900'
              : effectiveIsDark
              ? 'text-[#555] cursor-not-allowed'
              : 'text-neutral-400 cursor-not-allowed opacity-50'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          id="btn-nav-reload"
          onClick={onReload}
          title={isLoading ? 'Yüklemeyi Durdur (Esc)' : 'Sayfayı Yenile (Ctrl+R)'}
          className={`p-1.5 rounded-lg transition-all ${
            effectiveIsDark
              ? 'hover:bg-[#262626] text-[#888] hover:text-[#E0E0E0]'
              : 'hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {isLoading ? (
            <X className="w-4 h-4 text-red-400" />
          ) : (
            <RotateCw className="w-4 h-4" />
          )}
        </button>

        {showHomeButton && (
          <button
            id="btn-nav-home"
            onClick={onGoHome}
            title="Ana Sayfaya Git (Alt+Home)"
            className={`p-1.5 rounded-lg transition-all ${
              effectiveIsDark
                ? 'hover:bg-[#262626] text-[#888] hover:text-[#E0E0E0]'
                : 'hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Home className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Omnibox / URL and Search Bar */}
      <Omnibox
        activeTab={activeTab}
        searchEngine={searchEngine}
        bookmarks={bookmarks}
        history={history}
        isDark={isDark}
        onNavigate={onNavigate}
        onToggleBookmark={onToggleBookmark}
        isBookmarked={isBookmarked}
        onToggleReaderMode={onToggleReaderMode}
        onOpenQrModal={onOpenQrModal}
        onOpenShields={onOpenShields}
        shieldsBlockedCount={shieldsBlockedCount}
      />

      {/* Extensions & Tools Tray */}
      <div className={`flex items-center gap-1.5 ml-2 shrink-0 ${effectiveIsDark ? 'text-[#AAA]' : 'text-neutral-600'}`}>
        {/* Extensions Hub Button */}
        <button
          id="btn-extensions-hub"
          onClick={() => onNavigate('lnx://extensions')}
          title="Uzantılar ve Eklentiler"
          className={`p-1.5 rounded-lg transition-all ${
            effectiveIsDark
              ? 'hover:bg-[#262626] text-[#AAA] hover:text-[#E0E0E0]'
              : 'hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Downloads dropdown trigger */}
        <div className="relative" ref={downloadsRef}>
          <button
            id="btn-downloads-menu"
            onClick={() => setShowDownloadsMenu(!showDownloadsMenu)}
            title="İndirilenler (Ctrl+J)"
            className={`relative p-1.5 rounded-lg transition-all ${
              effectiveIsDark
                ? 'hover:bg-[#262626] text-[#AAA] hover:text-white'
                : 'hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Download className="w-4 h-4" />
            {activeDownloads > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] flex items-center justify-center font-bold">
                {activeDownloads}
              </span>
            )}
          </button>

          {/* Downloads Popover */}
          {showDownloadsMenu && (
            <div
              id="downloads-popover"
              className={`absolute right-0 top-10 w-80 rounded-xl shadow-2xl p-3 z-50 text-xs border ${
                effectiveIsDark
                  ? 'bg-[#121212] border-[#262626] text-[#E0E0E0]'
                  : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              <div className={`flex items-center justify-between pb-2 border-b font-semibold ${
                effectiveIsDark ? 'border-[#262626] text-[#E0E0E0]' : 'border-neutral-200 text-neutral-900'
              }`}>
                <span>İndirilenler</span>
                <button
                  onClick={() => {
                    onNavigate('lnx://downloads');
                    setShowDownloadsMenu(false);
                  }}
                  className="text-indigo-500 hover:underline text-[11px]"
                >
                  Tümünü Gör
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                {downloads.length === 0 ? (
                  <p className={`py-3 text-center ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>Henüz indirme yok.</p>
                ) : (
                  downloads.slice(0, 4).map((d) => (
                    <div key={d.id} className={`p-2 rounded-lg border ${
                      effectiveIsDark ? 'bg-[#1A1A1A] border-[#262626]' : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <div className={`flex items-center justify-between font-medium ${
                        effectiveIsDark ? 'text-[#E0E0E0]' : 'text-neutral-900'
                      }`}>
                        <span className="truncate max-w-[180px]">{d.filename}</span>
                        <span className={`text-[10px] ${effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}`}>{d.fileSize}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-1">
                        <span className={d.state === 'completed' ? 'text-emerald-500 font-medium' : 'text-indigo-500'}>
                          {d.state === 'completed' ? 'Tamamlandı' : 'İndiriliyor...'}
                        </span>
                        <span className={effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}>{d.speed}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            id="btn-profile-menu"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title={`Profil Hesabı (${account?.isGuest ? 'Misafir' : account?.name || 'Kullanıcı'})`}
            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ml-1 shrink-0 ${
              effectiveIsDark
                ? 'bg-[#222] border-[#333] hover:bg-[#2a2a2a] text-neutral-300'
                : 'bg-neutral-100 border-neutral-300 hover:bg-neutral-200 text-neutral-700 shadow-xs'
            }`}
          >
            {account?.isGuest ? (
              <span className="font-bold text-[11px]">M</span>
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Profile Menu Popover */}
          {showProfileMenu && (
            <div
              id="profile-popover"
              className={`absolute right-0 top-10 w-72 rounded-xl shadow-2xl p-4 z-50 text-xs border ${
                effectiveIsDark
                  ? 'bg-[#121212] border-[#262626] text-[#E0E0E0]'
                  : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              <div className={`flex items-center gap-3 pb-3 border-b ${effectiveIsDark ? 'border-[#262626]' : 'border-neutral-200'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  effectiveIsDark ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-700'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className={`font-semibold truncate ${effectiveIsDark ? 'text-[#E0E0E0]' : 'text-neutral-900'}`}>
                    {account?.isGuest ? 'Misafir Kullanıcı' : account?.name || 'LNX Kullanıcısı'}
                  </div>
                  <div className={`text-[11px] truncate ${effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}`}>
                    {account?.isGuest ? 'Yerel Profil (Eşitleme Kapalı)' : account?.email || 'tunarlyx57@gmail.com'}
                  </div>
                </div>
              </div>

              <div className={`py-2.5 space-y-1.5 border-b text-[11px] ${effectiveIsDark ? 'border-[#262626]' : 'border-neutral-200'}`}>
                <div className={`flex items-center justify-between ${effectiveIsDark ? 'text-[#AAA]' : 'text-neutral-600'}`}>
                  <span>Bulut Senkronizasyonu:</span>
                  <span className={`font-medium flex items-center gap-1 ${account?.isGuest ? 'text-amber-500' : 'text-emerald-500'}`}>
                    <Check className="w-3 h-3" /> {account?.isGuest ? 'Yerel' : 'Aktif (AES-256)'}
                  </span>
                </div>
                <div className={`flex items-center justify-between ${effectiveIsDark ? 'text-[#AAA]' : 'text-neutral-600'}`}>
                  <span>Şifreler & Yer İmleri:</span>
                  <span className={effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}>{account?.isGuest ? 'Cihazda Saklı' : 'Senkronize'}</span>
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <button
                  onClick={() => {
                    onNavigate('lnx://settings');
                    setShowProfileMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    effectiveIsDark
                      ? 'hover:bg-[#1A1A1A] text-[#AAA] hover:text-[#E0E0E0]'
                      : 'hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Profil Ayarlarını Yönet
                </button>
                <button
                  onClick={() => {
                    onNewIncognitoWindow();
                    setShowProfileMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    effectiveIsDark
                      ? 'hover:bg-[#1A1A1A] text-purple-400'
                      : 'hover:bg-purple-50 text-purple-600'
                  }`}
                >
                  Gizli Pencere Aç
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3-Dots Chromium Main Menu */}
        <div className="relative" ref={menuRef}>
          <button
            id="btn-chromium-menu"
            onClick={() => setShowChromiumMenu(!showChromiumMenu)}
            title="LNX Browser'ı Özelleştirin ve Denetleyin"
            className={`p-1.5 rounded-lg transition-all ${
              effectiveIsDark
                ? 'hover:bg-[#262626] text-[#AAA] hover:text-[#E0E0E0]'
                : 'hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Chromium Dropdown Menu */}
          {showChromiumMenu && (
            <div
              id="chromium-main-menu"
              className={`absolute right-0 top-10 w-72 rounded-xl shadow-2xl py-1.5 z-50 text-xs border ${
                effectiveIsDark
                  ? 'bg-[#121212] border-[#262626] text-[#E0E0E0]'
                  : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              {/* Brand Header */}
              <div className={`px-3 py-2 border-b flex items-center justify-between ${
                effectiveIsDark ? 'border-[#262626]' : 'border-neutral-200'
              }`}>
                <div className="flex items-center gap-2">
                  <LnxLogo size="sm" showSubtitle={false} />
                  <span className="font-bold text-xs tracking-tight">LNX Browser</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                  v152.0
                </span>
              </div>

              {/* Top Action Items */}
              <button
                onClick={() => {
                  onNewTab();
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-neutral-400" />
                  <span>Yeni Sekme</span>
                </span>
                <span className={`text-[10px] font-mono ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>Ctrl+T</span>
              </button>

              <button
                onClick={() => {
                  onNewIncognitoWindow();
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A] text-purple-300' : 'hover:bg-purple-50 text-purple-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Yeni Gizli Pencere</span>
                </span>
                <span className={`text-[10px] font-mono ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>Ctrl+Shift+N</span>
              </button>

              <div className={`my-1 border-t ${effectiveIsDark ? 'border-[#262626]' : 'border-neutral-200'}`} />

              <button
                onClick={() => {
                  onNavigate('lnx://history');
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4 text-neutral-400" />
                  <span>Geçmiş</span>
                </span>
                <span className={`text-[10px] font-mono ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>Ctrl+H</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('lnx://downloads');
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-neutral-400" />
                  <span>İndirilenler</span>
                </span>
                <span className={`text-[10px] font-mono ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>Ctrl+J</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('lnx://bookmarks');
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-neutral-400" />
                  <span>Yer İşaretleri</span>
                </span>
                <span className={`text-[10px] font-mono ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>Ctrl+Shift+O</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('lnx://extensions');
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-neutral-400" />
                  <span>Eklentiler</span>
                </span>
              </button>

              <div className={`my-1 border-t ${effectiveIsDark ? 'border-[#262626]' : 'border-neutral-200'}`} />

              {/* Zoom Controls inside Chromium Menu */}
              <div className={`flex items-center justify-between px-3 py-1.5 ${effectiveIsDark ? 'text-[#AAA]' : 'text-neutral-700'}`}>
                <span className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-neutral-400" />
                  <span>Yakınlaştır</span>
                </span>
                <div className={`flex items-center gap-2 px-2 py-0.5 rounded-lg border ${
                  effectiveIsDark ? 'bg-[#1A1A1A] border-[#262626]' : 'bg-neutral-100 border-neutral-200'
                }`}>
                  <button
                    onClick={onZoomOut}
                    title="Küçült"
                    className={effectiveIsDark ? 'p-1 hover:text-white' : 'p-1 hover:text-black'}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span
                    onClick={onZoomReset}
                    className="text-xs font-mono cursor-pointer hover:text-indigo-500"
                    title="Sıfırla"
                  >
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={onZoomIn}
                    title="Büyüt"
                    className={effectiveIsDark ? 'p-1 hover:text-white' : 'p-1 hover:text-black'}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Find in page */}
              <button
                onClick={() => {
                  onOpenFindInPage();
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <span>Sayfada Bul...</span>
                </span>
                <span className={`text-[10px] font-mono ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>Ctrl+F</span>
              </button>

              {/* Developer Tools */}
              <button
                onClick={() => {
                  onOpenDevTools();
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  <span>Geliştirici Araçları (DevTools)</span>
                </span>
                <span className={`text-[10px] font-mono ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>F12</span>
              </button>

              {/* Chromium Task Manager */}
              <button
                onClick={() => {
                  onOpenTaskManager();
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span>Görev Yöneticisi</span>
                </span>
                <span className={`text-[10px] font-mono ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>Shift+Esc</span>
              </button>

              {/* Clear browsing data */}
              <button
                onClick={() => {
                  onOpenClearData();
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors ${
                  effectiveIsDark ? 'hover:bg-[#1A1A1A] text-red-400' : 'hover:bg-red-50 text-red-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Tarama Verilerini Temizle</span>
                </span>
                <span className={`text-[10px] font-mono ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>Ctrl+Shift+Del</span>
              </button>

              <div className={`my-1 border-t ${effectiveIsDark ? 'border-[#262626]' : 'border-neutral-200'}`} />

              <button
                onClick={() => {
                  onNavigate('lnx://settings');
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 transition-colors ${
                  effectiveIsDark
                    ? 'hover:bg-[#1A1A1A] text-[#AAA] hover:text-[#E0E0E0]'
                    : 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Settings className="w-4 h-4 text-neutral-400" />
                <span>Ayarlar</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('lnx://flags');
                  setShowChromiumMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 transition-colors ${
                  effectiveIsDark
                    ? 'hover:bg-[#1A1A1A] text-[#AAA] hover:text-[#E0E0E0]'
                    : 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Deneysel Bayraklar (Flags)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
