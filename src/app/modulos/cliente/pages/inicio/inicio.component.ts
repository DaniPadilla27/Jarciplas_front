import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styles: ``,
})
export class InicioComponent implements OnInit {
  productos: any[] = []; // Variable para almacenar los productos
  carrito: any[] = []; // Carrito de compras local (temporal)

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.id_usuario = this.authService.getUserId(); // Obtener ID del usuario autenticado
    this.sincronizarCarrito(); // Sincronizar carrito al iniciar
  }

  id_usuario!: number;

  obtenerProductos(): void {
    this.apiService.obtenerProductos().subscribe(
      (data) => {
        this.productos = data.productos; // Ahora se asigna correctamente
        console.log('Productos cargados:', this.productos); // Verificar en consola
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  verDetalle(id: number) {
    console.log('ID del producto seleccionado:', id);
    this.router.navigate(['/cliente/detalle', id]);
  }

  // Función para agregar productos al carrito
  agregarAlCarrito(producto: any): void {
    const id_usuario = this.authService.getUserId();
    const existingItem = this.carrito.find(item => item.id === producto.id);

    if (existingItem) {
      // Si el producto ya existe, incrementar la cantidad localmente
      existingItem.cantidad += 1;
      existingItem.precio_total = existingItem.cantidad * existingItem.precio;
    } else {
      // Si no existe, agregarlo con cantidad 1
      this.carrito.push({ ...producto, cantidad: 1, precio_total: producto.precio });
    }

    console.log('Producto agregado al carrito:', producto);
    console.log('Carrito actual:', this.carrito);

    // Sincronizar con el backend
    this.apiService.agregarAlCarrito(id_usuario, producto.id, 1).subscribe(
      (response) => {
        console.log('Sincronización con backend exitosa:', response);
        this.sincronizarCarrito(); // Actualizar el carrito desde el backend
      },
      (error) => {
        console.error('Error al sincronizar con backend:', error);
        alert:'Error al agregar al carrito.';
      }
    );
  }

  // Sincronizar carrito con el backend
  sincronizarCarrito(): void {
    const id_usuario = this.authService.getUserId();
    this.apiService.obtenerCarritoPorUsuario(id_usuario).subscribe(
      (data) => {
        this.carrito = data.map((item: any) => ({
          ...item,
          imagen: item.imagen || '',
        }));
        this.cartService.updateCartCount(this.carrito.length);
        console.log('Carrito sincronizado:', this.carrito);
      },
      (error) => {
        console.error('Error al sincronizar carrito:', error);
      }
    );
  }
}