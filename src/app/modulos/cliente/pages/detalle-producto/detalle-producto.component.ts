import { Component, type OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import  { ApiService } from "../../../../services/api.service"
import  { CartService } from "../../../../services/cart.service"
import  { AuthService } from "../../../../services/auth.service"

@Component({
  selector: "app-detalle-producto",
  standalone: false,
  templateUrl: "./detalle-producto.component.html",
  styles: [
    `
    .recommendation-card {
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .recommendation-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    .confidence-badge {
      background: linear-gradient(135deg, #10b981, #059669);
    }
    .loading-spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #10b981;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  ],
})
export class DetalleProductoComponent implements OnInit {
  producto: any
  cantidad = 1
  id_usuario = 0
  mensajeError = ""
  carrito: any[] = []
  cantidadEnCarrito = 0

  // Propiedades para recomendaciones
  recomendaciones: any[] = []
  productosRecomendados: any[] = []
  cargandoRecomendaciones = false
  errorRecomendaciones = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.id_usuario = this.authService.getUserId()

    const id = Number(this.route.snapshot.paramMap.get("id"))
    this.apiService.obtenerProductoPorId(id).subscribe(
      (data) => {
        this.producto = data.producto
        this.cargarCarrito()
        // Cargar recomendaciones después de obtener el producto
        this.cargarRecomendaciones()
      },
      (error) => {
        console.error("Error al obtener el producto:", error)
      },
    )
  }

  cargarCarrito(): void {
    this.apiService.obtenerCarritoPorUsuario(this.id_usuario).subscribe(
      (carrito) => {
        this.carrito = carrito
        const itemEnCarrito = this.carrito.find((item: any) => item.id_producto === this.producto.id)
        this.cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0
        console.log(`Cantidad en carrito para el producto ${this.producto.id}: ${this.cantidadEnCarrito}`)
      },
      (error) => {
        console.error("Error al cargar el carrito:", error)
      },
    )
  }

  // Método mejorado para cargar recomendaciones con mejor manejo de errores
  cargarRecomendaciones(): void {
    if (!this.producto?.nombre_producto) {
      console.log("No hay producto cargado para obtener recomendaciones")
      return
    }

    this.cargandoRecomendaciones = true
    this.errorRecomendaciones = ""

    console.log("Cargando recomendaciones para:", this.producto.nombre_producto)

    this.apiService.obtenerRecomendaciones(this.producto.nombre_producto).subscribe(
      (recomendaciones) => {
        console.log("Recomendaciones recibidas:", recomendaciones)
        this.recomendaciones = recomendaciones || []
        this.procesarRecomendaciones()
        this.cargandoRecomendaciones = false
      },
      (error) => {
        console.error("Error completo al cargar recomendaciones:", error)

        // Intentar con el método alternativo si el primero falla
        console.log("Intentando con método alternativo...")
        this.apiService.obtenerRecomendacionesAlternativo(this.producto.nombre_producto).subscribe(
          (recomendaciones) => {
            console.log("Recomendaciones recibidas (método alternativo):", recomendaciones)
            this.recomendaciones = recomendaciones || []
            this.procesarRecomendaciones()
            this.cargandoRecomendaciones = false
          },
          (errorAlternativo) => {
            console.error("Error con método alternativo:", errorAlternativo)
            this.errorRecomendaciones = "No se pudieron cargar las recomendaciones"
            this.cargandoRecomendaciones = false

            // Mostrar información de debug
            console.log("URL base del environment:", (window as any).environment?.apiUrl || "No definida")
            console.log("Producto buscado:", this.producto.nombre_producto)
          },
        )
      },
    )
  }

  // Procesar recomendaciones y obtener detalles de productos
  procesarRecomendaciones(): void {
    if (!this.recomendaciones || this.recomendaciones.length === 0) {
      console.log("No hay recomendaciones para procesar")
      return
    }

    console.log("Procesando", this.recomendaciones.length, "recomendaciones")

    // Extraer productos únicos recomendados
    const productosUnicos = new Set<string>()

    this.recomendaciones.forEach((regla) => {
      if (regla.consequents && Array.isArray(regla.consequents)) {
        regla.consequents.forEach((producto: string) => {
          productosUnicos.add(producto)
        })
      }
    })

    console.log("Productos únicos encontrados:", Array.from(productosUnicos))

    // Obtener detalles de cada producto recomendado
    const promesasProductos = Array.from(productosUnicos).map((nombreProducto) => {
      return this.buscarProductoPorNombre(nombreProducto)
    })

    Promise.all(promesasProductos).then((productos) => {
      this.productosRecomendados = productos.filter((p) => p !== null)
      console.log("Productos recomendados procesados:", this.productosRecomendados)
    })
  }

  // Buscar producto por nombre
  buscarProductoPorNombre(nombre: string): Promise<any> {
    return new Promise((resolve) => {
      this.apiService.obtenerProductos().subscribe(
        (response) => {
          const productos = response.productos || response || []
          const producto = productos.find(
            (p: any) =>
              p.nombre_producto?.toLowerCase().includes(nombre.toLowerCase()) ||
              nombre.toLowerCase().includes(p.nombre_producto?.toLowerCase()),
          )

          if (producto) {
            // Agregar información de confianza de la recomendación
            const reglaRelacionada = this.recomendaciones.find((r) => r.consequents && r.consequents.includes(nombre))
            producto.confianzaRecomendacion = reglaRelacionada?.confidence || 0
            producto.liftRecomendacion = reglaRelacionada?.lift || 0
            console.log(
              "Producto encontrado:",
              producto.nombre_producto,
              "con confianza:",
              producto.confianzaRecomendacion,
            )
          } else {
            console.log("No se encontró producto para:", nombre)
          }

          resolve(producto || null)
        },
        (error) => {
          console.error("Error al buscar producto:", error)
          resolve(null)
        },
      )
    })
  }

  // Navegar a producto recomendado
  verProductoRecomendado(producto: any): void {
    this.router.navigate(["/detalle-producto", producto.id])
  }

  // Agregar producto recomendado al carrito
  agregarRecomendadoAlCarrito(producto: any): void {
    this.apiService.agregarAlCarrito(this.id_usuario, producto.id, 1).subscribe(
      (response) => {
        console.log("Producto recomendado agregado al carrito", response)
        alert(`${producto.nombre_producto} agregado al carrito`)
        this.cargarCarrito()
      },
      (error) => {
        console.error("Error al agregar producto recomendado:", error)
        alert("Error al agregar el producto al carrito")
      },
    )
  }

  onAgregarAlCarrito(): void {
    if (!this.producto || !this.producto.id) {
      console.error("Producto no cargado correctamente")
      return
    }

    const cantidadTotal = this.cantidad + this.cantidadEnCarrito

    if (cantidadTotal > this.producto.stock) {
      this.mensajeError = "Ya agregaste el límite de artículos disponibles"
      console.error(this.mensajeError)
      return
    }

    this.apiService.agregarAlCarrito(this.id_usuario, this.producto.id, this.cantidad).subscribe(
      (response) => {
        console.log("Producto agregado al carrito", response)
        this.mensajeError = ""
        alert("Producto agregado correctamente al carrito")
        this.cargarCarrito()
      },
      (error) => {
        console.error("Error al agregar al carrito:", error)
        this.mensajeError = "Ocurrió un error al intentar agregar el producto al carrito"
      },
    )
  }

  // Obtener porcentaje de confianza formateado
  obtenerPorcentajeConfianza(confianza: number): number {
    return Math.round((confianza || 0) * 100)
  }
}
