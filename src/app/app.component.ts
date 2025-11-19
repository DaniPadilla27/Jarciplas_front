import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'JarciplasFront';

  ngOnInit() {
    this.solicitarPermisosNotificaciones();
    this.detectarEstadoRed();
  }

  solicitarPermisosNotificaciones() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permiso) => {
        console.log("Permiso:", permiso);
      });
    }
  }

  detectarEstadoRed() {
    window.addEventListener('offline', () => {
      this.mostrarNotificacion("⚠ Sin conexión", "Te has quedado sin internet.");
    });

    window.addEventListener('online', () => {
      this.mostrarNotificacion("✅ Conexión restablecida", "Ya tienes internet nuevamente.");
    });
  }

  mostrarNotificacion(titulo: string, cuerpo: string) {
    if (!("Notification" in window)) {
      alert(`${titulo}: ${cuerpo}`);
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(titulo, { body: cuerpo });
    } else {
      alert(`${titulo}: ${cuerpo}`);
    }
  }
}
