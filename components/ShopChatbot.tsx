'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ShopChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Sorry, could not get a response.',
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Network error. Please try again! 🙏',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Small Toggle Button - bottom right corner */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-5 z-50 w-16 h-16 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 group border border-gray-200 p-0.5"
          aria-label="Open Store Assistant"
        >
          <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-200/50">
            <img 
              src="/WhatsApp_Image_2026-06-25_at_12.41.25_PM-removebg-preview.png" 
              alt="Chat Assistant" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
            />
          </div>
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-10" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-200 overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 140px)' }}
        >
          {/* Header */}
          <div className="bg-[#111111] px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-white/20 overflow-hidden shadow-sm">
                <img 
                  src="/WhatsApp_Image_2026-06-25_at_12.41.25_PM-removebg-preview.png" 
                  alt="Assistant" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm tracking-wide">Store Assistant</h3>
                <p className="text-gray-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                  Usually replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafafa]" style={{ minHeight: '200px', maxHeight: '350px' }}>
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 border border-gray-200 overflow-hidden shadow-sm">
                  <img 
                    src="/WhatsApp_Image_2026-06-25_at_12.41.25_PM-removebg-preview.png" 
                    alt="Assistant" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <p className="text-gray-800 text-sm font-medium">Namaste! 🙏</p>
                <p className="text-gray-500 text-xs mt-1.5 px-4 leading-relaxed">
                  Looking for a specific phone? Ask me about models, prices, or specs.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center px-2">
                  <button onClick={() => setInput("iPhone 15 price?")} className="text-[11px] bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">iPhone 15 price?</button>
                  <button onClick={() => setInput("Phones under 20000")} className="text-[11px] bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">Under ₹20,000</button>
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-[#111111] text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2.5 bg-[#f5f5f7] border border-transparent rounded-full text-[13px] focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 placeholder:text-gray-400 transition-all"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-[#111111] text-white rounded-full hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
