import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import  environment  from '../variables/environment'; // Ajustar la ruta si es necesario

@Injectable({
  providedIn: 'root'
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
      Contraseña
    });
  }
}
