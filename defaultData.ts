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
  TabGroup,
  TabItem,
} from '../types';

export const INITIAL_ACCOUNT: LnxUserAccount = {
  id: 'acc-1',
  name: 'LNX Kullanıcısı',
  email: 'kullanici@lnx.browser',
  avatarColor: '#3b82f6',
  isLoggedIn: false,
  isGuest: false,
  syncBookmarks: true,
  syncHistory: true,
  syncPasswords: true,
  syncSettings: true,
  syncExtensions: true,
  aiCloudEnabled: true,
  lastSyncedAt: Date.now(),
};


export const INITIAL_SETTINGS: BrowserSettings = {
  theme: 'dark',
  accentColor: '#10b981',
  wallpaper: 'nature',
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
};

export const INITIAL_SHORTCUTS: QuickShortcut[] = [
  { id: 'sc-google', title: 'Google', url: 'https://www.google.com', color: '#4285F4' },
  { id: 'sc-youtube', title: 'YouTube', url: 'https://www.youtube.com', color: '#FF0000' },
  { id: 'sc-github', title: 'GitHub', url: 'https://github.com', color: '#24292e' },
];

export const INITIAL_BOOKMARK_FOLDERS: BookmarkFolder[] = [
  { id: 'bar', name: 'Bookmarks Bar' },
];

export const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'b-settings',
    title: 'LNX Settings',
    url: 'lnx://settings',
    folderId: 'bar',
    dateAdded: Date.now(),
  },
  {
    id: 'b-google',
    title: 'Google',
    url: 'https://www.google.com',
    folderId: 'bar',
    dateAdded: Date.now(),
  },
  {
    id: 'b-youtube',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    folderId: 'bar',
    dateAdded: Date.now(),
  },
  {
    id: 'b-github',
    title: 'GitHub',
    url: 'https://github.com',
    folderId: 'bar',
    dateAdded: Date.now(),
  },
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'h1',
    title: 'LNX Browser - The Next Gen Chromium Engine',
    url: 'lnx://newtab',
    timestamp: Date.now() - 1000 * 60 * 10,
    visitCount: 14,
  },
  {
    id: 'h2',
    title: 'GitHub: Let’s build from here',
    url: 'https://github.com',
    timestamp: Date.now() - 1000 * 60 * 45,
    visitCount: 6,
  },
  {
    id: 'h4',
    title: 'DuckDuckGo — Privacy, simplified.',
    url: 'https://duckduckgo.com',
    timestamp: Date.now() - 1000 * 60 * 300,
    visitCount: 4,
  },
  {
    id: 'h5',
    title: 'Wikipedia, the free encyclopedia',
    url: 'https://en.wikipedia.org/wiki/Chromium_(web_browser)',
    timestamp: Date.now() - 1000 * 60 * 600,
    visitCount: 3,
  },
];

export const INITIAL_EXTENSIONS: ExtensionItem[] = [
  {
    id: 'lnx-shields',
    name: 'LNX Shields Pro',
    version: '2.4.1',
    description: 'Advanced adblocker, tracking script prevention, and HTTPS upgrade engine.',
    icon: 'ShieldCheck',
    enabled: true,
    author: 'LNX Security Team',
    permissions: ['webRequest', 'webRequestBlocking', 'storage'],
    category: 'Privacy & Security',
  },
  {
    id: 'dark-reader',
    name: 'Dark Reader',
    version: '4.9.82',
    description: 'Inverts brightness and provides eye-pleasing dark themes for every web page.',
    icon: 'Moon',
    enabled: true,
    author: 'Alexander Shutau',
    permissions: ['activeTab', 'storage'],
    category: 'Accessibility',
  },
  {
    id: 'password-vault',
    name: 'LNX Password Vault',
    version: '3.1.0',
    description: 'Secure zero-knowledge credential generator and one-click autofill.',
    icon: 'KeyRound',
    enabled: true,
    author: 'LNX Vault Systems',
    permissions: ['storage', 'autofill'],
    category: 'Privacy & Security',
  },
  {
    id: 'json-viewer',
    name: 'JSON Formatter & Tree Viewer',
    version: '1.0.5',
    description: 'Beautifies raw JSON responses with syntax highlighting and folding.',
    icon: 'Code2',
    enabled: true,
    author: 'DevTools Lab',
    permissions: ['activeTab'],
    category: 'Developer Tools',
  },
];

export const INITIAL_FLAGS: ChromiumFlag[] = [
  {
    id: 'parallel-downloading',
    name: 'Parallel downloading',
    description: 'Accelerates download speeds by breaking files into multiple concurrent streams.',
    category: 'Performance',
    enabled: true,
    restartRequired: false,
  },
  {
    id: 'memory-saver-mode',
    name: 'High-Efficiency Memory Saver Mode',
    description: 'Discards background tabs to free up RAM for active tasks and gaming.',
    category: 'Performance',
    enabled: true,
    restartRequired: false,
  },
  {
    id: 'smooth-scrolling',
    name: 'Smooth Scrolling 2.0',
    description: 'Animate smoothly when scrolling page content using physics-based deceleration.',
    category: 'Graphics',
    enabled: true,
    restartRequired: false,
  },
  {
    id: 'ai-tab-grouping',
    name: 'AI Smart Tab Auto-Organizer',
    description: 'Automatically clusters similar tabs into categorized colored groups.',
    category: 'AI & Productivity',
    enabled: true,
    restartRequired: false,
  },
  {
    id: 'gpu-rasterization',
    name: 'GPU rasterization',
    description: 'Offload 2D canvas and web layout rendering directly to hardware GPU.',
    category: 'Graphics',
    enabled: true,
    restartRequired: true,
  },
  {
    id: 'heavy-ad-intervention',
    name: 'Heavy Ad Intervention',
    description: 'Unloads ads that consume excessive CPU and network bandwidth.',
    category: 'Privacy',
    enabled: true,
    restartRequired: false,
  },
  {
    id: 'webrtc-leak-protection',
    name: 'WebRTC IP Handling Policy',
    description: 'Prevents internal IP address leaks through WebRTC peer connections.',
    category: 'Privacy',
    enabled: true,
    restartRequired: false,
  },
];

export const INITIAL_PASSWORDS: SavedPassword[] = [
  {
    id: 'p1',
    site: 'github.com',
    username: 'lnx_developer',
    password: '●●●●●●●●●●●●',
    createdDate: '2026-07-15',
  },
  {
    id: 'p2',
    site: 'google.com',
    username: 'tunarlyx57@gmail.com',
    password: '●●●●●●●●●●●●',
    createdDate: '2026-08-01',
  },
  {
    id: 'p3',
    site: 'discord.com',
    username: 'lnx_user_vip',
    password: '●●●●●●●●●●●●',
    createdDate: '2026-08-10',
  },
];

export const INITIAL_TAB_GROUPS: TabGroup[] = [];

export const INITIAL_TABS: TabItem[] = [
  {
    id: 'tab-1',
    url: 'lnx://welcome',
    title: 'LNX Kurulum ve Başlangıç',
    isLoading: false,
    canGoBack: false,
    canGoForward: false,
    history: ['lnx://welcome'],
    historyIndex: 0,
    isPinned: false,
    isMuted: false,
    isIncognito: false,
    zoomLevel: 100,
    securityStatus: 'internal',
    lastAccessed: Date.now(),
    memoryUsageMb: 24.5,
  },
];

export const INITIAL_DOWNLOADS: DownloadItem[] = [];

export const DEFAULT_SETTINGS = INITIAL_SETTINGS;
export const DEFAULT_SHORTCUTS = INITIAL_SHORTCUTS;
export const DEFAULT_BOOKMARK_FOLDERS = INITIAL_BOOKMARK_FOLDERS;
export const DEFAULT_BOOKMARKS = INITIAL_BOOKMARKS;
export const DEFAULT_HISTORY = INITIAL_HISTORY;
export const DEFAULT_EXTENSIONS = INITIAL_EXTENSIONS;
export const DEFAULT_FLAGS = INITIAL_FLAGS;
export const DEFAULT_PASSWORDS = INITIAL_PASSWORDS;
export const DEFAULT_TAB_GROUPS = INITIAL_TAB_GROUPS;
export const DEFAULT_TABS = INITIAL_TABS;
export const DEFAULT_DOWNLOADS = INITIAL_DOWNLOADS;
export const DEFAULT_ACCOUNT = INITIAL_ACCOUNT;

