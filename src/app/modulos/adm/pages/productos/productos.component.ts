import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  productoForm: FormGroup;
  imagen: File | null = null;
  productos: any[] = []; // Lista de productos
  imagenPreview: string | ArrayBuffer | null = null;
  modoEdicion: boolean = false; // Indica si se está editando
  productoId: number | null = null;

  // Lista de categorías a utilizar en el combobox
  categorias: string[] = [
    'Limpieza del hogar',
    'Cuidado de la ropa',
    'Higiene personal',
    'Limpieza industrial y profesional',
    'Utensilios de limpieza'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    // Inicializar el formulario
    this.productoForm = this.fb.group({
      nombre_producto: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      imagen: [null, Validators.required]
    });
  }

  // Maneja el cambio en el archivo de imagen
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Verificar formato de imagen
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Formato de imagen no permitido. Usa JPG, PNG o WEBP.');
        return;
      }
      this.imagen = file;
      this.productoForm.patchValue({ imagen: file });

      const reader = new FileReader();
      reader.onload = () => (this.imagenPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  // Crear o actualizar producto
  agregarProducto() {
    if (this.productoForm.invalid || !this.imagen) {
      alert('Todos los campos, incluyendo la imagen, son obligatorios');
      return;
    }

    const { nombre_producto, precio, categoria, descripcion } = this.productoForm.value;

    if (this.modoEdicion && this.productoId) {
      // Actualizar producto
      this.apiService.actualizarProducto(this.productoId, nombre_producto, precio, categoria, descripcion, this.imagen).subscribe(
        (response) => {
          alert('Producto actualizado exitosamente');
          this.obtenerProductos();
          this.resetForm();
        },
        (error) => {
          alert('Error al actualizar el producto');
          console.error('Error:', error);
        }
      );
    } else {
      // Crear nuevo producto
      this.apiService.crearProducto(nombre_producto, precio, categoria, descripcion, this.imagen).subscribe(
        (response) => {
          alert('Producto agregado exitosamente');
          this.obtenerProductos();
          this.resetForm();
        },
        (error) => {
          alert('Error al agregar el producto');
          console.error('Error:', error);
        }
      );
    }
  }

  // Obtiene la lista de productos
  obtenerProductos() {
    this.apiService.obtenerProductos().subscribe(
      (data) => {
        this.productos = data.productos;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  // Carga el producto para editar
  editarProducto(producto: any) {
    this.productoForm.patchValue({
      nombre_producto: producto.nombre_producto,
      precio: producto.precio,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
    });

    if (producto.imagen) {
      this.imagenPreview = 'data:image/jpeg;base64,' + producto.imagen;
      this.imagen = producto.imagen;
    }

    this.modoEdicion = true;
    this.productoId = producto.id;
  }

  // Elimina el producto
  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.apiService.eliminarProducto(id).subscribe(
        (response) => {
          this.obtenerProductos();
        },
        (error) => {
          console.error('Error al eliminar producto:', error);
        }
      );
    }
  }

  // Reinicia el formulario
  resetForm() {
    this.productoForm.reset();
    this.imagen = null;
    this.imagenPreview = null;
    this.modoEdicion = false;
    this.productoId = null;
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }
}
