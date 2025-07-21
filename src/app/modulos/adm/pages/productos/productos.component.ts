import { Component, type OnInit } from "@angular/core"
import {  FormBuilder, type FormGroup, Validators } from "@angular/forms"
import  { ApiService } from "../../../../services/api.service"
import  { Router } from "@angular/router"

@Component({
  selector: "app-productos",
  templateUrl: "./productos.component.html",
  standalone: false,
  styleUrls: ["./productos.component.scss"],
})
export class ProductosComponent implements OnInit {
  productoForm: FormGroup
  imagen: File | null = null
  productos: any[] = []
  imagenPreview: string | ArrayBuffer | null = null
  modoEdicion = false
  productoId: number | null = null
  categorias: any[] = []
  cargandoImagen = false
  mensajeError = ""

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) {
    this.productoForm = this.fb.group({
      nombre_producto: ["", [Validators.required]],
      precio: ["", [Validators.required, Validators.min(0)]],
      categoria_id: ["", [Validators.required]],
      descripcion: ["", [Validators.required]],
      stock: ["", [Validators.required, Validators.min(0)]],
      imagen: [null, Validators.required],
    })
  }

  onFileChange(event: any) {
    const file = event.target.files[0]
    if (file) {
      // Verificar formato de imagen
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        this.mensajeError = "Formato de imagen no permitido. Usa JPG, PNG o WEBP."
        return
      }

      // Verificar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        this.mensajeError = "La imagen es demasiado grande. El tamaño máximo es 5MB."
        return
      }

      this.mensajeError = ""
      this.imagen = file
      this.productoForm.patchValue({ imagen: file })

      const reader = new FileReader()
      reader.onload = () => (this.imagenPreview = reader.result)
      reader.readAsDataURL(file)
    }
  }

  agregarProducto() {
    if (this.productoForm.invalid) {
      this.mensajeError = "Por favor, complete todos los campos obligatorios."
      return
    }

    if (!this.imagen && !this.modoEdicion) {
      this.mensajeError = "La imagen es obligatoria para crear un producto."
      return
    }

    this.cargandoImagen = true
    this.mensajeError = ""

    const formData = {
      nombre_producto: this.productoForm.get("nombre_producto")?.value,
      precio: this.productoForm.get("precio")?.value,
      categoria_id: this.productoForm.get("categoria_id")?.value,
      descripcion: this.productoForm.get("descripcion")?.value,
      stock: this.productoForm.get("stock")?.value,
    }

    if (this.modoEdicion && this.productoId) {
      // Actualizar producto existente
      this.apiService
        .actualizarProducto(
          this.productoId,
          formData.nombre_producto,
          formData.precio,
          formData.categoria_id,
          formData.descripcion,
          formData.stock,
          this.imagen || undefined, // CORREGIDO: Ahora funciona porque actualizarProducto acepta imagen opcional
        )
        .subscribe({
          next: (response) => {
            console.log("Producto actualizado:", response)
            alert("Producto actualizado exitosamente")
            this.obtenerProductos()
            this.resetForm()
          },
          error: (error) => {
            console.error("Error al actualizar el producto:", error)
            this.mensajeError = error.error?.mensaje || "Error al actualizar el producto"
            this.cargandoImagen = false
          },
          complete: () => {
            this.cargandoImagen = false
          },
        })
    } else {
      // Crear nuevo producto
      if (!this.imagen) {
        this.mensajeError = "La imagen es obligatoria"
        this.cargandoImagen = false
        return
      }

      this.apiService
        .crearProducto(
          formData.nombre_producto,
          formData.precio,
          formData.categoria_id,
          formData.descripcion,
          formData.stock,
          this.imagen,
        )
        .subscribe({
          next: (response) => {
            console.log("Producto creado:", response)
            alert("Producto agregado exitosamente")
            this.obtenerProductos()
            this.resetForm()
          },
          error: (error) => {
            console.error("Error al agregar el producto:", error)
            this.mensajeError = error.error?.mensaje || "Error al agregar el producto"
            this.cargandoImagen = false
          },
          complete: () => {
            this.cargandoImagen = false
          },
        })
    }
  }

  obtenerProductos() {
    this.apiService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data.productos.map((producto: any) => ({
          ...producto,
          categoria: producto.categoria || "Sin categoría",
        }))
        console.log("Productos cargados:", this.productos)
      },
      error: (error) => {
        console.error("Error al obtener los productos:", error)
        this.mensajeError = "Error al cargar los productos"
      },
    })
  }

  cargarCategorias() {
    this.apiService.obtenercategorias().subscribe({
      next: (response) => {
        this.categorias = response.categorias.map((cat: any) => ({
          id: cat.id,
          nombre: cat.nombre_categoria,
        }))
        console.log("Categorías cargadas:", this.categorias)
      },
      error: (error) => {
        console.error("Error al obtener las categorías:", error)
        this.mensajeError = "Error al cargar las categorías"
      },
    })
  }

  editarProducto(producto: any) {
    console.log("Editando producto:", producto)

    this.productoForm.patchValue({
      nombre_producto: producto.nombre_producto,
      precio: producto.precio,
      categoria_id: producto.categoria_id,
      descripcion: producto.descripcion,
      stock: producto.stock,
    })

    // Mostrar imagen actual (URL de Cloudinary)
    if (producto.imagen) {
      this.imagenPreview = producto.imagen
      this.imagen = null // No hay archivo cargado aún
    }

    this.modoEdicion = true
    this.productoId = producto.id
    this.mensajeError = ""

    // Hacer que la imagen no sea obligatoria en modo edición
    this.productoForm.get("imagen")?.clearValidators()
    this.productoForm.get("imagen")?.updateValueAndValidity()
  }

  eliminarProducto(id: number) {
    if (confirm("¿Estás seguro de eliminar este producto? La imagen también será eliminada de Cloudinary.")) {
      this.apiService.eliminarProducto(id).subscribe({
        next: (response) => {
          console.log("Producto eliminado:", response)
          alert("Producto eliminado exitosamente")
          this.obtenerProductos()
        },
        error: (error) => {
          console.error("Error al eliminar producto:", error)
          alert("Error al eliminar el producto")
        },
      })
    }
  }

  resetForm() {
    this.productoForm.reset()
    this.imagen = null
    this.imagenPreview = null
    this.modoEdicion = false
    this.productoId = null
    this.cargandoImagen = false
    this.mensajeError = ""

    // Restaurar validación de imagen para nuevos productos
    this.productoForm.get("imagen")?.setValidators([Validators.required])
    this.productoForm.get("imagen")?.updateValueAndValidity()
  }

  ngOnInit(): void {
    this.obtenerProductos()
    this.cargarCategorias()
  }
}
