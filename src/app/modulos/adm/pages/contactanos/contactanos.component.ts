import { routes } from './../../../../app.routes';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contactanos',
  standalone: false,
  templateUrl: './contactanos.component.html',
  styles: ''
})
export class ContactanosComponent {
  contactoForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService,private router: Router) 
  {
    this.contactoForm = this.fb.group({
      nombre: ['', Validators.required],
      informacion: ['', Validators.required]
    });
  }

  enviarContacto() {
    const nombre = this.contactoForm.get('nombre')?.value;
    const informacion = this.contactoForm.get('informacion')?.value;
  
    if (this.contactoForm.invalid) {
      console.error('Nombre o información no proporcionados');
      return;
    }
  
    this.apiService.crearContacto(nombre, informacion).subscribe(
      (response) => {
        console.log('Contacto creado:', response);
      },
      (error: any) => { // Especificamos el tipo 'any' para evitar el error
        console.error('Error al crear contacto:', error);
      }
    );
  }
  
}
