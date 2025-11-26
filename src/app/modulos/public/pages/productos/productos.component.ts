import { Component, type OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { ApiService } from "../../../../services/api.service"

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
  // Productos cargados desde el backend
  productos: any[] = []

  // Filtros
  searchTerm = ""
  categoriaSeleccionada: string = ""
  ordenPrecio: string = ""
  precioMax: number | null = null

  // Carrusel
  currentIndex = 0

  // Modal
  mostrarModal = false

  // Voz
  escuchando = false
  reconocimiento: any = null

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.obtenerProductos()

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      this.reconocimiento = new SpeechRecognition()
      this.reconocimiento.lang = "es-ES"
      this.reconocimiento.continuous = false
      this.reconocimiento.interimResults = false

      this.reconocimiento.onresult = (event: any) => {
        const resultado = event.results[0][0].transcript
        this.searchTerm = resultado
        this.escuchando = false
      }

      this.reconocimiento.onend = () => {
        this.escuchando = false
      }

      this.reconocimiento.onerror = () => {
        this.escuchando = false
      }
    }
  }

  activarBusquedaVoz(): void {
    if (!this.reconocimiento) {
      alert("La búsqueda por voz no es compatible con este navegador.")
      return
    }

    if (this.escuchando) {
      this.reconocimiento.stop()
      this.escuchando = false
    } else {
      try {
        this.escuchando = true
        this.reconocimiento.start()
      } catch {
        this.escuchando = false
      }
    }
  }

  obtenerProductos(): void {
    this.apiService.obtenerProductos().subscribe({
      next: (data) => {
        if (data && Array.isArray(data.productos)) {
          this.productos = data.productos
        } else if (data && Array.isArray(data)) {
          this.productos = data
        } else {
          this.productos = []
        }

        console.log("[INFO] Productos cargados:", this.productos)
      },
      error: (error) => {
        console.error("[ERROR] No se pudieron obtener los productos:", error)
        this.productos = []
      },
    })
  }

  // 🔍 FILTRO COMPLETO SUPER OPTIMIZADO
  filtrarProductos(): any[] {
    let lista = [...this.productos]

    // 1. FILTRAR POR TEXTO
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim()
      lista = lista.filter(
        (p) =>
          p.nombre_producto.toLowerCase().includes(termino) ||
          p.categoria.toLowerCase().includes(termino) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(termino)),
      )
    }

    // 2. FILTRAR POR CATEGORÍA
    if (this.categoriaSeleccionada.trim()) {
      lista = lista.filter(
        (p) => p.categoria.toLowerCase() === this.categoriaSeleccionada.toLowerCase(),
      )
    }

    // 3. FILTRAR POR PRECIO MÁXIMO
    if (this.precioMax !== null && this.precioMax > 0) {
      lista = lista.filter((p) => p.precio <= this.precioMax!)
    }

    // 4. ORDENAR POR PRECIO
    if (this.ordenPrecio === "asc") {
      lista.sort((a, b) => a.precio - b.precio)
    } else if (this.ordenPrecio === "desc") {
      lista.sort((a, b) => b.precio - a.precio)
    }

    return lista
  }

  anteriorProducto(): void {
    const productosFiltrados = this.filtrarProductos()
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : productosFiltrados.length - 1
  }

  siguienteProducto(): void {
    const productosFiltrados = this.filtrarProductos()
    this.currentIndex =
      this.currentIndex < productosFiltrados.length - 1 ? this.currentIndex + 1 : 0
  }

  mostrarMensajeInicioSesion(): void {
    this.mostrarModal = true
  }

  cerrarModal(): void {
    this.mostrarModal = false
  }

  redirectToLogin(): void {
    this.router.navigate(["/public/login"])
    this.cerrarModal()
  }

  redirectToRegistro(): void {
    this.router.navigate(["/public/registro"])
    this.cerrarModal()
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement
    if (target) {
      target.src = "/placeholder.svg?height=256&width=256"
    }
  }
}
