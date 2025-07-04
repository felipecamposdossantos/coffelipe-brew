
import { useRef, useEffect, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}: PullToRefreshOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (element.scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      if (deltaY > 0 && element.scrollTop <= 0) {
        e.preventDefault();
        e.stopPropagation();
        const distance = deltaY / resistance;
        setPullDistance(distance);

        // Visual feedback
        element.style.transform = `translateY(${Math.min(distance, threshold)}px)`;
        element.style.transition = 'none';
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      setIsPulling(false);
      
      // Reset transform with smooth transition
      if (element) {
        element.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0.38, 0.9)';
        element.style.transform = 'translateY(0)';
      }

      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      setPullDistance(0);
    };

    // Previne scroll bounce no iOS
    const handleTouchCancel = () => {
      setIsPulling(false);
      if (element) {
        element.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0.38, 0.9)';
        element.style.transform = 'translateY(0)';
      }
      setPullDistance(0);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [enabled, threshold, resistance, isPulling, isRefreshing, pullDistance, onRefresh]);

  return {
    elementRef,
    isPulling,
    isRefreshing,
    pullDistance: Math.min(pullDistance, threshold)
  };
};
