import React, { useState } from 'react';
import {
  Plus,
  X,
  Volume2,
  VolumeX,
  Pin,
  Lock,
  Search,
  Columns2,
  Shield,
  Layers,
  ChevronDown,
  Cpu,
  Globe,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  Download as DownloadIcon,
  Puzzle as PuzzleIcon,
} from 'lucide-react';
import { TabGroup, TabItem } from '../../types';

interface TabStripProps {
  tabs?: TabItem[];
  activeTabId: string;
  tabGroups?: TabGroup[];
  isIncognito?: boolean;
  isDark?: boolean;
  accentColor?: string;
  memorySaver?: boolean;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onNewTab: () => void;
  onTogglePin?: (id: string, e?: React.MouseEvent) => void;
  onTogglePinTab?: (id: string) => void;
  onToggleMute?: (id: string, e?: React.MouseEvent) => void;
  onToggleMuteTab?: (id: string) => void;
  onToggleGroupCollapse?: (groupId: string) => void;
  onOpenTabSearch?: () => void;
  onDuplicateTab?: (id: string) => void;
  isSplitView?: boolean;
  onToggleSplitView?: () => void;
}

export const TabStrip: React.FC<TabStripProps> = ({
  tabs = [],
  activeTabId,
  tabGroups = [],
  isIncognito = false,
  isDark = true,
  accentColor = '#3b82f6',
  memorySaver = true,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onTogglePin,
  onTogglePinTab,
  onToggleMute,
  onToggleMuteTab,
  onToggleGroupCollapse = (_groupId: string) => {},
  onOpenTabSearch = () => {},
  onDuplicateTab = (_id: string) => {},
  isSplitView = false,
  onToggleSplitView = () => {},
}) => {
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);

  const handleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleMute) onToggleMute(id, e);
    else if (onToggleMuteTab) onToggleMuteTab(id);
  };

  const handlePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePin) onTogglePin(id, e);
    else if (onTogglePinTab) onTogglePinTab(id);
  };

  const safeTabs = Array.isArray(tabs) ? tabs : [];
  const safeGroups = Array.isArray(tabGroups) ? tabGroups : [];

  // Existing group IDs set for fast validation
  const existingGroupIds = new Set(safeGroups.map((g) => g.id));

  // Group tabs by groups if any
  const pinnedTabs = safeTabs.filter((t) => t?.isPinned);
  const unpinnedTabs = safeTabs.filter((t) => !t?.isPinned);

  const effectiveIsDark = isIncognito || isDark;

  return (
    <div
      id="lnx-tab-strip"
      className={`flex items-center px-3 pt-2 select-none overflow-x-auto no-scrollbar relative border-b transition-colors ${
        effectiveIsDark
          ? 'bg-[#141414] border-[#262626] text-[#E0E0E0]'
          : 'bg-[#E3E7EB] border-[#CFD6DD] text-neutral-800'
      }`}
      style={{ minHeight: '44px' }}
    >
      {/* Incognito Indicator if active */}
      {isIncognito && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 mr-2 rounded-md bg-[#262626] text-purple-300 border border-purple-500/40 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>Gizli Pencere</span>
        </div>
      )}

      {/* Pinned Tabs */}
      {pinnedTabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            id={`tab-pinned-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            title={tab.title}
            className={`relative flex items-center justify-center w-9 h-8 mr-1 rounded-t-lg transition-all text-xs border-t border-x ${
              isActive
                ? effectiveIsDark
                  ? 'bg-[#1A1A1A] text-[#E0E0E0] font-medium shadow-sm border-[#333]'
                  : 'bg-white text-neutral-900 font-medium shadow-sm border-[#CFD6DD]'
                : effectiveIsDark
                ? 'bg-[#121212]/80 hover:bg-[#1A1A1A] text-[#888] hover:text-[#E0E0E0] border-transparent'
                : 'bg-transparent hover:bg-[#D5DBE0] text-neutral-600 hover:text-neutral-900 border-transparent'
            }`}
          >
            {tab.isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Pin className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </button>
        );
      })}

      {/* Tab Groups and Unpinned Tabs */}
      <div className="flex items-center flex-1 min-w-0">
        {safeGroups.map((group) => {
          const groupTabs = unpinnedTabs.filter((t) => t?.groupId === group.id);
          if (groupTabs.length === 0) return null;

          return (
            <div key={group.id} className="flex items-center mr-1">
              <button
                onClick={() => onToggleGroupCollapse(group.id)}
                className="flex items-center gap-1 px-2.5 py-1 mr-1 rounded-md text-xs font-medium transition-all shadow-sm"
                style={{
                  backgroundColor: `${group.color}20`,
                  color: group.color,
                  border: `1px solid ${group.color}40`,
                }}
                title={`Tab Grubu: ${group.name}`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="truncate max-w-[90px]">{group.name}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    group.collapsed ? '-rotate-90' : ''
                  }`}
                />
              </button>

              {!group.collapsed &&
                groupTabs.map((tab) => renderTab(tab))}
            </div>
          );
        })}

        {/* Tabs without group or whose group no longer exists */}
        {unpinnedTabs
          .filter((t) => !t?.groupId || !existingGroupIds.has(t.groupId))
          .map((tab) => renderTab(tab))}

        {/* New Tab Button */}
        <button
          id="btn-new-tab"
          onClick={onNewTab}
          title="Yeni Sekme (Ctrl+T)"
          className={`flex items-center justify-center w-7 h-7 ml-1 rounded-lg border transition-all ${
            effectiveIsDark
              ? 'text-[#888] hover:text-[#E0E0E0] hover:bg-[#1A1A1A] border-transparent hover:border-[#262626]'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#D5DBE0] border-transparent'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Right Controls in Tab Bar: Tab Search, Split View */}
      <div className="flex items-center gap-1 pl-2 ml-auto">
        <button
          id="btn-split-view"
          onClick={onToggleSplitView}
          title={isSplitView ? 'Tekli Görünüme Geç' : 'Bölünmüş Ekran (2 Sekme Yan Yana)'}
          className={`p-1.5 rounded-lg text-xs transition-all border ${
            isSplitView
              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
              : effectiveIsDark
              ? 'text-[#888] hover:text-[#E0E0E0] hover:bg-[#1A1A1A] border-transparent hover:border-[#262626]'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#D5DBE0] border-transparent'
          }`}
        >
          <Columns2 className="w-3.5 h-3.5" />
        </button>

        <button
          id="btn-search-tabs"
          onClick={onOpenTabSearch}
          title="Sekmelerde Ara (Ctrl+Shift+A)"
          className={`p-1.5 rounded-lg border transition-all text-xs ${
            effectiveIsDark
              ? 'text-[#888] hover:text-[#E0E0E0] hover:bg-[#1A1A1A] border-transparent hover:border-[#262626]'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#D5DBE0] border-transparent'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  function renderTab(tab: TabItem) {
    const isActive = tab.id === activeTabId;
    return (
      <div
        key={tab.id}
        id={`tab-${tab.id}`}
        onMouseEnter={() => setHoveredTabId(tab.id)}
        onMouseLeave={() => setHoveredTabId(null)}
        onClick={() => onSelectTab(tab.id)}
        style={{
          borderTopColor: isActive ? accentColor : undefined,
          borderTopWidth: isActive ? '2px' : undefined,
        }}
        className={`group relative flex items-center h-8 min-w-[120px] max-w-[220px] flex-1 px-3 mr-1 rounded-t-lg cursor-pointer transition-all border-t border-x text-xs ${
          isActive
            ? effectiveIsDark
              ? 'bg-[#1A1A1A] text-[#E0E0E0] font-medium border-x-[#333] shadow-sm z-10'
              : 'bg-white text-neutral-900 font-medium border-x-[#CFD6DD] shadow-sm z-10'
            : effectiveIsDark
            ? 'bg-[#121212]/80 text-[#888] hover:text-[#E0E0E0] hover:bg-[#1A1A1A]/90 border-transparent hover:border-[#262626]'
            : 'bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-[#D5DBE0] border-transparent'
        }`}
      >
        {/* Favicon or Loading spinner */}
        <div className="flex-shrink-0 mr-2 flex items-center justify-center">
          {tab.isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          ) : tab.url.startsWith('lnx://') ? (
            tab.url === 'lnx://settings' ? (
              <SettingsIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            ) : tab.url === 'lnx://history' ? (
              <HistoryIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            ) : tab.url === 'lnx://bookmarks' ? (
              <BookmarkIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            ) : tab.url === 'lnx://downloads' ? (
              <DownloadIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            ) : tab.url === 'lnx://extensions' ? (
              <PuzzleIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            )
          ) : (
            <img
              src={`https://www.google.com/s2/favicons?domain=${
                tab.url.startsWith('http') ? new URL(tab.url).hostname : 'google.com'
              }&sz=32`}
              alt=""
              referrerPolicy="no-referrer"
              className="w-3.5 h-3.5 rounded-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Title */}
        <span className="truncate flex-1 font-medium">{tab.title || 'Yeni Sekme'}</span>

        {/* Audio Mute Icon if playing */}
        {tab.isMuted ? (
          <button
            onClick={(e) => handleMute(tab.id, e)}
            title="Sesi Aç"
            className={`p-0.5 ml-1 ${
              effectiveIsDark ? 'text-[#888] hover:text-[#E0E0E0]' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <VolumeX className="w-3 h-3" />
          </button>
        ) : (
          hoveredTabId === tab.id && (
            <button
              onClick={(e) => handleMute(tab.id, e)}
              title="Sekmeyi Sessize Al"
              className={`p-0.5 ml-1 opacity-0 group-hover:opacity-100 ${
                effectiveIsDark ? 'text-[#888] hover:text-[#E0E0E0]' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Volume2 className="w-3 h-3" />
            </button>
          )
        )}

        {/* Close Button */}
        <button
          onClick={(e) => onCloseTab(tab.id, e)}
          title="Sekmeyi Kapat (Ctrl+W)"
          className={`p-0.5 ml-1.5 rounded-md transition-opacity ${
            effectiveIsDark
              ? 'hover:bg-[#262626] text-[#888] hover:text-[#E0E0E0]'
              : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800'
          } ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }
};
