
import { useState, useEffect } from 'react';
import { useAppPerformance } from '@/hooks/useAppPerformance';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { Activity, Smartphone, Wifi, Battery } from 'lucide-react';

interface PerformanceMonitorProps {
  showDetails?: boolean;
}

export const PerformanceMonitor = ({ showDetails = false }: PerformanceMonitorProps) => {
  const { deviceInfo } = useAppPerformance();
  const [performanceData, setPerformanceData] = useState({
    loadTime: 0,
    memoryUsage: 0,
    connectionType: 'unknown'
  });

  useEffect(() => {
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          setPerformanceData(prev => ({
            ...prev,
            loadTime: navigation.loadEventEnd - navigation.loadEventStart
          }));
        }

        // Memory usage (if available)
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          setPerformanceData(prev => ({
            ...prev,
            memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
          }));
        }
      }
    };

    measurePerformance();
  }, []);

  if (!showDetails) return null;

  const getConnectionIcon = () => {
    switch (deviceInfo.connectionSpeed) {
      case 'fast': return <Wifi className="w-4 h-4 text-green-500" />;
      case 'slow': return <Wifi className="w-4 h-4 text-red-500" />;
      default: return <Wifi className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPerformanceBadge = () => {
    if (performanceData.loadTime < 1000) return { variant: 'default' as const, text: 'Excelente' };
    if (performanceData.loadTime < 3000) return { variant: 'secondary' as const, text: 'Bom' };
    return { variant: 'destructive' as const, text: 'Lento' };
  };

  const badge = getPerformanceBadge();

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-coffee-600" />
          <span className="text-sm font-medium">Performance</span>
          <Badge variant={badge.variant} className="ml-auto">
            {badge.text}
          </Badge>
        </div>

        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3 h-3" />
            <span>Dispositivo: {deviceInfo.isMobile ? 'Mobile' : 'Desktop'}</span>
          </div>

          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            <span>Conexão: {deviceInfo.connectionSpeed}</span>
          </div>

          {deviceInfo.isLowPowerMode && (
            <div className="flex items-center gap-2">
              <Battery className="w-3 h-3 text-yellow-500" />
              <span>Modo economia ativo</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Carregamento:</span>
            <span>{Math.round(performanceData.loadTime)}ms</span>
          </div>

          {performanceData.memoryUsage > 0 && (
            <div className="flex justify-between">
              <span>Memória:</span>
              <span>{Math.round(performanceData.memoryUsage)}MB</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
