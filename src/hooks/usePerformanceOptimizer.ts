
import { useEffect, useCallback } from 'react';
import { useDeviceDetection } from './useDeviceDetection';

export const usePerformanceOptimizer = () => {
  const deviceInfo = useDeviceDetection();

  // Otimizar baseado no dispositivo
  useEffect(() => {
    if (deviceInfo.isLowPowerMode) {
      // Reduzir animações
      document.documentElement.style.setProperty('--animation-duration', '0s');
      console.log('Modo economia de energia ativado - animações reduzidas');
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }

    // Otimizar para conexão lenta
    if (deviceInfo.connectionSpeed === 'slow') {
      // Reduzir qualidade de imagens, cache mais agressivo
      console.log('Conexão lenta detectada - otimizações ativadas');
    }
  }, [deviceInfo]);

  // Limpeza de memória
  const cleanupMemory = useCallback(() => {
    // Forçar garbage collection se disponível
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Limpar caches desnecessários
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('old-') || cacheName.includes('temp-')) {
            caches.delete(cacheName);
          }
        });
      });
    }
  }, []);

  // Monitor de performance
  const reportWebVitals = useCallback((metric: any) => {
    console.log(`Performance Metric: ${metric.name}`, metric.value);
    
    // Alertar sobre métricas ruins
    if (metric.name === 'CLS' && metric.value > 0.1) {
      console.warn('Layout Shift detectado:', metric.value);
    }
    
    if (metric.name === 'FID' && metric.value > 100) {
      console.warn('Input Delay alto:', metric.value);
    }
    
    if (metric.name === 'LCP' && metric.value > 2500) {
      console.warn('Largest Contentful Paint lento:', metric.value);
    }
  }, []);

  // Preload de recursos críticos
  const preloadCriticalResources = useCallback(() => {
    const criticalResources = [
      '/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    preloadCriticalResources();
    
    // Cleanup periódico
    const interval = setInterval(cleanupMemory, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [preloadCriticalResources, cleanupMemory]);

  return {
    deviceInfo,
    cleanupMemory,
    reportWebVitals
  };
};
