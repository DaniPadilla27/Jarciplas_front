import { Component, type OnInit } from "@angular/core"
import  { Router } from "@angular/router"
import  { ApiService } from "../../../../services/api.service"

interface Producto {
  id: number
  nombre_producto: string
  precio: number
  categoria: string
  descripcion: string
  imagen: string
  stock: number
}

@Component({
  selector: "app-productos",
  standalone: false,
  templateUrl: "./productos.component.html",
  styles: `
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .hover\\:scale-105:hover {
      transform: scale(1.05);
    }
    
    .hover\\:scale-\\[1\\.02\\]:hover {
      transform: scale(1.02);
    }
  `,
})
export class ProductosComponent implements OnInit {
  productos: any[] = [] // Lista de productos obtenidos del backend
  searchTerm = "" // Variable para almacenar la búsqueda
  currentIndex = 0 // Índice actual del carrusel
  mostrarModal = false

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.obtenerProductos()
  }

  obtenerProductos(): void {
    this.apiService.obtenerProductos().subscribe({
      next: (data) => {
        if (data && Array.isArray(data.productos)) {
          this.productos = data.productos // Solo asigna si es un array válido
          console.log("[INFO] Productos cargados:", this.productos)
        } else if (data && Array.isArray(data)) {
          // Si la respuesta directa es un array
          this.productos = data
          console.log("[INFO] Productos cargados (array directo):", this.productos)
        } else {
          console.warn("[WARNING] Datos inesperados recibidos:", data)
          this.productos = [] // Evita asignaciones erróneas
        }
      },
      error: (error) => {
        console.error("[ERROR] No se pudieron obtener los productos:", error)
        this.productos = []
      },
    })
  }

  // 🔍 Método para filtrar productos en tiempo real
  filtrarProductos(): any[] {
    if (!this.searchTerm.trim()) {
      return this.productos
    }

    const termino = this.searchTerm.toLowerCase().trim()
    return this.productos.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(termino)),
    )
  }

  // Método para navegar al producto anterior en el carrusel
  anteriorProducto(): void {
    const productosFiltrados = this.filtrarProductos()
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : productosFiltrados.length - 1
  }

  // Método para navegar al siguiente producto en el carrusel
  siguienteProducto(): void {
    const productosFiltrados = this.filtrarProductos()
    this.currentIndex = this.currentIndex < productosFiltrados.length - 1 ? this.currentIndex + 1 : 0
  }

  // Métodos para el modal de inicio de sesión
  mostrarMensajeInicioSesion(): void {
    this.mostrarModal = true
  }

  cerrarModal(): void {
    this.mostrarModal = false
  }

  // Métodos de redirección
  redirectToLogin(): void {
    this.router.navigate(["/public/login"])
    this.cerrarModal() // Cerrar modal después de redirigir
  }

  redirectToRegistro(): void {
    this.router.navigate(["/public/registro"])
    this.cerrarModal() // Cerrar modal después de redirigir
  }

  // Método para manejar errores de imagen
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement
    if (target) {
      target.src = "/placeholder.svg?height=256&width=256"
    }
  }
}
