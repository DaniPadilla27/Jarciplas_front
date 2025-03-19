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

  // 🔹 Lista de categorías disponibles
  categorias: string[] = [
    'Líquidos de Limpieza',
    'Productos Plásticos',
    'Artículos de Limpieza',
    'Ambientadores',
    'Productos Ecológicos',
    'Ofertas Especiales'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    // Inicializar el FormGroup con validaciones
    this.productoForm = this.fb.group({
      nombre_producto: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]], // Ahora es un select
      descripcion: ['', [Validators.required]],
    });
  }
  imagenPreview: string | ArrayBuffer | null = null;
// Manejar el cambio de archivo (imagen)
onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    // 🔹 Verificar el tamaño del archivo (Máximo 2MB)
    if (file.size > 2 * 1024 * 1024) { 
      alert('El archivo es demasiado grande (máximo 2MB)');
      return;
    }

    // 🔹 Verificar el tipo de archivo (Solo imágenes)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Formato de imagen no permitido. Usa JPG, PNG o WEBP.');
      return;
    }

    this.imagen = file;
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview = reader.result;
    reader.readAsDataURL(file);
  }
}

  // Crear producto
  agregarProducto() {
    if (this.productoForm.invalid || !this.imagen) {
      alert('Todos los campos, incluyendo la imagen, son obligatorios');
      return;
    }

    const { nombre_producto, precio, categoria, descripcion } = this.productoForm.value;

    // Llamar al servicio para crear el producto
    this.apiService.crearProducto(nombre_producto, precio, categoria, descripcion, this.imagen).subscribe(
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
