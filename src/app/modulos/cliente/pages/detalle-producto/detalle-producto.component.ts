import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: false,
  templateUrl: './detalle-producto.component.html',
  styles: [``]
})
export class DetalleProductoComponent implements OnInit {
  producto: any;
  cantidad: number = 1;
  id_usuario: number = 0;
  mensajeError: string = ''; // Mensaje de error para el stock
  carrito: any[] = []; // Almacena los productos del carrito
  cantidadEnCarrito: number = 0; // Cantidad del producto actual en el carrito

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.id_usuario = this.authService.getUserId();

    // Cargar el producto actual
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.obtenerProductoPorId(id).subscribe(
      (data) => {
        this.producto = data.producto;

        // Cargar el carrito después de obtener el producto
        this.cargarCarrito();
      },
      (error) => {
        console.error('Error al obtener el producto:', error);
      }
    );
  }

  // Cargar el carrito del usuario
  cargarCarrito(): void {
    this.apiService.obtenerCarritoPorUsuario(this.id_usuario).subscribe(
      (carrito) => {
        this.carrito = carrito;

        // Verificar si el producto actual ya está en el carrito
        const itemEnCarrito = this.carrito.find((item: any) => item.id_producto === this.producto.id);
        this.cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

        console.log(`Cantidad en carrito para el producto ${this.producto.id}: ${this.cantidadEnCarrito}`);
      },
      (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    );
  }

  // Método para agregar el producto al carrito
  onAgregarAlCarrito(): void {
    if (!this.producto || !this.producto.id) {
      console.error('Producto no cargado correctamente');
      return;
    }
  
    // Calcular la cantidad total que se intenta agregar
    const cantidadTotal = this.cantidad + this.cantidadEnCarrito;
  
    // Validar si la cantidad total supera el stock disponible
    if (cantidadTotal > this.producto.stock) {
      this.mensajeError = 'Ya agregaste el límite de artículos disponibles';
      console.error(this.mensajeError);
      return;
    }
  
    // Agregar el producto al carrito
    this.apiService.agregarAlCarrito(this.id_usuario, this.producto.id, this.cantidad).subscribe(
      (response) => {
        console.log('Producto agregado al carrito', response);
  
        // Mostrar mensaje de éxito
        this.mensajeError = ''; // Limpiar mensaje de error
        alert('Producto agregado correctamente al carrito');
  
        // Reevaluar el carrito después de agregar el producto
        this.cargarCarrito();
      },
      (error) => {
        console.error('Error al agregar al carrito:', error);
        this.mensajeError = 'Ocurrió un error al intentar agregar el producto al carrito';
      }
    );
  }
}