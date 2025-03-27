import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  standalone: false,
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
  categorias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    // Inicializar el formulario
    this.productoForm = this.fb.group({
      nombre_producto: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0)]],
      categoria_id: ['', [Validators.required]], // Cambiado de 'categoria' a 'categoria_id'
      descripcion: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]], // Corregido 'stok' a 'stock'
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

    const { nombre_producto, precio, categoria_id, descripcion, stock } = this.productoForm.value;

    // Convertir valores numéricos y validar
    const precioNum = Number(precio);
    const categoriaIdNum = Number(categoria_id); // Convertir a número
    const stockNum = Number(stock);

    if (isNaN(precioNum) || isNaN(categoriaIdNum) || isNaN(stockNum)) {
      alert("Los valores de precio, categoría y stock deben ser números válidos.");
      return;
    }

    if (this.modoEdicion && this.productoId) {
      // Actualizar producto
      this.apiService.actualizarProducto(this.productoId, nombre_producto, precioNum, categoriaIdNum, descripcion, stockNum, this.imagen)
        .subscribe(
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
      this.apiService.crearProducto(nombre_producto, precioNum, categoriaIdNum, descripcion, stockNum, this.imagen)
        .subscribe(
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
// filepath: src/app/modulos/adm/pages/productos/productos.component.ts
obtenerProductos() {
  this.apiService.obtenerProductos().subscribe(
    (data) => {
      this.productos = data.productos.map((producto: any) => ({
        ...producto,
        categoria: producto.categoria || 'Sin categoría', // Asegurar que siempre haya un valor
      }));
      console.log('Productos cargados:', this.productos);
    },
    (error) => {
      console.error('Error al obtener los productos:', error);
    }
  );
}
  cargarCategorias() {
    this.apiService.obtenercategorias().subscribe(
      (response) => {
        this.categorias = response.categorias.map((cat: any) => ({
          id: cat.id,
          nombre: cat.nombre_categoria, // Ajustar al nombre correcto del campo
        }));
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  // Carga el producto para editar
  editarProducto(producto: any) {
    this.productoForm.patchValue({
      nombre_producto: producto.nombre_producto,
      precio: producto.precio,
      categoria_id: producto.categoria_id, // Cambiado de 'categoria' a 'categoria_id'
      descripcion: producto.descripcion,
      stock: producto.stock, // Corregido 'stok' a 'stock'
    });

  // Solo mostrar la vista previa de la imagen, no asignarla como archivo
  if (producto.imagen) {
    this.imagenPreview = producto.imagen; // Base64 ya viene del backend
    this.imagen = null; // No hay archivo cargado aún
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
    this.cargarCategorias(); // Llamar al método para cargar categorías

  }
}