// En src/app/services/push-notification.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private readonly VAPID_PUBLIC_KEY =
    'BGiJD7Rg1_BAC2w45aULBCSVcR2hoquJsTfZGYzFuf-AoMnrPfW2SpVVT_epwFMi6IYgou5LezD_5ALbdQ0mK6Y';
  private readonly API_URL = 'http://31.220.108.196:3005/api'; // Ajusta según tu configuración

  constructor() {
    console.log('PushNotificationService inicializado');
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Este navegador no soporta notificaciones');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    if (!this.isSupported()) {
      throw new Error('Service Workers no están soportados');
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registrado:', registration);
    return registration;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  async subscribeToPush(userId: number): Promise<PushSubscription> {
    const registration = await this.registerServiceWorker();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY),
    });

    const subscriptionData = {
      id_usuario: userId,
      endpoint: subscription.endpoint,
      p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
      auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
    };

    console.log('Datos de suscripción generados:', subscriptionData);
    
    // Enviar al servidor usando fetch
    await this.sendSubscriptionToServer(subscriptionData);

    return subscription;
  }

  // Nueva función para enviar al servidor
  private async sendSubscriptionToServer(subscriptionData: any): Promise<void> {
    try {
      console.log('Enviando suscripción al servidor...');
      
      const response = await fetch(`${this.API_URL}/suscripcion-push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Suscripción enviada exitosamente:', result);
      
    } catch (error) {
      console.error('Error al enviar suscripción al servidor:', error);
      throw error;
    }
  }

  async unsubscribeFromPush(): Promise<boolean> {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const result = await subscription.unsubscribe();
        console.log('Desuscripción exitosa:', result);
        return result;
      }
    }

    return false;
  }

  async isSubscribed(): Promise<boolean> {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      return !!subscription;
    }

    return false;
  }

  async getCurrentSubscription(): Promise<PushSubscription | null> {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      return await registration.pushManager.getSubscription();
    }

    return null;
  }
}