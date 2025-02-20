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
}
