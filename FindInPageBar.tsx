import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';

interface FindInPageBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FindInPageBar: React.FC<FindInPageBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setMatchCount(0);
      setCurrentMatch(0);
    } else {
      // Mock match count for active document
      const calculated = Math.max(1, (val.length * 3) % 11);
      setMatchCount(calculated);
      setCurrentMatch(1);
    }
  };

  const handleNext = () => {
    if (matchCount === 0) return;
    setCurrentMatch((prev) => (prev >= matchCount ? 1 : prev + 1));
  };

  const handlePrev = () => {
    if (matchCount === 0) return;
    setCurrentMatch((prev) => (prev <= 1 ? matchCount : prev - 1));
  };

  return (
    <div className="absolute top-2 right-4 z-40 flex items-center gap-1.5 p-1.5 rounded-xl bg-[#1A1A1A] border border-[#262626] shadow-2xl text-xs text-[#E0E0E0]">
      <Search className="w-3.5 h-3.5 text-[#888] ml-1.5" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        placeholder="Sayfada bul..."
        className="w-36 bg-transparent text-[#E0E0E0] placeholder-[#666] px-1.5 py-1 text-xs outline-none"
      />

      <span className="text-[10px] text-[#888] font-mono px-1">
        {matchCount > 0 ? `${currentMatch}/${matchCount}` : 'Eşleşme yok'}
      </span>

      <div className="flex items-center gap-0.5 border-l border-[#262626] pl-1">
        <button
          onClick={handlePrev}
          title="Önceki"
          className="p-1 rounded-lg hover:bg-[#262626] text-[#888] hover:text-white"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleNext}
          title="Sonraki"
          className="p-1 rounded-lg hover:bg-[#262626] text-[#888] hover:text-white"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClose}
          title="Kapat (Esc)"
          className="p-1 rounded-lg hover:bg-[#262626] text-[#888] hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
