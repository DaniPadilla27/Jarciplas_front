// Service Worker para manejar notificaciones push
const CACHE_NAME = "push-notifications-v1"

// Instalar el service worker
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado")
  self.skipWaiting()
})

// Activar el service worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker activado")
  event.waitUntil(self.clients.claim())
})

// Manejar notificaciones push recibidas
self.addEventListener("push", (event) => {
  console.log("Notificación push recibida:", event)

  let notificationData = {
    title: "Nueva Notificación",
    body: "Tienes una nueva notificación",
    icon: "/assets/icons/icon-192x192.png",
    badge: "/assets/icons/badge-72x72.png",
    data: {},
  }

  // Si hay datos en el push, usarlos
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        data: data.data || {},
        tag: data.tag || "general",
        requireInteraction: data.requireInteraction || false,
        actions: data.actions || [],
      }
    } catch (error) {
      console.error("Error al parsear datos de la notificación:", error)
    }
  }

  // Mostrar la notificación
  const promiseChain = self.registration.showNotification(notificationData.title, {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    data: notificationData.data,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction,
    actions: notificationData.actions,
    vibrate: [100, 50, 100],
    timestamp: Date.now(),
  })

  event.waitUntil(promiseChain)
})

// Manejar clics en las notificaciones
self.addEventListener("notificationclick", (event) => {
  console.log("Notificación clickeada:", event)

  // Cerrar la notificación
  event.notification.close()

  // Manejar acciones específicas
  if (event.action) {
    switch (event.action) {
      case "explore":
        // Abrir una URL específica
        event.waitUntil(clients.openWindow("/admin/productos"))
        break
      case "close":
        // Solo cerrar la notificación (ya se hace arriba)
        break
      default:
        console.log("Acción no reconocida:", event.action)
    }
  } else {
    // Click general en la notificación
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        // Si hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes("/admin") && "focus" in client) {
            return client.focus()
          }
        }

        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow("/admin")
        }
      }),
    )
  }
})

// Manejar el cierre de notificaciones
self.addEventListener("notificationclose", (event) => {
  console.log("Notificación cerrada:", event)

  // Aquí puedes agregar lógica para tracking de notificaciones cerradas
  // Por ejemplo, enviar analytics
})

// Manejar errores de push
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("Suscripción push cambió:", event)

  // Aquí puedes manejar cambios en la suscripción
  // Por ejemplo, renovar la suscripción automáticamente
})
