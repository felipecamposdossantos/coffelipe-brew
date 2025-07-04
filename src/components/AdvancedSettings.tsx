
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Bell, 
  Zap, 
  Database, 
  Palette, 
  Volume2,
  Smartphone,
  Download
} from 'lucide-react';
import { usePWANotifications } from '@/hooks/usePWANotifications';
import { useSmartCache } from '@/hooks/useSmartCache';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

interface AppSettings {
  notifications: boolean;
  autoTimers: boolean;
  soundVolume: number;
  vibration: boolean;
  darkMode: 'auto' | 'light' | 'dark';
  cacheEnabled: boolean;
  offlineMode: boolean;
  animationSpeed: number;
}

export const AdvancedSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { permission, requestPermission, isSupported } = usePWANotifications();
  const { clearCache, cacheStats } = useSmartCache();
  
  const [settings, setSettings] = useState<AppSettings>({
    notifications: false,
    autoTimers: true,
    soundVolume: 70,
    vibration: true,
    darkMode: 'auto',
    cacheEnabled: true,
    offlineMode: true,
    animationSpeed: 1
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Carregar configurações do localStorage
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const saveSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('app-settings', JSON.stringify(updatedSettings));
    toast.success('Configurações salvas!');
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (granted) {
        saveSettings({ notifications: true });
      }
    } else {
      saveSettings({ notifications: enabled });
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('App instalado com sucesso!');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    toast.success('Cache limpo com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 dark:text-coffee-200 mb-2">
          Configurações Avançadas
        </h2>
        <p className="text-coffee-600 dark:text-coffee-300">
          Personalize sua experiência no TimerCoffee
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Ativar notificações</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={handleNotificationToggle}
                disabled={!isSupported}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="vibration">Vibração</Label>
              <Switch
                id="vibration"
                checked={settings.vibration}
                onCheckedChange={(checked) => saveSettings({ vibration: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label>Volume dos sons ({settings.soundVolume}%)</Label>
              <Slider
                value={[settings.soundVolume]}
                onValueChange={(value) => saveSettings({ soundVolume: value[0] })}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select
                value={theme}
                onValueChange={(value) => {
                  if (value !== theme) {
                    toggleTheme();
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Velocidade das animações ({settings.animationSpeed}x)</Label>
              <Slider
                value={[settings.animationSpeed]}
                onValueChange={(value) => saveSettings({ animationSpeed: value[0] })}
                min={0.5}
                max={2}
                step={0.25}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="cache">Cache inteligente</Label>
              <Switch
                id="cache"
                checked={settings.cacheEnabled}
                onCheckedChange={(checked) => saveSettings({ cacheEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-timers">Timers automáticos</Label>
              <Switch
                id="auto-timers"
                checked={settings.autoTimers}
                onCheckedChange={(checked) => saveSettings({ autoTimers: checked })}
              />
            </div>

            <div className="text-sm text-coffee-600 dark:text-coffee-400">
              <p>Cache: {cacheStats.size}/{cacheStats.maxSize} itens</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearCache}
                className="mt-2"
              >
                <Database className="w-4 h-4 mr-2" />
                Limpar Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PWA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              App Móvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="offline">Modo offline</Label>
              <Switch
                id="offline"
                checked={settings.offlineMode}
                onCheckedChange={(checked) => saveSettings({ offlineMode: checked })}
              />
            </div>

            {isInstallable && (
              <Button onClick={handleInstallPWA} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Instalar App
              </Button>
            )}

            <p className="text-sm text-coffee-600 dark:text-coffee-400">
              {isInstallable 
                ? 'Instale o app para uma experiência offline completa'
                : 'App já instalado ou não disponível para instalação'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
