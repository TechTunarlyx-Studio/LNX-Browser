import React, { useState } from 'react';
import { QrCode, X, Copy, Check, Download } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  url: string;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  url,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    url
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-xs select-none">
      <div className="w-full max-w-sm bg-[#121212] border border-[#262626] rounded-2xl shadow-2xl p-6 text-[#E0E0E0] space-y-4 text-center">
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Sayfa İçin QR Kod Oluştur</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#262626] text-[#888] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-[#888]">
          Telefonunuzun veya tabletinizin kamerasıyla tarayarak sayfayı anında mobil cihazınızda açın.
        </p>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto">
          <img
            src={qrImageUrl}
            alt="QR Code"
            className="w-44 h-44 object-contain mx-auto"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#262626] text-[#CCC] font-mono text-[11px] truncate">
          {url}
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı' : 'Bağlantıyı Kopyala'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
