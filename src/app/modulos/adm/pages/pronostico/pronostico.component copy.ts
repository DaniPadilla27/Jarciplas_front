import { Component } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
@Component({
  selector: 'app-pronostico',
  standalone: false,
  templateUrl: './pronostico.component.html',
  styles: ``
})
export class PronosticoComponent {
  mostrarLista = true;
  categoriaSeleccionada: string = '';
  categorias: { 
    id: number;
    nombre: string; 
    ventas: number; 
    stockInicial: number; 
    stockRestante: number; 
  }[] = [];  semanas: { numero: number; fechaInicio: string; fechaFin: string; ventas: number }[] = [];
  datosCategoria: any = {};
  productos: any[] = [];
  constructor(private apiService: ApiService) {}
  
  ngOnInit(): void {
    this.cargardatos();

  }
  private cargardatos(): void {
    this.apiService.prediccion().subscribe({
      next: (response: any) => {
        this.categorias = response.categorias.map((categoria: any) => ({
          id: categoria.categoriaId, // Incluye el ID de la categoría
          nombre: categoria.categorias, // Cambiado para reflejar el nuevo campo
          ventas: parseInt(categoria.ventasTotales, 10) || 0, // Convertimos a número
          stockInicial: parseInt(categoria.stock_inicial, 10) || 0, // Nuevo campo
          stockRestante: parseInt(categoria.stock_Restante, 10) || 0 // Nuevo campo
        }));
        console.log('Categorías obtenidas:', this.categorias);
      },
      error: (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    });
  }
  verDetalle(categoria: any) {
    this.categoriaSeleccionada = categoria.id;
    this.mostrarLista = false;
  
    // Buscar los datos de la categoría seleccionada
    const categoriaSeleccionada = this.categorias.find(cat => cat.id === categoria.id);
    if (categoriaSeleccionada) {
      this.datosCategoria = {
        stockInicial: categoriaSeleccionada.stockInicial,
        stockRestante: categoriaSeleccionada.stockRestante
      };
  
      // Consumir la API productosmasvendidos con el ID de la categoría
      this.apiService.productosmasvendidos(categoriaSeleccionada.id).subscribe({
        next: (response: any) => {
          console.log('Productos obtenidos:', response);
          this.productos = response.productos.map((producto: any) => ({
            nombre: producto.nombre_producto, // Nombre del producto
            stock: parseInt(producto.stock, 10) || 0, // Stock restante
            precio: parseFloat(producto.precio) || 0, // Precio del producto
            categoria: producto.nombre_categoria // Nombre de la categoría
          }));
        },
        error: (error) => {
          console.error('Error al obtener los productos de la categoría:', error);
          this.productos = []; // Limpia la lista de productos en caso de error
        }
      });
    }
  
    this.generarSemanas(); // Generar semanas si es necesario
  }

  
  volverALista() {
    this.mostrarLista = true;
  }
  

  private cargarDatosCategoria(categoria: string) {
    const datosEjemplo: any = {
      'Cuidado de la ropa': {
        stockInicial: 500,
        ventasTotales: 430,
        stockRestante: 70,
        ventasSemanales: [120, 90, 80, 70, 70], // Añade este array
        productos: [
          { nombre: 'Suavizante de Telas - 1L', ventas: 150, stock: 20 },
          { nombre: 'Detergente Líquido - 2L', ventas: 120, stock: 30 },
          { nombre: 'Quitamanchas en Spray', ventas: 90, stock: 15 },
          { nombre: 'Perfume para Ropa', ventas: 70, stock: 5 }
        ]
      },
      'Higiene personal': {
        stockInicial: 400,
        ventasTotales: 320,
        stockRestante: 80,
        ventasSemanales: [80, 70, 65, 60, 45], // Añade este array
        productos: [
          { nombre: 'Jabón Antibacterial - 500ml', ventas: 90, stock: 50 },
          { nombre: 'Shampoo Anticaspa - 400ml', ventas: 80, stock: 20 },
          { nombre: 'Crema Dental - 100ml', ventas: 75, stock: 5 },
          { nombre: 'Desodorante Roll-On', ventas: 75, stock: 5 }
        ]
      }
    };
  
    this.datosCategoria = datosEjemplo[categoria] || {};
    this.productos = this.datosCategoria.productos || [];
  }

  // Método para generar fechas de la semana (lunes a viernes)
  private obtenerFechasSemana(): string[] {
    const hoy = new Date();
    const fechas: string[] = [];
    for (let i = 0; i < 5; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - hoy.getDay() + i);  // Ajusta para obtener lunes a viernes
      fechas.push(fecha.toLocaleDateString()); // Formato fecha
    }
    return fechas;
  }

  // Método para simular ventas de cada día
  private obtenerVentasPorSemana(): number[] {
    const ventas = [];
    for (let i = 0; i < 5; i++) {
      const ventasDiarias = (this.datosCategoria.ventasTotales || 0) * (Math.random() * 0.2 + 0.8); // 80% a 100% de las ventas totales
      ventas.push(Math.round(ventasDiarias));
    }
    return ventas;
  }
  
  // Lógica de las fechas de la semana y las ventas
  get fechasSemana() {
    return this.obtenerFechasSemana();
  }

  get ventasSemana() {
    return this.obtenerVentasPorSemana();
  }

  private generarSemanas() {
    const hoy = new Date();
    this.semanas = [];
    
    // Generamos las últimas 5 semanas (de lunes a viernes)
    for (let i = 4; i >= 0; i--) {
      const fechaInicio = new Date(hoy);
      fechaInicio.setDate(hoy.getDate() - (hoy.getDay() + 6) % 7 - i * 7);
      
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + 4);
      
      this.semanas.push({
        numero: 5 - i, // Semana 1 a 5
        fechaInicio: this.formatearFecha(fechaInicio), // formato DD/MM
        fechaFin: this.formatearFecha(fechaFin),       // formato DD/MM
        ventas: this.datosCategoria.ventasSemanales ? this.datosCategoria.ventasSemanales[4 - i] : 0
      });
    }
  }
  
  private formatearFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    return `${dia}/${mes}`;
  }
  maxVentasSemanales(): number {
    if (!this.datosCategoria.ventasSemanales) return 0;
    return Math.max(...this.datosCategoria.ventasSemanales);
  }
  
cargarProductosMasVendidos(categoriaId: number): void {
  this.apiService.productosmasvendidos(categoriaId).subscribe({
    next: (response: any) => {
      if (response.productos && response.productos.length > 0) {
        this.productos = response.productos.map((producto: any) => ({
          nombre: producto.nombre_producto,
          ventas: parseInt(producto.total_vendido, 10) || 0,
          stock: parseInt(producto.stock, 10) || 0,
          precio: parseFloat(producto.precio) || 0,
          categoria: producto.nombre_categoria
        }));
      } else {
        console.warn('No se encontraron productos más vendidos para esta categoría.');
        this.productos = [];
      }
    },
    error: (error) => {
      console.error('Error al cargar los productos más vendidos:', error);
      this.productos = [];
    }
  });
}
  
}
