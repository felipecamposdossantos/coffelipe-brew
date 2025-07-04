
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  orientation: 'portrait' | 'landscape';
  connectionSpeed: 'slow' | 'fast' | 'offline';
  batteryLevel?: number;
  isLowPowerMode: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasTouch: false,
    orientation: 'portrait',
    connectionSpeed: 'fast',
    batteryLevel: undefined,
    isLowPowerMode: false
  });

  useEffect(() => {
    const updateDeviceInfo = async () => {
      // Detecção básica de dispositivo
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android(?=.*Tablet)|Tablet/i.test(userAgent);
      const isDesktop = !isMobile && !isTablet;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Orientação
      const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

      // Velocidade da conexão
      let connectionSpeed: 'slow' | 'fast' | 'offline' = 'fast';
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (!navigator.onLine) {
          connectionSpeed = 'offline';
        } else if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
          connectionSpeed = 'slow';
        }
      }

      // Nível da bateria
      let batteryLevel: number | undefined;
      let isLowPowerMode = false;
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          batteryLevel = battery.level * 100;
          isLowPowerMode = battery.level < 0.2;
        }
      } catch (error) {
        console.log('Battery API não suportada');
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        hasTouch,
        orientation,
        connectionSpeed,
        batteryLevel,
        isLowPowerMode
      });
    };

    updateDeviceInfo();

    // Listeners para mudanças
    const handleOrientationChange = () => {
      setDeviceInfo(prev => ({
        ...prev,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      }));
    };

    const handleConnectionChange = () => {
      setDeviceInfo(prev => ({
        ...prev,
        connectionSpeed: navigator.onLine ? 'fast' : 'offline'
      }));
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);

  return deviceInfo;
};
