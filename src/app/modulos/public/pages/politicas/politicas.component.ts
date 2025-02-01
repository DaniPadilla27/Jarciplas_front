import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-politicas',
  standalone: false,
  templateUrl: './politicas.component.html',
  styles: ``
})
export class PoliticasComponent implements OnInit {
  politicas: any[] = []; // Array para almacenar las políticas

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Cargar las políticas al inicializar el componente
    this.cargarPoliticas();
  }

  // Cargar políticas desde el backend
  cargarPoliticas() {
    this.apiService.obtenerPoliticas().subscribe(
      (response) => {
        this.politicas = response; // Almacenar las políticas en el array
      },
      (error) => {
        console.error('Error al cargar las políticas:', error);
        alert('Error al cargar las políticas');
      }
    );
  }
}