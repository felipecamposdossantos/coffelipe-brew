
import { useRef } from 'react';

export const useWakeLock = () => {
  const wakeLockRef = useRef<any>(null);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        console.log('Wake lock ativado - tela permanecerá ligada');
      }
    } catch (err) {
      console.log('Wake lock não suportado ou falhou:', err);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake lock liberado');
      } catch (err) {
        console.log('Erro ao liberar wake lock:', err);
      }
    }
  };

  return { requestWakeLock, releaseWakeLock };
};
