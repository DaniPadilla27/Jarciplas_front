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
        console.log('Datos del carrito:', data);
  
        // Procesar los datos del carrito
        this.cartItems = data.map((item: any) => ({
          ...item,
          imagen: this.convertirImagen(item.imagen), // Convertir imagen del buffer
        }));
  
        this.cartService.updateCartCount(this.cartItems.length);
      },
      (error) => {
        console.error('Error al obtener el carrito:', error);
        this.mensaje = 'No se pudo cargar el carrito.';
      }
    );
  }

  // Función para convertir la imagen del buffer a base64
convertirImagen(imagen: any): string {
  if (!imagen || !imagen.data) {
    return ''; // Imagen no disponible
  }
  const base64String = btoa(String.fromCharCode(...new Uint8Array(imagen.data)));
  return `data:image/png;base64,${base64String}`;
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
    if (item.cantidad + 1 > item.stock) {
      this.mensaje = `No puedes agregar más de ${item.stock} unidades de ${item.nombre_producto}.`;
      return;
    }
  
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
    return this.cartItems.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0);
  }

  // Función para calcular el costo de envío (puedes personalizar esta lógica)
  calcularEnvio(): number {
    // Ejemplo: Envío fijo de $5.00
    return 0.0;
  }

  // Función para calcular el total de la compra
  calcularTotal(): number {
    return this.calcularSubtotal() + this.calcularEnvio();
  }
  comprarCarrito(): void {
    this.apiService.comprarProductos(this.id_usuario).subscribe(
      (response) => {
        // Mostrar mensaje de éxito
        alert('¡Compra realizada con éxito!');
        
        // Vaciar el carrito después de la compra
        this.cartItems = [];
        this.cartService.updateCartCount(0);
      },
      (error) => {
        console.error('Error al realizar la compra:', error);
        alert('Hubo un error al procesar la compra. Inténtalo de nuevo.');
      }
    );
  }
}