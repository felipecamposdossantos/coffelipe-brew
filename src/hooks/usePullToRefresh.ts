
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
  const isScrollingUp = useRef<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only start pull-to-refresh if we're at the very top of the scroll
      if (element.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        isScrollingUp.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === 0 || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // Only handle pull-to-refresh if:
      // 1. We're moving down (deltaY > 0)
      // 2. We're at the top of the scroll (scrollTop === 0)
      // 3. The movement is significant enough (> 10px to avoid accidental triggers)
      if (deltaY > 10 && element.scrollTop === 0) {
        if (!isPulling) {
          setIsPulling(true);
        }
        
        // Prevent default only when actively pulling
        e.preventDefault();
        const distance = deltaY / resistance;
        setPullDistance(distance);

        // Visual feedback
        element.style.transform = `translateY(${Math.min(distance, threshold)}px)`;
        element.style.transition = 'none';
      } else if (deltaY < -10) {
        // User is scrolling up, reset everything
        isScrollingUp.current = true;
        if (isPulling) {
          setIsPulling(false);
          setPullDistance(0);
          element.style.transition = 'transform 0.2s ease-out';
          element.style.transform = 'translateY(0)';
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) {
        startY.current = 0;
        return;
      }

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
      startY.current = 0;
    };

    const handleTouchCancel = () => {
      setIsPulling(false);
      if (element) {
        element.style.transition = 'transform 0.2s ease-out';
        element.style.transform = 'translateY(0)';
      }
      setPullDistance(0);
      startY.current = 0;
    };

    // Use passive: false only for touchmove when needed
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true });

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
