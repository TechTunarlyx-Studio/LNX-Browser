import React, { useState } from 'react';
import {
  Rocket,
  ShieldCheck,
  Palette,
  Search,
  Zap,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Cpu,
  Globe,
  Bookmark,
  Layers,
  Lock,
  Moon,
  Sun,
  Monitor,
  Layout,
  Sliders,
  CheckCircle2,
  ExternalLink,
  User,
  Mail,
  KeyRound,
  RefreshCw,
  Cloud,
  ShieldAlert,
  SlidersHorizontal,
  LogOut,
  UserCheck,
} from 'lucide-react';
import {
  BrowserSettings,
  BrowserTheme,
  LnxUserAccount,
  QuickShortcut,
  SearchEngineType,
} from '../../types';
import { LnxLogo } from '../Common/LnxLogo';

interface WelcomeSetupPageProps {
  settings: BrowserSettings;
  account?: LnxUserAccount;
  shortcuts?: QuickShortcut[];
  onUpdateSettings: (newSettings: Partial<BrowserSettings>) => void;
  onUpdateAccount?: (newAccount: Partial<LnxUserAccount>) => void;
  onNavigate: (url: string) => void;
  onAddShortcut?: (title: string, url: string, color: string) => void;
  onSetShortcuts?: (shortcuts: QuickShortcut[]) => void;
  onOpenWelcomeModal?: () => void;
}

const ACCENT_COLORS = [
  { name: 'Sapphire Blue', color: '#3b82f6', border: 'border-blue-500' },
  { name: 'Indigo Dream', color: '#6366f1', border: 'border-indigo-500' },
  { name: 'Emerald Mint', color: '#10b981', border: 'border-emerald-500' },
  { name: 'Purple Cosmic', color: '#a855f7', border: 'border-purple-500' },
  { name: 'Crimson Red', color: '#ef4444', border: 'border-red-500' },
  { name: 'Amber Gold', color: '#f59e0b', border: 'border-amber-500' },
  { name: 'Cyan Neon', color: '#06b6d4', border: 'border-cyan-500' },
];

const SEARCH_ENGINES: {
  id: SearchEngineType;
  name: string;
  desc: string;
  badge: string;
  iconBg: string;
}[] = [
  {
    id: 'google',
    name: 'Google',
    desc: 'Dünyanın en kapsamlı web dizini ve hızlı sonuçları',
    badge: 'En Popüler',
    iconBg: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    desc: 'Kişisel verilerinizi kaydetmeyen gizlilik odaklı arama motoru',
    badge: 'Gizlilik Odaklı',
    iconBg: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
  },
  {
    id: 'bing',
    name: 'Microsoft Bing',
    desc: 'Zengin görsel arama ve entegre arama dizini',
    badge: 'Kapsamlı',
    iconBg: 'bg-teal-600/20 text-teal-400 border-teal-500/30',
  },
  {
    id: 'ecosia',
    name: 'Ecosia',
    desc: 'Aramalarınızla gezegen genelinde ağaç diken çevre dostu motor',
    badge: 'Çevre Dostu',
    iconBg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
  },
];

const RECOMMENDED_SHORTCUTS = [
  { id: 'sc-google', title: 'Google', url: 'https://www.google.com', color: '#4285F4' },
  { id: 'sc-youtube', title: 'YouTube', url: 'https://www.youtube.com', color: '#FF0000' },
  { id: 'sc-github', title: 'GitHub', url: 'https://github.com', color: '#24292e' },
  { id: 'sc-wikipedia', title: 'Wikipedia', url: 'https://en.wikipedia.org', color: '#636466' },
  { id: 'sc-reddit', title: 'Reddit', url: 'https://www.reddit.com', color: '#FF4500' },
  { id: 'sc-chatgpt', title: 'ChatGPT', url: 'https://chatgpt.com', color: '#10A37F' },
  { id: 'sc-twitter', title: 'X (Twitter)', url: 'https://x.com', color: '#1DA1F2' },
];

export const WelcomeSetupPage: React.FC<WelcomeSetupPageProps> = ({
  settings,
  account,
  shortcuts = [],
  onUpdateSettings,
  onUpdateAccount = (_newAccount: Partial<LnxUserAccount>) => {},
  onNavigate,
  onAddShortcut = (_title: string, _url: string, _color: string) => {},
  onSetShortcuts,
  onOpenWelcomeModal,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>(['sc-google', 'sc-youtube', 'sc-github']);

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Styling helper classes
  const cardBase = isDark
    ? 'bg-neutral-900/60 border-neutral-800'
    : 'bg-white border-neutral-200/90 shadow-sm';
  const cardHover = isDark
    ? 'hover:border-neutral-700 hover:bg-neutral-900/80'
    : 'hover:border-neutral-300 hover:bg-neutral-50/90';
  const textTitle = isDark ? 'text-white' : 'text-neutral-900';
  const textSubtitle = isDark ? 'text-neutral-400' : 'text-neutral-600';
  const textMuted = isDark ? 'text-neutral-500' : 'text-neutral-400';
  const inputStyle = isDark
    ? 'bg-neutral-800/80 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-indigo-500'
    : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-600 focus:bg-white';

  // Local account state during setup
  const [accountName, setAccountName] = useState<string>(account?.name || 'Tunar Lyx');
  const [accountEmail, setAccountEmail] = useState<string>(account?.email || 'tunarlyx57@gmail.com');
  const [accountPassword, setAccountPassword] = useState<string>('••••••••••••');
  const [avatarColor, setAvatarColor] = useState<string>(account?.avatarColor || settings.accentColor || '#3b82f6');
  const [isGuestMode, setIsGuestMode] = useState<boolean>(account?.isGuest || false);
  const [syncBookmarks, setSyncBookmarks] = useState<boolean>(account?.syncBookmarks ?? true);
  const [syncPasswords, setSyncPasswords] = useState<boolean>(account?.syncPasswords ?? true);
  const [syncHistory, setSyncHistory] = useState<boolean>(account?.syncHistory ?? true);
  const [syncSettings, setSyncSettings] = useState<boolean>(account?.syncSettings ?? true);
  const [aiCloudEnabled, setAiCloudEnabled] = useState<boolean>(account?.aiCloudEnabled ?? true);
  const [accountSavedNotification, setAccountSavedNotification] = useState<boolean>(false);

  const steps = [
    { title: 'Karşılama', desc: 'LNX Tanıtımı' },
    { title: 'LNX Hesabı', desc: 'Profil & Senkronizasyon' },
    { title: 'Görünüm', desc: 'Tema ve Renkler' },
    { title: 'Arama Motoru', desc: 'Varsayılan Motor' },
    { title: 'Gizlilik', desc: 'LNX Shields Kalkanı' },
    { title: 'Kısayollar', desc: 'Hızlı Başlangıç' },
    { title: 'Tamamlandı', desc: 'Gezinmeye Başla' },
  ];

  // Synchronize account state with parent in real-time
  const emitAccountUpdate = (overrides?: Partial<LnxUserAccount>) => {
    onUpdateAccount({
      name: (overrides?.isGuest ?? isGuestMode) ? 'Misafir Kullanıcı' : (overrides?.name ?? accountName).trim() || 'LNX Kullanıcısı',
      email: (overrides?.isGuest ?? isGuestMode) ? 'misafir@lnx.local' : (overrides?.email ?? accountEmail).trim() || 'kullanici@lnx.browser',
      isLoggedIn: !(overrides?.isGuest ?? isGuestMode),
      isGuest: overrides?.isGuest ?? isGuestMode,
      avatarColor: overrides?.avatarColor ?? avatarColor,
      syncBookmarks: overrides?.syncBookmarks ?? syncBookmarks,
      syncPasswords: overrides?.syncPasswords ?? syncPasswords,
      syncHistory: overrides?.syncHistory ?? syncHistory,
      syncSettings: overrides?.syncSettings ?? syncSettings,
      syncExtensions: true,
      aiCloudEnabled: overrides?.aiCloudEnabled ?? aiCloudEnabled,
      lastSyncedAt: Date.now(),
      ...overrides,
    });
  };

  const handleSaveAccountState = () => {
    emitAccountUpdate();
    setAccountSavedNotification(true);
    setTimeout(() => setAccountSavedNotification(false), 2000);
  };

  const handleFinishSetup = () => {
    try {
      localStorage.setItem('lnx_setup_completed', 'true');
    } catch {}

    // Save account state
    handleSaveAccountState();

    // Map selected shortcuts to list of chosen shortcuts only
    const chosenShortcuts: QuickShortcut[] = selectedShortcuts
      .map((id) => RECOMMENDED_SHORTCUTS.find((s) => s.id === id))
      .filter((s): s is (typeof RECOMMENDED_SHORTCUTS)[0] => Boolean(s))
      .map((s) => ({
        id: s.id,
        title: s.title,
        url: s.url,
        color: s.color,
      }));

    if (onSetShortcuts) {
      onSetShortcuts(chosenShortcuts);
    } else {
      chosenShortcuts.forEach((s) => {
        onAddShortcut(s.title, s.url, s.color);
      });
    }

    onNavigate('lnx://newtab');
    if (onOpenWelcomeModal) {
      setTimeout(() => {
        onOpenWelcomeModal();
      }, 300);
    }
  };

  const toggleShortcutSelection = (id: string) => {
    setSelectedShortcuts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div
      id="lnx-welcome-setup-page"
      className={`min-h-full w-full flex flex-col justify-between select-none relative overflow-y-auto transition-colors duration-200 ${
        isDark ? 'bg-[#0A0A0A] text-[#EDEDED]' : 'bg-[#F8F9FA] text-neutral-900'
      }`}
      style={{
        backgroundImage: isDark
          ? `radial-gradient(circle at 50% -10%, ${settings.accentColor}25, transparent 55%), radial-gradient(circle at 100% 100%, #1A1A1A, transparent 50%)`
          : `radial-gradient(circle at 50% -10%, ${settings.accentColor}18, transparent 55%), radial-gradient(circle at 100% 100%, #E2E8F0, transparent 50%)`,
      }}
    >
      {/* Top Header Bar */}
      <header
        className={`px-6 md:px-8 py-4 flex items-center justify-between border-b backdrop-blur-md sticky top-0 z-20 transition-colors ${
          isDark
            ? 'border-[#1E1E1E]/80 bg-[#0A0A0A]/85 text-[#EDEDED]'
            : 'border-neutral-200/80 bg-white/90 text-neutral-900 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="shrink-0 transition-transform hover:scale-105">
            <LnxLogo size={38} showSubtitle={false} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-bold text-base tracking-tight ${textTitle}`}>LNX Browser</h1>
              <span
                className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                }`}
              >
                v1.4 Kurulum
              </span>
            </div>
            <p className={`text-[11px] ${textSubtitle}`}>Yeni Nesil Hızlı ve Güvenli Tarayıcı Kurulum Sihirbazı</p>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="hidden lg:flex items-center gap-1.5">
          {steps.map((step, idx) => {
            const isActive = currentStep === idx;
            const isDone = currentStep > idx;

            return (
              <button
                key={idx}
                onClick={() => {
                  if (currentStep === 1) handleSaveAccountState();
                  setCurrentStep(idx);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-neutral-800 text-white font-medium shadow-xs'
                      : 'bg-neutral-100 text-neutral-900 font-semibold shadow-xs'
                    : isDone
                    ? isDark
                      ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    : isDark
                    ? 'text-neutral-600 hover:text-neutral-400'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
                style={isActive ? { borderColor: settings.accentColor, borderWidth: '1px' } : undefined}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? isDark
                        ? 'bg-white text-black'
                        : 'bg-neutral-900 text-white'
                      : isDark
                      ? 'bg-neutral-800 text-neutral-500'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                </div>
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Skip / Finish Button */}
        <button
          onClick={handleFinishSetup}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
            isDark
              ? 'text-neutral-400 hover:text-white hover:bg-neutral-900 border-transparent hover:border-neutral-800'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-transparent hover:border-neutral-200'
          }`}
        >
          <span>Kurulumu Atla</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        {/* STEP 0: Welcome Screen */}
        {currentStep === 0 && (
          <div className="text-center space-y-8 animate-fadeIn">
            <div className="relative inline-block">
              <div
                className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-300"
                style={{
                  backgroundColor: settings.accentColor,
                  boxShadow: `0 0 50px ${settings.accentColor}50`,
                }}
              >
                <Rocket className="w-12 h-12 text-white" />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 p-2 rounded-xl border text-emerald-500 shadow-md ${
                  isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${textTitle}`}>
                LNX Browser'a Hoş Geldiniz
              </h2>
              <p className={`${textSubtitle} text-sm md:text-base max-w-xl mx-auto leading-relaxed`}>
                Yüksek hızlı Chromium motoru, güvenli bulut senkronizasyonlu <strong>LNX Hesabı</strong> ve gelişmiş LNX Shields kalkanları ile interneti özgürce keşfedin.
              </p>
            </div>

            {/* Core Features Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-2">
              <div className={`p-4 rounded-2xl border transition-colors backdrop-blur-xs ${cardBase} ${cardHover}`}>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 w-fit mb-3">
                  <User className="w-5 h-5" />
                </div>
                <h3 className={`text-sm font-semibold mb-1 ${textTitle}`}>LNX Bulut Hesabı</h3>
                <p className={`text-xs leading-relaxed ${textSubtitle}`}>
                  Şifrelerinizi, yer imlerinizi ve geçmişinizi şifreli bulutta güvenle eşitleyin.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border transition-colors backdrop-blur-xs ${cardBase} ${cardHover}`}>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className={`text-sm font-semibold mb-1 ${textTitle}`}>LNX Shields Gizlilik</h3>
                <p className={`text-xs leading-relaxed ${textSubtitle}`}>
                  İzleyicileri, can sıkıcı reklamları ve çerez pencerelerini otomatik engeller.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border transition-colors backdrop-blur-xs ${cardBase} ${cardHover}`}>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 w-fit mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className={`text-sm font-semibold mb-1 ${textTitle}`}>Chromium Hızı</h3>
                <p className={`text-xs leading-relaxed ${textSubtitle}`}>
                  Donanım hızlandırma ve bellek tasarrufu ile ultra hızlı sayfa yükleme.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-white shadow-xl transition-all hover:opacity-90 flex items-center justify-center gap-2 group cursor-pointer"
                style={{ backgroundColor: settings.accentColor }}
              >
                <span>Hemen Başla (Hesap & Ayarlar)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={handleFinishSetup}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium border transition-colors text-sm cursor-pointer ${
                  isDark
                    ? 'text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border-neutral-800'
                    : 'text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-100 border-neutral-200 shadow-xs'
                }`}
              >
                Varsayılan Ayarlarla Başla
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: LNX Account (Hesap Oluşturma / Giriş / Misafir Modu) */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">
                <User className="w-4 h-4" />
                <span>Adım 1 / 6 • LNX Hesabı & Senkronizasyon</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold ${textTitle}`}>LNX Hesabınızı Yapılandırın</h2>
              <p className={`text-sm ${textSubtitle}`}>
                LNX Bulut Hesabı ile tüm şifrelerinizi, yer imlerinizi ve ayarlarınızı uçtan uca şifrelemeyle cihazlarınız arasında senkronize edin.
              </p>
            </div>

            {/* Account Mode Switcher (LNX Account vs Guest Mode) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setIsGuestMode(false)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  !isGuestMode
                    ? isDark
                      ? 'bg-neutral-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                      : 'bg-indigo-50/80 border-indigo-500 shadow-sm ring-1 ring-indigo-500/30'
                    : isDark
                    ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-500 mt-0.5">
                  <Cloud className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm ${textTitle}`}>LNX Hesabı ile Giriş Yap</span>
                    {!isGuestMode && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${textSubtitle}`}>
                    Şifreler, yer imleri ve eklentiler bulutta otomatik yedeklenir ve eşitlenir.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setIsGuestMode(true)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isGuestMode
                    ? isDark
                      ? 'bg-neutral-800/90 border-purple-500 shadow-md ring-1 ring-purple-500/40'
                      : 'bg-purple-50/80 border-purple-500 shadow-sm ring-1 ring-purple-500/30'
                    : isDark
                    ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-500 mt-0.5">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm ${textTitle}`}>Misafir Olarak Devam Et</span>
                    {isGuestMode && <CheckCircle2 className="w-4 h-4 text-purple-500" />}
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${textSubtitle}`}>
                    Hesap oluşturmadan yalnızca bu tarayıcıda yerel profil olarak kullanın (Bulut eşitleme kapalı).
                  </p>
                </div>
              </div>
            </div>

            {!isGuestMode ? (
              <div className="space-y-4">
                <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-2xl border ${cardBase}`}>
                  {/* Account Form */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Kullanıcı Adı / Profil İsmi</span>
                      </label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAccountName(val);
                          emitAccountUpdate({ name: val });
                        }}
                        placeholder="Örn: Tunar Lyx"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputStyle}`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        <span>E-posta Adresi (LNX ID)</span>
                      </label>
                      <input
                        type="email"
                        value={accountEmail}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAccountEmail(val);
                          emitAccountUpdate({ email: val });
                        }}
                        placeholder="tunarlyx57@gmail.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputStyle}`}
                      />
                    </div>

                    {/* Avatar Color Choice */}
                    <div className="space-y-1.5 pt-1">
                      <label className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        <Palette className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Profil Avatar Rengi</span>
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        {ACCENT_COLORS.map((c) => (
                          <button
                            key={c.color}
                            type="button"
                            onClick={() => {
                              setAvatarColor(c.color);
                              emitAccountUpdate({ avatarColor: c.color });
                            }}
                            className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                              avatarColor === c.color ? 'scale-125 ring-2 ring-indigo-500 shadow' : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c.color }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        <Lock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Hesap Parolası / Kasa Şifresi</span>
                      </label>
                      <input
                        type="password"
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputStyle}`}
                      />
                    </div>
                  </div>

                  {/* Cloud Sync Switches */}
                  <div className={`md:col-span-5 space-y-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-5 flex flex-col justify-between ${
                    isDark ? 'border-neutral-800' : 'border-neutral-200'
                  }`}>
                    <div>
                      <span className={`text-xs font-semibold block mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Bulut Senkronizasyon Tercihleri
                      </span>
                      <div className="space-y-2">
                        <label className={`flex items-center justify-between text-xs cursor-pointer p-1.5 rounded-lg transition-colors ${
                          isDark ? 'text-neutral-300 hover:bg-neutral-800/50' : 'text-neutral-700 hover:bg-neutral-100'
                        }`}>
                          <span className="flex items-center gap-2">
                            <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                            <span>Yer İmleri</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={syncBookmarks}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setSyncBookmarks(val);
                              emitAccountUpdate({ syncBookmarks: val });
                            }}
                            className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                        </label>

                        <label className={`flex items-center justify-between text-xs cursor-pointer p-1.5 rounded-lg transition-colors ${
                          isDark ? 'text-neutral-300 hover:bg-neutral-800/50' : 'text-neutral-700 hover:bg-neutral-100'
                        }`}>
                          <span className="flex items-center gap-2">
                            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                            <span>Şifre Kasası</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={syncPasswords}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setSyncPasswords(val);
                              emitAccountUpdate({ syncPasswords: val });
                            }}
                            className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                        </label>

                        <label className={`flex items-center justify-between text-xs cursor-pointer p-1.5 rounded-lg transition-colors ${
                          isDark ? 'text-neutral-300 hover:bg-neutral-800/50' : 'text-neutral-700 hover:bg-neutral-100'
                        }`}>
                          <span className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Geçmiş & Sekmeler</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={syncHistory}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setSyncHistory(val);
                              emitAccountUpdate({ syncHistory: val });
                            }}
                            className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-[11px] flex items-center gap-2 ${
                      isDark
                        ? 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                    }`}>
                      <Lock className="w-4 h-4 shrink-0 text-indigo-500" />
                      <span>Sıfır Bilgili (Zero-Knowledge) AES-256 şifreleme ile verileriniz sadece sizin cihazınızda çözülür.</span>
                    </div>
                  </div>
                </div>

                {/* Live Profile Card Preview */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${cardBase}`}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full text-white font-bold text-base flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {accountName.charAt(0).toUpperCase() || 'L'}
                    </div>
                    <div>
                      <div className={`text-xs font-bold flex items-center gap-2 ${textTitle}`}>
                        <span>{accountName || 'LNX Kullanıcısı'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
                          Canlı Profil
                        </span>
                      </div>
                      <div className={`text-[11px] ${textSubtitle}`}>{accountEmail}</div>
                    </div>
                  </div>

                  <div className={`text-right text-[11px] ${textSubtitle}`}>
                    <span className="text-emerald-600 font-medium block">⚡ AES-256 Eşitleme Aktif</span>
                    <span>Yer İmleri, Şifreler, AI</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border text-center space-y-2 ${cardBase}`}>
                <UserCheck className="w-8 h-8 text-neutral-500 mx-auto" />
                <div className={`font-semibold text-sm ${textTitle}`}>Misafir Modu Seçildi</div>
                <p className={`text-xs max-w-md mx-auto ${textSubtitle}`}>
                  Verileriniz bu tarayıcıda yerel olarak saklanacak, buluta gönderilmeyecektir. Dilediğiniz zaman profil menüsünden LNX Hesabı oluşturabilirsiniz.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Appearance & Theme */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">
                <Palette className="w-4 h-4" />
                <span>Adım 2 / 6</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold ${textTitle}`}>Görünüm ve Tema Tercihiniz</h2>
              <p className={`text-sm ${textSubtitle}`}>
                LNX Browser'ın rengini ve temasını zevkinize göre özelleştirin.
              </p>
            </div>

            {/* Theme Select */}
            <div className="space-y-3">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Arayüz Teması
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'dark', label: 'Karanlık (Önerilen)', icon: Moon, desc: 'Gözü yormayan şık siyah tonlar' },
                  { id: 'light', label: 'Aydınlık', icon: Sun, desc: 'Ferah ve yüksek kontrastlı beyaz arayüz' },
                  { id: 'system', label: 'Sistem Teması', icon: Monitor, desc: 'İşletim sistemi ayarlarını takip eder' },
                ].map((t) => {
                  const isSelected = settings.theme === t.id;
                  const Icon = t.icon;

                  return (
                    <div
                      key={t.id}
                      onClick={() => onUpdateSettings({ theme: t.id as BrowserTheme })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? isDark
                            ? 'bg-neutral-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                            : 'bg-indigo-50/90 border-indigo-600 shadow-sm ring-1 ring-indigo-600/40'
                          : isDark
                          ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl ${isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                      </div>
                      <div>
                        <div className={`font-medium text-sm ${textTitle}`}>{t.label}</div>
                        <div className={`text-xs mt-0.5 ${textSubtitle}`}>{t.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Select */}
            <div className="space-y-3">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Vurgu Rengi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {ACCENT_COLORS.map((c) => {
                  const isSelected = settings.accentColor.toLowerCase() === c.color.toLowerCase();

                  return (
                    <button
                      key={c.color}
                      onClick={() => onUpdateSettings({ accentColor: c.color })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all text-center cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-neutral-800 border-white/40 ring-2 ring-white/20'
                            : 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/30'
                          : isDark
                          ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full shadow-md flex items-center justify-center text-white"
                        style={{ backgroundColor: c.color }}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <span className={`text-[11px] font-medium truncate w-full ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => onUpdateSettings({ showBookmarksBar: !settings.showBookmarksBar })}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${cardBase} ${cardHover}`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className={`text-xs font-medium ${textTitle}`}>Yer İmleri Çubuğu</div>
                    <div className={`text-[11px] ${textMuted}`}>Adres çubuğunun altında göster</div>
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    settings.showBookmarksBar ? 'bg-indigo-600' : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.showBookmarksBar ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              <div
                onClick={() => onUpdateSettings({ showHomeButton: !settings.showHomeButton })}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${cardBase} ${cardHover}`}
              >
                <div className="flex items-center gap-3">
                  <Layout className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className={`text-xs font-medium ${textTitle}`}>Ana Sayfa Butonu</div>
                    <div className={`text-[11px] ${textMuted}`}>Gezinme çubuğunda ana sayfa butonu</div>
                  </div>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    settings.showHomeButton ? 'bg-indigo-600' : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.showHomeButton ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Search Engine */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-500">
                <Search className="w-4 h-4" />
                <span>Adım 3 / 6</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold ${textTitle}`}>Varsayılan Arama Motorunuz</h2>
              <p className={`text-sm ${textSubtitle}`}>
                Adres çubuğuna (Omnibox) yazdığınız sorguların yönlendirileceği varsayılan motoru seçin.
              </p>
            </div>

            <div className="space-y-3">
              {SEARCH_ENGINES.map((engine) => {
                const isSelected = settings.searchEngine === engine.id;

                return (
                  <div
                    key={engine.id}
                    onClick={() => onUpdateSettings({ searchEngine: engine.id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? isDark
                          ? 'bg-neutral-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                          : 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500/40'
                        : isDark
                        ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/90'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl border ${engine.iconBg}`}>
                        <Search className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${textTitle}`}>{engine.name}</span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                              isDark
                                ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                                : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                            }`}
                          >
                            {engine.badge}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${textSubtitle}`}>{engine.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-600 text-white'
                          : isDark
                          ? 'border-neutral-700 bg-neutral-800 text-transparent'
                          : 'border-neutral-300 bg-neutral-100 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Privacy & Shields */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-500">
                <ShieldCheck className="w-4 h-4" />
                <span>Adım 4 / 6</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold ${textTitle}`}>Güvenlik ve LNX Shields Kalkanı</h2>
              <p className={`text-sm ${textSubtitle}`}>
                Web'de gezinirken izleyicileri, üçüncü taraf çerezlerini ve zararlı içerikleri engelleyin.
              </p>
            </div>

            <div className="space-y-3">
              {/* Shields Toggle */}
              <div
                onClick={() => onUpdateSettings({ shieldsEnabled: !settings.shieldsEnabled })}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${cardBase} ${cardHover}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${textTitle}`}>LNX Shields Kalkanlarını Etkinleştir</div>
                    <div className={`text-xs mt-0.5 ${textSubtitle}`}>
                      Reklamları, izleme komutlarını ve parmak izi alma tekniklerini engeller
                    </div>
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                    settings.shieldsEnabled ? 'bg-emerald-600' : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.shieldsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* HTTPS Only Toggle */}
              <div
                onClick={() => onUpdateSettings({ httpsOnly: !settings.httpsOnly })}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${cardBase} ${cardHover}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${textTitle}`}>Her Zaman Güvenli Bağlantı (HTTPS-Only)</div>
                    <div className={`text-xs mt-0.5 ${textSubtitle}`}>
                      Tüm bağlantıları şifreli ve güvenli HTTPS protokolüne otomatik yükseltir
                    </div>
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                    settings.httpsOnly ? 'bg-indigo-600' : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.httpsOnly ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Memory Saver Toggle */}
              <div
                onClick={() => onUpdateSettings({ memorySaver: !settings.memorySaver })}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${cardBase} ${cardHover}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${textTitle}`}>Bellek Tasarrufu (Memory Saver)</div>
                    <div className={`text-xs mt-0.5 ${textSubtitle}`}>
                      Arka planda kullanılmayan sekmeleri askıya alarak RAM kullanımını %40 azaltır
                    </div>
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                    settings.memorySaver ? 'bg-purple-600' : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.memorySaver ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Initial Shortcuts */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500">
                <Bookmark className="w-4 h-4" />
                <span>Adım 5 / 6</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold ${textTitle}`}>Başlangıç Kısayollarınızı Seçin</h2>
              <p className={`text-sm ${textSubtitle}`}>
                Yeni Sekme sayfanızda hızlıca erişmek istediğiniz favori web sitelerini seçin.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {RECOMMENDED_SHORTCUTS.map((sc) => {
                const isSelected = selectedShortcuts.includes(sc.id);

                return (
                  <div
                    key={sc.id}
                    onClick={() => toggleShortcutSelection(sc.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                      isSelected
                        ? isDark
                          ? 'bg-neutral-800 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
                          : 'bg-indigo-50/80 border-indigo-500 ring-1 ring-indigo-500/40 shadow-sm'
                        : isDark
                        ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/90'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-xs'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md relative"
                      style={{ backgroundColor: sc.color }}
                    >
                      {sc.title.charAt(0)}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="w-full">
                      <div className={`text-xs font-semibold truncate ${textTitle}`}>{sc.title}</div>
                      <div className={`text-[10px] truncate ${textMuted}`}>{sc.url.replace('https://', '')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Ready / Completion */}
        {currentStep === 6 && (
          <div className="text-center space-y-6 animate-fadeIn max-w-2xl mx-auto">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className={`text-2xl md:text-3xl font-bold ${textTitle}`}>Kurulum Başarıyla Tamamlandı!</h2>
              <p className={`text-xs md:text-sm max-w-md mx-auto ${textSubtitle}`}>
                LNX Browser ve LNX Hesabınız tercihlerinize göre hazırlandı. Seçtiğiniz ayarlar aşağıda özetlenmiştir:
              </p>
            </div>

            {/* Detailed Grid Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Account Card */}
              <div className={`p-4 rounded-2xl border space-y-2 relative group ${cardBase}`}>
                <div className={`flex items-center justify-between text-xs ${textSubtitle}`}>
                  <span className={`font-semibold uppercase tracking-wider text-[10px] ${textMuted}`}>LNX Hesabı</span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-indigo-500 hover:underline text-[11px] font-medium cursor-pointer"
                  >
                    Düzenle
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full text-white font-bold text-sm flex items-center justify-center shadow"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {isGuestMode ? 'M' : (accountName.charAt(0).toUpperCase() || 'L')}
                  </div>
                  <div className="overflow-hidden">
                    <div className={`text-xs font-semibold truncate ${textTitle}`}>
                      {isGuestMode ? 'Misafir Modu' : accountName}
                    </div>
                    <div className={`text-[11px] truncate ${textSubtitle}`}>
                      {isGuestMode ? 'Yerel Profil' : accountEmail}
                    </div>
                  </div>
                </div>
                <div className={`text-[11px] text-emerald-500 font-medium pt-1 border-t flex items-center gap-1 ${
                  isDark ? 'border-neutral-800/60' : 'border-neutral-200'
                }`}>
                  <span>⚡</span>
                  <span>{isGuestMode ? 'Yalnızca Bu Cihazda' : 'AES-256 Bulut Senkronizasyonu'}</span>
                </div>
              </div>

              {/* Appearance Card */}
              <div className={`p-4 rounded-2xl border space-y-2 relative group ${cardBase}`}>
                <div className={`flex items-center justify-between text-xs ${textSubtitle}`}>
                  <span className={`font-semibold uppercase tracking-wider text-[10px] ${textMuted}`}>Görünüm & Tema</span>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-indigo-500 hover:underline text-[11px] font-medium cursor-pointer"
                  >
                    Düzenle
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-semibold capitalize ${textTitle}`}>{settings.theme} Tema</div>
                    <div className={`text-[11px] ${textSubtitle}`}>
                      {settings.showBookmarksBar ? 'Yer İmleri Çubuğu Açık' : 'Kompakt Başlık'}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-100 border-neutral-200'
                  }`}>
                    <div
                      className="w-3.5 h-3.5 rounded-full shadow"
                      style={{ backgroundColor: settings.accentColor }}
                    />
                    <span className={`text-[11px] font-medium ${textTitle}`}>Vurgu</span>
                  </div>
                </div>
                <div className={`text-[11px] pt-1 border-t ${textSubtitle} ${
                  isDark ? 'border-neutral-800/60' : 'border-neutral-200'
                }`}>
                  {settings.showHomeButton ? 'Ana Sayfa Butonu Etkin' : 'Standart Navigasyon'}
                </div>
              </div>

              {/* Search Engine Card */}
              <div className={`p-4 rounded-2xl border space-y-2 relative group ${cardBase}`}>
                <div className={`flex items-center justify-between text-xs ${textSubtitle}`}>
                  <span className={`font-semibold uppercase tracking-wider text-[10px] ${textMuted}`}>Varsayılan Arama</span>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-indigo-500 hover:underline text-[11px] font-medium cursor-pointer"
                  >
                    Düzenle
                  </button>
                </div>
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-blue-500" />
                  <span className={`text-xs font-semibold ${textTitle}`}>
                    {SEARCH_ENGINES.find((e) => e.id === settings.searchEngine)?.name || 'Google'}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      isDark ? 'bg-neutral-800 text-neutral-300 border-neutral-700' : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {SEARCH_ENGINES.find((e) => e.id === settings.searchEngine)?.badge || 'Varsayılan'}
                  </span>
                </div>
                <div className={`text-[11px] pt-1 border-t ${textSubtitle} ${
                  isDark ? 'border-neutral-800/60' : 'border-neutral-200'
                }`}>
                  Adres çubuğu aramalarında doğrudan kullanılır
                </div>
              </div>

              {/* Shields & Privacy Card */}
              <div className={`p-4 rounded-2xl border space-y-2 relative group ${cardBase}`}>
                <div className={`flex items-center justify-between text-xs ${textSubtitle}`}>
                  <span className={`font-semibold uppercase tracking-wider text-[10px] ${textMuted}`}>Güvenlik & Kalkanlar</span>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="text-indigo-500 hover:underline text-[11px] font-medium cursor-pointer"
                  >
                    Düzenle
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className={`text-xs font-semibold ${textTitle}`}>
                      {settings.shieldsEnabled ? 'LNX Shields Aktif' : 'Shields Kapalı'}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600">
                    {settings.httpsOnly ? 'HTTPS-Only' : 'Standart'}
                  </span>
                </div>
                <div className={`text-[11px] pt-1 border-t ${textSubtitle} ${
                  isDark ? 'border-neutral-800/60' : 'border-neutral-200'
                }`}>
                  {settings.memorySaver ? 'Bellek Tasarrufu devrede (%40 RAM tasarrufu)' : 'Maksimum Performans Modu'}
                </div>
              </div>
            </div>

            {/* Selected Shortcuts Badges */}
            <div className={`p-3.5 rounded-2xl border text-left space-y-2 ${cardBase}`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Yeni Sekmeye Eklenecek Başlangıç Kısayolları ({selectedShortcuts.length})</span>
                </span>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="text-indigo-500 hover:underline text-[11px] font-medium cursor-pointer"
                >
                  Kısayolları Düzenle
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedShortcuts.map((id) => {
                  const sc = RECOMMENDED_SHORTCUTS.find((s) => s.id === id);
                  if (!sc) return null;
                  return (
                    <span
                      key={id}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${
                        isDark
                          ? 'bg-neutral-800/90 border-neutral-700 text-white'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sc.color }} />
                      <span>{sc.title}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleFinishSetup}
                className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-medium text-white shadow-xl transition-all hover:opacity-90 flex items-center justify-center gap-2 mx-auto cursor-pointer text-sm"
                style={{ backgroundColor: settings.accentColor }}
              >
                <span>Gezinmeye Başla (Yeni Sekmeyi Aç)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Control Bar */}
      {currentStep > 0 && currentStep < 6 && (
        <footer
          className={`px-6 md:px-8 py-4 border-t backdrop-blur-md sticky bottom-0 z-20 flex items-center justify-between transition-colors ${
            isDark
              ? 'border-[#1E1E1E]/80 bg-[#0A0A0A]/85 text-[#EDEDED]'
              : 'border-neutral-200/80 bg-white/90 text-neutral-900 shadow-xs'
          }`}
        >
          <button
            onClick={() => {
              if (currentStep === 1) handleSaveAccountState();
              setCurrentStep((prev) => Math.max(0, prev - 1));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                : 'text-neutral-700 hover:text-neutral-900 bg-white border-neutral-300 hover:bg-neutral-100 shadow-xs'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Geri</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-xs ${textMuted}`}>
              {currentStep} / {steps.length - 1}
            </span>
          </div>

          <button
            onClick={() => {
              if (currentStep === 1) handleSaveAccountState();
              setCurrentStep((prev) => Math.min(6, prev + 1));
            }}
            className="px-6 py-2 rounded-xl text-xs font-medium text-white shadow-md transition-all hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: settings.accentColor }}
          >
            <span>İleri</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </footer>
      )}
    </div>
  );
};
