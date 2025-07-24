
import { Component, type OnInit } from "@angular/core"
import  { ApiService } from "../../../../services/api.service"
import  { AuthService } from "../../../../services/auth.service"

interface Producto {
  id_detalle: number
  id_producto: number
  nombre_producto: string
  cantidad: number
  precio_unitario: number | string
  precio_total_producto: number | string
  imagen_producto: string
  descripcion_producto: string
}

interface Usuario {
  nombre: string
  correo: string
  telefono: string
}

interface Venta {
  id_venta: number
  id_usuario: number
  total_venta: number | string
  fecha_venta: string
  estado_venta: string
  metodo_pago: string
  id_transaccion_paypal?: string
  usuario: Usuario
  productos: Producto[]
}

@Component({
  selector: "app-historial",
  standalone: false,
  templateUrl: "./historial.component.html",
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
    
    .hover\\:-translate-y-1:hover {
      transform: translateY(-0.25rem);
    }
    
    .shadow-teal-100 {
      box-shadow: 0 10px 15px -3px rgba(20, 184, 166, 0.1), 0 4px 6px -2px rgba(20, 184, 166, 0.05);
    }

    .gradient-bg {
      background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
    }
  `,
})
export class HistorialComponent implements OnInit {
  ventas: Venta[] = []
  ventasMostradas: Venta[] = []
  loading = true
  error = ""
  paginaActual = 1
  ventasPorPagina = 5
  usuarioActual: any = null
  usuarioId = 0
  totalGastado = 0
  totalProductos = 0
  usuarioEncontrado = false

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioActual()
    this.cargarHistorialCompras()
  }

  obtenerUsuarioActual(): void {
    // 1. Primero intentar obtener el ID desde AuthService
    this.usuarioId = this.authService.getUserId()

    if (this.usuarioId && this.usuarioId > 0) {
      this.usuarioEncontrado = true
      this.obtenerDatosAdicionales()
    } else {
      this.intentarObtenerUsuarioAlternativo()
    }
  }

  obtenerDatosAdicionales(): void {
    // Intentar obtener datos adicionales del usuario para mostrar el nombre
    const userData = localStorage.getItem("usuario")
    if (userData) {
      try {
        this.usuarioActual = JSON.parse(userData)
      } catch (error) {
        // Error silencioso
      }
    }

    // Si no hay datos adicionales, crear un objeto básico
    if (!this.usuarioActual) {
      this.usuarioActual = {
        id_usuarios: this.usuarioId,
        Nombre: "Usuario",
        nombre: "Usuario",
      }
    }
  }

  intentarObtenerUsuarioAlternativo(): void {
    // Método de respaldo si AuthService no funciona
    const userId = localStorage.getItem("userId")
    if (userId) {
      this.usuarioId = Number(userId)
      this.usuarioEncontrado = true
      this.obtenerDatosAdicionales()
      return
    }

    // Intentar obtener desde sessionStorage
    const sessionData = sessionStorage.getItem("usuario")
    if (sessionData) {
      try {
        this.usuarioActual = JSON.parse(sessionData)
        this.usuarioId = this.usuarioActual.id_usuarios || 0
        this.usuarioEncontrado = this.usuarioId > 0
        return
      } catch (error) {
        // Error silencioso
      }
    }

    // Intentar obtener desde otras claves posibles
    const posiblesClaves = ["user", "currentUser", "authUser", "loginData"]
    for (const clave of posiblesClaves) {
      const data = localStorage.getItem(clave)
      if (data) {
        try {
          const userData = JSON.parse(data)
          if (userData && (userData.id_usuarios || userData.id || userData.userId)) {
            this.usuarioActual = userData
            this.usuarioId = userData.id_usuarios || userData.id || userData.userId
            this.usuarioEncontrado = true
            return
          }
        } catch (error) {
          // Error silencioso
        }
      }
    }
  }

  cargarHistorialCompras(): void {
    this.loading = true
    this.error = ""

    this.apiService.obtenerHistorialCompras().subscribe({
      next: (data) => {
        // Filtrar solo las compras del usuario actual usando el ID del AuthService
        let ventasUsuario = []

        if (this.usuarioId && this.usuarioId > 0) {
          ventasUsuario = data.filter((venta: any) => venta.id_usuario === this.usuarioId)
        } else {
          // En caso de error, no mostrar nada por seguridad
          ventasUsuario = []
        }

        // Convertir strings a números y procesar los datos
        this.ventas = ventasUsuario.map((venta: any) => ({
          ...venta,
          total_venta: this.convertirANumero(venta.total_venta),
          productos: venta.productos.map((producto: any) => ({
            ...producto,
            precio_unitario: this.convertirANumero(producto.precio_unitario),
            precio_total_producto: this.convertirANumero(producto.precio_total_producto),
            cantidad: this.convertirANumero(producto.cantidad),
          })),
        }))

        // Ordenar por fecha más reciente
        this.ventas.sort((a, b) => new Date(b.fecha_venta).getTime() - new Date(a.fecha_venta).getTime())

        // Calcular estadísticas
        this.calcularEstadisticas()

        // Mostrar las primeras ventas
        this.actualizarVentasMostradas()
        this.loading = false
      },
      error: (error) => {
        this.error = "No se pudo cargar tu historial de compras. Por favor, intenta de nuevo."
        this.loading = false
      },
    })
  }

  calcularEstadisticas(): void {
    this.totalGastado = this.ventas.reduce((total, venta) => {
      return total + this.convertirANumero(venta.total_venta)
    }, 0)

    this.totalProductos = this.ventas.reduce((total, venta) => {
      return total + this.calcularTotalProductos(venta.productos)
    }, 0)
  }

  convertirANumero(valor: any): number {
    if (typeof valor === "number") return valor
    if (typeof valor === "string") {
      const numero = Number.parseFloat(valor)
      return isNaN(numero) ? 0 : numero
    }
    return 0
  }

  actualizarVentasMostradas(): void {
    const inicio = 0
    const fin = this.paginaActual * this.ventasPorPagina
    this.ventasMostradas = this.ventas.slice(inicio, fin)
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  formatearPrecio(precio: number | string): string {
    const numero = this.convertirANumero(precio)
    return numero.toFixed(2)
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case "entregado":
      case "completado":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200"
      case "en proceso":
      case "procesando":
        return "bg-amber-100 text-amber-700 border border-amber-200"
      case "en camino":
      case "enviado":
        return "bg-blue-100 text-blue-700 border border-blue-200"
      case "cancelado":
        return "bg-red-100 text-red-700 border border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  cargarMasCompras(): void {
    this.paginaActual++
    this.actualizarVentasMostradas()
  }

  hayMasVentas(): boolean {
    return this.ventasMostradas.length < this.ventas.length
  }

  calcularTotalProductos(productos: Producto[]): number {
    return productos.reduce((total, producto) => {
      return total + this.convertirANumero(producto.cantidad)
    }, 0)
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement
    if (target) {
      target.src = "/placeholder.svg?height=80&width=80"
    }
  }

  obtenerMesAnio(fecha: string): string {
    const date = new Date(fecha)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    })
  }
}
