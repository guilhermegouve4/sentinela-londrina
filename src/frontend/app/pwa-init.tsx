'use client';

/**
 * Componente de inicialização do PWA
 * 
 * Este componente é responsável por:
 * 1. Registrar o Service Worker
 * 2. Solicitar permissão para notificações push
 * 3. Monitorar o status da conexão
 * 4. Sincronizar dados em background
 */

import { useEffect, useState } from 'react';

// Interface para estender o ServiceWorkerRegistration com o SyncManager
interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}

export function PWAInit() {
  const [isOnline, setIsOnline] = useState(true);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // ============================================
    // 1. Registrar o Service Worker
    // ============================================
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('[PWA] Service Worker registrado com sucesso:', registration);
            setSwRegistered(true);

            // Verifica atualizações do SW a cada hora
            intervalId = setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);
          })
          .catch((error) => {
            console.error('[PWA] Erro ao registrar Service Worker:', error);
          });
      });
    }

    // ============================================
    // 2. Monitorar status da conexão
    // ============================================
    const handleOnline = () => {
      console.log('[PWA] Conexão restaurada');
      setIsOnline(true);

      // Solicita sincronização em background quando reconectar
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          const reg = registration as ServiceWorkerRegistrationWithSync;
          if (reg.sync) {
            reg.sync.register('sync-data').catch((err: unknown) => {
              console.warn('[PWA] Erro ao registrar sincronização:', err);
            });
          }
        });
      }
    };

    const handleOffline = () => {
      console.log('[PWA] Conexão perdida');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // ============================================
    // 3. Solicitar permissão para notificações
    // ============================================
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('[PWA] Permissão para notificações concedida');
        }
      });
    }

    // ============================================
    // 4. Escutar mensagens do Service Worker
    // ============================================
    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {
        const { type, data } = event.data;
        if (type === 'SYNC_COMPLETE') {
          console.log('[PWA] Sincronização concluída:', data);
        }
      };
      navigator.serviceWorker.addEventListener('message', handleMessage);
      
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (intervalId) clearInterval(intervalId);
      };
    }

    // Cleanup padrão caso serviceWorker não exista
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
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
