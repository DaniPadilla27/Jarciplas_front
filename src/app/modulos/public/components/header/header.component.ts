import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent implements OnInit {
  categorias: string[] = []; // Lista de categorías obtenidas del backend

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  // Método para obtener las categorías desde el API
  obtenerCategorias(): void {
    this.apiService.obtenercategorias().subscribe(
      (data) => {
        if (data && Array.isArray(data.categorias)) {
          this.categorias = data.categorias; // Asignar categorías si son válidas
          console.log('[INFO] Categorías cargadas:', this.categorias);
        } else {
          console.warn('[WARNING] Datos inesperados recibidos:', data);
          this.categorias = [];
        }
      },
      (error) => {
        console.error('[ERROR] No se pudieron obtener las categorías:', error);
      }
    );
  }

  // Método para redirigir a los productos filtrados por categoría
  redirigirPorCategoria(categoria: string): void {
    this.router.navigate(['/public/productos'], { queryParams: { categoria } });
  }

  mostrarAlertaCarrito(): void {
    alert('Debes iniciar sesión para agregar productos al carrito.');
  }

  // Método para redirigir al login
  redirectToLogin(): void {
    this.router.navigate(['/public/login']);
  }

  // Método para redirigir al registro
  redirectToRegistro(): void {
    this.router.navigate(['/public/registro']);
  }
}