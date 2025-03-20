import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import environment from '../variables/environment'; // Ajustar la ruta si es necesario

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

 //nueva linea de codigo para la busqueda 
  obtenerProductoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}producto/${id}`);
  }

  solicitarRecuperacionContrasena(email: string): Observable<any> {
    const body = { email }; // El cuerpo de la solicitud debe coincidir con lo que espera el backend
    return this.http.post<any>(`${environment.apiUrl}solicitarR`, body);
  }
  verificarCodigo(codigo: string, email: string): Observable<any> {
    const body = { codigo, email }; // El cuerpo de la solicitud debe coincidir con lo que espera el backend
    return this.http.post<any>(`${environment.apiUrl}verificarCodigo`, body);
  }

  actualizarContrasena(correo: string, nuevaContrasena: string): Observable<any> {
    const body = { correo, nuevaContrasena }; // Cuerpo de la solicitud
    return this.http.put<any>(`${environment.apiUrl}actualizarcon`, body);
  }
  actualizarProducto(id: number, nombre_producto: string, precio: string, categoria: string, descripcion: string, imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append('nombre_producto', nombre_producto);
    formData.append('precio', precio);
    formData.append('categoria', categoria);
    formData.append('descripcion', descripcion);
  
    if (imagen) {
      formData.append('imagen', imagen);
    }
  
    return this.http.put<any>(`${environment.apiUrl}productos/${id}`, formData);
  }
  
  obtenerProductos(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}mostrar`);
  }
  editarProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}editar/${id}`, producto);
  }
  
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}eliminar/${id}`);
  }
  obtenerPoliticas(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}politicas`);
  }
  obtenerTrabajadores(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}trabajadores`);
  }
  
  obtenerProductosPorCategoria(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}productos-por-categoria`);
  }

  login(Correo: string, Contraseña: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}usuarios/iniciar_sesion`, { Correo, Contraseña });
  }


  registrarUsuario(
    Nombre: string,
    Correo: string,
    Contraseña: string,
    Telefono: string,
    pregunta_secreta: string, // Corregido para coincidir con el backend
    respuesta_secreta: string // Corregido para coincidir con el backend
     // Agregado porque el backend lo espera
  ): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}usuarios`, {
      Nombre,
      Correo,
      Contraseña,
      Telefono,
      pregunta_secreta, // Ahora coincide con el backend
      respuesta_secreta // Ahora coincide con el backend
     // Enviado correctamente
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  recuperarConPreguntaSecreta(
    Telefono: string,
    pregunta_secreta?: string,
    respuesta_secreta?: string,
    nuevaContraseña?: string
  ): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}preguntasecreta`, {
      Telefono,
      pregunta_secreta,
      respuesta_secreta,
      nuevaContraseña
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  crearProducto(
    nombre_producto: string,
    precio: number,
    categoria: string,
    descripcion:string,
    imagen: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nombre_producto', nombre_producto);
    formData.append('precio', precio.toString());
    formData.append('categoria', categoria);
    formData.append('descripcion',descripcion);
    formData.append('imagen', imagen, imagen.name); // Asegurar que el archivo tiene un nombre

    // Debug: Verificar que FormData tiene los datos correctos
    console.log('FormData enviado:', formData);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

  

    return this.http.post<any>(`${environment.apiUrl}cambios`, formData); // Asegurar que la ruta sea la correcta
  }

  
  crearContacto(
    nombre: string,
    informacion: string
  ): Observable<any> {
    const body = {
      nombre,
      informacion
    };
  
    // Debug: Verificar que el cuerpo de la solicitud tiene los datos correctos
    console.log('Datos enviados para crear Contacto:', body);
  
    return this.http.post<any>(`${environment.apiUrl}contacto`, body); // Asegúrate de que la ruta sea la correcta
  }

  crearPolitica(
    titulo: string,
    contenido: string
  ): Observable<any> {
    const body = {
      titulo,
      contenido
    };
  
    // Debug: Verificar que el cuerpo de la solicitud tiene los datos correctos
    console.log('Datos enviados para crear política:', body);
  
    return this.http.post<any>(`${environment.apiUrl}politicas`, body); // Asegúrate de que la ruta sea la correcta
  }

  // Dentro de api.service.ts

agregarAlCarrito(id_usuario: number, id_producto: number, cantidad: number): Observable<any> {
  const body = { id_usuario, id_producto, cantidad };
  return this.http.post<any>(`${environment.apiUrl}carrito`, body);
}

obtenerCarritoPorUsuario(id_usuario: number): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}carrito/${id_usuario}`);
}
    // Método para eliminar un producto del carrito
    eliminarDelCarrito(id_carrito: number): Observable<any> {
      return this.http.delete<any>(`${environment.apiUrl}carrito/${id_carrito}`);
  }

  // Método para actualizar la cantidad de un producto en el carrito
  actualizarCarrito(id_carrito: number, cantidad: number): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}carrito/${id_carrito}`, { cantidad });
  }

}
