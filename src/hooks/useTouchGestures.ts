
import { useRef, useEffect } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  threshold?: number;
  enabled?: boolean;
}

export const useTouchGestures = (options: TouchGestureOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const startTouch = useRef<{ x: number; y: number; time: number } | null>(null);
  const initialDistance = useRef<number>(0);
  const hasMoved = useRef<boolean>(false);

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    threshold = 50,
    enabled = true
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      hasMoved.current = false;
      
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        startTouch.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
      } else if (e.touches.length === 2 && onPinch) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        initialDistance.current = distance;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      hasMoved.current = true;
      
      if (e.touches.length === 2 && onPinch && initialDistance.current > 0) {
        // Only prevent default for pinch gestures
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const scale = distance / initialDistance.current;
        onPinch(scale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startTouch.current || e.touches.length > 0 || !hasMoved.current) {
        startTouch.current = null;
        return;
      }

      const endTouch = e.changedTouches[0];
      const deltaX = endTouch.clientX - startTouch.current.x;
      const deltaY = endTouch.clientY - startTouch.current.y;
      const deltaTime = Date.now() - startTouch.current.time;

      // Only process swipes if they're fast enough and significant enough
      if (deltaTime > 300 || (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold)) {
        startTouch.current = null;
        return;
      }

      // Only process horizontal swipes if they're more horizontal than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
        // Only process vertical swipes if they're more vertical than horizontal
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }

      startTouch.current = null;
      initialDistance.current = 0;
    };

    // Use passive listeners for better performance
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, threshold, enabled]);

  return elementRef;
};
