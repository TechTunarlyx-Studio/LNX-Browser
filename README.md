# LNX Browser — Masaüstü (Electron) Sürümü

Bu proje artık **Electron** ile paketlenmiş bir masaüstü uygulaması. Sekme arayüzü React ile,
gerçek sayfa gösterimi ise Electron'un yerleşik `<webview>` etiketiyle — yani gerçek bir
Chromium motoruyla — yapılıyor (proxy/srcDoc hilesi yerine).

> **Not:** Bu paket bu ortamda derlenmedi çünkü bu ortamın internet erişimi kapalı
> (`npm install` çalışmıyor). Aşağıdaki adımları **kendi bilgisayarınızda** (internetli)
> çalıştırarak kurulum sihirbazlı `.exe` dosyasını üretebilirsiniz.

## Gereksinimler

- [Node.js](https://nodejs.org) 20 LTS veya üzeri (npm dahil)
- Windows üzerinde derleme yapıyorsanız ekstra bir şey gerekmez.
- macOS/Linux üzerinden **Windows .exe** üretmek isterseniz `electron-builder` Wine kullanır;
  en sorunsuz yol doğrudan bir Windows makinede derlemektir.

## 1) Bağımlılıkları kurun

```bash
npm install
```

## 2) Geliştirme modunda çalıştırın (opsiyonel, test için)

```bash
npm run electron:dev
```

Bu, backend'i (`server.ts`) ve Electron penceresini birlikte başlatır.

## 3) Windows kurulum sihirbazlı .exe üretin

```bash
npm run dist:win
```

- Çıktı: `release/LNX Browser-Setup-1.0.0.exe`
- Bu bir **NSIS installer**'dır: kullanıcı kurulum dizinini seçebilir, masaüstü/başlat menüsü
  kısayolu oluşturur, ve normal bir "Kur / Kaldır" deneyimi sunar (`electron-builder`'ın
  `nsis` hedefi).
- Sadece geçici bir çalıştırılabilir (installer'sız, tek klasör) istiyorsanız:
  ```bash
  npm run electron:pack
  ```
  çıktısı `release/win-unpacked/LNX Browser.exe` olur.

## 4) Gemini API anahtarı (opsiyonel)

AI Copilot özelliği için `.env.local` dosyası oluşturup içine
`GEMINI_API_KEY="..."` satırını ekleyin (`.env.example` dosyasına bakın).
Anahtar girilmezse uygulamanın geri kalanı (sekmeler, gezinme, ayarlar vb.) yine çalışır,
sadece AI Copilot yanıt veremez.

## Mimari özeti

- `electron/main.cjs` — Electron ana süreci: pencereyi açar, yerel backend'i
  (`dist/server.cjs`) arka planda başlatır, native menüyü kurar.
- `electron/preload.cjs` — renderer'a güvenli, sınırlı bir köprü (`window.lnxNative`) sağlar;
  `contextIsolation` açık, `nodeIntegration` kapalı.
- `src/components/Content/ElectronEngineView.tsx` — gerçek sayfa yüklemesini Electron'un
  `<webview>` (gerçek Chromium) etiketiyle yapan bileşen; `WebView.tsx` Electron içinde
  çalışırken otomatik olarak buna geçer.
- `build/icon.ico` / `build/icon.png` — uygulama ve installer ikonu.

## Orijinal (tarayıcıda çalışan) mod

Electron olmadan, düz web uygulaması olarak da hâlâ çalışır:

```bash
npm run dev      # geliştirme
npm run build && npm start   # üretim
```

Bu modda `http://localhost:3000` üzerinden tarayıcıda açılır ve sayfa gösterimi eski
sunucu-taraflı proxy yöntemiyle (bazı sitelerde CSP/X-Frame-Options kısıtlamaları nedeniyle
sınırlı olabilir) çalışır.
