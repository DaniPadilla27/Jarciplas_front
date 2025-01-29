import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../variables/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Cambiar la firma del método para aceptar un solo objeto con las propiedades necesarias
  login(Correo: string, Contraseña: string ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${environment.apiUrl}usuarios/iniciar_sesion`, { Correo, Contraseña });

  }
}

