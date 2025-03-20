import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-carrito',
  standalone: false,
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit {
  id_usuario!: number;
  cartItems: any[] = [];
  mensaje: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.id_usuario = this.authService.getUserId();
    this.obtenerCarrito();
  }

  obtenerCarrito(): void {
    this.apiService.obtenerCarritoPorUsuario(this.id_usuario).subscribe(
        (data) => {
            console.log('Datos del carrito:', data);  // Verifica que "imagen" esté presente
            const groupedItems = data.reduce((acc: any[], item: any) => {
                const existingItem = acc.find((p) => p.id_producto === item.id_producto);
                if (existingItem) {
                    existingItem.cantidad += item.cantidad;
                    existingItem.precio_total += item.precio_total;
                } else {
                    acc.push({ ...item });
                }
                return acc;
            }, []);

            this.cartItems = groupedItems;
            this.cartService.updateCartCount(this.cartItems.length);
        },
        (error) => {
            console.error('Error al obtener el carrito:', error);
            this.mensaje = 'No se pudo cargar el carrito.';
        }
    );
}

  // Función para decrementar la cantidad de un producto en el carrito
  decrementarCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      item.precio_total = item.cantidad * item.precio_unitario;
      this.actualizarItemCarrito(item);
    }
  }

  // Función para incrementar la cantidad de un producto en el carrito
  incrementarCantidad(item: any): void {
    item.cantidad++;
    item.precio_total = item.cantidad * item.precio_unitario;
    this.actualizarItemCarrito(item);
  }

  // Función para eliminar un producto del carrito
  eliminarDelCarrito(item: any): void {
    this.apiService.eliminarDelCarrito(item.id_carrito).subscribe(
      () => {
        this.cartItems = this.cartItems.filter((i) => i.id_carrito !== item.id_carrito);
        this.cartService.updateCartCount(this.cartItems.length);
      },
      (error) => {
        console.error('Error al eliminar el producto del carrito:', error);
        this.mensaje = 'No se pudo eliminar el producto del carrito.';
      }
    );
  }

  // Función para actualizar un item en el carrito
  actualizarItemCarrito(item: any): void {
    this.apiService.actualizarCarrito(item.id_carrito, item.cantidad).subscribe(
      () => {
        console.log('Carrito actualizado correctamente');
      },
      (error) => {
        console.error('Error al actualizar el carrito:', error);
        this.mensaje = 'No se pudo actualizar el carrito.';
      }
    );
  }

  // Función para calcular el subtotal de la compra
  calcularSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.precio_total, 0);
  }

  // Función para calcular el costo de envío (puedes personalizar esta lógica)
  calcularEnvio(): number {
    // Ejemplo: Envío fijo de $5.00
    return 5.0;
  }

  // Función para calcular el total de la compra
  calcularTotal(): number {
    return this.calcularSubtotal() + this.calcularEnvio();
  }
}