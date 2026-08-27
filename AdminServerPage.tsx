import React, { useState, useEffect } from 'react';
import {
  Server,
  Radio,
  Send,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Users,
  Activity,
  ArrowUpCircle,
  Bug,
  Globe,
  Trash2,
} from 'lucide-react';
import { BrowserSettings } from '../../types';

interface AdminServerPageProps {
  settings?: BrowserSettings;
  onNavigate?: (url: string) => void;
}

export const AdminServerPage: React.FC<AdminServerPageProps> = ({
  settings,
  onNavigate,
}) => {
  const isDark = settings?.theme !== 'light';

  // Authentication State
  const [adminKey, setAdminKey] = useState<string>(() => {
    return sessionStorage.getItem('lnx_admin_key') || '';
  });
  const [inputKey, setInputKey] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('lnx_admin_key') === 'lnx-master-admin-2026';
  });

  // Server Live Status
  const [serverStats, setServerStats] = useState<{
    status: string;
    version: string;
    serverTime?: string;
    activeClients?: number;
    hasUpdate?: boolean;
    latestUpdate?: any;
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Broadcast Form State
  const [broadcastVersion, setBroadcastVersion] = useState('152.0.7977.65');
  const [broadcastChannel, setBroadcastChannel] = useState<'stable' | 'beta' | 'nightly' | 'critical'>('stable');
  const [broadcastTitle, setBroadcastTitle] = useState('LNX Browser Kritik Kararlılık ve Güvenlik Paketi');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'critical' | 'important' | 'normal'>('critical');
  const [broadcastNotes, setBroadcastNotes] = useState('Sekmeler arası hızlı geçişlerde yaşanan takılmalar, bellek yönetimi ve arama çubuğu optimize edildi.');
  const [broadcastFix1, setBroadcastFix1] = useState('Sekmeler arası hızlı geçişlerde yaşanan takılmalar ve bellek sızıntıları giderildi.');
  const [broadcastFix2, setBroadcastFix2] = useState('Omnibox arama çubuğundaki URL ayrıştırma ve geçmiş arama hataları çözüldü.');
  const [broadcastFix3, setBroadcastFix3] = useState('DevTools konsol senkronizasyonu ve element denetleyicideki görsel hatalar düzeltildi.');
  const [broadcastFix4, setBroadcastFix4] = useState('LNX Shields reklam ve izleyici engelleyicideki kural uyuşmazlıkları giderildi.');

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Fetch Server Stats
  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const [healthRes, statusRes] = await Promise.all([
        fetch('/api/health').catch(() => null),
        fetch('/api/updates/status').catch(() => null),
      ]);

      const healthData = healthRes?.ok ? await healthRes.json() : {};
      const statusData = statusRes?.ok ? await statusRes.json() : {};

      setServerStats({
        status: healthData.status || 'running',
        version: healthData.version || '152.0.7977.65',
        serverTime: healthData.serverTime || new Date().toISOString(),
        activeClients: healthData.activeClients ?? 1,
        hasUpdate: statusData.hasUpdate ?? false,
        latestUpdate: statusData.latestUpdate,
      });
    } catch {
      // ignore
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      const timer = setInterval(fetchStats, 5000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim() === 'lnx-master-admin-2026') {
      setAdminKey(inputKey.trim());
      setIsAuthenticated(true);
      sessionStorage.setItem('lnx_admin_key', inputKey.trim());
      setAuthError(null);
    } else {
      setAuthError('Hatalı Yönetici Şifresi! LNX Güncelleme Sunucusuna yalnızca yetkili geliştirici erişebilir.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    sessionStorage.removeItem('lnx_admin_key');
  };

  const handleSendBroadcast = async () => {
    setIsBroadcasting(true);
    setBroadcastFeedback(null);
    try {
      const payload = {
        adminKey,
        version: broadcastVersion.trim() || '152.0.7977.65',
        channel: broadcastChannel,
        title: broadcastTitle.trim() || 'LNX Browser Kararlılık Paketi',
        releaseNotes: broadcastNotes.trim(),
        severity: broadcastSeverity,
        fixes: [broadcastFix1, broadcastFix2, broadcastFix3, broadcastFix4].filter(Boolean),
      };

      const res = await fetch('/api/updates/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBroadcastFeedback({
          success: true,
          message: `🚀 Güncelleme (v${payload.version}) sunucudan tüm kullanıcılara canlı olarak yayınlandı! SSE istemcilerine anında iletildi.`,
        });
        fetchStats();
      } else {
        setBroadcastFeedback({
          success: false,
          message: data.error || 'Güncelleme yayınlanırken bir hata oluştu.',
        });
      }
    } catch {
      setBroadcastFeedback({
        success: false,
        message: 'Sunucuya bağlanılamadı. Lütfen sunucu durumunu kontrol edin.',
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDismissBroadcast = async () => {
    try {
      await fetch('/api/updates/dismiss', { method: 'POST' });
      setBroadcastFeedback({
        success: true,
        message: 'Yayındaki güncelleme kaldırıldı.',
      });
      fetchStats();
    } catch {}
  };

  // Locked View for Unauthenticated / Regular Users
  if (!isAuthenticated) {
    return (
      <div
        id="lnx-admin-locked-page"
        className={`min-h-full flex items-center justify-center p-6 select-none ${
          isDark ? 'bg-[#0f1117] text-white' : 'bg-slate-100 text-slate-900'
        }`}
      >
        <div
          className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl space-y-6 ${
            isDark ? 'bg-[#161a23] border-indigo-500/30' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">LNX Geliştirici & OTA Sunucu Paneli</h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Bu sayfa yalnızca LNX Browser sistem yöneticisi ve geliştiricisi içindir. Normal kullanıcılar güncelleme gönderemez.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                Yönetici Master Anahtarı (Admin Secret Key):
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Admin anahtarını girin..."
                autoFocus
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <p className="text-[11px] text-neutral-500 mt-1">Varsayılan geliştirici anahtarı: <code className="font-mono text-indigo-400">lnx-master-admin-2026</code></p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Yönetici Girişi Yap</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate?.('lnx://settings')}
              className="text-xs text-neutral-400 hover:text-neutral-200 underline"
            >
              ← Normal Ayarlar Sayfasına Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Developer / Administrator Control Center
  return (
    <div
      id="lnx-admin-dashboard"
      className={`min-h-full p-6 lg:p-10 space-y-6 ${
        isDark ? 'bg-[#0f1117] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-neutral-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-sm">
            <Server className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight">LNX OTA Güncelleme Dağıtım Sunucusu</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Geliştirici Yetkili
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
              Bu panelden gönderdiğiniz güncellemeler tüm kullanıcılara canlı SSE akışıyla sağ alttan anında iletilir.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchStats}
            disabled={isLoadingStats}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Live Server Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#151923] border-neutral-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Sunucu Durumu</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold flex items-center gap-2 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Canlı & Aktif</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1 font-mono">Port: 3000 / SSE Stream</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#151923] border-neutral-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Bağlı Kullanıcı / İstemci</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-400">
            {serverStats?.activeClients ?? 1} Canlı Soket
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Anlık bildirim alacak istemciler</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#151923] border-neutral-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Yayındaki Sürüm</span>
            <ArrowUpCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-indigo-400">
            v{serverStats?.latestUpdate?.version || '152.0.7977.65'}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
            {serverStats?.hasUpdate ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" /> Yayında
              </span>
            ) : (
              <span className="text-neutral-400">Beklemede</span>
            )}
          </div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#151923] border-neutral-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Dağıtım Kanalı</span>
            <Globe className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold capitalize text-amber-400">
            {serverStats?.latestUpdate?.channel || 'Stable'}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Global OTA Ağı</div>
        </div>
      </div>

      {/* Main Broadcast Dispatch Form */}
      <div
        className={`p-6 rounded-3xl border space-y-5 shadow-sm ${
          isDark ? 'bg-[#151923] border-indigo-500/30' : 'bg-white border-indigo-200'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4 border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Yeni Güncelleme Paketi Oluştur & Yayınla</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Aşağıdaki bilgileri doldurup gönderdiğinizde tüm kullanıcılarda anında sağ alt bildirim açılır.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
              Hedef Sürüm No:
            </label>
            <input
              type="text"
              value={broadcastVersion}
              onChange={(e) => setBroadcastVersion(e.target.value)}
              placeholder="152.0.7977.65"
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-neutral-800/80 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
              Dağıtım Kanalı:
            </label>
            <select
              value={broadcastChannel}
              onChange={(e) => setBroadcastChannel(e.target.value as any)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-neutral-800/80 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="stable">Stable (Kararlı Sürüm - Tüm Kullanıcılar)</option>
              <option value="beta">Beta Kanalı</option>
              <option value="nightly">Nightly (Geliştirici Sürümü)</option>
              <option value="critical">Critical Hotfix (Acil Güvenlik Yaması)</option>
            </select>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
              Önem Seviyesi:
            </label>
            <select
              value={broadcastSeverity}
              onChange={(e) => setBroadcastSeverity(e.target.value as any)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-neutral-800/80 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="critical">Kritik (Hata ve Çökme Düzeltmeleri)</option>
              <option value="important">Önemli (Yeni Özellikler)</option>
              <option value="normal">Normal İyileştirme</option>
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
            Güncelleme Başlığı:
          </label>
          <input
            type="text"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            placeholder="LNX Browser Kritik Kararlılık ve Güvenlik Paketi"
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark ? 'bg-neutral-800/80 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>

        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
            Sürüm Notu Özeti:
          </label>
          <textarea
            rows={2}
            value={broadcastNotes}
            onChange={(e) => setBroadcastNotes(e.target.value)}
            placeholder="Kullanıcı bildiriminde görünecek genel açıklama..."
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark ? 'bg-neutral-800/80 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>

        {/* Fixes List */}
        <div className="space-y-2">
          <label className={`block text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
            <Bug className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fixlenen Hatalar Listesi (Kullanıcı Bildiriminde Gösterilecek Maddeler):</span>
          </label>
          <input
            type="text"
            value={broadcastFix1}
            onChange={(e) => setBroadcastFix1(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs border ${
              isDark ? 'bg-neutral-800/60 border-neutral-700 text-neutral-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          />
          <input
            type="text"
            value={broadcastFix2}
            onChange={(e) => setBroadcastFix2(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs border ${
              isDark ? 'bg-neutral-800/60 border-neutral-700 text-neutral-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          />
          <input
            type="text"
            value={broadcastFix3}
            onChange={(e) => setBroadcastFix3(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs border ${
              isDark ? 'bg-neutral-800/60 border-neutral-700 text-neutral-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          />
          <input
            type="text"
            value={broadcastFix4}
            onChange={(e) => setBroadcastFix4(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs border ${
              isDark ? 'bg-neutral-800/60 border-neutral-700 text-neutral-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          />
        </div>

        {/* Feedback Message */}
        {broadcastFeedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
              broadcastFeedback.success
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}
          >
            {broadcastFeedback.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-medium">{broadcastFeedback.message}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Korumalı Uç Nokta: <code className="font-mono text-indigo-400">POST /api/updates/broadcast</code></span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDismissBroadcast}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Yayını Geri Çek</span>
            </button>

            <button
              type="button"
              onClick={handleSendBroadcast}
              disabled={isBroadcasting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isBroadcasting ? 'Yayınlanıyor...' : '🚀 Tüm Kullanıcılara Güncelleme Gönder'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
