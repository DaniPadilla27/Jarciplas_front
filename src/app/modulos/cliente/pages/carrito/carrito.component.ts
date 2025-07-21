import { Component, type OnInit, type AfterViewInit, type ElementRef, ViewChild } from "@angular/core"
import  { ApiService } from "../../../../services/api.service"
import  { Router } from "@angular/router"
import  { AuthService } from "../../../../services/auth.service"
import  { CartService } from "../../../../services/cart.service"

declare var paypal: any

@Component({
  selector: "app-carrito",
  standalone: false,
  templateUrl: "./carrito.component.html",
  styleUrls: ["./carrito.component.scss"],
})
export class CarritoComponent implements OnInit, AfterViewInit {
  @ViewChild("paypalButtonContainer", { static: false }) paypalButtonContainer!: ElementRef

  id_usuario!: number
  cartItems: any[] = []
  mensaje = ""
  paymentInProgress = false
  paymentCompleted = false

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.id_usuario = this.authService.getUserId()
    this.obtenerCarrito()
  }

  ngAfterViewInit(): void {
    // Inicializar PayPal después de que la vista se haya cargado
    setTimeout(() => {
      this.initializePayPal()
    }, 100)
  }

  initializePayPal(): void {
    if (typeof paypal !== "undefined" && this.paypalButtonContainer) {
      paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 55,
          },
          createOrder: (data: any, actions: any) => {
            const total = this.calcularTotal()
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: total.toFixed(2),
                    currency_code: "MXN",
                  },
                  description: `Compra en JarciplasFront - ${this.cartItems.length} productos`,
                },
              ],
            })
          },
          onApprove: (data: any, actions: any) => {
            this.paymentInProgress = true
            return actions.order.capture().then((details: any) => {
              console.log("Pago completado:", details)
              this.paymentCompleted = true
              this.procesarCompraExitosa(details)
            })
          },
          onError: (err: any) => {
            console.error("Error en el pago:", err)
            this.paymentInProgress = false
            this.mensaje = "Error al procesar el pago. Por favor, inténtalo de nuevo."
          },
          onCancel: (data: any) => {
            console.log("Pago cancelado:", data)
            this.paymentInProgress = false
            this.mensaje = "Pago cancelado. Puedes intentar de nuevo cuando gustes."
          },
        })
        .render(this.paypalButtonContainer.nativeElement)
    }
  }

  procesarCompraExitosa(paypalDetails: any): void {
    // Aquí ejecutamos la compra en nuestro backend después del pago exitoso
    this.apiService.comprarProductos(this.id_usuario).subscribe(
      (response) => {
        this.paymentInProgress = false
        alert(`¡Compra realizada con éxito! 
               ID de transacción PayPal: ${paypalDetails.id}
               Total pagado: $${this.calcularTotal()} MXN`)
        this.cartItems = []
        this.cartService.updateCartCount(0)
        this.paymentCompleted = false

        // Opcional: redirigir a una página de confirmación
        // this.router.navigate(['/confirmacion-compra']);
      },
      (error) => {
        console.error("Error al registrar la compra en el backend:", error)
        this.paymentInProgress = false
        alert("El pago se procesó correctamente, pero hubo un error al registrar la compra. Contacta al soporte.")
      },
    )
  }

  obtenerCarrito(): void {
    this.apiService.obtenerCarritoPorUsuario(this.id_usuario).subscribe(
      (data) => {
        console.log("Datos del carrito:", data)
        this.cartItems = data.map((item: any) => ({
          ...item,
          imagen: item.imagen || "",
        }))
        this.cartService.updateCartCount(this.cartItems.length)

        // Reinicializar PayPal cuando el carrito cambie
        setTimeout(() => {
          this.initializePayPal()
        }, 100)
      },
      (error) => {
        console.error("Error al obtener el carrito:", error)
        this.mensaje = "No se pudo cargar el carrito."
      },
    )
  }

  decrementarCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad--
      item.precio_total = this.roundToTwoDecimals(item.cantidad * item.precio_unitario)
      this.actualizarItemCarrito(item).then(() => this.obtenerCarrito())
    }
  }

  incrementarCantidad(item: any): void {
    if (item.cantidad + 1 > item.stock) {
      this.mensaje = `No puedes agregar más de ${item.stock} unidades de ${item.nombre_producto}.`
      return
    }
    item.cantidad++
    item.precio_total = this.roundToTwoDecimals(item.cantidad * item.precio_unitario)
    this.actualizarItemCarrito(item).then(() => this.obtenerCarrito())
  }

  eliminarDelCarrito(item: any): void {
    this.apiService.eliminarDelCarrito(item.id_carrito).subscribe(
      () => {
        this.cartItems = this.cartItems.filter((i) => i.id_carrito !== item.id_carrito)
        this.cartService.updateCartCount(this.cartItems.length)
      },
      (error) => {
        console.error("Error al eliminar el producto del carrito:", error)
        this.mensaje = "No se pudo eliminar el producto del carrito."
      },
    )
  }

  actualizarItemCarrito(item: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.actualizarCarrito(item.id_carrito, item.cantidad).subscribe(
        () => {
          console.log("Carrito actualizado correctamente")
          resolve()
        },
        (error) => {
          console.error("Error al actualizar el carrito:", error)
          this.mensaje = "No se pudo actualizar el carrito."
          reject(error)
        },
      )
    })
  }

  calcularSubtotal(): number {
    const subtotal = this.cartItems.reduce((total, item) => total + item.precio_unitario * item.cantidad, 0)
    return this.roundToTwoDecimals(subtotal)
  }

  calcularEnvio(): number {
    return this.roundToTwoDecimals(0.0)
  }

  calcularTotal(): number {
    return this.roundToTwoDecimals(this.calcularSubtotal() + this.calcularEnvio())
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100
  }

  // Esta función ya no se usa directamente, solo después del pago exitoso
  comprarCarrito(): void {
    // Esta función ahora solo se ejecuta desde procesarCompraExitosa()
    console.log("Compra procesada a través de PayPal")
  }
}
