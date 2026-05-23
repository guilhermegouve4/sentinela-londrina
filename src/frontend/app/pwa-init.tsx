'use client';

/**
 * Componente de inicialização do PWA
 *
 * Em produção: registra Service Worker, notificações e sync offline.
 * Em desenvolvimento: remove SW existente para não interferir no HMR do Next.js.
 */

import { useEffect, useState } from 'react';

const isDev = process.env.NODE_ENV === 'development';

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}

async function unregisterServiceWorkers() {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
}

export function PWAInit() {
  const [isOnline, setIsOnline] = useState(true);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    let loadListener: (() => void) | undefined;

    const handleOnline = () => {
      setIsOnline(true);
      if (isDev || !('serviceWorker' in navigator) || !('SyncManager' in window)) return;
      navigator.serviceWorker.ready.then((registration) => {
        const reg = registration as ServiceWorkerRegistrationWithSync;
        reg.sync?.register('sync-data').catch((err: unknown) => {
          console.warn('[PWA] Erro ao registrar sincronização:', err);
        });
      });
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (isDev) {
      unregisterServiceWorkers().catch((err) => {
        console.warn('[PWA] Falha ao remover Service Workers em dev:', err);
      });
    } else if ('serviceWorker' in navigator) {
      loadListener = () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            setSwRegistered(true);
            intervalId = setInterval(() => registration.update(), 60 * 60 * 1000);
          })
          .catch((error) => {
            console.error('[PWA] Erro ao registrar Service Worker:', error);
          });
      };
      window.addEventListener('load', loadListener);

      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'SYNC_COMPLETE') {
          console.log('[PWA] Sincronização concluída:', event.data.data);
        }
      };
      navigator.serviceWorker.addEventListener('message', handleMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (loadListener) window.removeEventListener('load', loadListener);
        if (intervalId) clearInterval(intervalId);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (loadListener) window.removeEventListener('load', loadListener);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm font-medium">Você está offline</span>
        </div>
      )}

      {swRegistered && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Service Worker ativado. Você pode usar a aplicação offline.
        </div>
      )}
    </>
  );
}
