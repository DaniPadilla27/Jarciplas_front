import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
@Component({
  selector: 'app-politicas',
  standalone: false,
  
  templateUrl: './politicas.component.html',
  styles: ``
})
export class PoliticasComponent {
  politicaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    // Inicializar el FormGroup
    this.politicaForm = this.fb.group({
      titulo: ['', [Validators.required]],
      contenido: ['', [Validators.required]],
    });
  }

  // Crear política
  crearPolitica() {
    if (this.politicaForm.invalid) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const { titulo, contenido } = this.politicaForm.value;

    // Llamar al servicio para crear la política
    this.apiService.crearPolitica(titulo, contenido).subscribe(
      (response) => {
        console.log('Política creada:', response);
        alert('Política creada exitosamente');
        this.router.navigate(['/politicas']); // Redirigir a la lista de políticas
      },
      (error) => {
        console.error('Error al crear la política:', error);
        alert('Error al crear la política');
      }
    );
  }


}
