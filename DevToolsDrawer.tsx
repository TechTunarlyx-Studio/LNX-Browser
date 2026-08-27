import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Activity,
  Database,
  Zap,
  X,
  Play,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';
import { ConsoleLog, DevToolsState, NetworkRequest, TabItem } from '../../types';

interface DevToolsDrawerProps {
  devTools: DevToolsState;
  activeTab: TabItem;
  networkRequests?: NetworkRequest[];
  onClose: () => void;
  onActiveTabChange: (tab: DevToolsState['activeTab']) => void;
}

export const DevToolsDrawer: React.FC<DevToolsDrawerProps> = ({
  devTools,
  activeTab,
  networkRequests = [],
  onClose,
  onActiveTabChange,
}) => {
  const [consoleInput, setConsoleInput] = useState('');
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      id: '1',
      type: 'info',
      message: `[LNX-Chromium-Kernel] DevTools 152.0 attached to target: ${activeTab.url}`,
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: '2',
      type: 'log',
      message: `Document loaded with DOMContentLoaded event (42ms)`,
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: '3',
      type: 'log',
      message: `LNX Shields: 4 trackers and 12 telemetry scripts intercepted.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  if (!devTools.isOpen) return null;

  const safeNetworkRequests = Array.isArray(networkRequests) ? networkRequests : [];

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const cmd = consoleInput.trim();
    let result = '';

    try {
      if (cmd === 'location.href') {
        result = activeTab.url;
      } else if (cmd === 'document.title') {
        result = activeTab.title;
      } else if (cmd.startsWith('navigator.')) {
        result = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 LNXBrowser/1.0';
      } else {
        // Safe evaluation of simple math / expressions
        result = String(Function(`"use strict"; return (${cmd})`)());
      }
    } catch (err: any) {
      setLogs((prev) => [
        ...prev,
        { id: String(Date.now()), type: 'error', message: `> ${cmd}\nUncaught EvalError: ${err.message}`, timestamp: new Date().toLocaleTimeString() },
      ]);
      setConsoleInput('');
      return;
    }

    setLogs((prev) => [
      ...prev,
      { id: String(Date.now()), type: 'log', message: `> ${cmd}\n< ${result}`, timestamp: new Date().toLocaleTimeString() },
    ]);
    setConsoleInput('');
  };

  return (
    <div
      id="lnx-devtools-panel"
      className="h-64 bg-[#0A0A0A] border-t border-[#262626] flex flex-col z-40 text-xs font-mono text-[#E0E0E0] select-none shadow-2xl"
    >
      {/* DevTools Tab Bar */}
      <div className="flex items-center justify-between px-2 bg-[#1A1A1A] border-b border-[#262626] h-8">
        <div className="flex items-center gap-1">
          {[
            { id: 'elements', label: 'Elements', icon: Code2 },
            { id: 'console', label: 'Console', icon: Terminal },
            { id: 'network', label: 'Network', icon: Activity },
            { id: 'storage', label: 'Storage', icon: Database },
            { id: 'lighthouse', label: 'Lighthouse', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = devTools.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onActiveTabChange(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-[#262626] text-indigo-400 font-bold border-b-2 border-indigo-500'
                    : 'text-[#888] hover:text-[#E0E0E0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#666]">LNX Chromium DevTools</span>
          <button
            onClick={onClose}
            title="DevTools'u Kapat (F12)"
            className="p-1 rounded hover:bg-[#262626] text-[#888] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DevTools Body Content */}
      <div className="flex-1 overflow-auto p-3 bg-[#0A0A0A] font-mono text-xs">
        {/* Elements Tab */}
        {devTools.activeTab === 'elements' && (
          <div className="space-y-1 text-[11px] leading-relaxed">
            <div className="text-[#666]">&lt;!DOCTYPE html&gt;</div>
            <div className="text-purple-400">&lt;html lang="tr" class="dark"&gt;</div>
            <div className="pl-4 text-purple-400">&lt;head&gt;</div>
            <div className="pl-8 text-[#888]">&lt;meta charset="UTF-8" /&gt;</div>
            <div className="pl-8 text-[#888]">&lt;title&gt;<span className="text-emerald-400">{activeTab.title}</span>&lt;/title&gt;</div>
            <div className="pl-4 text-purple-400">&lt;/head&gt;</div>
            <div className="pl-4 text-purple-400">&lt;body class="bg-[#0A0A0A] text-[#E0E0E0] font-sans"&gt;</div>
            <div className="pl-8 text-[#CCC]">
              &lt;div id="root" class="min-h-screen flex flex-col"&gt;
              <span className="text-[#666] ml-2">... ({activeTab.url})</span>
            </div>
            <div className="pl-4 text-purple-400">&lt;/body&gt;</div>
            <div className="text-purple-400">&lt;/html&gt;</div>
          </div>
        )}

        {/* Console Tab */}
        {devTools.activeTab === 'console' && (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-1 overflow-y-auto max-h-40">
              {logs.map((l) => (
                <div
                  key={l.id}
                  className={`p-1 rounded flex items-start gap-2 ${
                    l.type === 'error'
                      ? 'bg-red-950/40 text-red-400 border-l-2 border-red-500'
                      : l.type === 'info'
                      ? 'text-indigo-400'
                      : 'text-[#CCC]'
                  }`}
                >
                  <span className="text-[10px] text-[#666] select-none">[{l.timestamp}]</span>
                  <span className="whitespace-pre-wrap">{l.message}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleConsoleSubmit} className="flex items-center gap-2 pt-2 border-t border-[#262626]">
              <span className="text-indigo-400 font-bold">&gt;</span>
              <input
                type="text"
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                placeholder="JavaScript kodu çalıştırın (örn: location.href, 2+2, document.title)..."
                className="flex-1 bg-transparent text-[#E0E0E0] outline-none text-xs"
              />
              <button
                type="button"
                onClick={() => setLogs([])}
                title="Konsolu Temizle"
                className="p-1 text-[#666] hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Network Tab */}
        {devTools.activeTab === 'network' && (
          <div className="space-y-2">
            <div className="grid grid-cols-12 font-bold text-[#888] border-b border-[#262626] pb-1 text-[11px]">
              <div className="col-span-4">Adı / URL</div>
              <div className="col-span-2">Durum</div>
              <div className="col-span-2">Tür</div>
              <div className="col-span-2">Boyut</div>
              <div className="col-span-2">Süre</div>
            </div>

            <div className="space-y-1">
              {safeNetworkRequests.map((req) => (
                <div key={req.id} className="grid grid-cols-12 text-[11px] text-[#CCC] py-0.5 hover:bg-[#1A1A1A]">
                  <div className="col-span-4 truncate text-indigo-400">{req.name}</div>
                  <div className="col-span-2 text-emerald-400 font-bold">{req.status} OK</div>
                  <div className="col-span-2 text-[#888]">{req.type}</div>
                  <div className="col-span-2 text-[#888]">{req.size}</div>
                  <div className="col-span-2 text-[#888]">{req.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storage Tab */}
        {devTools.activeTab === 'storage' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <h4 className="font-bold text-white mb-2 text-xs">LocalStorage Verileri</h4>
              <div className="space-y-1 text-[11px]">
                <div className="text-[#888]">lnx_browser_theme: "dark"</div>
                <div className="text-[#888]">lnx_shields_active: true</div>
                <div className="text-[#888]">lnx_session_id: "lnx_9492a912"</div>
              </div>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <h4 className="font-bold text-white mb-2 text-xs">Aktif Çerezler (Cookies)</h4>
              <div className="space-y-1 text-[11px]">
                <div className="text-[#888]">__Secure-LNX-ID: [HttpOnly, SameSite=Strict]</div>
                <div className="text-[#888]">locale: "tr-TR"</div>
              </div>
            </div>
          </div>
        )}

        {/* Lighthouse Audit Tab */}
        {devTools.activeTab === 'lighthouse' && (
          <div className="flex items-center justify-around py-4">
            {[
              { label: 'Performans', score: 98, color: 'text-emerald-400' },
              { label: 'Erişilebilirlik', score: 100, color: 'text-emerald-400' },
              { label: 'En İyi Uygulamalar', score: 96, color: 'text-emerald-400' },
              { label: 'SEO', score: 100, color: 'text-emerald-400' },
            ].map((metric) => (
              <div key={metric.label} className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full border-4 border-emerald-500/40 flex items-center justify-center font-bold text-lg ${metric.color}`}>
                  {metric.score}
                </div>
                <span className="text-xs font-semibold mt-2 text-[#CCC]">{metric.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
