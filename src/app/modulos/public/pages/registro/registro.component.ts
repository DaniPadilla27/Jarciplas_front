import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    this.registroForm = this.fb.group({
      Nombre: ['', Validators.required],
      Apellido_Paterno: ['', Validators.required],
      Apellido_Materno: ['', Validators.required],
      Edad: ['', [Validators.required, Validators.min(1)]],
      Genero: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      Contraseña: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registrarUsuario() {
    if (this.registroForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    // Extraer valores del formulario manualmente
    const nombre = this.registroForm.get('Nombre')?.value;
    const apellidoPaterno = this.registroForm.get('Apellido_Paterno')?.value;
    const apellidoMaterno = this.registroForm.get('Apellido_Materno')?.value;
    const edad = this.registroForm.get('Edad')?.value;
    const genero = this.registroForm.get('Genero')?.value;
    const correo = this.registroForm.get('Correo')?.value;
    const telefono = this.registroForm.get('Telefono')?.value;
    const contraseña = this.registroForm.get('Contraseña')?.value;

    this.apiService.registrarUsuario(
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      edad,
      genero,
      correo,
      telefono,
      contraseña
    ).subscribe({
      next: () => {
        alert('Usuario registrado exitosamente');
        this.registroForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Error al registrar usuario: ' + err.error.message);
      }
    });
  }
}
