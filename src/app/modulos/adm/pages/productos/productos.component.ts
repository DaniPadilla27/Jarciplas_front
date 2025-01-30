import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service'; // Ajustar la ruta si es necesario
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent {
  productoForm: FormGroup;
  imagen: File | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    // Inicializar el FormGroup
    this.productoForm = this.fb.group({
      nombre_producto: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]],
    });
  }

  // Manejar el cambio de archivo (imagen)
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
    }
  }

  // Crear producto
  agregarProducto() {
    if (this.productoForm.invalid || !this.imagen) {
      alert('Todos los campos, incluyendo la imagen, son obligatorios');
      return;
    }

    const { nombre_producto, precio, categoria } = this.productoForm.value;

    // Llamar al servicio para crear el producto
    this.apiService.crearProducto(nombre_producto, precio, categoria, this.imagen).subscribe(
      (response) => {
        console.log('Producto agregado:', response);
        alert('Producto agregado exitosamente');
        this.router.navigate(['/productos']); // Redirigir a la lista de productos
      },
      (error) => {
        console.error('Error al agregar producto:', error);
        alert('Error al agregar el producto');
      }
    );
  }
}
