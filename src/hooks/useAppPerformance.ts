
import { useEffect, useCallback } from 'react';
import { usePerformanceOptimizer } from './usePerformanceOptimizer';
import { useDeviceDetection } from './useDeviceDetection';

export const useAppPerformance = () => {
  const { cleanupMemory, reportWebVitals } = usePerformanceOptimizer();
  const deviceInfo = useDeviceDetection();

  const optimizeForDevice = useCallback(() => {
    // Apply device-specific optimizations
    if (deviceInfo.isMobile) {
      // Mobile optimizations
      document.documentElement.style.setProperty('--animation-duration', '200ms');
      
      // Reduce motion for low-power devices
      if (deviceInfo.isLowPowerMode) {
        document.documentElement.style.setProperty('--animation-duration', '0ms');
        console.log('Low power mode detected - animations disabled');
      }
    } else {
      // Desktop optimizations
      document.documentElement.style.setProperty('--animation-duration', '300ms');
    }

    // Network-based optimizations
    if (deviceInfo.connectionSpeed === 'slow') {
      // Preload critical resources only
      console.log('Slow connection detected - reducing preloads');
    }
  }, [deviceInfo]);

  const measurePerformance = useCallback(() => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        console.log('Performance Metrics:', {
          loadTime: `${loadTime}ms`,
          domContentLoaded: `${domContentLoaded}ms`,
          connectionType: deviceInfo.connectionSpeed
        });

        // Report slow performance
        if (loadTime > 3000) {
          console.warn('Slow page load detected:', loadTime);
        }
      }
    }
  }, [deviceInfo.connectionSpeed]);

  const scheduleCleanup = useCallback(() => {
    // Schedule memory cleanup based on device capabilities
    const interval = deviceInfo.isMobile ? 5 * 60 * 1000 : 10 * 60 * 1000; // 5min mobile, 10min desktop
    
    const cleanupInterval = setInterval(() => {
      cleanupMemory();
      console.log('Scheduled memory cleanup executed');
    }, interval);

    return () => clearInterval(cleanupInterval);
  }, [cleanupMemory, deviceInfo.isMobile]);

  useEffect(() => {
    optimizeForDevice();
    measurePerformance();
    
    const cleanup = scheduleCleanup();
    
    // Listen for visibility changes to optimize when app is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanupMemory();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [optimizeForDevice, measurePerformance, scheduleCleanup, cleanupMemory]);

  return {
    deviceInfo,
    cleanupMemory,
    reportWebVitals,
    measurePerformance
  };
};
