import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styles: ``,
})
export class InicioComponent implements OnInit {
  productos: any[] = []; // Variable para almacenar los productos
  carrito: any[] = []; // Carrito de compras

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.apiService.obtenerProductos().subscribe(
      (data) => {
        this.productos = data.productos; // Ahora se asigna correctamente
        console.log('Productos cargados:', this.productos); // Verificar en consola
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  verDetalle(id: number) {
    console.log('ID del producto seleccionado:', id);
    this.router.navigate(['/cliente/detalle',id]);
  }

  // Función para agregar productos al carrito
  agregarAlCarrito(producto: any): void {
    this.carrito.push(producto); // Agregar el producto al carrito
    console.log('Producto agregado al carrito:', producto);
    console.log('Carrito actual:', this.carrito); // Mostrar carrito actual en consola
  }
}
