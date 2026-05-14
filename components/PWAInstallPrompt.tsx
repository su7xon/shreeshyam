'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the default browser prompt
      e.preventDefault();
      // Save the event so it can be triggered later
      setInstallPrompt(e);
      // Only show if not dismissed in this session
      if (!sessionStorage.getItem('pwa-prompt-dismissed')) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    } else {
      console.log('User dismissed the PWA install');
    }

    // Clear the saved prompt
    setInstallPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-sm p-4 flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#ff8c00] rounded-sm flex items-center justify-center flex-shrink-0">
            <Download className="text-black h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Install Shreeshyam Mobiles</h3>
            <p className="text-xs text-gray-500">Add to home screen for faster access</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-[#ff8c00] text-black text-xs font-bold rounded-sm hover:bg-[#e67e00] transition-colors whitespace-nowrap"
          >
            Install Now
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
