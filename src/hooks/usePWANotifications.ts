
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export const usePWANotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      toast.error('Notificações não são suportadas neste navegador');
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Notificações ativadas com sucesso!');
      } else if (result === 'denied') {
        toast.error('Notificações foram negadas. Você pode ativar nas configurações do navegador.');
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      toast.error('Erro ao ativar notificações');
      return 'denied';
    }
  };

  const showNotification = async (options: NotificationOptions): Promise<boolean> => {
    if (!isSupported) {
      toast.info(options.body); // Fallback to toast
      return false;
    }

    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        toast.info(options.body); // Fallback to toast
        return false;
      }
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
        badge: '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
        tag: options.tag || 'coffee-timer',
        requireInteraction: options.requireInteraction || false,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'view',
            title: 'Ver App',
            icon: '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png'
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
      toast.info(options.body); // Fallback to toast
      return false;
    }
  };

  const showTimerNotification = (stepName: string, isComplete: boolean = false) => {
    const title = isComplete ? '☕ Etapa Concluída!' : '⏰ Timer do Café';
    const body = isComplete 
      ? `Etapa "${stepName}" finalizada!`
      : `Timer para "${stepName}" em andamento`;

    return showNotification({
      title,
      body,
      tag: 'coffee-timer',
      requireInteraction: isComplete
    });
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showTimerNotification
  };
};
