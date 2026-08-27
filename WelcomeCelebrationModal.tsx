import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Search,
  Bookmark,
  User,
  Zap,
  ArrowRight,
  X,
  Bot,
  Settings as SettingsIcon,
  RotateCcw,
  Globe,
  Cpu,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { BrowserSettings, LnxUserAccount, QuickShortcut, SearchEngineType } from '../../types';
import { LnxLogo } from '../Common/LnxLogo';

interface WelcomeCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: LnxUserAccount;
  settings: BrowserSettings;
  shortcuts?: QuickShortcut[];
  onNavigate: (url: string) => void;
  onOpenShields?: () => void;
}

export const WelcomeCelebrationModal: React.FC<WelcomeCelebrationModalProps> = ({
  isOpen,
  onClose,
  account,
  settings,
  shortcuts = [],
  onNavigate,
  onOpenShields,
}) => {
  const [quickQuery, setQuickQuery] = useState('');
  const accentColor = account?.avatarColor || settings.accentColor || '#3b82f6';

  if (!isOpen) return null;

  const searchEngineNames: Record<SearchEngineType, string> = {
    google: 'Google',
    duckduckgo: 'DuckDuckGo',
    bing: 'Bing',
    ecosia: 'Ecosia',
    brave: 'Brave Search',
    yahoo: 'Yahoo',
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    const query = quickQuery.trim();
    if (settings.searchEngine === 'duckduckgo') {
      onNavigate(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`);
    } else if (settings.searchEngine === 'bing') {
      onNavigate(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);
    } else if (settings.searchEngine === 'ecosia') {
      onNavigate(`https://www.ecosia.org/search?q=${encodeURIComponent(query)}`);
    } else {
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    }
    onClose();
  };

  const userName = account?.isGuest ? 'Misafir Kullanıcı' : account?.name || 'Tunar Lyx';
  const initial = account?.isGuest ? 'M' : (userName.charAt(0) || 'L').toUpperCase();

  return (
    <AnimatePresence>
      <div
        id="lnx-welcome-celebration-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl bg-[#111111] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden relative text-neutral-200 my-auto"
          style={{
            boxShadow: `0 25px 60px -15px ${accentColor}25, 0 0 0 1px #262626`,
          }}
        >
          {/* Ambient Glow Gradient Header */}
          <div
            className="h-32 w-full absolute top-0 left-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(ellipse at 50% 0%, ${accentColor}, transparent 70%)`,
            }}
          />

          {/* Close / Dismiss Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700/60 transition-colors z-20 cursor-pointer"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 md:p-8 space-y-6 relative z-10">
            {/* Top Celebration Identity Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-4">
                {/* LNX Logo */}
                <div className="relative shrink-0">
                  <LnxLogo size={58} />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-neutral-900 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-neutral-950 font-bold" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Kurulum Tamamlandı</span>
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-400">
                      Chromium v152 Kernel
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                    Hoş Geldiniz, {userName}! 🎉
                  </h2>
                  <p className="text-xs text-neutral-400">
                    LNX Browser ve LNX Hesabınız başarıyla hazırlandı. Gezinmeye başlayabilirsiniz.
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sistem Hazır & Aktif</span>
                </span>
                <span className="text-[10px] text-neutral-500 mt-1">AES-256 Şifreleme</span>
              </div>
            </div>

            {/* Configured Features Grid (Kurulumda Seçilenlerin Canlı Kartları) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {/* Feature 1: Account */}
              <div className="p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Profil</span>
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="font-semibold text-white truncate">{userName}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span>●</span> <span>{account?.isGuest ? 'Yerel Profil' : 'Eşitleme Aktif'}</span>
                </div>
              </div>

              {/* Feature 2: Search Engine */}
              <div className="p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Arama Motoru</span>
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="font-semibold text-white truncate">
                  {searchEngineNames[settings.searchEngine] || 'Google'}
                </div>
                <div className="text-[10px] text-neutral-400">Varsayılan Motor</div>
              </div>

              {/* Feature 3: Shields */}
              <div className="p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">LNX Shields</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="font-semibold text-emerald-400 truncate">Kalkanlar Aktif</div>
                <div className="text-[10px] text-neutral-400">Tracker & Reklam Blok</div>
              </div>

              {/* Feature 4: Theme & Performance */}
              <div className="p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Görünüm & RAM</span>
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="font-semibold text-white capitalize">{settings.theme} Mod</div>
                <div className="text-[10px] text-purple-300">
                  {settings.memorySaver ? 'Bellek Tasarrufu (%40)' : 'Hızlı Mod'}
                </div>
              </div>
            </div>

            {/* Quick Search Launch Bar */}
            <form onSubmit={handleQuickSearch} className="relative">
              <div className="flex items-center w-full h-11 px-3.5 rounded-xl bg-neutral-900 border border-neutral-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <Search className="w-4 h-4 text-neutral-400 mr-2.5" />
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder={`${searchEngineNames[settings.searchEngine] || 'Web'} üzerinde hemen arayın veya URL girin...`}
                  className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg text-white font-medium text-xs shadow transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: accentColor }}
                >
                  Ara
                </button>
              </div>
            </form>

            {/* Setup Shortcuts Preview (Seçilen Hızlı Erişimler) */}
            {shortcuts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-semibold flex items-center gap-1.5 text-neutral-300">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Kurulumda Eklenen Kısayollar ({shortcuts.length})</span>
                  </span>
                  <span className="text-[11px] text-neutral-500">Yeni Sekmede Kullanıma Hazır</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {shortcuts.slice(0, 6).map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        onNavigate(sc.url);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left transition-all group cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                      <div
                        className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center mb-1 shadow group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: sc.color || accentColor }}
                      >
                        {sc.title.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-medium text-neutral-200 group-hover:text-white truncate max-w-[70px]">
                        {sc.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Browser Tool Action Launchers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenShields?.();
                }}
                className="p-3 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-left transition-all group cursor-pointer flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    LNX Shields Kalkanı
                  </div>
                  <div className="text-[10px] text-neutral-400">Güvenlik & Reklam Engelleme Paneli</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigate('lnx://settings');
                  onClose();
                }}
                className="p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 text-left transition-all group cursor-pointer flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-neutral-300 transition-colors">
                    Tarayıcı Ayarları
                  </div>
                  <div className="text-[10px] text-neutral-400">Gelişmiş Yapılandırma ve Temalar</div>
                </div>
              </button>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-800">
              <button
                onClick={() => {
                  onNavigate('lnx://welcome');
                  onClose();
                }}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                <span>Kurulum Sihirbazını Yeniden Başlat</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-xs text-white shadow-lg transition-all hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>Gezinmeye Başla</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
