import { Component } from '@angular/core';

@Component({
  selector: 'app-pronostico',
  standalone: false,
  templateUrl: './pronostico.component.html',
  styles: ``
})
export class PronosticoComponent {
  mostrarLista = true;
  categoriaSeleccionada: string = '';
  semanas: { numero: number; fechaInicio: string; fechaFin: string; ventas: number }[] = [];
  productoSeleccionado: any = null;
  

  categorias = [
    { nombre: 'Cuidado de la ropa', ventas: 430 },
    { nombre: 'Higiene personal', ventas: 320 },
    { nombre: 'Limpieza industrial y profesional', ventas: 320 },
    { nombre: 'Utensilios de limpieza', ventas: 290 },
    { nombre: 'Líquidos de Limpieza', ventas: 920 },
    { nombre: 'Ambientadores', ventas: 90 }
  ];

  datosCategoria: any = {};
  productos: any[] = [];

  verDetalle(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.mostrarLista = false;
    this.cargarDatosCategoria(categoria);
    this.generarSemanas();
  }

  verDetalleProducto(producto: any) {
    this.productoSeleccionado = producto;
  }

  cerrarDetalleProducto() {
    this.productoSeleccionado = null;
  }

  volverALista() {
    this.mostrarLista = true;
    this.productoSeleccionado = null;
  }

  private cargarDatosCategoria(categoria: string) {
    const datosEjemplo: any = {
      'Cuidado de la ropa': {
        stockInicial: 500,
        ventasTotales: 430,
        stockRestante: 70,
        ventasSemanales: [120, 90, 80, 70, 70],
        productos: [
          { nombre: 'Suavizante de Telas - 1L', ventas: 150, stock: 20, ventasSemanales: [40, 35, 30, 25, 20] },
          { nombre: 'Detergente Líquido - 2L', ventas: 120, stock: 30, ventasSemanales: [35, 30, 25, 20, 10] },
          { nombre: 'Quitamanchas en Spray', ventas: 90, stock: 15, ventasSemanales: [25, 20, 20, 15, 10] },
          { nombre: 'Perfume para Ropa', ventas: 70, stock: 5, ventasSemanales: [20, 15, 15, 10, 10] }
        ]
      },
      'Higiene personal': {
        stockInicial: 400,
        ventasTotales: 320,
        stockRestante: 80,
        ventasSemanales: [80, 70, 65, 60, 45],
        productos: [
          { nombre: 'Jabón Antibacterial - 500ml', ventas: 90, stock: 50, ventasSemanales: [25, 20, 20, 15, 10] },
          { nombre: 'Shampoo Anticaspa - 400ml', ventas: 80, stock: 20, ventasSemanales: [20, 20, 15, 15, 10] },
          { nombre: 'Crema Dental - 100ml', ventas: 75, stock: 5, ventasSemanales: [15, 15, 15, 15, 15] },
          { nombre: 'Desodorante Roll-On', ventas: 75, stock: 5, ventasSemanales: [20, 15, 15, 15, 10] }
        ]
      }
    };
  
    this.datosCategoria = datosEjemplo[categoria] || {};
    this.productos = this.datosCategoria.productos || [];
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
        fechaInicio: this.formatearFecha(fechaInicio),
        fechaFin: this.formatearFecha(fechaFin),
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

  maxVentasProductoSemanales(producto: any): number {
    if (!producto?.ventasSemanales) return 0;
    return Math.max(...producto.ventasSemanales);
  }
}