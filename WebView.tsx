import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Lock,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Volume2,
  VolumeX,
  Type,
  Maximize,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  BookmarkFolder,
  BookmarkItem,
  BrowserSettings,
  ChromiumFlag,
  DownloadItem,
  ExtensionItem,
  HistoryItem,
  LnxUserAccount,
  QuickShortcut,
  SavedPassword,
  SearchEngineType,
  TabItem,
} from '../../types';
import { NewTabPage } from '../SystemPages/NewTabPage';
import { SettingsPage } from '../SystemPages/SettingsPage';
import { HistoryPage } from '../SystemPages/HistoryPage';
import { BookmarksManager } from '../SystemPages/BookmarksManager';
import { DownloadsPage } from '../SystemPages/DownloadsPage';
import { ExtensionsPage } from '../SystemPages/ExtensionsPage';
import { FlagsPage } from '../SystemPages/FlagsPage';
import { TaskManagerPage } from '../SystemPages/TaskManagerPage';
import { WelcomeSetupPage } from '../SystemPages/WelcomeSetupPage';
import { AdminServerPage } from '../SystemPages/AdminServerPage';
import { ElectronEngineView } from './ElectronEngineView';

const IS_ELECTRON = typeof window !== 'undefined' && !!window.lnxNative?.isElectron;

interface WebViewProps {
  tab: TabItem;
  tabs?: TabItem[];
  shortcuts?: QuickShortcut[];
  searchEngine?: SearchEngineType;
  settings?: BrowserSettings;
  account?: LnxUserAccount;
  bookmarks?: BookmarkItem[];
  bookmarkFolders?: BookmarkFolder[];
  history?: HistoryItem[];
  downloads?: DownloadItem[];
  extensions?: ExtensionItem[];
  flags?: ChromiumFlag[];
  passwords?: SavedPassword[];
  onNavigate: (url: string) => void;
  onAddShortcut?: (title: string, url: string, color: string) => void;
  onRemoveShortcut?: (id: string) => void;
  onSetShortcuts?: (shortcuts: QuickShortcut[]) => void;
  onSearch?: (query: string, engine: SearchEngineType) => void;
  onUpdateSettings?: (settings: Partial<BrowserSettings>) => void;
  onUpdateAccount?: (newAccount: Partial<LnxUserAccount>) => void;
  onAddPassword?: (site: string, username: string, password: string) => void;
  onDeletePassword?: (id: string) => void;
  onOpenClearDataModal?: () => void;
  onDeleteHistoryItem?: (id: string) => void;
  onClearAllHistory?: () => void;
  onAddBookmark?: (title: string, url: string, folderId?: string) => void;
  onDeleteBookmark?: (id: string) => void;
  onAddBookmarkFolder?: (name: string) => void;
  onToggleDownloadState?: (id: string) => void;
  onCancelDownload?: (id: string) => void;
  onClearDownloads?: () => void;
  onToggleExtension?: (id: string) => void;
  onInstallExtension?: (ext: ExtensionItem) => void;
  onRemoveExtension?: (id: string) => void;
  onToggleFlag?: (id: string) => void;
  onResetAllFlags?: () => void;
  onCloseTab?: (id: string, e: React.MouseEvent) => void;
  onSetPageContentSnippet?: (text: string) => void;
  onOpenWelcomeModal?: () => void;
}

export const WebView: React.FC<WebViewProps> = ({
  tab,
  tabs = [],
  shortcuts = [],
  searchEngine = 'google',
  settings,
  account,
  bookmarks = [],
  bookmarkFolders = [],
  history = [],
  downloads = [],
  extensions = [],
  flags = [],
  passwords = [],
  onNavigate,
  onAddShortcut = () => {},
  onRemoveShortcut = () => {},
  onSetShortcuts,
  onSearch = () => {},
  onUpdateSettings = () => {},
  onUpdateAccount = () => {},
  onAddPassword = () => {},
  onDeletePassword = () => {},
  onOpenClearDataModal = () => {},
  onDeleteHistoryItem = () => {},
  onClearAllHistory = () => {},
  onAddBookmark = () => {},
  onDeleteBookmark = () => {},
  onAddBookmarkFolder = () => {},
  onToggleDownloadState = () => {},
  onCancelDownload = () => {},
  onClearDownloads = () => {},
  onToggleExtension = () => {},
  onInstallExtension = () => {},
  onRemoveExtension = () => {},
  onToggleFlag = () => {},
  onResetAllFlags = () => {},
  onCloseTab = () => {},
  onSetPageContentSnippet,
  onOpenWelcomeModal,
}) => {
  const [proxyData, setProxyData] = useState<any>(null);
  const [loadingProxy, setLoadingProxy] = useState(false);
  const [proxyError, setProxyError] = useState<string | null>(null);
  const [useDirectFallback, setUseDirectFallback] = useState(false);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [readerFontSize, setReaderFontSize] = useState(18);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch web content via proxy if external URL.
  // Skipped entirely inside the Electron shell: there, ElectronEngineView
  // below handles real navigation directly through Chromium, so no
  // server-side fetch/srcDoc workaround is needed.
  useEffect(() => {
    if (IS_ELECTRON) return;

    if (tab.url.startsWith('lnx://')) {
      setProxyData(null);
      setLoadingProxy(false);
      setProxyError(null);
      setUseDirectFallback(false);
      return;
    }

    let isMounted = true;
    setLoadingProxy(true);
    setProxyError(null);
    setUseDirectFallback(false);

    fetch(`/api/proxy?url=${encodeURIComponent(tab.url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.error) {
          // Some sites block server-side fetches (bot detection) but still
          // allow being embedded by a real browser — fall back to loading
          // the target directly in a sandboxed iframe instead of failing.
          if (data.fallbackDirect) {
            setUseDirectFallback(true);
            setProxyData(null);
            setProxyError(null);
          } else {
            setProxyError(data.error);
          }
        } else {
          setProxyData(data);
          // Pass extracted snippet to AI Copilot
          if (onSetPageContentSnippet && data.html) {
            const stripped = data.html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').slice(0, 4000);
            onSetPageContentSnippet(stripped);
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        // Network-level failure talking to our own proxy endpoint — still
        // worth trying a direct load before giving up entirely.
        setUseDirectFallback(true);
      })
      .finally(() => {
        if (isMounted) setLoadingProxy(false);
      });

    return () => {
      isMounted = false;
    };
  }, [tab.url]);

  // Handle Internal LNX Protocols
  if (tab.url === 'lnx://newtab' || tab.url === 'about:blank') {
    return (
      <NewTabPage
        shortcuts={shortcuts}
        searchEngine={searchEngine}
        settings={settings}
        account={account}
        onNavigate={onNavigate}
        onAddShortcut={onAddShortcut}
        onRemoveShortcut={onRemoveShortcut}
        onSearch={onSearch}
        onUpdateSettings={onUpdateSettings}
        onOpenWelcomeModal={onOpenWelcomeModal}
      />
    );
  }

  if (tab.url.startsWith('lnx://settings')) {
    return (
      <SettingsPage
        settings={settings}
        account={account}
        passwords={passwords}
        bookmarks={bookmarks}
        bookmarkFolders={bookmarkFolders}
        onUpdateSettings={onUpdateSettings}
        onUpdateAccount={onUpdateAccount}
        onAddPassword={onAddPassword}
        onDeletePassword={onDeletePassword}
        onAddBookmark={onAddBookmark}
        onDeleteBookmark={onDeleteBookmark}
        onOpenClearDataModal={onOpenClearDataModal}
        onNavigate={onNavigate}
      />
    );
  }

  if (tab.url === 'lnx://history') {
    return (
      <HistoryPage
        history={history}
        onNavigate={onNavigate}
        onDeleteItem={onDeleteHistoryItem}
        onClearAll={onClearAllHistory}
        onOpenClearDataModal={onOpenClearDataModal}
      />
    );
  }

  if (tab.url === 'lnx://bookmarks') {
    return (
      <BookmarksManager
        bookmarks={bookmarks}
        folders={bookmarkFolders}
        onNavigate={onNavigate}
        onAddBookmark={onAddBookmark}
        onDeleteBookmark={onDeleteBookmark}
        onAddFolder={onAddBookmarkFolder}
      />
    );
  }

  if (tab.url === 'lnx://downloads') {
    return (
      <DownloadsPage
        downloads={downloads}
        isDark={settings.theme !== 'light'}
        onToggleDownloadState={onToggleDownloadState}
        onCancelDownload={onCancelDownload}
        onClearDownloads={onClearDownloads}
      />
    );
  }

  if (tab.url === 'lnx://extensions') {
    return (
      <ExtensionsPage
        extensions={extensions}
        onToggleExtension={onToggleExtension}
        onInstallExtension={onInstallExtension}
        onRemoveExtension={onRemoveExtension}
      />
    );
  }

  if (tab.url === 'lnx://flags') {
    return (
      <FlagsPage
        flags={flags}
        onToggleFlag={onToggleFlag}
        onResetAllFlags={onResetAllFlags}
      />
    );
  }

  if (tab.url === 'lnx://taskmanager') {
    return <TaskManagerPage tabs={tabs.length > 0 ? tabs : [tab]} onCloseTab={onCloseTab} />;
  }

  if (tab.url === 'lnx://admin' || tab.url === 'lnx://server' || tab.url === 'lnx://developer') {
    return <AdminServerPage settings={settings} onNavigate={onNavigate} />;
  }

  if (tab.url === 'lnx://welcome' || tab.url === 'lnx://setup') {
    return (
      <WelcomeSetupPage
        settings={settings || {
          theme: 'dark',
          accentColor: '#3b82f6',
          searchEngine: 'google',
          defaultZoom: 100,
          showBookmarksBar: true,
          showHomeButton: true,
          homePageUrl: 'lnx://newtab',
          memorySaver: true,
          shieldsEnabled: true,
          adBlockLevel: 'aggressive',
          trackingProtection: true,
          httpsOnly: true,
          doNotTrack: true,
          defaultDownloadDir: 'C:\\Users\\LNX\\Downloads',
          askDownloadLocation: false,
          hardwareAcceleration: true,
          tabHoverPreview: true,
          smoothScrolling: true,
          restoreSessionOnStartup: true,
        }}
        account={account}
        shortcuts={shortcuts}
        onUpdateSettings={onUpdateSettings}
        onUpdateAccount={onUpdateAccount}
        onNavigate={onNavigate}
        onAddShortcut={onAddShortcut}
        onSetShortcuts={onSetShortcuts}
        onOpenWelcomeModal={onOpenWelcomeModal}
      />
    );
  }

  // Real engine path — only inside the Electron desktop shell, and only
  // for actual http(s) navigation (internal lnx:// pages are handled by
  // the branches above regardless of shell).
  if (IS_ELECTRON && !tab.isReaderMode && /^https?:\/\//i.test(tab.url)) {
    return (
      <ElectronEngineView
        tabId={tab.id}
        url={tab.url}
        zoomLevel={tab.zoomLevel}
        shieldsEnabled={settings?.shieldsEnabled}
        onNavigate={onNavigate}
        onPageTextExtracted={onSetPageContentSnippet}
      />
    );
  }

  // Reader Mode View
  if (tab.isReaderMode && proxyData) {
    const rawText = proxyData.html
      ? proxyData.html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
          .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
          .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      : '<p>Okuma modu içeriği yükleniyor...</p>';

    const toggleSpeech = () => {
      if ('speechSynthesis' in window) {
        if (isPlayingAudio) {
          window.speechSynthesis.cancel();
          setIsPlayingAudio(false);
        } else {
          const stripped = rawText.replace(/<[^>]*>?/gm, ' ');
          const utterance = new SpeechSynthesisUtterance(stripped.slice(0, 1500));
          utterance.lang = 'tr-TR';
          utterance.onend = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utterance);
          setIsPlayingAudio(true);
        }
      }
    };

    const readerBg =
      readerTheme === 'sepia'
        ? 'bg-[#fbf0d9] text-[#5f4b32]'
        : readerTheme === 'light'
        ? 'bg-white text-neutral-900'
        : 'bg-neutral-950 text-neutral-100';

    return (
      <div className={`min-h-full flex flex-col items-center p-8 transition-colors ${readerBg}`}>
        {/* Reader controls floating header */}
        <div className="w-full max-w-2xl flex items-center justify-between mb-8 p-3 rounded-2xl bg-neutral-900/80 backdrop-blur-md border border-neutral-800 text-neutral-200 text-xs shadow-xl">
          <div className="flex items-center gap-2 font-bold">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>LNX Okuma Modu</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Font size controls */}
            <div className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded-lg">
              <button
                onClick={() => setReaderFontSize((prev) => Math.max(14, prev - 2))}
                className="font-bold px-1 hover:text-white"
              >
                A-
              </button>
              <span className="text-[11px] font-mono">{readerFontSize}px</span>
              <button
                onClick={() => setReaderFontSize((prev) => Math.min(28, prev + 2))}
                className="font-bold px-1 hover:text-white"
              >
                A+
              </button>
            </div>

            {/* Themes */}
            <div className="flex items-center gap-1">
              {(['dark', 'sepia', 'light'] as const).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setReaderTheme(thm)}
                  className={`w-5 h-5 rounded-full border ${
                    readerTheme === thm ? 'ring-2 ring-blue-500' : ''
                  } ${thm === 'dark' ? 'bg-neutral-900 border-neutral-700' : thm === 'sepia' ? 'bg-[#fbf0d9] border-[#e2d3be]' : 'bg-white border-neutral-300'}`}
                />
              ))}
            </div>

            {/* Text-To-Speech */}
            <button
              onClick={toggleSpeech}
              className={`p-1.5 rounded-lg transition-colors ${
                isPlayingAudio ? 'bg-blue-600 text-white' : 'hover:bg-neutral-800 text-neutral-300'
              }`}
              title="Sesli Oku"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Article Container */}
        <article
          className="w-full max-w-2xl font-serif leading-relaxed"
          style={{ fontSize: `${readerFontSize}px` }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight font-sans mb-4">
            {proxyData.title || tab.title}
          </h1>
          <div className="text-xs text-neutral-500 font-sans mb-8 border-b pb-4">
            Kaynak: <a href={tab.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{tab.url}</a>
          </div>

          <div
            className="prose prose-invert max-w-none space-y-4"
            dangerouslySetInnerHTML={{ __html: rawText }}
          />
        </article>
      </div>
    );
  }

  // Loading indicator for proxy web pages
  if (loadingProxy) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-300 p-8">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <h3 className="text-sm font-bold text-white mb-1">Web Sayfası Yükleniyor</h3>
        <p className="text-xs text-neutral-500 font-mono">{tab.url}</p>
      </div>
    );
  }

  // Direct-load fallback: our server-side proxy fetch failed (often because
  // the site fingerprints/blocks non-browser requests), so try embedding the
  // real URL straight in a sandboxed iframe as a last resort. This lets sites
  // that block proxying but don't set restrictive frame-ancestors still open.
  if (useDirectFallback && !loadingProxy) {
    const zoomTransformDirect = `scale(${tab.zoomLevel / 100})`;
    return (
      <div className="w-full h-full bg-white relative overflow-hidden flex flex-col">
        <iframe
          ref={iframeRef}
          title={tab.title}
          src={tab.url}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          className="w-full flex-1 border-none bg-white"
          style={{
            transform: zoomTransformDirect,
            transformOrigin: 'top left',
            width: tab.zoomLevel !== 100 ? `${(100 / tab.zoomLevel) * 100}%` : '100%',
            height: tab.zoomLevel !== 100 ? `${(100 / tab.zoomLevel) * 100}%` : '100%',
          }}
          onError={() => {
            setUseDirectFallback(false);
            setProxyError('Bu siteye ne proxy ne de doğrudan bağlantı ile ulaşılabildi.');
          }}
        />
      </div>
    );
  }

  // Error fallback or direct iframe loader
  if (proxyError || !proxyData) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-300 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Bu siteye ulaşılamıyor</h2>
        <p className="text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">
          {proxyError || 'Sayfa güvenlik politikası veya bağlantı engeli nedeniyle doğrudan yüklenemedi.'}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(tab.url)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow"
          >
            Yeniden Dene
          </button>
          <button
            onClick={() => onNavigate('lnx://newtab')}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium"
          >
            Yeni Sekmeye Dön
          </button>
        </div>
      </div>
    );
  }

  // Render Full Live Web Content via Sandboxed Blob / Iframe with LNX Shields and Zoom
  const zoomTransform = `scale(${tab.zoomLevel / 100})`;

  return (
    <div className="w-full h-full bg-white relative overflow-hidden flex flex-col">
      <iframe
        ref={iframeRef}
        title={tab.title}
        srcDoc={proxyData.html}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        className="w-full flex-1 border-none bg-white"
        style={{
          transform: zoomTransform,
          transformOrigin: 'top left',
          width: tab.zoomLevel !== 100 ? `${(100 / tab.zoomLevel) * 100}%` : '100%',
          height: tab.zoomLevel !== 100 ? `${(100 / tab.zoomLevel) * 100}%` : '100%',
        }}
      />
    </div>
  );
};
