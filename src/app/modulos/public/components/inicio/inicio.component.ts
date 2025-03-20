import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service'; // Servicio para obtener los productos

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styles: ``
})
export class InicioComponent implements OnInit {
  productos: any[] = []; // Variable para almacenar los productos

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.apiService.obtenerProductosPorCategoria().subscribe(
      (response) => {
        this.productos = response.productos; // Asigna los productos desde la respuesta
        console.log('Productos cargados:', this.productos);

        // Verificar si la imagen está correctamente formateada
        this.productos.forEach((producto, index) => {
          console.log(`Producto ${index + 1}:`, {
            nombre: producto.nombre_producto,
            imagen: producto.imagen ? 'Imagen presente' : 'Sin imagen'
          });
        });
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  mostrarAlertaCarrito(): void {
    alert("Debes iniciar sesión para agregar productos al carrito.");
  }
}
