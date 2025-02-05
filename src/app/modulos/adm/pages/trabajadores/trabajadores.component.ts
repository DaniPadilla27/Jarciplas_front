import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service'; // Ajustar la ruta si es necesario
import { Router } from '@angular/router';

@Component({
  selector: 'app-trabajadores',
  
  standalone:false,
  templateUrl: './trabajadores.component.html',
  styles: ``
})
export class TrabajadoresComponent implements OnInit {


   trabajadores: any[] = []; // Variable para almacenar los productos

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerTrabajadores();
  }

  obtenerTrabajadores(): void {
    this.apiService.obtenerTrabajadores().subscribe(
      (data) => {
        this.trabajadores = data; // La API ya devuelve un array directamente
        console.log('Trabajadores cargados:', this.trabajadores);
      },
      (error) => {
        console.error('Error al obtener trabajadores:', error);
      }
    );
  }
  

}
