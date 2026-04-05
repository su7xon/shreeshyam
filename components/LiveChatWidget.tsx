'use client';

import { useState } from 'react';
import { X, Phone, Mail, MessageCircle, Send, Minimize2, Maximize2 } from 'lucide-react';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'bot', text: 'Hi there! 👋 How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: 'Thanks for reaching out! Our team will get back to you shortly. For urgent queries, call us at +91 98765 43210.' }]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 ${isMinimized ? 'w-16 h-16' : 'w-80 sm:w-96'}`}>
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          {!isMinimized && (
            <div>
              <h3 className="text-white font-bold">Live Chat</h3>
              <p className="text-white/80 text-xs">We&apos;re online!</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 rounded transition-colors">
            {isMinimized ? <Maximize2 className="h-4 w-4 text-white" /> : <Minimize2 className="h-4 w-4 text-white" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="h-64 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#3B82F6] text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center hover:bg-[#2563EB] transition-colors"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +91 98765 43210</span>
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> support@shreeshyammobiles.com</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}