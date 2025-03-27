import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styles: ``
})
export class InicioComponent implements OnInit {
  productos: any[] = []; // Lista de productos obtenidos del backend
  categorias: any[] = []; // Lista de categorías con productos
  searchTerm: string = ''; // Variable para almacenar la búsqueda

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerProductosPorCategoria();
  }

  obtenerProductosPorCategoria(): void {
    this.apiService.obtenerProductosPorCategoria().subscribe(
      (response) => {
        if (response && Array.isArray(response.categorias)) {
          this.categorias = response.categorias; // Asignamos las categorías con sus productos

          // Solo tomar el primer producto de cada categoría y decodificar la imagen
          this.productos = this.categorias
            .map((categoria: any) => categoria.productos.length > 0 ? { 
              ...categoria.productos[0], 
              categoria: categoria.nombre_categoria,
              imagen: this.convertirImagen(categoria.productos[0].imagen) // Convertir Buffer a URL
            } : null)
            .filter((producto: any) => producto !== null);

          console.log('[INFO] Productos filtrados por categoría:', this.productos);
        } else {
          console.warn('[WARNING] Datos inesperados recibidos:', response);
          this.productos = [];
        }
      },
      (error) => {
        console.error('[ERROR] No se pudieron obtener los productos por categoría:', error);
      }
    );
  }

  convertirImagen(imagenBuffer: any): string {
    if (!imagenBuffer || !imagenBuffer.data) {
      return 'assets/default-image.jpg'; // Imagen por defecto
    }
    const byteArray = new Uint8Array(imagenBuffer.data);
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Ajusta el tipo si es PNG u otro formato
    return URL.createObjectURL(blob);
  }

  mostrarAlertaCarrito(): void {
    alert('Debes iniciar sesión para agregar productos al carrito.');
  }

  verMas(categoria: string): void {
    const categoriaSeleccionada = this.categorias.find((cat: any) => cat.nombre_categoria === categoria);
    if (categoriaSeleccionada) {
      this.productos = categoriaSeleccionada.productos.map((producto: any) => ({
        ...producto,
        categoria: categoriaSeleccionada.nombre_categoria,
        imagen: this.convertirImagen(producto.imagen) // Convertir Buffer a URL
      }));
      console.log(`Productos cargados para la categoría: ${categoria}`, this.productos);
    } else {
      console.warn(`[WARNING] Categoría no encontrada: ${categoria}`);
    }
  }
}
