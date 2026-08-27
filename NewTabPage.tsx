import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Settings as SettingsIcon,
} from 'lucide-react';
import { BrowserSettings, LnxUserAccount, QuickShortcut, SearchEngineType } from '../../types';
import { LnxLogo } from '../Common/LnxLogo';

interface NewTabPageProps {
  shortcuts?: QuickShortcut[];
  searchEngine?: SearchEngineType;
  settings?: BrowserSettings;
  account?: LnxUserAccount;
  onNavigate: (url: string) => void;
  onAddShortcut: (title: string, url: string, color: string) => void;
  onRemoveShortcut: (id: string) => void;
  onSearch: (query: string, engine: SearchEngineType) => void;
  onUpdateSettings?: (settings: Partial<BrowserSettings>) => void;
  onOpenWelcomeModal?: () => void;
}

const WALLPAPERS = [
  {
    id: 'nature',
    name: 'Zümrüt Yeşili',
    darkColor: '#059669',
    lightColor: '#10b981',
    dark: 'bg-[#041D14]',
    light: 'bg-[#ECFDF5]',
    darkStyle: {
      background: 'radial-gradient(ellipse at 50% 38%, #064e3b 0%, #032a1f 48%, #01140e 100%)',
    },
    lightStyle: {
      background: 'radial-gradient(ellipse at 50% 38%, #a7f3d0 0%, #d1fae5 45%, #ecfdf5 100%)',
    },
  },
  {
    id: 'lnx_banner',
    name: 'LNX Klasik (Banner)',
    darkColor: '#20242c',
    lightColor: '#E8E3D7',
    dark: 'bg-[#0d0f14]',
    light: 'bg-[#F3EFE7]',
    darkStyle: {
      background: 'radial-gradient(ellipse at 50% 50%, #20242c 0%, #15181f 55%, #0d0f14 100%)',
    },
    lightStyle: {
      background: 'radial-gradient(ellipse at 50% 50%, #f7f4ed 0%, #ede8dc 55%, #dfd9cb 100%)',
    },
  },
  {
    id: 'lnx_official',
    name: 'LNX Resmi',
    isLnxTheme: true,
    darkColor: '#1d2533',
    lightColor: '#dbeafe',
    dark: 'bg-[#0a0d14]',
    light: 'bg-[#F8FAFC]',
    darkStyle: {
      background: 'radial-gradient(ellipse at 50% 45%, #1d2533 0%, #121822 55%, #0a0d14 100%)',
    },
    lightStyle: {
      background: 'radial-gradient(ellipse at 50% 45%, #dbeafe 0%, #eff6ff 55%, #f8fafc 100%)',
    },
  },
  {
    id: 'minimal',
    name: 'Sade & Minimal',
    darkColor: '#0E0E0E',
    lightColor: '#F8F9FA',
    dark: 'bg-[#0E0E0E]',
    light: 'bg-[#F8F9FA]',
    darkStyle: {
      background: 'radial-gradient(ellipse at 50% 50%, #181818 0%, #0e0e0e 100%)',
    },
    lightStyle: {
      background: 'radial-gradient(ellipse at 50% 50%, #ffffff 0%, #f8f9fa 100%)',
    },
  },
  {
    id: 'space',
    name: 'Derin Uzay',
    darkColor: '#111322',
    lightColor: '#e0e7ff',
    dark: 'bg-[#030712]',
    light: 'bg-[#F8FAFC]',
    darkStyle: {
      background: 'radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #0f172a 55%, #030712 100%)',
    },
    lightStyle: {
      background: 'radial-gradient(ellipse at 50% 30%, #e0e7ff 0%, #f1f5f9 60%, #ffffff 100%)',
    },
  },
  {
    id: 'sunset',
    name: 'Alacakaranlık & Şafak',
    darkColor: '#18111A',
    lightColor: '#ffe4e6',
    dark: 'bg-[#09050d]',
    light: 'bg-[#FFF7ED]',
    darkStyle: {
      background: 'radial-gradient(ellipse at 50% 30%, #3b0764 0%, #1e112a 55%, #09050d 100%)',
    },
    lightStyle: {
      background: 'radial-gradient(ellipse at 50% 30%, #ffe4e6 0%, #fef3c7 50%, #fff7ed 100%)',
    },
  },
];

export const NewTabPage: React.FC<NewTabPageProps> = ({
  shortcuts = [],
  searchEngine = 'google',
  settings,
  account,
  onNavigate,
  onAddShortcut,
  onRemoveShortcut,
  onSearch,
  onUpdateSettings,
  onOpenWelcomeModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<SearchEngineType>(settings?.searchEngine || searchEngine);
  const [selectedWallpaper, setSelectedWallpaper] = useState(settings?.wallpaper || 'nature');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newColor, setNewColor] = useState('#10b981');
  const [currentTime, setCurrentTime] = useState(new Date());

  const safeShortcuts = Array.isArray(shortcuts) ? shortcuts : [];
  const accentColor = settings?.accentColor || '#3b82f6';
  const isDark = settings?.theme !== 'light';

  useEffect(() => {
    if (settings?.searchEngine) {
      setSelectedEngine(settings.searchEngine);
    } else if (searchEngine) {
      setSelectedEngine(searchEngine);
    }
  }, [settings?.searchEngine, searchEngine]);

  useEffect(() => {
    if (settings?.wallpaper) {
      setSelectedWallpaper(settings.wallpaper);
    }
  }, [settings?.wallpaper]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectWallpaper = (wpId: string) => {
    setSelectedWallpaper(wpId);
    if (onUpdateSettings) {
      onUpdateSettings({ wallpaper: wpId });
    }
    setShowWallpaperMenu(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim(), selectedEngine);
  };

  const handleCreateShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('lnx://')) {
      url = 'https://' + url;
    }
    onAddShortcut(newTitle.trim(), url, newColor);
    setNewTitle('');
    setNewUrl('');
    setShowAddModal(false);
  };

  const activeWp = WALLPAPERS.find((w) => w.id === selectedWallpaper) || WALLPAPERS[0];
  const bgClass = isDark ? activeWp.dark : activeWp.light;
  const bgStyle = isDark ? activeWp.darkStyle : activeWp.lightStyle;

  const timeString = currentTime.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getGreeting = (date: Date, userName?: string): string => {
    const hour = date.getHours();
    const name = userName && userName.trim() ? userName.trim() : 'Kullanıcı';

    if (hour >= 5 && hour < 12) {
      return `Günaydın, ${name}`;
    } else if (hour >= 12 && hour < 14) {
      return `İyi Öğlenler, ${name}`;
    } else if (hour >= 14 && hour < 18) {
      return `İyi Günler, ${name}`;
    } else if (hour >= 18 && hour < 22) {
      return `İyi Akşamlar, ${name}`;
    } else {
      return `İyi Geceler, ${name}`;
    }
  };

  const displayName = account?.isGuest ? 'Misafir' : (account?.name || 'Kullanıcı');
  const greeting = getGreeting(currentTime, displayName);

  const searchEngineNames: Record<SearchEngineType, string> = {
    google: 'Google',
    duckduckgo: 'DuckDuckGo',
    bing: 'Bing',
    ecosia: 'Ecosia',
    brave: 'Brave Search',
    yahoo: 'Yahoo',
  };

  return (
    <div
      id="lnx-new-tab-view"
      style={bgStyle}
      className={`min-h-full w-full flex flex-col items-center justify-between p-6 sm:p-10 select-none relative transition-all duration-300 ${bgClass} ${
        isDark ? 'text-[#E0E0E0]' : 'text-neutral-850'
      }`}
    >
      {/* Centered LNX Brand Watermark if LNX Official Wallpaper is active */}
      {activeWp.id === 'lnx_official' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span
            className={`text-[120px] sm:text-[160px] md:text-[200px] font-sans font-bold tracking-[0.18em] transform -translate-y-6 ${
              isDark ? 'text-white opacity-[0.06]' : 'text-slate-900 opacity-[0.05]'
            }`}
            style={{ textShadow: isDark ? '0 0 80px rgba(255,255,255,0.05)' : 'none' }}
          >
            LNX
          </span>
        </div>
      )}

      {/* Top Header Controls: Minimal Customize & Settings */}
      <div className="w-full max-w-5xl flex items-center justify-end z-10 gap-2">
        <div className="relative">
          <button
            onClick={() => setShowWallpaperMenu(!showWallpaperMenu)}
            title="Arka Planı Değiştir"
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs ${
              isDark
                ? 'bg-[#181818]/80 hover:bg-[#242424] border-[#2E2E2E] text-neutral-400 hover:text-neutral-200 backdrop-blur-xs'
                : 'bg-white/85 hover:bg-white border-neutral-300 text-neutral-700 hover:text-neutral-900 shadow-sm backdrop-blur-xs'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {showWallpaperMenu && (
            <div
              className={`absolute right-0 top-11 w-56 rounded-xl p-1.5 z-50 text-xs border shadow-2xl ${
                isDark
                  ? 'bg-[#161616]/95 border-[#2E2E2E] text-neutral-200 backdrop-blur-md'
                  : 'bg-white/95 border-neutral-200 text-neutral-800 backdrop-blur-md'
              }`}
            >
              <div className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Duvar Kağıdı (Mod Uyumlu)
              </div>
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => handleSelectWallpaper(wp.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                    selectedWallpaper === wp.id
                      ? 'bg-emerald-500/15 text-emerald-500 font-semibold'
                      : isDark
                      ? 'hover:bg-[#222] text-neutral-300'
                      : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: isDark ? wp.darkColor : wp.lightColor }}
                    />
                    <span className="truncate">{wp.name}</span>
                  </div>
                  {selectedWallpaper === wp.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onNavigate('lnx://settings')}
          title="Ayarlar"
          className={`p-2 rounded-xl border transition-colors ${
            isDark
              ? 'bg-[#181818] hover:bg-[#242424] border-[#2E2E2E] text-neutral-400 hover:text-neutral-200'
              : 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-700 hover:text-neutral-900 shadow-sm'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Center Section: Dynamic Greeting, Search Box & Shortcuts */}
      <div className="w-full max-w-2xl flex flex-col items-center my-auto py-4">
        {/* Hero Greeting & Banner for LNX Klasik */}
        {activeWp.id === 'lnx_banner' ? (
          <div className="flex flex-col items-center mb-6 text-center">
            <div
              className="flex items-center justify-center gap-1.5 sm:gap-2.5 mb-3 select-none hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => onNavigate('lnx://settings')}
            >
              <span
                className={`text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}
              >
                LNX Br
              </span>
              <div className="inline-block transform translate-y-0.5 sm:translate-y-1">
                <LnxLogo size={62} showSubtitle={false} />
              </div>
              <span
                className={`text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}
              >
                wser
              </span>
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-medium tracking-tight font-sans select-none transition-colors ${
                isDark ? 'text-neutral-200' : 'text-neutral-800'
              }`}
            >
              {greeting}
            </h1>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8 text-center px-4">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight font-sans select-none transition-colors ${
                isDark ? 'text-neutral-100' : 'text-neutral-850'
              }`}
            >
              {greeting}
            </h1>
          </div>
        )}

        {/* Minimal Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full relative mb-8">
          <div
            className={`flex items-center w-full h-12 px-4 rounded-2xl border transition-all shadow-sm focus-within:ring-4 ${
              isDark
                ? 'bg-[#161616]/90 border-[#2A2A2A] hover:border-[#383838] focus-within:border-emerald-500 focus-within:ring-emerald-500/20'
                : 'bg-white/95 border-neutral-300 hover:border-neutral-400 focus-within:border-emerald-500 focus-within:ring-emerald-500/20 shadow-sm'
            }`}
          >
            <Search className={`w-4 h-4 mr-3 flex-shrink-0 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />

            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${searchEngineNames[selectedEngine] || 'Web'} üzerinde arayın veya URL girin...`}
              className={`flex-1 bg-transparent text-sm outline-none font-sans ${
                isDark ? 'text-white placeholder-neutral-500' : 'text-neutral-900 placeholder-neutral-400'
              }`}
            />

            {query.trim() && (
              <button
                type="submit"
                className="px-3 py-1 rounded-xl text-white font-medium text-xs shadow hover:opacity-90 transition-opacity"
                style={{ backgroundColor: accentColor }}
              >
                Ara
              </button>
            )}
          </div>
        </form>

        {/* Speed Dial Shortcuts Grid */}
        <div className="w-full">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 sm:gap-4">
            {safeShortcuts.map((sc) => (
              <div
                key={sc.id}
                onClick={() => onNavigate(sc.url)}
                className={`group relative flex flex-col items-center p-3 rounded-2xl border cursor-pointer transition-all duration-150 hover:-translate-y-0.5 ${
                  isDark
                    ? 'bg-[#161616]/90 hover:bg-[#202020] border-[#242424] hover:border-[#333]'
                    : 'bg-white/85 hover:bg-white border-neutral-300 hover:border-neutral-400 shadow-sm'
                }`}
              >
                {/* Delete button on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveShortcut(sc.id);
                  }}
                  title="Kaldır"
                  className={`absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? 'bg-[#2A2A2A] text-neutral-400 hover:text-red-400' : 'bg-neutral-100 text-neutral-500 hover:text-red-500'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                {/* Icon Tile */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-2 shadow-sm transition-transform group-hover:scale-105"
                  style={{ backgroundColor: sc.color || accentColor }}
                >
                  {sc.title.charAt(0).toUpperCase()}
                </div>

                <span
                  className={`text-xs font-medium truncate max-w-[75px] text-center ${
                    isDark ? 'text-neutral-300 group-hover:text-white' : 'text-neutral-800 group-hover:text-black'
                  }`}
                >
                  {sc.title}
                </span>
              </div>
            ))}

            {/* Add Shortcut Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed cursor-pointer transition-all ${
                isDark
                  ? 'border-[#2E2E2E] hover:border-emerald-500 bg-[#161616]/40 hover:bg-[#1C1C1C] text-neutral-400 hover:text-emerald-400'
                  : 'border-neutral-400 hover:border-emerald-500 bg-white/60 hover:bg-white text-neutral-600 hover:text-emerald-600'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                  isDark ? 'bg-[#222]' : 'bg-neutral-200/80'
                }`}
              >
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">Kısayol</span>
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="w-full max-w-5xl flex items-center justify-center text-[11px] text-neutral-500">
        <span>LNX Web Tarayıcısı</span>
      </div>

      {/* Add Shortcut Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl text-xs border ${
              isDark ? 'bg-[#141414] border-[#2A2A2A] text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
            }`}
          >
            <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Yeni Kısayol Ekle</h3>
            <form onSubmit={handleCreateShortcut} className="space-y-3">
              <div>
                <label className={`block mb-1 text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Başlık
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: GitHub"
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark
                      ? 'bg-[#1C1C1C] border-[#2E2E2E] text-white focus:border-indigo-500'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Web Adresi (URL)
                </label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://github.com"
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark
                      ? 'bg-[#1C1C1C] border-[#2E2E2E] text-white focus:border-indigo-500'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Renk
                </label>
                <div className="flex items-center gap-2">
                  {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#3b82f6'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newColor === c ? 'scale-125 ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-3 py-1.5 rounded-xl border ${
                    isDark ? 'bg-[#202020] hover:bg-[#2A2A2A] border-[#303030] text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                  }`}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-white font-medium shadow hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
