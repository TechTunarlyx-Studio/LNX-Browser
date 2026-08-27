import React, { useState } from 'react';
import { Activity, X, RefreshCw, Cpu, HardDrive, Shield, Layers, Globe } from 'lucide-react';
import { TabItem } from '../../types';

interface TaskManagerPageProps {
  tabs?: TabItem[];
  onCloseTab: (id: string, e: React.MouseEvent) => void;
}

export const TaskManagerPage: React.FC<TaskManagerPageProps> = ({
  tabs = [],
  onCloseTab,
}) => {
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  const safeTabs = Array.isArray(tabs) ? tabs : [];

  // System processes mock data
  const processes = [
    {
      id: 'proc-browser',
      name: 'Tarayıcı Çekirdeği (LNX Kernel)',
      type: 'browser',
      cpu: '0.8%',
      memory: '128.4 MB',
      pid: '18492',
    },
    {
      id: 'proc-gpu',
      name: 'GPU İşlemi (Hardware Rasterizer)',
      type: 'gpu',
      cpu: '2.1%',
      memory: '84.0 MB',
      pid: '18504',
    },
    {
      id: 'proc-shields',
      name: 'Uzantı: LNX Shields Pro AdBlock',
      type: 'extension',
      cpu: '0.1%',
      memory: '24.6 MB',
      pid: '18520',
    },
    {
      id: 'proc-ai',
      name: 'Uzantı: LNX AI Copilot Assistant',
      type: 'extension',
      cpu: '0.4%',
      memory: '42.1 MB',
      pid: '18544',
    },
    ...safeTabs.map((t, idx) => ({
      id: t?.id || `tab-proc-${idx}`,
      name: `Sekme: ${t?.title || 'Yeni Sekme'}`,
      type: 'tab',
      cpu: `${(Math.sin(idx + 1) * 1.5 + 1.8).toFixed(1)}%`,
      memory: `${(t?.memoryUsageMb || 45.2).toFixed(1)} MB`,
      pid: `${18600 + idx}`,
    })),
  ];

  const handleEndProcess = () => {
    if (!selectedProcessId) return;
    const isTab = safeTabs.some((t) => t?.id === selectedProcessId);
    if (isTab) {
      onCloseTab(selectedProcessId, { stopPropagation: () => {} } as any);
    }
    setSelectedProcessId(null);
  };

  return (
    <div id="lnx-task-manager-page" className="min-h-full bg-neutral-950 text-neutral-200 p-8 text-xs">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Görev Yöneticisi - LNX Browser</h1>
              <p className="text-neutral-400 text-[11px]">
                Çalışan sekmelerin, uzantıların ve arka plan işlemlerinin kaynak kullanımı
              </p>
            </div>
          </div>

          <button
            onClick={handleEndProcess}
            disabled={!selectedProcessId}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              selectedProcessId
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            İşlemi Sonlandır
          </button>
        </div>

        {/* Processes Table */}
        <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden">
          <div className="grid grid-cols-12 bg-neutral-900 px-4 py-2.5 font-semibold text-neutral-400 border-b border-neutral-800 text-[11px]">
            <div className="col-span-6">Görev / İşlem Adı</div>
            <div className="col-span-2 text-right">Bellek Ayak İzi</div>
            <div className="col-span-2 text-right">CPU</div>
            <div className="col-span-2 text-right">İşlem Kimliği (PID)</div>
          </div>

          <div className="divide-y divide-neutral-800/60 max-h-[480px] overflow-y-auto">
            {processes.map((proc) => {
              const isSelected = selectedProcessId === proc.id;

              return (
                <div
                  key={proc.id}
                  onClick={() => setSelectedProcessId(proc.id)}
                  className={`grid grid-cols-12 px-4 py-2.5 items-center cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600/30 text-white'
                      : 'hover:bg-neutral-800/50 text-neutral-300'
                  }`}
                >
                  <div className="col-span-6 flex items-center gap-2.5 truncate font-medium">
                    {proc.type === 'browser' && <Activity className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                    {proc.type === 'gpu' && <Cpu className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {proc.type === 'extension' && <Layers className="w-4 h-4 text-purple-400 flex-shrink-0" />}
                    {proc.type === 'tab' && <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                    <span className="truncate">{proc.name}</span>
                  </div>

                  <div className="col-span-2 text-right font-mono text-neutral-200">{proc.memory}</div>
                  <div className="col-span-2 text-right font-mono text-neutral-200">{proc.cpu}</div>
                  <div className="col-span-2 text-right font-mono text-neutral-500">{proc.pid}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
