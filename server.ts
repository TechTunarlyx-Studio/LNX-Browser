import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-Memory LNX Update Server State
  interface ServerUpdate {
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

  let latestServerUpdate: ServerUpdate = {
    id: 'upd-' + Date.now(),
    version: '152.0.7977.65',
    channel: 'stable',
    title: 'LNX Browser Kararlılık & Güvenlik Güncellemesi',
    releaseNotes: 'Sekme bellek optimizasyonu, Omnibox arama çubuğu ve LNX Shields kalkan geliştirmeleri.',
    fixes: [
      'Sekmeler arası hızlı geçişlerde yaşanan takılmalar ve bellek sızıntıları giderildi.',
      'Omnibox arama çubuğundaki URL ayrıştırma ve geçmiş arama optimizasyonu yapıldı.',
      'DevTools konsol senkronizasyonu ve element denetleyicisi düzeltildi.',
      'LNX Shields reklam ve izleyici engelleyici filtre kuralları güncellendi.',
      'V8 JavaScript derleme performansı %24 artırıldı.'
    ],
    severity: 'critical',
    publishedAt: new Date().toISOString(),
    isBroadcastActive: false,
  };

  // SSE client pool for live real-time update push
  const sseClients = new Set<Response>();

  // API Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      browser: 'LNX Browser (Chromium-Engine)',
      version: '152.0.7977.65',
      serverTime: new Date().toISOString(),
      activeClients: sseClients.size,
    });
  });

  // GET /api/updates/status - Check current OTA status
  app.get('/api/updates/status', (req: Request, res: Response) => {
    res.json({
      currentVersion: '152.0.7977.65',
      latestUpdate: latestServerUpdate,
      hasUpdate: latestServerUpdate.isBroadcastActive,
      serverTime: new Date().toISOString(),
    });
  });

  // GET /api/updates/stream - SSE endpoint for instant real-time update notification pushes
  app.get('/api/updates/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);

    // Initial greeting / status
    const initialPayload = JSON.stringify({
      type: 'connected',
      message: 'LNX OTA Update Stream Connected',
      currentUpdate: latestServerUpdate,
    });
    res.write(`data: ${initialPayload}\n\n`);

    // Keep-alive ping interval
    const keepAlive = setInterval(() => {
      res.write(`: ping\n\n`);
    }, 20000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
  });

  const ADMIN_SECRET = process.env.LNX_ADMIN_SECRET || 'lnx-master-admin-2026';

  // POST /api/updates/broadcast - Trigger/Broadcast an update directly from the server (Admin Only)
  app.post('/api/updates/broadcast', (req: Request, res: Response) => {
    const adminKey = req.headers['x-admin-key'] || req.body?.adminKey;

    // Security Check: Only administrator can broadcast updates
    if (adminKey !== ADMIN_SECRET) {
      return res.status(401).json({
        success: false,
        error: 'Yetkisiz işlem! Yalnızca LNX sunucu yöneticisi genel güncelleme yayını yapabilir.',
      });
    }

    const {
      version = '152.0.7977.65',
      channel = 'stable',
      title = 'LNX Browser Yeni Kararlılık Güncellemesi',
      releaseNotes = 'Tarayıcı genelinde tespit edilen çoğu hata fixlendi ve performans artırıldı.',
      fixes = [
        'Sekmeler arası hızlı geçişlerde yaşanan takılmalar ve bellek sızıntıları giderildi.',
        'Omnibox arama çubuğu URL ayrıştırması optimize edildi.',
        'LNX Shields reklam ve izleyici engelleyici filtreleri güncellendi.',
        'DevTools konsol ve denetleyici arayüzü hızlandırıldı.'
      ],
      severity = 'critical',
    } = req.body || {};

    latestServerUpdate = {
      id: 'upd-' + Date.now(),
      version,
      channel,
      title,
      releaseNotes,
      fixes: Array.isArray(fixes) && fixes.length > 0 ? fixes : [
        'Çoğu bug ve çökme sorunları fixlendi.',
        'V8 motor performansı ve bellek yönetimi iyileştirildi.'
      ],
      severity,
      publishedAt: new Date().toISOString(),
      isBroadcastActive: true,
    };

    // Broadcast to all connected clients immediately
    const broadcastPayload = JSON.stringify({
      type: 'update_available',
      update: latestServerUpdate,
      timestamp: Date.now(),
    });

    for (const client of sseClients) {
      try {
        client.write(`data: ${broadcastPayload}\n\n`);
      } catch (err) {
        sseClients.delete(client);
      }
    }

    console.log(`[LNX-Update-Server] Broadcasted update ${version} to ${sseClients.size} clients.`);

    return res.json({
      success: true,
      message: `Güncelleme başarıyla sunucudan yayınlandı (${version})!`,
      broadcastedToClients: sseClients.size,
      update: latestServerUpdate,
    });
  });

  // POST /api/updates/dismiss - Dismiss or acknowledge update
  app.post('/api/updates/dismiss', (req: Request, res: Response) => {
    latestServerUpdate.isBroadcastActive = false;
    return res.json({ success: true, message: 'Güncelleme yayını sonlandırıldı.' });
  });

  // Web Proxy for live web browsing without CORS blocks
  // Fetches the target page server-side (so it can reach virtually any site,
  // regardless of that site's X-Frame-Options / frame-ancestors CSP, since we
  // never load it in an iframe by src — we inline the HTML via srcDoc instead),
  // strips framing/CSP restrictions embedded in the markup itself, and retries
  // with a couple of different fetch strategies before giving up.
  const PROXY_USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36 LNXBrowser/1.0',
    // Fallback UA for sites that specifically block unrecognized/custom UA suffixes
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
  ];

  async function fetchWithRetry(formattedUrl: string, parsedUrl: URL) {
    let lastErr: any = null;
    for (let attempt = 0; attempt < PROXY_USER_AGENTS.length; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const response = await fetch(formattedUrl, {
          signal: controller.signal,
          redirect: 'follow',
          headers: {
            'User-Agent': PROXY_USER_AGENTS[attempt],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': `${parsedUrl.origin}/`,
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Dest': 'document',
          },
        });
        clearTimeout(timeoutId);
        // Some sites return a soft-block page with a 403/429 on the first UA;
        // retry once with the plain-Chrome UA before surfacing an error.
        if ((response.status === 403 || response.status === 429) && attempt < PROXY_USER_AGENTS.length - 1) {
          lastErr = new Error(`HTTP ${response.status}`);
          continue;
        }
        return response;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('Unknown fetch error');
  }

  app.get('/api/proxy', async (req: Request, res: Response) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    let formattedUrl = targetUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(formattedUrl);
    } catch {
      return res.status(400).json({ error: 'Geçersiz URL', url: targetUrl });
    }

    try {
      const response = await fetchWithRetry(formattedUrl, parsedUrl);

      const contentType = response.headers.get('content-type') || 'text/html';
      const status = response.status;
      // The final URL after following any redirects (important so relative
      // links/assets resolve against the right origin).
      const finalUrl = new URL(response.url || formattedUrl);

      if (contentType.includes('text/html') || contentType.includes('application/xhtml+xml')) {
        let html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const pageTitle = titleMatch ? titleMatch[1].trim() : finalUrl.hostname;

        // Strip any embedded CSP / X-Frame-Options meta tags and <base> the
        // page doesn't need to fight our own — we inline the markup via
        // srcDoc, so restrictive in-page CSP (frame-ancestors, script-src
        // targeting self-origin, etc.) would otherwise block the page from
        // rendering or running inside the sandboxed iframe for no good reason.
        html = html.replace(/<meta[^>]+http-equiv=["']?content-security-policy["']?[^>]*>/gi, '');
        html = html.replace(/<meta[^>]+http-equiv=["']?x-frame-options["']?[^>]*>/gi, '');

        // Base URL tag injection for proper relative asset/link resolution
        const baseTag = `<base href="${finalUrl.origin}${finalUrl.pathname}" target="_self">`;
        if (/<head[^>]*>/i.test(html)) {
          html = html.replace(/<head[^>]*>/i, (m) => `${m}${baseTag}`);
        } else if (/<html[^>]*>/i.test(html)) {
          html = html.replace(/<html[^>]*>/i, (m) => `${m}<head>${baseTag}</head>`);
        } else {
          html = baseTag + html;
        }

        // Return rich metadata alongside sanitized proxy content
        return res.json({
          url: finalUrl.toString(),
          hostname: finalUrl.hostname,
          title: pageTitle,
          status,
          contentType,
          html,
          headers: Object.fromEntries(response.headers.entries()),
        });
      } else {
        // Direct media or non-html — let the client render/download it
        // straight from the origin URL rather than trying to inline it.
        return res.json({
          url: finalUrl.toString(),
          hostname: finalUrl.hostname,
          title: finalUrl.pathname.split('/').pop() || finalUrl.hostname,
          status,
          contentType,
          isBinary: true,
          directUrl: finalUrl.toString(),
          headers: Object.fromEntries(response.headers.entries()),
        });
      }
    } catch (err: any) {
      console.error('Proxy Error:', err.message);
      // Surface a fallbackDirect hint so the client can, as a last resort,
      // try loading the site directly (some sites block server-side fetches
      // via bot-detection but still allow being framed by a real browser).
      return res.status(502).json({
        error: `Sayfa yüklenemedi: ${err.message}`,
        url: formattedUrl,
        fallbackDirect: true,
      });
    }
  });

  // Search Engine Proxy / Query suggestor
  app.get('/api/search', async (req: Request, res: Response) => {
    const q = req.query.q as string;
    const engine = (req.query.engine as string) || 'duckduckgo';
    if (!q) {
      return res.json({ query: '', results: [] });
    }

    try {
      // DuckDuckGo Instant Answer API or simulated results
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_redirect=1&no_html=1`;
      const ddgRes = await fetch(ddgUrl, {
        headers: { 'User-Agent': 'LNX-Browser/1.0' },
      });
      const data: any = await ddgRes.json();

      const results = [];
      if (data.AbstractText) {
        results.push({
          title: data.Heading || q,
          snippet: data.AbstractText,
          url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
          source: data.AbstractSource || 'DuckDuckGo Instant Answer',
        });
      }

      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, 8)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || topic.Text,
              snippet: topic.Text,
              url: topic.FirstURL,
              source: 'Web Search',
              icon: topic.Icon?.URL ? `https://duckduckgo.com${topic.Icon.URL}` : undefined,
            });
          }
        }
      }

      return res.json({
        query: q,
        engine,
        heading: data.Heading,
        abstract: data.AbstractText,
        results,
      });
    } catch (err: any) {
      return res.json({
        query: q,
        engine,
        results: [
          {
            title: `${q} - Web Arama`,
            snippet: `Search for "${q}" across the global web index.`,
            url: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
            source: 'Google',
          },
        ],
      });
    }
  });

  // Gemini AI Copilot Endpoint
  app.post('/api/gemini/copilot', async (req: Request, res: Response) => {
    try {
      const { prompt, currentUrl, pageTitle, pageContent, mode } = req.body;

      const ai = getGeminiClient();

      let systemInstruction = `You are LNX Browser's integrated Chromium AI Copilot (LNX AI).
You help the user navigate, summarize, research, analyze, translate, and inspect web pages.
Provide clear, well-structured, formatted Markdown responses.
If asked in Turkish, respond in Turkish. If in English, respond in English.
Browser: LNX Browser (Chromium Kernel v152.0).`;

      if (mode === 'summarize') {
        systemInstruction += `\nTASK: Provide a concise executive summary of the current page with 3 key highlights and key takeaways.`;
      } else if (mode === 'explain') {
        systemInstruction += `\nTASK: Explain the core concepts of this page simply and clearly for any reader.`;
      } else if (mode === 'translate') {
        systemInstruction += `\nTASK: Translate the content smoothly maintaining tone and context.`;
      } else if (mode === 'code') {
        systemInstruction += `\nTASK: Inspect code snippets or technical specifications, providing clean code blocks with syntax explanation.`;
      }

      let contentPrompt = `Current Active Tab Information:
- Page Title: ${pageTitle || 'Untitled'}
- URL: ${currentUrl || 'about:blank'}

User Message/Query:
${prompt || 'Summarize this page'}
`;

      if (pageContent && typeof pageContent === 'string') {
        // Trim content safely
        const sanitizedContent = pageContent.slice(0, 8000);
        contentPrompt += `\nPage Text Extract:\n"""\n${sanitizedContent}\n"""`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: contentPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || 'LNX AI response generated successfully.',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Gemini Copilot Error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to process AI Copilot request',
        reply: `LNX AI Copilot Note: Could not complete AI request (${err.message || 'Check Gemini API Key in Settings'}).`,
      });
    }
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LNX Browser backend active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
