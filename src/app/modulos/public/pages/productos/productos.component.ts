import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service'; 

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styles: ``
})
export class ProductosComponent implements OnInit {
  productos: any[] = []; // Lista de productos obtenidos del backend
  searchTerm: string = ''; // Variable para almacenar la búsqueda
  currentIndex: number = 0; // Índice actual del carrusel

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.apiService.obtenerProductos().subscribe(
      (data) => {
        this.productos = data.productos; // Carga los productos desde la API
        console.log('Productos cargados:', this.productos); // Verificar en consola
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  // 🔍 Método para filtrar productos en tiempo real
  filtrarProductos(): any[] {
    return this.productos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Método para navegar al producto anterior en el carrusel
  anteriorProducto(): void {
    const productosFiltrados = this.filtrarProductos();
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : productosFiltrados.length - 1;
  }

  // Método para navegar al siguiente producto en el carrusel
  siguienteProducto(): void {
    const productosFiltrados = this.filtrarProductos();
    this.currentIndex = (this.currentIndex < productosFiltrados.length - 1) ? this.currentIndex + 1 : 0;
  }
}