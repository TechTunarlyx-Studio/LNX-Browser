export type BrowserTheme = 'dark' | 'light' | 'system';
export type SearchEngineType = 'google' | 'duckduckgo' | 'bing' | 'ecosia' | 'brave' | 'yahoo';
export type AdBlockLevel = 'aggressive' | 'standard' | 'off';

export interface TabItem {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  history: string[];
  historyIndex: number;
  isPinned: boolean;
  isMuted: boolean;
  isIncognito: boolean;
  groupId?: string;
  zoomLevel: number;
  isReaderMode?: boolean;
  readerTheme?: 'light' | 'sepia' | 'dark' | 'black';
  readerFontSize?: number;
  securityStatus: 'secure' | 'warning' | 'insecure' | 'internal';
  lastAccessed: number;
  memoryUsageMb: number;
}

export interface TabGroup {
  id: string;
  name: string;
  color: string;
  collapsed: boolean;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folderId?: string;
  dateAdded: number;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  parentId?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
  visitCount: number;
  favicon?: string;
}

export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  fileSize: string;
  totalBytes: number;
  loadedBytes: number;
  state: 'in_progress' | 'completed' | 'paused' | 'canceled';
  speed: string;
  startTime: number;
  fileType: string;
}

export interface ExtensionItem {
  id: string;
  name: string;
  version: string;
  description: string;
  icon: string;
  enabled: boolean;
  author: string;
  permissions: string[];
  category: string;
}

export interface ChromiumFlag {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  restartRequired: boolean;
}

export interface BrowserSettings {
  theme: BrowserTheme;
  accentColor: string;
  wallpaper?: string;
  searchEngine: SearchEngineType;
  defaultZoom: number;
  showBookmarksBar: boolean;
  showHomeButton: boolean;
  homePageUrl: string;
  memorySaver: boolean;
  shieldsEnabled: boolean;
  adBlockLevel: AdBlockLevel;
  trackingProtection: boolean;
  httpsOnly: boolean;
  doNotTrack: boolean;
  defaultDownloadDir: string;
  askDownloadLocation: boolean;
  hardwareAcceleration: boolean;
  tabHoverPreview: boolean;
  smoothScrolling: boolean;
  restoreSessionOnStartup: boolean;
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  source?: string;
}

export interface NetworkRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  status: number;
  type: 'document' | 'script' | 'stylesheet' | 'image' | 'xhr' | 'font';
  size: string;
  time: string;
  url: string;
}

export interface QuickShortcut {
  id: string;
  title: string;
  url: string;
  icon?: string;
  color?: string;
  isCustom?: boolean;
}

export interface SavedPassword {
  id: string;
  site: string;
  username: string;
  password: string;
  createdDate: string;
}

export interface DevToolsState {
  isOpen: boolean;
  activeTab: 'elements' | 'console' | 'network' | 'storage' | 'lighthouse';
  dockPosition: 'bottom' | 'right';
}

export interface LnxUserAccount {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  isLoggedIn: boolean;
  isGuest?: boolean;
  syncBookmarks: boolean;
  syncHistory: boolean;
  syncPasswords: boolean;
  syncSettings: boolean;
  syncExtensions: boolean;
  aiCloudEnabled: boolean;
  lastSyncedAt?: number;
}

export interface BrowserUpdateInfo {
  id: string;
  version: string;
  channel: 'stable' | 'beta' | 'nightly' | 'critical';
  title: string;
  releaseNotes: string;
  fixes: string[];
  severity: 'normal' | 'important' | 'critical';
  publishedAt: string;
  isBroadcastActive: boolean;
}


