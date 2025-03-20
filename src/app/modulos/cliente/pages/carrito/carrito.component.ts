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
    // Obtenemos el id del usuario de forma dinámica
    this.id_usuario = this.authService.getUserId();
    this.obtenerCarrito();
  }

  obtenerCarrito(): void {
    this.apiService.obtenerCarritoPorUsuario(this.id_usuario).subscribe(
      (data) => {
        this.cartItems = data;
        this.cartService.updateCartCount(this.cartItems.length); // Actualiza el contador

      },
      (error) => {
        console.error('Error al obtener el carrito:', error);
        this.mensaje = 'No se pudo cargar el carrito.';
      }
    );
  }
}
