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

          // Procesar productos y asignar categoria_id
          this.productos = this.categorias
            .map((categoria: any) => categoria.productos.length > 0 ? { 
              ...categoria.productos[0], 
              categoria: categoria.nombre_categoria,
              categoria_id: categoria.id, // Aseguramos que el ID de la categoría esté presente
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

//   convertirImagen(imagenBuffer: any): string {
//   if (!imagenBuffer || !imagenBuffer.data) {
//     return 'assets/default-image.jpg'; // Imagen por defecto
//   }
//   const byteArray = new Uint8Array(imagenBuffer.data);
//   const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Ajusta el tipo si es PNG u otro formato
//   return URL.createObjectURL(blob);
// }
// convertirImagen(imagenData: any): string {
//   // Si ya es una URL base64
//   if (typeof imagenData === 'string' && imagenData.startsWith('data:image/')) {
//     return imagenData;
//   }
  
//   // Si el backend envía un objeto con datos base64 (caso menos común)
//   if (imagenData?.base64) {
//     return `data:${imagenData.type};base64,${imagenData.base64}`;
//   }

//   // Imagen por defecto si no hay datos
//   return 'assets/default-image.jpg';
// }


convertirImagen(imagenData: any): string {
  // Si ya es una URL base64
  if (typeof imagenData === 'string' && imagenData.startsWith('data:image/')) {
    return imagenData;
  }

  // Si el backend envía un objeto con datos base64 (caso menos común)
  if (imagenData?.base64) {
    return `data:${imagenData.type};base64,${imagenData.base64}`;
  }

  // Si el backend envía un buffer de datos
  if (imagenData?.data) {
    const byteArray = new Uint8Array(imagenData.data);
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Ajusta el tipo si es PNG u otro formato
    return URL.createObjectURL(blob);
  }

  // Imagen por defecto si no hay datos
  return 'assets/default-image.jpg';
}

  mostrarAlertaCarrito(): void {
    alert('Debes iniciar sesión para agregar productos al carrito.');
  }

  verMas(categoriaId: number): void {
    console.log('[DEBUG] ID de la categoría recibido:', categoriaId); // Depuración
  
    if (!categoriaId) {
      console.warn('[WARNING] El ID de la categoría es inválido:', categoriaId);
      return;
    }
  
    this.apiService.obtenerConclik(categoriaId).subscribe(
      (response) => {
        if (response && Array.isArray(response.productos)) {
          this.productos = response.productos.map((producto: any) => ({
            ...producto,
            imagen: this.convertirImagen(producto.imagen) // Convertir Buffer a URL
          }));
          console.log(`[INFO] Productos de la categoría ${categoriaId} cargados:`, this.productos);
        } else {
          console.warn('[WARNING] No se encontraron productos para esta categoría:', response);
          this.productos = [];
        }
      },
      (error) => {
        console.error('[ERROR] No se pudieron obtener los productos de la categoría:', error);
      }
    );
  }
}