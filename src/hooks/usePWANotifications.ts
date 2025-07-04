
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const usePWANotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Notificações não são suportadas neste navegador');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Notificações ativadas!');
        return true;
      } else {
        toast.error('Permissão para notificações negada');
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      toast.error('Erro ao ativar notificações');
      return false;
    }
  };

  const showNotification = (title: string, options: NotificationOptions = {}) => {
    if (permission !== 'granted') {
      console.warn('Notificações não permitidas');
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
      badge: '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png',
      vibrate: [200, 100, 200],
      tag: 'coffee-timer',
      ...options
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, defaultOptions);
      });
    } else {
      new Notification(title, defaultOptions);
    }
  };

  const scheduleBrewingNotification = (recipeName: string, stepName: string, delay: number) => {
    setTimeout(() => {
      showNotification(`${recipeName} - ${stepName}`, {
        body: 'Hora de continuar com o próximo passo!',
        actions: [
          { action: 'view', title: 'Ver Receita' },
          { action: 'dismiss', title: 'Dispensar' }
        ]
      });
    }, delay * 1000);
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    scheduleBrewingNotification
  };
};
