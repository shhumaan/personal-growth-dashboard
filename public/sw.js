// Service Worker for Push Notifications
// This enables background notifications and handles user interactions

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  // Handle different notification actions
  switch (action) {
    case 'start-now':
    case 'continue':
    case 'finish-strong':
    case 'work-now':
    case 'redeem-now':
      // Open dashboard
      event.waitUntil(
        clients.openWindow('/')
      );
      break;
      
    case 'remind-later':
      // Schedule reminder in 30 minutes
      setTimeout(() => {
        self.registration.showNotification('⏰ Reminder: Still waiting...', {
          body: 'Your family is still counting on you. No more delays.',
          icon: '/notification-reminder.png',
          tag: 'reminder-followup',
          requireInteraction: true
        });
      }, 30 * 60 * 1000);
      break;
      
    case 'view-progress':
      event.waitUntil(
        clients.openWindow('/weekly')
      );
      break;
      
    case 'view-shame':
      // Open accountability page (we'll create this)
      event.waitUntil(
        clients.openWindow('/accountability')
      );
      break;
      
    case 'celebrate':
      // Open celebration page
      event.waitUntil(
        clients.openWindow('/?celebrate=true')
      );
      break;
      
    case 'share-win':
      // Open share functionality
      event.waitUntil(
        clients.openWindow('/?share=true')
      );
      break;
      
    case 'work-weekend':
      event.waitUntil(
        clients.openWindow('/?weekend-mode=true')
      );
      break;
      
    default:
      // Default action - open dashboard
      event.waitUntil(
        clients.openWindow('/')
      );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
  
  // If accountability notification is closed without action, increase pressure
  if (event.notification.tag === 'accountability') {
    setTimeout(() => {
      self.registration.showNotification('😔 Closing notifications won\'t help...', {
        body: 'Your family\'s dreams don\'t disappear when you ignore them.',
        icon: '/notification-persistent.png',
        tag: 'persistent-shame',
        requireInteraction: true
      });
    }, 5 * 60 * 1000); // 5 minutes later
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync any pending progress updates
  console.log('Background sync triggered');
}

// Handle push messages (for when we add server-sent notifications)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: data.data,
      actions: data.actions,
      tag: data.tag,
      requireInteraction: data.requireInteraction
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Periodic background sync (Chrome only)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-accountability') {
    event.waitUntil(checkDailyProgress());
  }
});

async function checkDailyProgress() {
  // Check if user has completed daily tasks
  // This would connect to your API
  try {
    const response = await fetch('/api/check-progress');
    const data = await response.json();
    
    if (data.needsAccountability) {
      await self.registration.showNotification('🚨 Daily Check Failed', {
        body: 'Another day wasted. Your family deserves better.',
        icon: '/notification-failed.png',
        tag: 'daily-failure',
        requireInteraction: true
      });
    }
  } catch (error) {
    console.error('Failed to check daily progress:', error);
  }
}

// Handle errors
self.addEventListener('error', (event) => {
  console.error('Service worker error:', event.error);
});

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});