import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth.service'; // Importa AuthService

@Component({
  selector: 'app-detalle-producto',
  standalone: false,
  templateUrl: './detalle-producto.component.html',
  styles: [``]
})
export class DetalleProductoComponent implements OnInit {

  producto: any;
  cantidad: number = 1;
  id_usuario: number = 0;  // Inicializado con un valor predeterminado

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private authService: AuthService // Inyecta AuthService
  ) {}

  ngOnInit() {
    // Obtén el ID del usuario de forma dinámica desde el servicio de autenticación
    this.id_usuario = this.authService.getUserId();
    
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.obtenerProductoPorId(id).subscribe(
      (data) => {
        this.producto = data.producto;
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
      }
    );
  }

  // Método para agregar el producto al carrito
  onAgregarAlCarrito(): void {
    if (!this.producto || !this.producto.id) {
      console.error('Producto no cargado correctamente');
      return;
    }

    this.apiService.agregarAlCarrito(this.id_usuario, this.producto.id, this.cantidad).subscribe(
      (response) => {
        console.log('Producto agregado al carrito', response);

        // Obtener el nuevo número de productos en el carrito y actualizar el contador
        this.apiService.obtenerCarritoPorUsuario(this.id_usuario).subscribe(
          (carrito) => {
            this.cartService.updateCartCount(carrito.length);
          }
        );
      },
      (error) => {
        console.error('Error al agregar al carrito:', error);
      }
    );
  }
}
