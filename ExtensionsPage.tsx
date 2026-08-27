import React, { useState } from 'react';
import {
  Layers,
  Shield,
  Moon,
  Sparkles,
  KeyRound,
  Code2,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  Download,
  Search,
} from 'lucide-react';
import { ExtensionItem } from '../../types';

interface ExtensionsPageProps {
  extensions?: ExtensionItem[];
  onToggleExtension: (id: string) => void;
  onInstallExtension: (ext: ExtensionItem) => void;
  onRemoveExtension: (id: string) => void;
}

const WEB_STORE_CATALOGUE: ExtensionItem[] = [
  {
    id: 'ublock-origin',
    name: 'uBlock Origin Lite',
    version: '1.2.4',
    description: 'Verimli ve düşük bellek tüketimli içerik ve reklam engelleyici.',
    icon: 'Shield',
    enabled: false,
    author: 'Raymond Hill',
    permissions: ['webRequest', 'declarativeNetRequest'],
    category: 'Privacy & Security',
  },
  {
    id: 'translate-pro',
    name: 'LNX Page Translator',
    version: '2.1.0',
    description: 'Web sayfalarını ve seçili metinleri 100+ dile anında çevirir.',
    icon: 'Sparkles',
    enabled: false,
    author: 'LNX Team',
    permissions: ['activeTab', 'translate'],
    category: 'Productivity',
  },
  {
    id: 'colorzilla',
    name: 'ColorZilla Eyedropper',
    version: '3.3.0',
    description: 'Herhangi bir web sayfasından renk seçici ve palet analizörü.',
    icon: 'Code2',
    enabled: false,
    author: 'Alex Sirota',
    permissions: ['activeTab'],
    category: 'Developer Tools',
  },
  {
    id: 'react-devtools',
    name: 'React Developer Tools',
    version: '5.2.0',
    description: 'React bileşen hiyerarşisi ve state profil çıkarma aracı.',
    icon: 'Code2',
    enabled: false,
    author: 'Meta Open Source',
    permissions: ['activeTab', 'debugger'],
    category: 'Developer Tools',
  },
];

export const ExtensionsPage: React.FC<ExtensionsPageProps> = ({
  extensions = [],
  onToggleExtension,
  onInstallExtension,
  onRemoveExtension,
}) => {
  const [activeTab, setActiveTab] = useState<'installed' | 'store'>('installed');
  const [search, setSearch] = useState('');

  const safeExtensions = Array.isArray(extensions) ? extensions : [];
  const installedIds = new Set(safeExtensions.map((e) => e?.id));

  const filteredInstalled = safeExtensions.filter(
    (e) =>
      (e?.name || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (e?.description || '').toLowerCase().includes((search || '').toLowerCase())
  );

  const filteredStore = (WEB_STORE_CATALOGUE || []).filter(
    (e) =>
      (e?.name || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (e?.description || '').toLowerCase().includes((search || '').toLowerCase())
  );

  return (
    <div id="lnx-extensions-page" className="min-h-full bg-neutral-950 text-neutral-200 p-8 text-xs">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Eklentiler (Extensions)</h1>
              <p className="text-neutral-400 text-[11px]">
                Chromium Manifest V3 uyumlu tarayıcı eklentileri ve mağaza
              </p>
            </div>
          </div>

          <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('installed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'installed'
                  ? 'bg-purple-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Yüklü Eklentiler ({extensions.length})
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'store'
                  ? 'bg-purple-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              LNX Web Mağazası
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Eklentilerde ara..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 outline-none focus:border-purple-500 text-xs"
          />
        </div>

        {/* Installed Extensions List */}
        {activeTab === 'installed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInstalled.map((ext) => (
              <div
                key={ext.id}
                className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{ext.name}</div>
                      <div className="text-[10px] text-neutral-400">
                        v{ext.version} • {ext.author}
                      </div>
                    </div>
                  </div>

                  {/* Toggle switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ext.enabled}
                      onChange={() => onToggleExtension(ext.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                  </label>
                </div>

                <p className="text-neutral-400 text-[11px] leading-relaxed">{ext.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">
                    {ext.category}
                  </span>

                  <button
                    onClick={() => onRemoveExtension(ext.id)}
                    className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kaldır</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Web Store Catalogue */}
        {activeTab === 'store' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-neutral-900/60 to-blue-950/40 border border-purple-800/40 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">LNX Eklenti ve Uzantı Mağazası</h3>
                <p className="text-[11px] text-neutral-400">
                  Chromium Web Store ve LNX ekosisteminden doğrulanmış uzantılar
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStore.map((ext) => {
                const isInstalled = installedIds.has(ext.id);

                return (
                  <div
                    key={ext.id}
                    className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{ext.name}</div>
                          <div className="text-[10px] text-neutral-400">
                            v{ext.version} • {ext.author}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-neutral-400 text-[11px] leading-relaxed">{ext.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                      <span className="text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">
                        {ext.category}
                      </span>

                      {isInstalled ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Yüklendi</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onInstallExtension(ext)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium shadow transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>LNX'e Ekle</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
