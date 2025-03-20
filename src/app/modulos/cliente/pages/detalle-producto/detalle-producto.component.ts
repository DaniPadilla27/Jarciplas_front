import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CartService } from '../../../../services/cart.service';


@Component({
  selector: 'app-detalle-producto',
  standalone: false,
  templateUrl: './detalle-producto.component.html',
  styles: [``]
})
export class DetalleProductoComponent implements OnInit {

  producto: any;
  cantidad: number = 1;

  // Aquí puedes obtener el id_usuario de algún servicio de autenticación o similar.
  // Para el ejemplo usaremos un id estático.
  id_usuario: number = 127; 

  constructor(private route: ActivatedRoute, private apiService: ApiService,    private cartService: CartService // Servicio para actualizar el contador
  ) {}

  ngOnInit() {
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
