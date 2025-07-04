
import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const useHapticFeedback = () => {
  const vibrate = useCallback((pattern: HapticPattern) => {
    if (!('vibrate' in navigator)) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [50, 100, 50, 100, 50]
    };

    try {
      navigator.vibrate(patterns[pattern]);
    } catch (error) {
      console.log('Vibração não suportada:', error);
    }
  }, []);

  const impactFeedback = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    // iOS Haptic Feedback se disponível
    if ('hapticEngine' in navigator) {
      try {
        (navigator as any).hapticEngine.impact(style);
      } catch (error) {
        vibrate(style);
      }
    } else {
      vibrate(style);
    }
  }, [vibrate]);

  const selectionFeedback = useCallback(() => {
    if ('hapticEngine' in navigator) {
      try {
        (navigator as any).hapticEngine.selection();
      } catch (error) {
        vibrate('light');
      }
    } else {
      vibrate('light');
    }
  }, [vibrate]);

  return {
    vibrate,
    impactFeedback,
    selectionFeedback
  };
};
