import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  FileText,
  HelpCircle,
  Languages,
  Code2,
  Copy,
  Check,
  RefreshCw,
  Bot,
  User,
} from 'lucide-react';
import { TabItem } from '../../types';

interface AICopilotSidebarProps {
  isOpen: boolean;
  activeTab: TabItem;
  pageContentSnippet?: string;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AICopilotSidebar: React.FC<AICopilotSidebarProps> = ({
  isOpen,
  activeTab,
  pageContentSnippet,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Merhaba! Ben **LNX AI Copilot**.\nŞu anda **${
        activeTab.title || 'Yeni Sekme'
      }** sayfasını inceliyorum. Sayfayı özetleyebilir, ana noktaları çıkarabilir veya sorularınızı yanıtlayabilirim.`,
      timestamp: 'Şimdi',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string, mode?: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          currentUrl: activeTab.url,
          pageTitle: activeTab.title,
          pageContent: pageContentSnippet || `Title: ${activeTab.title}, URL: ${activeTab.url}`,
          mode: mode || 'chat',
        }),
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: data.reply || 'Yanıt alınamadı.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `Bağlantı hatası: ${err.message || 'LNX AI servisine erişilemedi.'}`,
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="lnx-ai-copilot-sidebar"
      className="w-80 md:w-96 bg-[#121212] border-l border-[#262626] flex flex-col h-full z-40 text-xs text-[#E0E0E0] select-none shadow-2xl"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] bg-[#1A1A1A]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>LNX AI Copilot</span>
              <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                Gemini 3.7
              </span>
            </div>
            <div className="text-[10px] text-[#888] truncate max-w-[200px]">
              {activeTab.title || 'Aktif Sekme'}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[#262626] text-[#888] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="p-3 border-b border-[#262626] bg-[#161616] grid grid-cols-2 gap-2">
        <button
          onClick={() => handleSendMessage('Bu web sayfasının özetini 3 ana madde halinde çıkar.', 'summarize')}
          className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] text-[#E0E0E0] text-left transition-colors font-medium text-[11px]"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="truncate">Sayfayı Özetle</span>
        </button>

        <button
          onClick={() => handleSendMessage('Bu sayfadaki önemli terimleri ve kavramları açıkla.', 'explain')}
          className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] text-[#E0E0E0] text-left transition-colors font-medium text-[11px]"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="truncate">Kavramları Açıkla</span>
        </button>

        <button
          onClick={() => handleSendMessage('Bu sayfanın içeriğini Türkçe ve anlaşılır bir dille açıkla.', 'translate')}
          className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] text-[#E0E0E0] text-left transition-colors font-medium text-[11px]"
        >
          <Languages className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">Türkçe Açıkla</span>
        </button>

        <button
          onClick={() => handleSendMessage('Sayfadaki teknik detayları, kodları veya özellikleri incele.', 'code')}
          className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] text-[#E0E0E0] text-left transition-colors font-medium text-[11px]"
        >
          <Code2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span className="truncate">Kodu İncele</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-md bg-indigo-600/30 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3 rounded-2xl leading-relaxed select-text ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-[#1A1A1A] text-[#E0E0E0] rounded-bl-none border border-[#262626]'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs">{msg.text}</div>
              <div className="flex items-center justify-between mt-1.5 pt-1 text-[10px] text-[#888]">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-white p-0.5"
                    title="Kopyala"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                U
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-[#888] text-xs p-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>LNX AI düşünüyor ve yanıt hazırlıyor...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 border-t border-[#262626] bg-[#161616]"
      >
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1A1A1A] border border-[#262626] focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="LNX AI'a bir soru sorun..."
            className="flex-1 bg-transparent px-2 text-xs text-[#E0E0E0] placeholder-[#666] outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
