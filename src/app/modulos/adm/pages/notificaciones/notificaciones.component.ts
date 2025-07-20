import { Component, type OnInit } from "@angular/core"
import  { PushNotificationService } from "../../../../services/push-notification.service"
import  { AuthService } from "../../../../services/auth.service"

@Component({
  selector: "app-notificaciones",
  standalone: false,
  templateUrl: "./notificaciones.component.html",
  styleUrls: ["./notificaciones.component.scss"],
})
export class NotificacionesComponent implements OnInit {
  isSupported = false
  isSubscribed = false
  permission: NotificationPermission = "default"
  loading = false
  message = ""

  constructor(
    private pushService: PushNotificationService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.isSupported = this.pushService.isSupported()

    if (this.isSupported) {
      this.permission = Notification.permission
      this.isSubscribed = await this.pushService.isSubscribed()
    }
  }

  /**
   * Suscribe al usuario a las notificaciones push
   */
  async subscribe() {
    if (!this.isSupported) {
      this.showMessage("Tu navegador no soporta notificaciones push", "error")
      return
    }

    this.loading = true

    try {
      // Solicitar permisos
      const permission = await this.pushService.requestPermission()
      this.permission = permission

      if (permission !== "granted") {
        this.showMessage("Permisos de notificación denegados", "error")
        return
      }

      // Obtener ID del usuario actual usando tu AuthService
      const userId = this.authService.getUserId()

      if (!userId || userId === 0) {
        this.showMessage("Error: Usuario no autenticado", "error")
        return
      }

      // Suscribirse
      await this.pushService.subscribeToPush(userId)
      this.isSubscribed = true
      this.showMessage("¡Suscripción exitosa! Recibirás notificaciones push.", "success")
    } catch (error) {
      console.error("Error al suscribirse:", error)
      this.showMessage("Error al suscribirse a las notificaciones", "error")
    } finally {
      this.loading = false
    }
  }

  /**
   * Desuscribe al usuario de las notificaciones push
   */
  async unsubscribe() {
    this.loading = true

    try {
      const success = await this.pushService.unsubscribeFromPush()

      if (success) {
        this.isSubscribed = false
        this.showMessage("Te has desuscrito de las notificaciones", "success")
      } else {
        this.showMessage("Error al desuscribirse", "error")
      }
    } catch (error) {
      console.error("Error al desuscribirse:", error)
      this.showMessage("Error al desuscribirse de las notificaciones", "error")
    } finally {
      this.loading = false
    }
  }

  /**
   * Envía una notificación de prueba
   */
  async sendTestNotification() {
    if ("serviceWorker" in navigator && "Notification" in window) {
      const registration = await navigator.serviceWorker.getRegistration()

      if (registration) {
        // Usar 'as any' para evitar errores de TypeScript con propiedades no reconocidas
        const notificationOptions: any = {
          body: "Esta es una notificación de prueba desde el frontend",
          icon: "/assets/icons/icon-192x192.png",
          badge: "/assets/icons/badge-72x72.png",
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
          },
          actions: [
            {
              action: "explore",
              title: "Ver más",
              icon: "/assets/icons/checkmark.png",
            },
            {
              action: "close",
              title: "Cerrar",
              icon: "/assets/icons/xmark.png",
            },
          ],
          vibrate: [100, 50, 100],
        }

        registration.showNotification("Notificación de Prueba", notificationOptions)
      }
    }
  }

  /**
   * Muestra mensajes al usuario
   */
  private showMessage(text: string, type: "success" | "error") {
    this.message = text

    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      this.message = ""
    }, 5000)
  }

  /**
   * Obtiene el estado de los permisos en texto legible
   */
  getPermissionText(): string {
    switch (this.permission) {
      case "granted":
        return "Concedidos"
      case "denied":
        return "Denegados"
      default:
        return "No solicitados"
    }
  }

  /**
   * Obtiene la clase CSS según el estado de los permisos
   */
  getPermissionClass(): string {
    switch (this.permission) {
      case "granted":
        return "text-success"
      case "denied":
        return "text-danger"
      default:
        return "text-warning"
    }
  }
}
