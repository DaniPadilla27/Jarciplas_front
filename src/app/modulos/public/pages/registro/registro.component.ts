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
      Correo: ['', [Validators.required, Validators.email]],
      Contraseña: ['', [Validators.required, Validators.minLength(6)]],
      Telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      PreguntaSecreta: ['', Validators.required],
      RespuestaSecreta: ['', Validators.required]
    });
  }

  registrarUsuario() {
    if (this.registroForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    // Extraer valores del formulario
    const nombre = this.registroForm.get('Nombre')?.value;
    const correo = this.registroForm.get('Correo')?.value;
    const contraseña = this.registroForm.get('Contraseña')?.value;
    const telefono = this.registroForm.get('Telefono')?.value;
    const preguntaSecreta = this.registroForm.get('PreguntaSecreta')?.value;
    const respuestaSecreta = this.registroForm.get('RespuestaSecreta')?.value;

    this.apiService.registrarUsuario(
      nombre,
      correo,
      contraseña,
      telefono,
      preguntaSecreta,
      respuestaSecreta
    ).subscribe({
      next: () => {
        alert('Usuario registrado exitosamente');
        this.registroForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error desconocido';
        alert(`Error al registrar usuario: ${errorMessage}`);
      }
    });
  }
}