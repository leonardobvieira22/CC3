// Service Worker para notificações push
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker instalado');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  return self.clients.claim();
});

// Lidar com notificações push
self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: data.message || 'Nova notificação',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.data || {},
    vibrate: [100, 50, 100],
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'AI Crypto Trading', options)
  );
});

// Lidar com cliques nas notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Redirecionar para URL específica ao clicar na notificação
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    // Redirecionar para a aplicação por padrão
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
