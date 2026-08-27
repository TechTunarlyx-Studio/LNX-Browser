// Ambient types for the Electron integration.
// Present only when the app is actually running inside the LNX Browser
// desktop shell (electron/preload.cjs); undefined in a plain browser tab.

export {};

declare global {
  interface Window {
    lnxNative?: {
      isElectron: true;
      platform: string;
      versions: {
        electron: string;
        chrome: string;
        node: string;
      };
    };
  }

  namespace JSX {
    interface IntrinsicElements {
      // Electron's <webview> tag — a real, separate Chromium instance
      // embedded in the page. Only available inside the Electron shell.
      webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        allowpopups?: string;
        partition?: string;
        useragent?: string;
        webpreferences?: string;
        ref?: React.Ref<any>;
      };
    }
  }
}
