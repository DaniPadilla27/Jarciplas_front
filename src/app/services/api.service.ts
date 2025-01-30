import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../variables/environment'; // Ajustar la ruta si es necesario

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  login(Correo: string, Contraseña: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}usuarios/iniciar_sesion`, { Correo, Contraseña });
  }

  registrarUsuario(
    Nombre: string,
    Apellido_Paterno: string,
    Apellido_Materno: string,
    Edad: number,
    Genero: string,
    Correo: string,
    Telefono: string,
    Contraseña: string
  ): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}usuarios`, {
      Nombre,
      Apellido_Paterno,
      Apellido_Materno,
      Edad,
      Genero,
      Correo,
      Telefono,
      Contraseña,
    });
  }

  crearProducto(
    nombre_producto: string,
    precio: number,
    categoria: string,
    imagen: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nombre_producto', nombre_producto);
    formData.append('precio', precio.toString());
    formData.append('categoria', categoria);
    formData.append('imagen', imagen, imagen.name); // Asegurar que el archivo tiene un nombre

    // Debug: Verificar que FormData tiene los datos correctos
    console.log('FormData enviado:', formData);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return this.http.post<any>(`${environment.apiUrl}cambios`, formData); // Asegurar que la ruta sea la correcta
  }
}
