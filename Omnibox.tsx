import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Globe,
  Search,
  Star,
  BookOpen,
  QrCode,
  Copy,
  Check,
  ZoomIn,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  History,
  Bookmark,
  Sparkles,
  Command,
} from 'lucide-react';
import { BookmarkItem, HistoryItem, SearchEngineType, TabItem } from '../../types';

interface OmniboxProps {
  activeTab: TabItem;
  searchEngine: SearchEngineType;
  bookmarks?: BookmarkItem[];
  history?: HistoryItem[];
  isDark?: boolean;
  onNavigate: (url: string) => void;
  onToggleBookmark: (tab: TabItem) => void;
  isBookmarked: boolean;
  onToggleReaderMode: () => void;
  onOpenQrModal: () => void;
  onOpenShields: () => void;
  shieldsBlockedCount: number;
}

export const Omnibox: React.FC<OmniboxProps> = ({
  activeTab,
  searchEngine,
  bookmarks = [],
  history = [],
  isDark = true,
  onNavigate,
  onToggleBookmark,
  isBookmarked,
  onToggleReaderMode,
  onOpenQrModal,
  onOpenShields,
  shieldsBlockedCount,
}) => {
  const [inputValue, setInputValue] = useState(activeTab.url);
  const [isFocused, setIsFocused] = useState(false);
  const [showSiteInfo, setShowSiteInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const siteInfoRef = useRef<HTMLDivElement>(null);

  const effectiveIsDark = activeTab.isIncognito || isDark;

  // Sync input value when activeTab URL changes and not actively focused
  useEffect(() => {
    if (!isFocused) {
      setInputValue(activeTab.url);
    }
  }, [activeTab.url, isFocused]);

  // Click outside site info popover
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (siteInfoRef.current && !siteInfoRef.current.contains(e.target as Node)) {
        setShowSiteInfo(false);
      }
    }
    if (showSiteInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSiteInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    let target = inputValue.trim();
    // Check if it's an internal lnx protocol
    if (target.startsWith('lnx://') || target.startsWith('chrome://') || target.startsWith('about:')) {
      target = target.replace('chrome://', 'lnx://').replace('about:', 'lnx://');
      onNavigate(target);
      setIsFocused(false);
      inputRef.current?.blur();
      return;
    }

    // Check if it's a domain or URL
    const isDomain = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(target) || /^https?:\/\//i.test(target) || target.startsWith('localhost:');
    if (isDomain) {
      if (!/^https?:\/\//i.test(target) && !target.startsWith('localhost:')) {
        target = 'https://' + target;
      }
    } else {
      // It's a search query
      if (searchEngine === 'duckduckgo') {
        target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
      } else if (searchEngine === 'bing') {
        target = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
      } else if (searchEngine === 'ecosia') {
        target = `https://www.ecosia.org/search?q=${encodeURIComponent(target)}`;
      } else if (searchEngine === 'brave') {
        target = `https://search.brave.com/search?q=${encodeURIComponent(target)}`;
      } else if (searchEngine === 'yahoo') {
        target = `https://search.yahoo.com/search?p=${encodeURIComponent(target)}`;
      } else {
        target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
      }
    }

    onNavigate(target);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(activeTab.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter autocomplete suggestions
  const cleanInput = (inputValue || '').trim().toLowerCase();
  const safeHistory = Array.isArray(history) ? history : [];
  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];

  const historySuggestions = cleanInput
    ? safeHistory
        .filter(
          (h) =>
            (h?.title || '').toLowerCase().includes(cleanInput) ||
            (h?.url || '').toLowerCase().includes(cleanInput)
        )
        .slice(0, 4)
    : [];

  const bookmarkSuggestions = cleanInput
    ? safeBookmarks
        .filter(
          (b) =>
            (b?.title || '').toLowerCase().includes(cleanInput) ||
            (b?.url || '').toLowerCase().includes(cleanInput)
        )
        .slice(0, 3)
    : [];

  const isInternal = activeTab.url.startsWith('lnx://');
  const isHttps = activeTab.url.startsWith('https://');

  return (
    <div className="relative flex-1 min-w-0 mx-2">
      <form
        onSubmit={handleSubmit}
        className={`flex items-center h-8 px-3 rounded-lg transition-all text-xs border ${
          isFocused
            ? effectiveIsDark
              ? 'bg-[#1E1E1E] border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
              : 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
            : effectiveIsDark
            ? 'bg-[#262626] border-[#333] hover:border-[#444] hover:bg-[#2A2A2A]'
            : 'bg-[#F1F3F4] border-neutral-300 hover:border-neutral-400 hover:bg-white'
        }`}
      >
        {/* Security Badge / Lock / Site Info Trigger */}
        <button
          type="button"
          id="btn-site-info"
          onClick={() => setShowSiteInfo(!showSiteInfo)}
          title="Site Bilgilerini Görüntüle"
          className={`flex items-center gap-1 mr-2 px-1.5 py-0.5 rounded-md transition-colors ${
            effectiveIsDark
              ? 'hover:bg-[#333] text-[#888] hover:text-[#E0E0E0]'
              : 'hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {isInternal ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>LNX</span>
            </span>
          ) : isHttps ? (
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          )}
        </button>

        {/* Search Engine Icon when focused or searching */}
        {isFocused && (
          <Search className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 ${effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}`} />
        )}

        {/* URL / Query Input */}
        <input
          ref={inputRef}
          id="omnibox-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setTimeout(() => inputRef.current?.select(), 50);
          }}
          onBlur={() => {
            // delay blur to allow suggestion clicks
            setTimeout(() => setIsFocused(false), 200);
          }}
          placeholder="Web'de ara veya URL yazın..."
          className={`w-full bg-transparent outline-none font-sans text-xs tracking-wide ${
            effectiveIsDark
              ? 'text-[#E0E0E0] placeholder-[#555]'
              : 'text-neutral-900 placeholder-neutral-400'
          }`}
        />

        {/* Action icons right side of Omnibox */}
        <div className={`flex items-center gap-1 ml-1.5 ${effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}`}>
          {/* LNX Shields Real-time badge */}
          <button
            type="button"
            id="btn-omnibox-shields"
            onClick={onOpenShields}
            title={`LNX Shields: ${shieldsBlockedCount} izleyici/reklam engellendi`}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
              effectiveIsDark
                ? 'hover:bg-[#333] text-emerald-400 hover:text-emerald-300'
                : 'hover:bg-neutral-200 text-emerald-600 hover:text-emerald-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{shieldsBlockedCount}</span>
          </button>

          {/* Reader Mode Toggle */}
          {!isInternal && (
            <button
              type="button"
              id="btn-reader-mode"
              onClick={onToggleReaderMode}
              title={activeTab.isReaderMode ? 'Normal Görünüme Dön' : 'Okuma Modu (Distraction-Free)'}
              className={`p-1 rounded transition-colors ${
                effectiveIsDark
                  ? `hover:bg-[#333] ${activeTab.isReaderMode ? 'text-indigo-400 bg-indigo-500/20' : 'hover:text-[#E0E0E0]'}`
                  : `hover:bg-neutral-200 ${activeTab.isReaderMode ? 'text-indigo-600 bg-indigo-100' : 'hover:text-neutral-900'}`
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          )}

          {/* QR Code generator */}
          {!isInternal && (
            <button
              type="button"
              id="btn-qr-code"
              onClick={onOpenQrModal}
              title="Bu Sayfayı Telefonla Aç (QR Kod)"
              className={`p-1 rounded transition-colors ${
                effectiveIsDark ? 'hover:bg-[#333] hover:text-[#E0E0E0]' : 'hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy URL */}
          <button
            type="button"
            id="btn-copy-url"
            onClick={handleCopyUrl}
            title="URL'yi Kopyala"
            className={`p-1 rounded transition-colors ${
              effectiveIsDark ? 'hover:bg-[#333] hover:text-[#E0E0E0]' : 'hover:bg-neutral-200 hover:text-neutral-900'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Star Bookmark */}
          <button
            type="button"
            id="btn-star-bookmark"
            onClick={() => onToggleBookmark(activeTab)}
            title={isBookmarked ? 'Yer işaretini düzenle' : 'Bu sekmeyi yer işaretlerine ekle (Ctrl+D)'}
            className={`p-1 rounded transition-colors ${
              isBookmarked
                ? 'text-amber-400 fill-amber-400'
                : effectiveIsDark
                ? 'hover:bg-[#333] hover:text-[#E0E0E0]'
                : 'hover:bg-neutral-200 hover:text-neutral-900'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
      </form>

      {/* Autocomplete / Suggestions Dropdown */}
      {isFocused && (
        <div
          id="omnibox-suggestions"
          className={`absolute top-10 left-0 right-0 z-50 rounded-xl shadow-2xl overflow-hidden py-1.5 border text-xs ${
            effectiveIsDark
              ? 'bg-[#121212] border-[#262626] text-[#E0E0E0]'
              : 'bg-white border-neutral-200 text-neutral-800'
          }`}
        >
          {/* Quick System Navigation Shortcuts */}
          {cleanInput.length === 0 && (
            <div className={`px-3 py-1.5 text-[11px] font-semibold uppercase border-b flex items-center justify-between ${
              effectiveIsDark ? 'text-[#888] border-[#262626]' : 'text-neutral-500 border-neutral-100'
            }`}>
              <span>LNX Hızlı Komutlar</span>
              <Command className="w-3 h-3 text-neutral-400" />
            </div>
          )}

          {cleanInput.length === 0 && (
            <div className={`grid grid-cols-3 gap-1 p-2 border-b text-xs ${
              effectiveIsDark ? 'bg-[#0A0A0A]/60 border-[#262626]' : 'bg-neutral-50 border-neutral-100'
            }`}>
              {[
                { title: 'Yeni Sekme', url: 'lnx://newtab', icon: '🏠' },
                { title: 'Kurulum', url: 'lnx://welcome', icon: '🚀' },
                { title: 'Ayarlar', url: 'lnx://settings', icon: '⚙️' },
                { title: 'Geçmiş', url: 'lnx://history', icon: '🕒' },
                { title: 'Yer İmleri', url: 'lnx://bookmarks', icon: '⭐' },
                { title: 'Eklentiler', url: 'lnx://extensions', icon: '🧩' },
                { title: 'Bayraklar (Flags)', url: 'lnx://flags', icon: '🚩' },
              ].map((cmd) => (
                <button
                  key={cmd.url}
                  type="button"
                  onMouseDown={() => {
                    onNavigate(cmd.url);
                    setIsFocused(false);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left transition-colors ${
                    effectiveIsDark
                      ? 'hover:bg-[#1A1A1A] text-[#AAA] hover:text-[#E0E0E0]'
                      : 'hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  <span>{cmd.icon}</span>
                  <span className="truncate">{cmd.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Web Search Suggestion */}
          {cleanInput.length > 0 && (
            <div
              onMouseDown={() => {
                handleSubmit({ preventDefault: () => {} } as any);
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-xs transition-colors ${
                effectiveIsDark
                  ? 'hover:bg-indigo-600/20 text-[#E0E0E0]'
                  : 'hover:bg-indigo-50 text-neutral-800'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <div className="flex-1 truncate">
                <span className={`font-semibold ${effectiveIsDark ? 'text-white' : 'text-neutral-900'}`}>{cleanInput}</span>
                <span className={`ml-2 text-[11px] ${effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}`}>({searchEngine.toUpperCase()} ile ara)</span>
              </div>
            </div>
          )}

          {/* Bookmarks matches */}
          {bookmarkSuggestions.map((bm) => (
            <div
              key={bm.id}
              onMouseDown={() => {
                onNavigate(bm.url);
                setIsFocused(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-xs transition-colors ${
                effectiveIsDark
                  ? 'hover:bg-[#1A1A1A] text-[#E0E0E0]'
                  : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <div className="flex-1 truncate">
                <span className={`font-medium ${effectiveIsDark ? 'text-[#E0E0E0]' : 'text-neutral-900'}`}>{bm.title}</span>
                <span className={`ml-2 text-[11px] truncate ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>{bm.url}</span>
              </div>
            </div>
          ))}

          {/* History matches */}
          {historySuggestions.map((hist) => (
            <div
              key={hist.id}
              onMouseDown={() => {
                onNavigate(hist.url);
                setIsFocused(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-xs transition-colors ${
                effectiveIsDark
                  ? 'hover:bg-[#1A1A1A] text-[#E0E0E0]'
                  : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <History className={`w-3.5 h-3.5 flex-shrink-0 ${effectiveIsDark ? 'text-[#888]' : 'text-neutral-400'}`} />
              <div className="flex-1 truncate">
                <span className={effectiveIsDark ? 'text-[#AAA]' : 'text-neutral-700'}>{hist.title}</span>
                <span className={`ml-2 text-[11px] ${effectiveIsDark ? 'text-[#666]' : 'text-neutral-400'}`}>{hist.url}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Site Security & Permissions Info Popover */}
      {showSiteInfo && (
        <div
          ref={siteInfoRef}
          id="site-info-popover"
          className={`absolute top-10 left-0 z-50 w-80 rounded-xl shadow-2xl p-4 text-xs border ${
            effectiveIsDark
              ? 'bg-[#121212] border-[#262626] text-[#E0E0E0]'
              : 'bg-white border-neutral-200 text-neutral-800'
          }`}
        >
          <div className={`flex items-start justify-between pb-3 border-b ${effectiveIsDark ? 'border-[#262626]' : 'border-neutral-200'}`}>
            <div>
              <div className={`font-semibold text-sm flex items-center gap-1.5 ${effectiveIsDark ? 'text-white' : 'text-neutral-900'}`}>
                {isInternal ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <span>LNX Sistem Sayfası</span>
                  </>
                ) : isHttps ? (
                  <>
                    <Lock className="w-4 h-4 text-emerald-500" />
                    <span>Bağlantı Güvenli</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Güvensiz Bağlantı</span>
                  </>
                )}
              </div>
              <p className={`text-[11px] mt-0.5 truncate ${effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}`}>
                {isInternal ? 'LNX Browser Güvenli Dahili Protokolü' : new URL(activeTab.url).hostname}
              </p>
            </div>
          </div>

          {/* Certificate & Cookies Details */}
          <div className={`py-2.5 space-y-2 border-b text-[11px] ${effectiveIsDark ? 'border-[#262626]' : 'border-neutral-200'}`}>
            <div className="flex justify-between items-center">
              <span className={effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}>Protokol:</span>
              <span className="font-mono text-emerald-500">TLS 1.3 / HTTP 2.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}>Sertifika:</span>
              <span className={effectiveIsDark ? 'text-[#E0E0E0]' : 'text-neutral-800'}>Google Trust Services LLC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}>Çerezler ve Site Verileri:</span>
              <span className="text-indigo-500 font-medium">8 çerez kullanımda</span>
            </div>
          </div>

          {/* Permissions switches */}
          <div className="pt-2.5 space-y-2">
            <div className={`text-[11px] font-semibold uppercase ${effectiveIsDark ? 'text-[#888]' : 'text-neutral-500'}`}>Site İzinleri</div>
            {[
              { label: 'Kamera', state: 'İzin verildi' },
              { label: 'Mikrofon', state: 'İzin verildi' },
              { label: 'Konum', state: 'Sorulsun' },
              { label: 'Bildirimler', state: 'Engellendi' },
            ].map((perm) => (
              <div key={perm.label} className="flex items-center justify-between text-xs">
                <span className={effectiveIsDark ? 'text-[#AAA]' : 'text-neutral-700'}>{perm.label}</span>
                <span className={`text-[11px] px-2 py-0.5 border rounded ${
                  effectiveIsDark ? 'text-[#888] bg-[#1A1A1A] border-[#262626]' : 'text-neutral-600 bg-neutral-100 border-neutral-200'
                }`}>
                  {perm.state}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
