
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Coffee } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = localStorage.getItem('pwa-installed') === 'true';

    if (isStandalone || isInstalled) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual install instructions after a delay
    if (isIOSDevice && !isStandalone) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
        setShowPrompt(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm bg-coffee-50 border-coffee-200 shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-coffee-800">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            <span className="text-sm">Instalar CofFelipe</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-coffee-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-coffee-600">
          {isIOS 
            ? "Para instalar, toque no botão 'Compartilhar' e selecione 'Adicionar à Tela de Início'"
            : "Instale o app para uma experiência completa offline!"
          }
        </p>
        
        {!isIOS && deferredPrompt && (
          <Button
            onClick={handleInstallClick}
            className="w-full bg-coffee-600 hover:bg-coffee-700 text-white"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Instalar App
          </Button>
        )}
        
        {isIOS && (
          <div className="text-xs text-coffee-600 bg-coffee-100 p-2 rounded">
            <p className="font-medium mb-1">Como instalar no iOS:</p>
            <p>1. Toque no botão compartilhar (□↗)</p>
            <p>2. Role para baixo e toque em "Adicionar à Tela de Início"</p>
            <p>3. Toque em "Adicionar"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
