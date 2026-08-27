import React, { useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_ACCOUNT,
  DEFAULT_BOOKMARKS,
  DEFAULT_BOOKMARK_FOLDERS,
  DEFAULT_DOWNLOADS,
  DEFAULT_EXTENSIONS,
  DEFAULT_FLAGS,
  DEFAULT_HISTORY,
  DEFAULT_PASSWORDS,
  DEFAULT_SETTINGS,
  DEFAULT_SHORTCUTS,
  DEFAULT_TABS,
  DEFAULT_TAB_GROUPS,
} from './data/defaultData';
import {
  AdBlockLevel,
  BookmarkFolder,
  BookmarkItem,
  BrowserSettings,
  BrowserUpdateInfo,
  ChromiumFlag,
  DevToolsState,
  DownloadItem,
  ExtensionItem,
  HistoryItem,
  LnxUserAccount,
  NetworkRequest,
  QuickShortcut,
  SavedPassword,
  SearchEngineType,
  TabGroup,
  TabItem,
} from './types';
import { TabStrip } from './components/Header/TabStrip';
import { NavigationToolbar } from './components/Header/NavigationToolbar';
import { BookmarksBar } from './components/Header/BookmarksBar';
import { WebView } from './components/Content/WebView';
import { DevToolsDrawer } from './components/DevTools/DevToolsDrawer';
import { ShieldsPopover } from './components/Modals/ShieldsPopover';
import { ClearDataModal } from './components/Modals/ClearDataModal';
import { QrCodeModal } from './components/Modals/QrCodeModal';
import { FindInPageBar } from './components/Modals/FindInPageBar';
import { TabSearchModal } from './components/Modals/TabSearchModal';
import { WelcomeCelebrationModal } from './components/Modals/WelcomeCelebrationModal';
import { UpdateNotificationToast } from './components/Modals/UpdateNotificationToast';

// Helper for guaranteed unique tab IDs
const generateUniqueTabId = () =>
  `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Sanitizes and ensures uniqueness of tab IDs
function sanitizeTabs(rawTabs: any[]): TabItem[] {
  if (!Array.isArray(rawTabs) || rawTabs.length === 0) {
    return DEFAULT_TABS;
  }
  const seenIds = new Set<string>();
  const cleaned: TabItem[] = [];

  for (const t of rawTabs) {
    if (!t || typeof t !== 'object') continue;
    let id = typeof t.id === 'string' && t.id.trim() ? t.id : generateUniqueTabId();
    if (seenIds.has(id)) {
      id = generateUniqueTabId();
    }
    seenIds.add(id);

    cleaned.push({
      ...t,
      id,
      title: t.title || (t.url === 'lnx://newtab' ? 'Yeni Sekme' : 'Sekme'),
      url: t.url || 'lnx://newtab',
      history: Array.isArray(t.history) && t.history.length > 0 ? t.history : [t.url || 'lnx://newtab'],
      historyIndex: typeof t.historyIndex === 'number' ? t.historyIndex : 0,
      isPinned: !!t.isPinned,
      isMuted: !!t.isMuted,
      isIncognito: !!t.isIncognito,
      isLoading: false,
      canGoBack: t.historyIndex > 0,
      canGoForward: Array.isArray(t.history) && t.historyIndex < t.history.length - 1,
      securityStatus: t.securityStatus || (t.url?.startsWith('https://') ? 'secure' : t.url?.startsWith('lnx://') ? 'internal' : 'warning'),
      lastAccessed: t.lastAccessed || Date.now(),
      zoomLevel: typeof t.zoomLevel === 'number' ? t.zoomLevel : 100,
      isReaderMode: !!t.isReaderMode,
      memoryUsageMb: typeof t.memoryUsageMb === 'number' ? t.memoryUsageMb : 32,
    });
  }

  return cleaned.length > 0 ? cleaned : DEFAULT_TABS;
}

export default function App() {
  // Primary Browser State
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    try {
      const saved = localStorage.getItem('lnx_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeTabs(parsed);
      }
    } catch {}
    return DEFAULT_TABS;
  });
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    try {
      const setupDone = localStorage.getItem('lnx_setup_completed') === 'true';
      if (!setupDone) {
        const welcomeTab = DEFAULT_TABS.find((t) => t.url === 'lnx://welcome' || t.url === 'lnx://setup');
        if (welcomeTab) return welcomeTab.id;
      }
    } catch {}
    return tabs[0]?.id || 'tab-1';
  });
  const [closedTabs, setClosedTabs] = useState<TabItem[]>([]);
  const [tabGroups, setTabGroups] = useState<TabGroup[]>([]);

  // Invariant check: Ensure tabs is NEVER empty and activeTabId is valid
  useEffect(() => {
    if (!tabs || tabs.length === 0) {
      setTabs(DEFAULT_TABS);
      setActiveTabId(DEFAULT_TABS[0].id);
    } else if (!tabs.some((t) => t.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  // User Account State (LNX Hesabı)
  const [userAccount, setUserAccount] = useState<LnxUserAccount>(() => {
    try {
      const saved = localStorage.getItem('lnx_account');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return { ...DEFAULT_ACCOUNT, ...parsed };
      }
    } catch {}
    return DEFAULT_ACCOUNT;
  });

  useEffect(() => {
    try {
      localStorage.setItem('lnx_account', JSON.stringify(userAccount));
    } catch {}
  }, [userAccount]);

  const handleUpdateAccount = useCallback((newAcc: Partial<LnxUserAccount>) => {
    setUserAccount((prev) => ({ ...prev, ...newAcc }));
  }, []);

  // Settings & Data Collections
  const [settings, setSettings] = useState<BrowserSettings>(() => {
    try {
      const saved = localStorage.getItem('lnx_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const res = { ...DEFAULT_SETTINGS, ...parsed };
          if ((res.searchEngine as string) === 'lnx_ai') res.searchEngine = 'google';
          return res;
        }
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('lnx_bookmarks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((b) => b && typeof b === 'object' && b.id && b.url);
          if (valid.length > 0) return valid;
        }
      }
    } catch {}
    return DEFAULT_BOOKMARKS;
  });
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([
    { id: 'bar', name: 'Bookmarks Bar' },
  ]);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('lnx_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (h) =>
              h &&
              h.id !== 'h3' &&
              h.title !== 'Hacker News' &&
              !h.url?.includes('news.ycombinator.com')
          );
        }
      }
    } catch {}
    return DEFAULT_HISTORY;
  });
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [extensions, setExtensions] = useState<ExtensionItem[]>(DEFAULT_EXTENSIONS);
  const [flags, setFlags] = useState<ChromiumFlag[]>(DEFAULT_FLAGS);
  const [passwords, setPasswords] = useState<SavedPassword[]>(DEFAULT_PASSWORDS);
  const [shortcuts, setShortcuts] = useState<QuickShortcut[]>(() => {
    try {
      const saved = localStorage.getItem('lnx_shortcuts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (s) =>
              s &&
              s.id !== 'sc-hackernews' &&
              s.title !== 'Hacker News' &&
              !s.url?.includes('news.ycombinator.com')
          );
        }
      }
    } catch {}
    return DEFAULT_SHORTCUTS;
  });

  // Side panels & Modals
  const [isShieldsOpen, setIsShieldsOpen] = useState(false);
  const [isClearDataOpen, setIsClearDataOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isFindInPageOpen, setIsFindInPageOpen] = useState(false);
  const [isTabSearchOpen, setIsTabSearchOpen] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [secondaryTabId, setSecondaryTabId] = useState<string | null>(null);
  const [isWelcomeCelebrationOpen, setIsWelcomeCelebrationOpen] = useState(false);
  const [pageSnippet, setPageSnippet] = useState<string>('');

  // Live OTA Server Update Notification State
  const [isUpdateToastOpen, setIsUpdateToastOpen] = useState(false);
  const [serverUpdate, setServerUpdate] = useState<BrowserUpdateInfo | null>(null);
  const [currentBrowserVersion, setCurrentBrowserVersion] = useState<string>(() => {
    return localStorage.getItem('lnx_version') || '152.0.7977.65';
  });

  // Real-Time Server-Sent Events (SSE) & Polling for Updates
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/updates/stream');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'update_available' && data.update) {
            setServerUpdate(data.update);
            setIsUpdateToastOpen(true);
          }
        } catch {}
      };
    } catch {}

    const checkServerUpdateStatus = async () => {
      try {
        const res = await fetch('/api/updates/status');
        if (res.ok) {
          const data = await res.json();
          if (data.latestUpdate) {
            setServerUpdate(data.latestUpdate);
            if (data.hasUpdate) {
              setIsUpdateToastOpen(true);
            }
          }
        }
      } catch {}
    };

    checkServerUpdateStatus();
    const interval = setInterval(checkServerUpdateStatus, 10000);

    const handleCustomUpdateNotification = (e: any) => {
      if (e.detail?.update) {
        setServerUpdate(e.detail.update);
      }
      setIsUpdateToastOpen(true);
    };
    window.addEventListener('lnx-show-update-notification', handleCustomUpdateNotification);

    return () => {
      eventSource?.close();
      clearInterval(interval);
      window.removeEventListener('lnx-show-update-notification', handleCustomUpdateNotification);
    };
  }, []);

  const handleApplyBrowserUpdate = async (newVersion: string) => {
    setCurrentBrowserVersion(newVersion);
    localStorage.setItem('lnx_version', newVersion);
    try {
      await fetch('/api/updates/dismiss', { method: 'POST' });
    } catch {}
  };

  // DevTools Panel State
  const [devTools, setDevTools] = useState<DevToolsState>({
    isOpen: false,
    activeTab: 'elements',
    dockPosition: 'bottom',
  });

  // Mock network requests for active tab
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([
    { id: '1', name: 'document (index.html)', status: 200, type: 'document', size: '14.2 KB', time: '18ms' },
    { id: '2', name: 'lnx-core.css', status: 200, type: 'stylesheet', size: '28.6 KB', time: '9ms' },
    { id: '3', name: 'react.production.min.js', status: 200, type: 'script', size: '132.0 KB', time: '24ms' },
    { id: '4', name: 'favicon.ico', status: 200, type: 'image', size: '1.4 KB', time: '4ms' },
  ]);

  // Persist important state to local storage
  useEffect(() => {
    localStorage.setItem('lnx_tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('lnx_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('lnx_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('lnx_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('lnx_shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  // Active tab helper
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || DEFAULT_TABS[0];

  // Tab Management
  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  const handleNewTab = (
    url: string = 'lnx://newtab',
    title: string = 'Yeni Sekme',
    isIncognito: boolean = false
  ) => {
    const newId = generateUniqueTabId();
    const newTabItem: TabItem = {
      id: newId,
      title,
      url,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isIncognito,
      securityStatus: url.startsWith('https://') ? 'secure' : url.startsWith('lnx://') ? 'internal' : 'warning',
      lastAccessed: Date.now(),
      history: [url],
      historyIndex: 0,
      zoomLevel: 100,
      isMuted: false,
      isPinned: false,
      isReaderMode: false,
      memoryUsageMb: 35 + Math.floor(Math.random() * 20),
    };
    setTabs((prev) => sanitizeTabs([...prev, newTabItem]));
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const tabToClose = tabs.find((t) => t.id === id);
    if (tabToClose) {
      setClosedTabs((prev) => [tabToClose, ...prev]);
    }

    if (tabs.length === 1) {
      // Don't leave zero tabs, open fresh new tab
      const fallbackId = generateUniqueTabId();
      setTabs([
        {
          id: fallbackId,
          title: 'Yeni Sekme',
          url: 'lnx://newtab',
          isLoading: false,
          canGoBack: false,
          canGoForward: false,
          isIncognito: false,
          securityStatus: 'internal',
          lastAccessed: Date.now(),
          history: ['lnx://newtab'],
          historyIndex: 0,
          zoomLevel: 100,
          isMuted: false,
          isPinned: false,
          isReaderMode: false,
          memoryUsageMb: 32,
        },
      ]);
      setActiveTabId(fallbackId);
      return;
    }

    const nextTabs = tabs.filter((t) => t.id !== id);
    setTabs(sanitizeTabs(nextTabs));
    if (activeTabId === id) {
      const closedIndex = tabs.findIndex((t) => t.id === id);
      const nextActive = nextTabs[Math.max(0, closedIndex - 1)];
      if (nextActive) setActiveTabId(nextActive.id);
    }
  };

  const handleRestoreClosedTab = () => {
    if (closedTabs.length === 0) return;
    const [lastClosed, ...rest] = closedTabs;
    const restoredTab = { ...lastClosed, id: generateUniqueTabId() };
    setTabs((prev) => sanitizeTabs([...prev, restoredTab]));
    setActiveTabId(restoredTab.id);
    setClosedTabs(rest);
  };

  const handleTogglePinTab = (id: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const handleToggleMuteTab = (id: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isMuted: !t.isMuted } : t))
    );
  };

  const handleDuplicateTab = (id: string) => {
    const target = tabs.find((t) => t.id === id);
    if (!target) return;
    handleNewTab(target.url, target.title);
  };

  const handleToggleGroupCollapse = (groupId: string) => {
    setTabGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, collapsed: !g.collapsed } : g))
    );
  };

  const handleToggleSplitView = () => {
    setIsSplitView((prev) => {
      const next = !prev;
      if (next) {
        const otherTab = tabs.find((t) => t.id !== activeTabId);
        if (otherTab) {
          setSecondaryTabId(otherTab.id);
        } else {
          const splitId = generateUniqueTabId();
          const newSplitTab: TabItem = {
            id: splitId,
            title: 'Yeni Sekme (Bölünmüş)',
            url: 'lnx://newtab',
            isLoading: false,
            canGoBack: false,
            canGoForward: false,
            isIncognito: false,
            securityStatus: 'internal',
            lastAccessed: Date.now(),
            history: ['lnx://newtab'],
            historyIndex: 0,
            zoomLevel: 100,
            isMuted: false,
            isPinned: false,
            isReaderMode: false,
            memoryUsageMb: 24,
          };
          setTabs((prevTabs) => sanitizeTabs([...prevTabs, newSplitTab]));
          setSecondaryTabId(splitId);
        }
      }
      return next;
    });
  };

  // Navigation handlers
  const handleNavigate = (url: string) => {
    let cleanUrl = url.trim();
    if (!cleanUrl) return;

    // Check if it's a search term or URL
    if (
      !cleanUrl.startsWith('http://') &&
      !cleanUrl.startsWith('https://') &&
      !cleanUrl.startsWith('lnx://') &&
      !cleanUrl.startsWith('chrome://') &&
      !cleanUrl.startsWith('about:')
    ) {
      if (cleanUrl.includes('.') && !cleanUrl.includes(' ')) {
        cleanUrl = `https://${cleanUrl}`;
      } else {
        // Search using configured engine
        if (settings.searchEngine === 'duckduckgo') {
          cleanUrl = `https://duckduckgo.com/?q=${encodeURIComponent(cleanUrl)}`;
        } else if (settings.searchEngine === 'bing') {
          cleanUrl = `https://www.bing.com/search?q=${encodeURIComponent(cleanUrl)}`;
        } else if (settings.searchEngine === 'ecosia') {
          cleanUrl = `https://www.ecosia.org/search?q=${encodeURIComponent(cleanUrl)}`;
        } else if (settings.searchEngine === 'brave') {
          cleanUrl = `https://search.brave.com/search?q=${encodeURIComponent(cleanUrl)}`;
        } else if (settings.searchEngine === 'yahoo') {
          cleanUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(cleanUrl)}`;
        } else if (settings.searchEngine === 'lnx_ai') {
          cleanUrl = `lnx://ai?query=${encodeURIComponent(cleanUrl)}`;
        } else {
          cleanUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanUrl)}`;
        }
      }
    }

    // Determine title
    let title = cleanUrl;
    if (cleanUrl === 'lnx://newtab') title = 'Yeni Sekme';
    else if (cleanUrl === 'lnx://settings') title = 'Ayarlar';
    else if (cleanUrl === 'lnx://history') title = 'Geçmiş';
    else if (cleanUrl === 'lnx://bookmarks') title = 'Yer İşaretleri';
    else if (cleanUrl === 'lnx://downloads') title = 'İndirilenler';
    else if (cleanUrl === 'lnx://extensions') title = 'Eklentiler';
    else if (cleanUrl === 'lnx://flags') title = 'Deneyler (Flags)';
    else if (cleanUrl === 'lnx://taskmanager') title = 'Görev Yöneticisi';
    else if (cleanUrl === 'lnx://welcome' || cleanUrl === 'lnx://setup') title = 'Kurulum ve Başlangıç';
    else {
      try {
        const u = new URL(cleanUrl);
        title = u.hostname.replace('www.', '');
      } catch (e) {
        title = cleanUrl;
      }
    }

    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;
        const newHist = [...t.history.slice(0, t.historyIndex + 1), cleanUrl];
        return {
          ...t,
          url: cleanUrl,
          title,
          history: newHist,
          historyIndex: newHist.length - 1,
          isLoading: false,
        };
      })
    );

    // Add to history
    setHistory((prev) => [
      {
        id: String(Date.now()),
        title,
        url: cleanUrl,
        timestamp: Date.now(),
        visitCount: 1,
      },
      ...prev,
    ]);
  };

  const handleBack = () => {
    if (activeTab.historyIndex <= 0) return;
    const nextIdx = activeTab.historyIndex - 1;
    const prevUrl = activeTab.history[nextIdx];
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, historyIndex: nextIdx, url: prevUrl } : t))
    );
  };

  const handleForward = () => {
    if (activeTab.historyIndex >= activeTab.history.length - 1) return;
    const nextIdx = activeTab.historyIndex + 1;
    const nextUrl = activeTab.history[nextIdx];
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, historyIndex: nextIdx, url: nextUrl } : t))
    );
  };

  const handleReload = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: true } : t))
    );
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
      );
    }, 400);
  };

  const handleHome = () => {
    handleNavigate(settings.homePageUrl || 'lnx://newtab');
  };

  const handleZoomIn = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, zoomLevel: Math.min(250, t.zoomLevel + 10) } : t
      )
    );
  };

  const handleZoomOut = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, zoomLevel: Math.max(50, t.zoomLevel - 10) } : t
      )
    );
  };

  const handleResetZoom = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, zoomLevel: 100 } : t))
    );
  };

  const handleToggleReaderMode = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, isReaderMode: !t.isReaderMode } : t))
    );
  };

  const handleToggleBookmark = () => {
    const isBookmarked = bookmarks.some((b) => b.url === activeTab.url);
    if (isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.url !== activeTab.url));
    } else {
      setBookmarks((prev) => [
        {
          id: String(Date.now()),
          title: activeTab.title || 'İşaretli Sayfa',
          url: activeTab.url,
          folderId: 'bar',
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          handleNewTab();
        } else if (e.key.toLowerCase() === 'w') {
          e.preventDefault();
          handleCloseTab(activeTabId, { stopPropagation: () => {} } as any);
        } else if (e.shiftKey && e.key.toLowerCase() === 't') {
          e.preventDefault();
          handleRestoreClosedTab();
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          handleReload();
        } else if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          handleNavigate('lnx://history');
        } else if (e.key.toLowerCase() === 'j') {
          e.preventDefault();
          handleNavigate('lnx://downloads');
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          handleToggleBookmark();
        } else if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          setIsFindInPageOpen((prev) => !prev);
        } else if (e.shiftKey && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          setIsTabSearchOpen((prev) => !prev);
        }
      } else if (e.key === 'F12') {
        e.preventDefault();
        setDevTools((prev) => ({ ...prev, isOpen: !prev.isOpen }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, closedTabs, bookmarks, activeTab]);

  const isBookmarked = bookmarks.some((b) => b.url === activeTab.url);
  const isDarkTheme = settings.theme !== 'light';
  const secondaryTab = isSplitView
    ? tabs.find((t) => t.id === secondaryTabId) || tabs.find((t) => t.id !== activeTabId) || null
    : null;

  return (
    <div
      id="lnx-browser-application-root"
      className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none transition-colors ${
        isDarkTheme ? 'bg-[#0A0A0A] text-[#E0E0E0]' : 'bg-[#F0F2F5] text-neutral-850'
      }`}
    >
      {/* 1. Chromium Tab Strip */}
      <TabStrip
        tabs={tabs}
        activeTabId={activeTabId}
        tabGroups={tabGroups}
        accentColor={settings.accentColor}
        memorySaver={settings.memorySaver}
        isDark={isDarkTheme}
        isSplitView={isSplitView}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={() => handleNewTab()}
        onTogglePinTab={handleTogglePinTab}
        onToggleMuteTab={handleToggleMuteTab}
        onToggleGroupCollapse={handleToggleGroupCollapse}
        onDuplicateTab={handleDuplicateTab}
        onToggleSplitView={handleToggleSplitView}
        onOpenTabSearch={() => setIsTabSearchOpen(true)}
      />

      {/* 2. Navigation Toolbar with Omnibox */}
      <NavigationToolbar
        activeTab={activeTab}
        canGoBack={activeTab.historyIndex > 0}
        canGoForward={activeTab.historyIndex < activeTab.history.length - 1}
        isLoading={activeTab.isLoading}
        isIncognito={activeTab.isIncognito}
        isDark={isDarkTheme}
        searchEngine={settings.searchEngine}
        account={userAccount}
        bookmarks={bookmarks}
        history={history}
        extensions={extensions}
        downloads={downloads}
        shieldsBlockedCount={42}
        isBookmarked={isBookmarked}
        zoomLevel={activeTab.zoomLevel}
        showHomeButton={settings.showHomeButton}
        accentColor={settings.accentColor}
        onGoBack={handleBack}
        onGoForward={handleForward}
        onReload={handleReload}
        onGoHome={handleHome}
        onNavigate={handleNavigate}
        onToggleBookmark={handleToggleBookmark}
        onToggleReaderMode={handleToggleReaderMode}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenShields={() => setIsShieldsOpen(true)}
        onToggleExtension={(id) =>
          setExtensions((prev) =>
            prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
          )
        }
        onOpenDevTools={() => setDevTools((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
        onOpenTaskManager={() => handleNavigate('lnx://taskmanager')}
        onOpenFindInPage={() => setIsFindInPageOpen(true)}
        onOpenClearData={() => setIsClearDataOpen(true)}
        onOpenWelcomeModal={() => setIsWelcomeCelebrationOpen(true)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleResetZoom}
        onNewIncognitoWindow={() => handleNewTab('lnx://newtab', 'Gizli Sekme', true)}
        onNewTab={() => handleNewTab()}
      />

      {/* 3. Bookmarks Bar (Conditional) */}
      {settings.showBookmarksBar && (
        <BookmarksBar
          bookmarks={bookmarks}
          folders={bookmarkFolders}
          onNavigate={handleNavigate}
          onAddBookmark={(title, url, folderId) =>
            setBookmarks((prev) => [
              ...prev,
              { id: String(Date.now()), title, url, folderId: folderId || 'bar', dateAdded: Date.now() },
            ])
          }
          show={settings.showBookmarksBar}
          isDark={isDarkTheme}
        />
      )}

      {/* 4. Active Content Area (WebView + Split View) */}
      <div className={`flex-1 relative flex overflow-hidden ${isDarkTheme ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'}`}>
        {/* Primary Tab Pane */}
        <div className={`${isSplitView && secondaryTab ? 'w-1/2 border-r border-neutral-700/60' : 'flex-1'} h-full relative overflow-auto ${isDarkTheme ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'}`}>
          {isSplitView && secondaryTab && (
            <div className={`h-7 px-3 flex items-center justify-between border-b text-[11px] font-medium select-none ${
              isDarkTheme ? 'bg-[#181818] border-[#2A2A2A] text-neutral-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <span className="truncate max-w-[200px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Sol Panel: {activeTab.title}</span>
              </span>
            </div>
          )}
          <WebView
            tab={activeTab}
            tabs={tabs}
            shortcuts={shortcuts}
            searchEngine={settings.searchEngine}
            settings={settings}
            account={userAccount}
            bookmarks={bookmarks}
            bookmarkFolders={bookmarkFolders}
            history={history}
            downloads={downloads}
            extensions={extensions}
            flags={flags}
            passwords={passwords}
            onNavigate={handleNavigate}
            onAddShortcut={(title, url, color) =>
              setShortcuts((prev) => [...prev, { id: String(Date.now()), title, url, color }])
            }
            onRemoveShortcut={(id) => setShortcuts((prev) => prev.filter((s) => s.id !== id))}
            onSetShortcuts={(newShortcuts) => setShortcuts(newShortcuts)}
            onSearch={(query, engine) => {
              if (engine === 'duckduckgo') {
                handleNavigate(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`);
              } else if (engine === 'bing') {
                handleNavigate(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);
              } else if (engine === 'ecosia') {
                handleNavigate(`https://www.ecosia.org/search?q=${encodeURIComponent(query)}`);
              } else if (engine === 'brave') {
                handleNavigate(`https://search.brave.com/search?q=${encodeURIComponent(query)}`);
              } else if (engine === 'yahoo') {
                handleNavigate(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}`);
              } else {
                handleNavigate(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
              }
            }}
            onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
            onUpdateAccount={handleUpdateAccount}
            onAddPassword={(site, username, password) =>
              setPasswords((prev) => [
                ...prev,
                { id: String(Date.now()), site, username, password, createdAt: Date.now() },
              ])
            }
            onDeletePassword={(id) => setPasswords((prev) => prev.filter((p) => p.id !== id))}
            onOpenClearDataModal={() => setIsClearDataOpen(true)}
            onDeleteHistoryItem={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
            onClearAllHistory={() => setHistory([])}
            onAddBookmark={(title, url, folderId) =>
              setBookmarks((prev) => [
                ...prev,
                { id: String(Date.now()), title, url, folderId: folderId || 'bar', createdAt: Date.now() },
              ])
            }
            onDeleteBookmark={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
            onAddBookmarkFolder={(name) =>
              setBookmarkFolders((prev) => [
                ...prev,
                { id: `folder-${Date.now()}`, name, icon: 'Folder' },
              ])
            }
            onToggleDownloadState={(id) =>
              setDownloads((prev) =>
                prev.map((d) =>
                  d.id === id
                    ? { ...d, state: d.state === 'in_progress' ? 'paused' : 'in_progress' }
                    : d
                )
              )
            }
            onCancelDownload={(id) =>
              setDownloads((prev) =>
                prev.map((d) => (d.id === id ? { ...d, state: 'cancelled' } : d))
              )
            }
            onClearDownloads={() => setDownloads([])}
            onToggleExtension={(id) =>
              setExtensions((prev) =>
                prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
              )
            }
            onInstallExtension={(ext) =>
              setExtensions((prev) => [...prev, { ...ext, enabled: true }])
            }
            onRemoveExtension={(id) => setExtensions((prev) => prev.filter((e) => e.id !== id))}
            onToggleFlag={(id) =>
              setFlags((prev) =>
                prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
              )
            }
            onResetAllFlags={() =>
              setFlags((prev) => prev.map((f) => ({ ...f, enabled: false })))
            }
            onCloseTab={handleCloseTab}
            onSetPageContentSnippet={setPageSnippet}
            onOpenWelcomeModal={() => setIsWelcomeCelebrationOpen(true)}
          />

          {/* Find In Page Floating Overlay */}
          <FindInPageBar
            isOpen={isFindInPageOpen}
            onClose={() => setIsFindInPageOpen(false)}
          />
        </div>

        {/* Secondary Tab Pane (Split View) */}
        {isSplitView && secondaryTab && (
          <div className={`w-1/2 h-full relative overflow-auto flex flex-col ${isDarkTheme ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'}`}>
            <div className={`h-7 px-3 flex items-center justify-between border-b text-[11px] font-medium select-none shrink-0 ${
              isDarkTheme ? 'bg-[#181818] border-[#2A2A2A] text-neutral-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="truncate max-w-[220px]">Sağ Panel: {secondaryTab.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <select
                  value={secondaryTab.id}
                  onChange={(e) => setSecondaryTabId(e.target.value)}
                  className={`px-1.5 py-0.5 rounded text-[10px] border outline-none ${
                    isDarkTheme ? 'bg-[#222] border-[#333] text-neutral-300' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  {tabs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsSplitView(false)}
                  className={`px-1.5 py-0.5 rounded text-[10px] hover:bg-red-500/20 hover:text-red-400 transition-colors ${
                    isDarkTheme ? 'text-neutral-400' : 'text-slate-500'
                  }`}
                  title="Bölünmüş Ekranı Kapat"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 relative overflow-auto">
              <WebView
                tab={secondaryTab}
                tabs={tabs}
                shortcuts={shortcuts}
                searchEngine={settings.searchEngine}
                settings={settings}
                account={userAccount}
                bookmarks={bookmarks}
                bookmarkFolders={bookmarkFolders}
                history={history}
                downloads={downloads}
                extensions={extensions}
                flags={flags}
                passwords={passwords}
                onNavigate={(url) => {
                  setTabs((prev) =>
                    prev.map((t) =>
                      t.id === secondaryTab.id
                        ? { ...t, url, history: [...t.history, url], historyIndex: t.history.length }
                        : t
                    )
                  );
                }}
                onAddShortcut={(title, url, color) =>
                  setShortcuts((prev) => [...prev, { id: String(Date.now()), title, url, color }])
                }
                onRemoveShortcut={(id) => setShortcuts((prev) => prev.filter((s) => s.id !== id))}
                onSetShortcuts={(newShortcuts) => setShortcuts(newShortcuts)}
                onSearch={(query, engine) => {
                  let sUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                  if (engine === 'duckduckgo') sUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                  else if (engine === 'bing') sUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                  else if (engine === 'ecosia') sUrl = `https://www.ecosia.org/search?q=${encodeURIComponent(query)}`;
                  else if (engine === 'brave') sUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
                  else if (engine === 'yahoo') sUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`;
                  setTabs((prev) =>
                    prev.map((t) =>
                      t.id === secondaryTab.id
                        ? { ...t, url: sUrl, history: [...t.history, sUrl], historyIndex: t.history.length }
                        : t
                    )
                  );
                }}
                onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
                onUpdateAccount={handleUpdateAccount}
                onAddPassword={(site, username, password) =>
                  setPasswords((prev) => [
                    ...prev,
                    { id: String(Date.now()), site, username, password, createdAt: Date.now() },
                  ])
                }
                onDeletePassword={(id) => setPasswords((prev) => prev.filter((p) => p.id !== id))}
                onOpenClearDataModal={() => setIsClearDataOpen(true)}
                onDeleteHistoryItem={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
                onClearAllHistory={() => setHistory([])}
                onAddBookmark={(title, url, folderId) =>
                  setBookmarks((prev) => [
                    ...prev,
                    { id: String(Date.now()), title, url, folderId: folderId || 'bar', createdAt: Date.now() },
                  ])
                }
                onDeleteBookmark={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
                onAddBookmarkFolder={(name) =>
                  setBookmarkFolders((prev) => [
                    ...prev,
                    { id: `folder-${Date.now()}`, name, icon: 'Folder' },
                  ])
                }
                onToggleDownloadState={(id) =>
                  setDownloads((prev) =>
                    prev.map((d) =>
                      d.id === id
                        ? { ...d, state: d.state === 'in_progress' ? 'paused' : 'in_progress' }
                        : d
                    )
                  )
                }
                onCancelDownload={(id) =>
                  setDownloads((prev) =>
                    prev.map((d) => (d.id === id ? { ...d, state: 'cancelled' } : d))
                  )
                }
                onClearDownloads={() => setDownloads([])}
                onToggleExtension={(id) =>
                  setExtensions((prev) =>
                    prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
                  )
                }
                onInstallExtension={(ext) =>
                  setExtensions((prev) => [...prev, { ...ext, enabled: true }])
                }
                onRemoveExtension={(id) => setExtensions((prev) => prev.filter((e) => e.id !== id))}
                onToggleFlag={(id) =>
                  setFlags((prev) =>
                    prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
                  )
                }
                onResetAllFlags={() =>
                  setFlags((prev) => prev.map((f) => ({ ...f, enabled: false })))
                }
                onCloseTab={handleCloseTab}
                onSetPageContentSnippet={setPageSnippet}
                onOpenWelcomeModal={() => setIsWelcomeCelebrationOpen(true)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. Chromium DevTools Drawer */}
      <DevToolsDrawer
        devTools={devTools}
        activeTab={activeTab}
        networkRequests={networkRequests}
        onClose={() => setDevTools((prev) => ({ ...prev, isOpen: false }))}
        onActiveTabChange={(tab) => setDevTools((prev) => ({ ...prev, activeTab: tab }))}
      />

      {/* 7. Modals & Popovers */}
      <ShieldsPopover
        isOpen={isShieldsOpen}
        blockedCount={42}
        adBlockLevel={settings.adBlockLevel}
        currentHost={activeTab.url}
        onClose={() => setIsShieldsOpen(false)}
        onChangeLevel={(lvl) => setSettings((prev) => ({ ...prev, adBlockLevel: lvl }))}
      />

      <ClearDataModal
        isOpen={isClearDataOpen}
        onClose={() => setIsClearDataOpen(false)}
        onConfirmClear={(opts) => {
          if (opts.history) setHistory([]);
          if (opts.downloads) setDownloads([]);
          if (opts.passwords) setPasswords([]);
        }}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        url={activeTab.url}
        onClose={() => setIsQrModalOpen(false)}
      />

      <TabSearchModal
        isOpen={isTabSearchOpen}
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onClose={() => setIsTabSearchOpen(false)}
      />

      {/* 8. LNX Welcome Celebration & Post-Setup Panel */}
      <WelcomeCelebrationModal
        isOpen={isWelcomeCelebrationOpen}
        onClose={() => setIsWelcomeCelebrationOpen(false)}
        account={userAccount}
        settings={settings}
        shortcuts={shortcuts}
        onNavigate={handleNavigate}
        onOpenShields={() => setIsShieldsOpen(true)}
      />

      {/* 9. Live OTA Server Update Notification Toast (Bottom Right) */}
      <UpdateNotificationToast
        isOpen={isUpdateToastOpen}
        update={serverUpdate}
        isDark={isDarkTheme}
        accentColor={settings.accentColor}
        onClose={() => setIsUpdateToastOpen(false)}
        onViewDetails={() => handleNavigate('lnx://settings')}
        onApplyUpdate={handleApplyBrowserUpdate}
      />
    </div>
  );
}
