// Service Worker para manejar notificaciones push y cachear páginas
const CACHE_NAME = "push-notifications-v2"

// Lista de páginas a cachear
const URLS_TO_CACHE = [
  '/',
  '/home',
  '/login',
  '/registro',
  '/inicio',
  '/index.html',
]

// Instalar el service worker y cachear páginas
globalThis.addEventListener("install", (event) => {
  console.log("Service Worker instalado")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE)
    })
  )
  globalThis.skipWaiting()
})
// Interceptar peticiones y servir desde el caché si existe
globalThis.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché, responde con el caché
      if (response) {
        return response
      }
      // Si no, realiza la petición normalmente
      return fetch(event.request)
    })
  )
})

// Activar el service worker
globalThis.addEventListener("activate", (event) => {
  console.log("Service Worker activado")
  event.waitUntil(globalThis.clients.claim())
})

// Manejar notificaciones push recibidas
globalThis.addEventListener("push", (event) => {
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
      // Enviar datos a la app para guardar en localStorage
      globalThis.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'GUARDAR_LOCALSTORAGE',
            key: 'notificacion',
            value: data
          })
        })
      })
    } catch (error) {
      console.error("Error al parsear datos de la notificación:", error)
    }
  }

  // Mostrar la notificación
  const promiseChain = globalThis.registration.showNotification(notificationData.title, {
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
globalThis.addEventListener("notificationclick", (event) => {
  console.log("Notificación clickeada:", event)

  // Cerrar la notificación
  event.notification.close()

  // Manejar acciones específicas
  if (event.action) {
    switch (event.action) {
      case "explore":
        // Abrir una URL específica
        event.waitUntil(globalThis.clients.openWindow("/admin/productos"))
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
      globalThis.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        // Si hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes("/admin") && "focus" in client) {
            return client.focus()
          }
        }

        // Si no hay ventana abierta, abrir una nueva
        if (globalThis.clients.openWindow) {
          return globalThis.clients.openWindow("/admin")
        }
      }),
    )
  }
})

// Manejar el cierre de notificaciones
globalThis.addEventListener("notificationclose", (event) => {
  console.log("Notificación cerrada:", event)

  // Aquí puedes agregar lógica para tracking de notificaciones cerradas
  // Por ejemplo, enviar analytics
})

// Manejar errores de push
globalThis.addEventListener("pushsubscriptionchange", (event) => {
  console.log("Suscripción push cambió:", event)

  // Aquí puedes manejar cambios en la suscripción
  // Por ejemplo, renovar la suscripción automáticamente
})
