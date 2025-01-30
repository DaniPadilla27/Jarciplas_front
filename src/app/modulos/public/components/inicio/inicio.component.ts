
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service'; // Servicio para obtener los productos

@Component({
  selector: 'app-inicio',
  standalone:false,
  templateUrl: './inicio.component.html',
  styles: ``
})
export class InicioComponent implements OnInit {
  productos: any[] = []; // Variable para almacenar los productos

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

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
  
}

