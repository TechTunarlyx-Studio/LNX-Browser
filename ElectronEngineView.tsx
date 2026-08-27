import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ElectronEngineViewProps {
  tabId: string;
  url: string;
  zoomLevel: number;
  shieldsEnabled?: boolean;
  onTitleChange?: (title: string) => void;
  onFaviconChange?: (favicon: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  onNavigate?: (url: string) => void;
  onNavStateChange?: (canGoBack: boolean, canGoForward: boolean) => void;
  onPageTextExtracted?: (text: string) => void;
}

/**
 * Renders live web content using Electron's native <webview> tag — a real,
 * independent Chromium renderer process — instead of the server-side
 * fetch-and-inline-HTML proxy used for the plain-browser (non-Electron)
 * build. This is the actual "engine": full JS execution, real cookies,
 * real network stack, no CSP/frame-ancestors stripping required because
 * the page is genuinely navigated to, not embedded via srcDoc.
 */
export const ElectronEngineView: React.FC<ElectronEngineViewProps> = ({
  tabId,
  url,
  zoomLevel,
  shieldsEnabled = true,
  onTitleChange,
  onFaviconChange,
  onLoadingChange,
  onNavigate,
  onNavStateChange,
  onPageTextExtracted,
}) => {
  const webviewRef = useRef<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv) return;

    const handleDidStartLoading = () => {
      setLoadError(null);
      onLoadingChange?.(true);
    };
    const handleDidStopLoading = () => {
      onLoadingChange?.(false);
      onNavStateChange?.(wv.canGoBack?.() ?? false, wv.canGoForward?.() ?? false);
      // Best-effort text extraction for the AI Copilot's page context.
      wv.executeJavaScript('document.body ? document.body.innerText.slice(0, 4000) : ""')
        .then((text: string) => {
          if (text) onPageTextExtracted?.(text);
        })
        .catch(() => {});
    };
    const handlePageTitleUpdated = (e: any) => onTitleChange?.(e.title);
    const handlePageFaviconUpdated = (e: any) => {
      if (e.favicons && e.favicons.length > 0) onFaviconChange?.(e.favicons[0]);
    };
    const handleDidNavigate = (e: any) => onNavigate?.(e.url);
    const handleDidNavigateInPage = (e: any) => onNavigate?.(e.url);
    const handleDidFailLoad = (e: any) => {
      // -3 is "aborted", usually from a redirect chain / user navigating
      // away mid-load — not a real error, so don't surface it.
      if (e.errorCode === -3) return;
      setLoadError(e.errorDescription || 'Sayfa yüklenemedi.');
      onLoadingChange?.(false);
    };
    const handleNewWindow = (e: any) => {
      // Open target="_blank" links as a navigation within the same
      // webview rather than spawning an unmanaged native window.
      if (e.url) wv.loadURL?.(e.url);
    };

    wv.addEventListener('did-start-loading', handleDidStartLoading);
    wv.addEventListener('did-stop-loading', handleDidStopLoading);
    wv.addEventListener('page-title-updated', handlePageTitleUpdated);
    wv.addEventListener('page-favicon-updated', handlePageFaviconUpdated);
    wv.addEventListener('did-navigate', handleDidNavigate);
    wv.addEventListener('did-navigate-in-page', handleDidNavigateInPage);
    wv.addEventListener('did-fail-load', handleDidFailLoad);
    wv.addEventListener('new-window', handleNewWindow);

    return () => {
      wv.removeEventListener('did-start-loading', handleDidStartLoading);
      wv.removeEventListener('did-stop-loading', handleDidStopLoading);
      wv.removeEventListener('page-title-updated', handlePageTitleUpdated);
      wv.removeEventListener('page-favicon-updated', handlePageFaviconUpdated);
      wv.removeEventListener('did-navigate', handleDidNavigate);
      wv.removeEventListener('did-navigate-in-page', handleDidNavigateInPage);
      wv.removeEventListener('did-fail-load', handleDidFailLoad);
      wv.removeEventListener('new-window', handleNewWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId]);

  // Navigate the webview when the tab's URL changes from outside (e.g. the
  // user typed a new address in the omnibox) — but not on every re-render.
  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv || !url) return;
    const current = wv.getURL?.();
    if (current !== url) {
      try {
        wv.loadURL(url);
      } catch (_) {
        // Webview not attached yet; the src attribute below covers first mount.
      }
    }
  }, [url]);

  if (loadError) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-300 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Bu siteye ulaşılamıyor</h2>
        <p className="text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">{loadError}</p>
        <button
          onClick={() => webviewRef.current?.reload?.()}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow"
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white relative overflow-hidden flex flex-col">
      <webview
        ref={webviewRef}
        src={url}
        partition={shieldsEnabled ? 'persist:lnx-shielded' : 'persist:lnx'}
        allowpopups="true"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          zoom: zoomLevel ? zoomLevel / 100 : 1,
        } as React.CSSProperties}
      />
    </div>
  );
};
