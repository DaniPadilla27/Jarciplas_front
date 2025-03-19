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
  productos: any[] = []; // Variable para almacenar los productos
  imagenPreview: string | ArrayBuffer | null = null;
  modoEdicion: boolean = false; // Indica si estamos en modo edición
  productoId: number | null = null;

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
    // Inicializar el FormGroup con la imagen incluida
    this.productoForm = this.fb.group({
      nombre_producto: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      imagen: [null, Validators.required] // Se agrega el campo imagen
    });
  }

  // Manejar el cambio de archivo (imagen)
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
      this.productoForm.patchValue({ imagen: file });

      const reader = new FileReader();
      reader.onload = () => (this.imagenPreview = reader.result);
      reader.readAsDataURL(file);
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


  // Crear o actualizar producto
  agregarProducto() {
    if (this.productoForm.invalid || !this.imagen) {
      alert('Todos los campos, incluyendo la imagen, son obligatorios');
      return;
    }

    const { nombre_producto, precio, categoria, descripcion } = this.productoForm.value;

    if (this.modoEdicion && this.productoId) {
      // Modo edición: Actualizar producto
      this.apiService.actualizarProducto(this.productoId, nombre_producto, precio, categoria, descripcion, this.imagen).subscribe(
        (response) => {
          console.log('Producto actualizado:', response);
          alert('Producto actualizado exitosamente');
          this.obtenerProductos(); // Actualizar la lista de productos
          this.resetForm(); // Reiniciar el formulario
        },
        (error) => {
          console.error('Error al actualizar producto:', error);
          alert('Error al actualizar el producto');
        }
      );
    } else {
      // Modo creación: Crear producto
      this.apiService.crearProducto(nombre_producto, precio, categoria, descripcion, this.imagen).subscribe(
        (response) => {
          console.log('Producto agregado:', response);
          alert('Producto agregado exitosamente');
          this.obtenerProductos(); // Actualizar la lista de productos
          this.resetForm(); // Reiniciar el formulario
        },
        (error) => {
          console.error('Error al agregar producto:', error);
          alert('Error al agregar el producto');
        }
      );
    }
  }

  // Obtener productos
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

  // Método para editar un producto
  editarProducto(producto: any) {
    // Cargar los datos del producto en el formulario
    this.productoForm.patchValue({
      nombre_producto: producto.nombre_producto,
      precio: producto.precio,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
    });

    // Cargar la imagen del producto si está disponible
    if (producto.imagen) {
      this.imagenPreview = 'data:image/jpeg;base64,' + producto.imagen;
      this.imagen = producto.imagen;
    }

    // Cambiar el texto del botón de enviar a "Actualizar Producto"
    this.modoEdicion = true;
    this.productoId = producto.id; // Guardar el ID del producto que se está editando
  }

  // Método para eliminar un producto
  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.apiService.eliminarProducto(id).subscribe(
        (response) => {
          console.log('Producto eliminado:', response);
          this.obtenerProductos();
        },
        (error) => {
          console.error('Error al eliminar producto:', error);
        }
      );
    }
  }

  // Reiniciar el formulario
  resetForm() {
    this.productoForm.reset();
    this.imagen = null;
    this.imagenPreview = null;
    this.modoEdicion = false;
    this.productoId = null;
  }

  // Inicializar el componente
  ngOnInit(): void {
    this.obtenerProductos();
  }
}