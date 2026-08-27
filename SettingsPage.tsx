import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Search,
  Shield,
  KeyRound,
  Download,
  Cpu,
  Info,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  RefreshCw,
  Sliders,
  Sparkles,
  User,
  Cloud,
  Lock,
  Mail,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Folder,
  Zap,
  Bug,
  ArrowUpCircle,
  History,
  Server,
  Radio,
  Send,
} from 'lucide-react';
import { AdBlockLevel, BookmarkFolder, BookmarkItem, BrowserSettings, LnxUserAccount, SavedPassword, SearchEngineType } from '../../types';
import { LnxLogo } from '../Common/LnxLogo';

interface SettingsPageProps {
  settings: BrowserSettings;
  account?: LnxUserAccount;
  passwords?: SavedPassword[];
  bookmarks?: BookmarkItem[];
  bookmarkFolders?: BookmarkFolder[];
  onUpdateSettings: (newSettings: Partial<BrowserSettings>) => void;
  onUpdateAccount?: (newAccount: Partial<LnxUserAccount>) => void;
  onAddPassword: (site: string, username: string, password: string) => void;
  onDeletePassword: (id: string) => void;
  onAddBookmark?: (title: string, url: string, folderId?: string) => void;
  onDeleteBookmark?: (id: string) => void;
  onOpenClearDataModal: () => void;
  onNavigate?: (url: string) => void;
}

type SettingsSection = 'account' | 'appearance' | 'search' | 'privacy' | 'passwords' | 'downloads' | 'performance' | 'about';

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  account,
  passwords = [],
  bookmarks = [],
  bookmarkFolders = [],
  onUpdateSettings,
  onUpdateAccount = (_newAccount: Partial<LnxUserAccount>) => {},
  onAddPassword,
  onDeletePassword,
  onAddBookmark = (_title: string, _url: string, _folderId?: string) => {},
  onDeleteBookmark = (_id: string) => {},
  onOpenClearDataModal,
  onNavigate = (_url: string) => {},
}) => {
  const isDark = settings?.theme !== 'light';
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [accName, setAccName] = useState(account?.name || 'LNX Kullanıcısı');
  const [accEmail, setAccEmail] = useState(account?.email || 'tunarlyx57@gmail.com');
  const [accSaved, setAccSaved] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateFeedback(null);
    try {
      const res = await fetch('/api/updates/status');
      const data = await res.json();
      if (data.hasUpdate && data.latestUpdate) {
        setUpdateFeedback(`Yeni güncelleme mevcut: v${data.latestUpdate.version}! Bildirim ekrana yansıtıldı.`);
        window.dispatchEvent(new CustomEvent('lnx-show-update-notification', { detail: { update: data.latestUpdate } }));
      } else {
        setUpdateFeedback('LNX Browser günceldir (v152.0.7977.65). En son kararlılık ve güvenlik yamaları devrede.');
      }
    } catch {
      setUpdateFeedback('LNX Browser günceldir (v152.0.7977.65).');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  // New Bookmark on Bar Form State
  const [newBmTitle, setNewBmTitle] = useState('');
  const [newBmUrl, setNewBmUrl] = useState('');
  const [newBmFolder, setNewBmFolder] = useState('bar');
  const [bmAddedFeedback, setBmAddedFeedback] = useState(false);

  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
  const safeFolders = Array.isArray(bookmarkFolders) ? bookmarkFolders : [];

  const handleAddNewBarBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBmTitle.trim() || !newBmUrl.trim()) return;
    let url = newBmUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('lnx://')) {
      url = 'https://' + url;
    }
    onAddBookmark(newBmTitle.trim(), url, newBmFolder);
    setNewBmTitle('');
    setNewUrl('');
    setBmAddedFeedback(true);
    setTimeout(() => setBmAddedFeedback(false), 3000);
  };

  const setNewUrl = (val: string) => setNewBmUrl(val);

  const safePasswords = Array.isArray(passwords) ? passwords : [];

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.trim() || !newUser.trim() || !newPass.trim()) return;
    onAddPassword(newSite.trim(), newUser.trim(), newPass.trim());
    setNewSite('');
    setNewUser('');
    setNewPass('');
    setShowAddPasswordModal(false);
  };

  const navItems = [
    { id: 'account', label: 'LNX Hesabı & Profil', icon: User },
    { id: 'appearance', label: 'Görünüm', icon: Palette },
    { id: 'search', label: 'Arama Motoru', icon: Search },
    { id: 'privacy', label: 'Gizlilik ve Güvenlik', icon: Shield },
    { id: 'passwords', label: 'Şifreler ve Otomatik Doldurma', icon: KeyRound },
    { id: 'downloads', label: 'İndirilenler', icon: Download },
    { id: 'performance', label: 'Performans ve Sistem', icon: Cpu },
    { id: 'about', label: 'LNX Browser Hakkında', icon: Info },
  ];

  return (
    <div
      id="lnx-settings-page"
      className={`min-h-full flex text-xs transition-colors duration-200 ${
        isDark ? 'bg-neutral-950 text-neutral-200' : 'bg-[#F8FAFC] text-neutral-800'
      }`}
    >
      {/* Settings Left Navigation Sidebar */}
      <div
        className={`w-64 border-r p-4 flex flex-col gap-1 select-none transition-colors duration-200 ${
          isDark ? 'border-neutral-800 bg-neutral-950' : 'border-slate-200 bg-white shadow-xs'
        }`}
      >
        <div className={`flex items-center gap-2.5 px-3 py-2 mb-3 font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <LnxLogo size="sm" showSubtitle={false} />
          <span>LNX Ayarlar</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as SettingsSection)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors font-medium text-xs ${
                isActive
                  ? isDark
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Content Pane */}
      <div className="flex-1 p-8 max-w-4xl overflow-y-auto">
        {/* LNX Account Section */}
        {activeSection === 'account' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>LNX Hesabı & Bulut Senkronizasyonu</h2>

            {/* Profile Overview Card */}
            <div
              className={`p-5 rounded-2xl border space-y-4 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-md"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    {(accName || 'L').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{accName || 'LNX Kullanıcısı'}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        {account?.isGuest ? 'Misafir Modu' : 'Bulut Senkronizasyonu Aktif'}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{accEmail || 'kullanici@lnx.browser'}</p>
                    <div className={`text-[11px] mt-1 flex items-center gap-1.5 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                      <Cloud className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Son Senkronizasyon: Bugün, {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('lnx://welcome')}
                  className={`px-3.5 py-2 rounded-xl border font-medium text-xs transition-colors flex items-center gap-1.5 ${
                    isDark
                      ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-500/30'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kurulum Sihirbazı</span>
                </button>
              </div>

              {/* Edit Account Inputs */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div className="space-y-1">
                  <label className={`text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Görünen İsim</label>
                  <input
                    type="text"
                    value={accName}
                    onChange={(e) => setAccName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-neutral-800/80 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>LNX ID E-Posta</label>
                  <input
                    type="email"
                    value={accEmail}
                    onChange={(e) => setAccEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-neutral-800/80 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-emerald-500 flex items-center gap-1.5">
                  {accSaved && (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Hesap bilgileri başarıyla güncellendi.</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateAccount({
                      name: accName.trim() || 'LNX Kullanıcısı',
                      email: accEmail.trim() || 'tunarlyx57@gmail.com',
                      isLoggedIn: true,
                      isGuest: false,
                    });
                    setAccSaved(true);
                    setTimeout(() => setAccSaved(false), 3000);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-xs"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>

            {/* Sync Switches */}
            <div
              className={`p-5 rounded-2xl border space-y-3 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Eşitleme & Senkronize Edilen Veriler</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { icon: KeyRound, title: 'Şifreler ve Otomatik Doldurma', desc: 'Kasa şifreli bulutta korunur', color: 'text-amber-500' },
                  { icon: Palette, title: 'Temalar ve Ayarlar', desc: 'Tüm cihazlarda aynı görünüm', color: 'text-purple-500' },
                  { icon: Bookmark, title: 'Yer İmleri & Sekmeler', desc: 'Cihazlar arası anlık eşitleme', color: 'text-blue-500' },
                  { icon: Shield, title: 'LNX Shields Kuralları', desc: 'Kalkan filtreleri senkronize', color: 'text-emerald-500' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                        isDark ? 'bg-neutral-800/50 border-neutral-750' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <div>
                          <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</div>
                          <div className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>{item.desc}</div>
                        </div>
                      </div>
                      <span className="text-emerald-500 font-semibold text-[11px]">Açık</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Görünüm & Tema</h2>

            <div
              className={`p-5 rounded-2xl border space-y-4 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Tarayıcı Teması</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Karanlık veya aydınlık mod seçin</div>
                </div>
                <div className={`flex gap-1.5 p-1 rounded-xl border ${isDark ? 'bg-neutral-900 border-neutral-750' : 'bg-slate-100 border-slate-200'}`}>
                  {(['dark', 'light', 'system'] as const).map((thm) => (
                    <button
                      key={thm}
                      onClick={() => onUpdateSettings({ theme: thm })}
                      className={`px-3 py-1.5 rounded-lg font-medium capitalize text-xs transition-colors ${
                        settings.theme === thm
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isDark
                          ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                    >
                      {thm === 'dark' ? 'Karanlık' : thm === 'light' ? 'Aydınlık' : 'Sistem'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duvar Kağıdı / Yeni Sekme Arka Planı */}
              <div className={`border-t pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Yeni Sekme Duvar Kağıdı</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Seçilen moda (Karanlık/Aydınlık) göre uyum sağlayan temalar</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'nature', name: 'Zümrüt Yeşili', darkColor: '#059669', lightColor: '#10b981' },
                    { id: 'lnx_banner', name: 'LNX Klasik (Banner)', darkColor: '#20242c', lightColor: '#E8E3D7' },
                    { id: 'lnx_official', name: 'LNX Resmi', darkColor: '#1d2533', lightColor: '#dbeafe' },
                    { id: 'minimal', name: 'Sade', darkColor: '#0E0E0E', lightColor: '#F8F9FA' },
                    { id: 'space', name: 'Uzay', darkColor: '#111322', lightColor: '#e0e7ff' },
                    { id: 'sunset', name: 'Alacakaranlık & Şafak', darkColor: '#18111A', lightColor: '#ffe4e6' },
                  ].map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => onUpdateSettings({ wallpaper: wp.id })}
                      className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border transition-all ${
                        (settings.wallpaper || 'nature') === wp.id
                          ? 'bg-emerald-600/15 border-emerald-500 text-emerald-400 font-semibold ring-1 ring-emerald-500/50'
                          : isDark
                          ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-750 text-neutral-300'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: isDark ? wp.darkColor : wp.lightColor }}
                      />
                      <span>{wp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`border-t pt-4 flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Vurgu Rengi (Accent)</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Aktif sekme ve düğme vurgu tonu</div>
                </div>
                <div className="flex items-center gap-2">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'].map((col) => (
                    <button
                      key={col}
                      onClick={() => onUpdateSettings({ accentColor: col })}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        settings.accentColor === col ? 'scale-125 ring-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className={`border-t pt-4 flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Yer İşaretleri Çubuğunu Göster</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Adres çubuğunun altında sabit yer işaretleri</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showBookmarksBar}
                  onChange={(e) => onUpdateSettings({ showBookmarksBar: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </div>

              <div className={`border-t pt-4 flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Ana Sayfa Düğmesini Göster</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Gezinme çubuğuna Home simgesi ekler</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showHomeButton}
                  onChange={(e) => onUpdateSettings({ showHomeButton: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </div>
            </div>

            {/* Bookmarks Bar Customization & Direct Item Manager */}
            <div
              className={`p-5 rounded-2xl border space-y-4 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Yer İşaretleri Çubuğu Yönetimi</h3>
                    <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                      Üst çubukta görünmesini istediğiniz özel web sitelerini ve linkleri ekleyin veya kaldırın.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('lnx://bookmarks')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Gelişmiş Yönetici</span>
                </button>
              </div>

              {/* Add New Item Form */}
              <form
                onSubmit={handleAddNewBarBookmark}
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-neutral-800/40 border-neutral-750' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`font-medium text-xs flex items-center gap-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-800'}`}>
                  <Plus className="w-4 h-4 text-amber-500" />
                  <span>Çubuğa Yeni Web Sitesi / Bağlantı Ekle</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="Başlık (örn: YouTube, GitHub)"
                      value={newBmTitle}
                      onChange={(e) => setNewBmTitle(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-amber-500 ${
                        isDark
                          ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      required
                      placeholder="URL (örn: https://youtube.com)"
                      value={newBmUrl}
                      onChange={(e) => setNewBmUrl(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-amber-500 ${
                        isDark
                          ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-3 flex gap-2">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Çubuğa Ekle</span>
                    </button>
                  </div>
                </div>
                {bmAddedFeedback && (
                  <div className="text-[11px] text-emerald-500 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bağlantı yer işaretleri çubuğuna başarıyla eklendi!</span>
                  </div>
                )}
              </form>

              {/* Current Items on Bar */}
              <div className="space-y-2 pt-1">
                <div className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                  Çubuktaki Mevcut Öğeler ({safeBookmarks.filter((b) => b.folderId === 'bar' || !b.folderId).length})
                </div>

                {safeBookmarks.filter((b) => b.folderId === 'bar' || !b.folderId).length === 0 ? (
                  <div
                    className={`p-4 rounded-xl border text-center text-xs ${
                      isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-500' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    Yer işaretleri çubuğunda henüz kayıtlı öğe yok. Yukarıdaki formdan istediğiniz siteleri ekleyebilirsiniz.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {safeBookmarks
                      .filter((b) => b.folderId === 'bar' || !b.folderId)
                      .map((bm) => (
                        <div
                          key={bm.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                            isDark
                              ? 'bg-neutral-800/40 border-neutral-700/50 hover:bg-neutral-800/70'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {bm.url.startsWith('lnx://') ? (
                              <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                L
                              </span>
                            ) : (
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${
                                  bm.url.startsWith('http') ? new URL(bm.url).hostname : 'google.com'
                                }&sz=16`}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-4 h-4 rounded-xs flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            )}
                            <div className="min-w-0">
                              <div className={`font-medium truncate text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{bm.title}</div>
                              <div className={`text-[10px] truncate ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>{bm.url}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => onNavigate(bm.url)}
                              title="Aç"
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteBookmark(bm.id)}
                              title="Kaldır"
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-neutral-400 hover:text-red-500 transition-colors"
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
          </div>
        )}

        {/* Search Engine Settings */}
        {activeSection === 'search' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Arama Motoru</h2>

            <div
              className={`p-5 rounded-2xl border space-y-4 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Adres Çubuğunda Kullanılan Arama Motoru</div>
                <div className={`text-[11px] mb-3 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                  Omnibox'a doğrudan arama ifadesi yazıldığında kullanılacak motor
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'google', name: 'Google (Varsayılan)', url: 'https://www.google.com' },
                    { id: 'duckduckgo', name: 'DuckDuckGo (Gizlilik Odaklı)', url: 'https://duckduckgo.com' },
                    { id: 'bing', name: 'Microsoft Bing', url: 'https://www.bing.com' },
                    { id: 'ecosia', name: 'Ecosia (Ağaç Diken Arama)', url: 'https://www.ecosia.org' },
                    { id: 'brave', name: 'Brave Search (Bağımsız İndeks)', url: 'https://search.brave.com' },
                    { id: 'yahoo', name: 'Yahoo Arama', url: 'https://search.yahoo.com' },
                  ].map((engine) => (
                    <label
                      key={engine.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        settings.searchEngine === engine.id
                          ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-white'
                          : isDark
                          ? 'bg-neutral-800/40 border-neutral-700/60 hover:bg-neutral-800 text-neutral-300'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{engine.name}</div>
                        <div className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{engine.url}</div>
                      </div>
                      <input
                        type="radio"
                        name="searchEngine"
                        value={engine.id}
                        checked={settings.searchEngine === engine.id}
                        onChange={() => onUpdateSettings({ searchEngine: engine.id as SearchEngineType })}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy & Security Settings */}
        {activeSection === 'privacy' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Gizlilik ve Güvenlik</h2>

            {/* Shields Control */}
            <div
              className={`p-5 rounded-2xl border space-y-4 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>LNX Shields Kalkanı</span>
                  </div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                    Reklamları, izleyicileri ve parmak izi çıkarma scriptlerini engeller
                  </div>
                </div>
                <select
                  value={settings.adBlockLevel}
                  onChange={(e) => onUpdateSettings({ adBlockLevel: e.target.value as AdBlockLevel })}
                  className={`px-3 py-1.5 rounded-lg border outline-none text-xs ${
                    isDark ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <option value="aggressive">Agresif (Önerilen)</option>
                  <option value="standard">Standart</option>
                  <option value="off">Kapalı</option>
                </select>
              </div>

              <div className={`border-t pt-4 flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Her Zaman Güvenli Bağlantı (HTTPS-Only)</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Tüm siteleri otomatik HTTPS'e yükseltir</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.httpsOnly}
                  onChange={(e) => onUpdateSettings({ httpsOnly: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </div>

              <div className={`border-t pt-4 flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Do Not Track (Beni İzleme Talebi Gönder)</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Tüm isteklere DNT: 1 başlığı ekler</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.doNotTrack}
                  onChange={(e) => onUpdateSettings({ doNotTrack: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </div>

              <div className={`border-t pt-4 flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className="font-semibold text-red-500">Tarama Verilerini Temizle</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Geçmişi, çerezleri, önbelleği ve indirmeleri sil</div>
                </div>
                <button
                  onClick={onOpenClearDataModal}
                  className="px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/30 font-medium transition-colors"
                >
                  Verileri Temizle...
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Passwords & Autofill */}
        {activeSection === 'passwords' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Kayıtlı Şifreler</h2>
                <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>LNX Vault ile korunan yerel şifre kasanız</p>
              </div>
              <button
                onClick={() => setShowAddPasswordModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Şifre Ekle</span>
              </button>
            </div>

            <div
              className={`p-5 rounded-2xl border shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-2">
                {safePasswords.length === 0 ? (
                  <p className={`text-center py-4 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>Kayıtlı şifre bulunmuyor.</p>
                ) : (
                  safePasswords.map((pw) => (
                    <div
                      key={pw.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        isDark ? 'bg-neutral-800/40 border-neutral-700/40' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{pw.site}</div>
                        <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{pw.username}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`font-mono ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                          {visiblePasswords[pw.id] ? pw.password : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(pw.id)}
                          className={`p-1 ${isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
                        >
                          {visiblePasswords[pw.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onDeletePassword(pw.id)}
                          className="p-1 text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Downloads Settings */}
        {activeSection === 'downloads' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>İndirilenler</h2>

            <div
              className={`p-5 rounded-2xl border space-y-4 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Varsayılan İndirme Klasörü</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{settings.defaultDownloadDir}</div>
                </div>
                <button
                  className={`px-3 py-1.5 rounded-lg border font-medium text-xs ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  Değiştir
                </button>
              </div>

              <div className={`border-t pt-4 flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Her Dosyayı İndirmeden Önce Nereye Kaydedileceğini Sor</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>İndirme konumu onay penceresi</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.askDownloadLocation}
                  onChange={(e) => onUpdateSettings({ askDownloadLocation: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Performance & System */}
        {activeSection === 'performance' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Performans ve Sistem</h2>

            <div
              className={`p-5 rounded-2xl border space-y-4 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Bellek Tasarrufu (Memory Saver)</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                    Kullanılmayan arka plan sekmelerini uyutarak RAM tüketimini %40 azaltır
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.memorySaver}
                  onChange={(e) => onUpdateSettings({ memorySaver: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </div>

              <div className={`border-t pt-4 flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Kullanılabilir Olduğunda Donanım Hızlandırmayı Kullan</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>GPU rasterizasyonu ve video donanım hızlandırma</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hardwareAcceleration}
                  onChange={(e) => onUpdateSettings({ hardwareAcceleration: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* About LNX Browser */}
        {activeSection === 'about' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>LNX Browser Hakkında</h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                  Sürüm bilgileri, son güncelleme notları ve sistem durumu
                </p>
              </div>
              <button
                type="button"
                onClick={handleCheckUpdate}
                disabled={isCheckingUpdate}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isCheckingUpdate
                    ? 'opacity-70 cursor-wait bg-blue-600/20 text-blue-400 border-blue-500/40'
                    : isDark
                    ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/40 shadow-xs'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 shadow-xs'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                <span>{isCheckingUpdate ? 'Denetleniyor...' : 'Güncellemeleri Denetle'}</span>
              </button>
            </div>

            {/* Version Overview Card */}
            <div
              className={`p-6 rounded-2xl border space-y-4 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    <LnxLogo size={56} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>LNX Browser</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        Resmi Derleme
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                      Sürüm: <strong>152.0.7977.65</strong> (LNX-x86_64 Stable)
                    </p>
                    <p className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>LNX Browser güncel</span>
                    </p>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border text-xs sm:text-right ${isDark ? 'bg-neutral-800/40 border-neutral-750' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Chromium Çekirdeği</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>v152.0 • V8 Engine 15.2</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">● Güvenlik Yamaları Etkin</div>
                </div>
              </div>

              {updateFeedback && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{updateFeedback}</span>
                </div>
              )}

              <div className={`border-t pt-4 text-xs leading-relaxed ${isDark ? 'border-neutral-800 text-neutral-400' : 'border-slate-100 text-slate-600'}`}>
                LNX Browser, Chromium Açık Kaynak Projesi ve modern gizlilik mimarisi üzerine geliştirilmiş yüksek performanslı masaüstü web tarayıcısıdır.
              </div>
            </div>

            {/* Latest Update & Bug Fixes Changelog Card */}
            <div
              className={`p-6 rounded-2xl border space-y-4 shadow-xs transition-colors duration-200 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3.5 border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ArrowUpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <span>Son Güncelleme Yayınlandı</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                        v152.0.7977.65
                      </span>
                    </h4>
                    <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                      Kritik kararlılık paketi ve kapsamlı hata düzeltmeleri
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">25 Ağustos 2026</span>
              </div>

              {/* Bug Fixes Highlights */}
              <div className="space-y-3 pt-1">
                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-neutral-800/50 border-neutral-750' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 shrink-0 mt-0.5">
                      <Bug className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Çoğu Bug ve Çökme Sorunları Fixlendi
                      </h5>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                        Kullanıcı bildirimleri ve telemetri analizleri doğrultusunda tarayıcı genelinde tespit edilen <strong>çoğu hata ve kararsızlık fixlendi</strong>:
                      </p>
                      <ul className={`mt-2 space-y-1 text-xs list-disc list-inside ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                        <li>Sekmeler arası hızlı geçişlerde yaşanan takılmalar ve bellek sızıntıları giderildi.</li>
                        <li>Omnibox arama çubuğundaki URL ayrıştırma ve geçmiş arama hataları çözüldü.</li>
                        <li>DevTools konsol senkronizasyonu ve element denetleyicideki görsel hatalar düzeltildi.</li>
                        <li>LNX Shields reklam ve izleyici engelleyicideki kural uyuşmazlıkları giderildi.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-neutral-800/40 border-neutral-750' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Performans & V8 Hızlandırma
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                      JavaScript motoru ve render hattı optimize edilerek ilk sayfa açılış süreleri %24 oranında hızlandırıldı.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${
                    isDark ? 'bg-neutral-800/40 border-neutral-750' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Palette className="w-4 h-4 text-purple-400" />
                      <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Yeni Duvar Kağıdı & Temalar
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                      Yeni Sekme için "LNX Resmi (Koyu)" degrade arka plan ve geliştirilmiş koyu mod kontrastı entegre edildi.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`border-t pt-4 flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                <div>
                  <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Kurulum ve Başlangıç Sihirbazı</div>
                  <div className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Tarayıcı başlangıç ayarlarını ve tercihleri yeniden yapılandırın</div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('lnx://welcome')}
                  className={`px-3.5 py-1.5 rounded-xl border font-medium text-xs transition-colors flex items-center gap-1.5 ${
                    isDark
                      ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-500/30'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sihirbazı Başlat</span>
                </button>
              </div>

              {/* Discreet Developer Console Link */}
              <div className={`border-t pt-3 flex items-center justify-between text-[11px] ${isDark ? 'border-neutral-800/80 text-neutral-500' : 'border-slate-100 text-slate-400'}`}>
                <span>LNX Open-Source Core • Güvenli Chromium Mimarisi</span>
                <button
                  type="button"
                  onClick={() => onNavigate('lnx://admin')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1 opacity-60 hover:opacity-100"
                  title="LNX Sunucu Yöneticisi Girişi"
                >
                  <Lock className="w-3 h-3" />
                  <span>Yönetici Paneli (OTA Server)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Password Modal */}
      {showAddPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-sm border rounded-2xl p-5 shadow-2xl text-xs ${
              isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="text-sm font-bold mb-3">Yeni Şifre Kaydet</h3>
            <form onSubmit={handleSaveNewPassword} className="space-y-3">
              <div>
                <label className={`block mb-1 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Web Sitesi</label>
                <input
                  type="text"
                  required
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  placeholder="örn: github.com"
                  className={`w-full px-3 py-2 rounded-xl border outline-none focus:border-blue-500 ${
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Kullanıcı Adı / E-Posta</label>
                <input
                  type="text"
                  required
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  placeholder="örn: kullanici@email.com"
                  className={`w-full px-3 py-2 rounded-xl border outline-none focus:border-blue-500 ${
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Şifre</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-3 py-2 rounded-xl border outline-none focus:border-blue-500 ${
                    isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPasswordModal(false)}
                  className={`px-3 py-1.5 rounded-xl ${
                    isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xs"
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
