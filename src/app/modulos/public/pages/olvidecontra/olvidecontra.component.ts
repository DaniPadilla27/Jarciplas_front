import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service'; 
@Component({
  selector: 'app-olvidecontra',
  standalone: false,
  
  templateUrl: './olvidecontra.component.html',
  styles: ``
})
export class OlvidecontraComponent implements OnInit {
  recuperarForm: FormGroup; // Formulario para recuperar contraseña
  mensajeExito: string = ''; // Mensaje de éxito al enviar el código
  mensajeError: string = ''; // Mensaje de error en caso de fallo
  mostrarCampoCodigo: boolean = false; // Controla si se muestra el campo de código

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.recuperarForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]], // Validación de correo
      codigo: [''] // Campo para el código de verificación
    });
  }

  ngOnInit(): void {
    // Puedes agregar lógica adicional al inicializar el componente si es necesario
  }

  // Método para enviar el código de recuperación
  enviarCodigo(): void {
    if (this.recuperarForm.invalid) {
      this.mensajeError = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    const correo = this.recuperarForm.value.correo;

    // Llama al servicio para enviar el código de recuperación
    this.apiService.solicitarRecuperacionContrasena(correo).subscribe(
      (response) => {
        console.log('Código enviado exitosamente:', response);
        this.mensajeExito = 'Código de verificación enviado. Revisa tu correo electrónico.';
        this.mensajeError = ''; // Limpiar mensaje de error
        this.mostrarCampoCodigo = true; // Mostrar el campo de código
      },
      (error) => {
        console.error('Error al enviar el código:', error);
        this.mensajeError = 'Ocurrió un problema. Intenta más tarde.';
        this.mensajeExito = ''; // Limpiar mensaje de éxito
        this.mostrarCampoCodigo = false; // Ocultar el campo de código
      }
    );
  }
}
