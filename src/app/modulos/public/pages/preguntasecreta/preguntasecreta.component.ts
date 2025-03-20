import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-preguntasecreta',
  templateUrl: './preguntasecreta.component.html',
  standalone: false,
  styles: []
})
export class PreguntasecretaComponent {
  formulario: FormGroup;
  preguntaSecreta: string | null = null;
  telefonoConfirmado = false;
  preguntaConfirmada = false;
  respuestaConfirmada = false;
  contrasenaCambiada = false;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private cdRef: ChangeDetectorRef) {
    this.formulario = this.fb.group({
      Telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      pregunta_secreta: [{ value: '', disabled: true }], 
      respuesta_secreta: [''],
      nuevaContraseña: ['', [Validators.required, Validators.minLength(6)]] // ← Añadir required
    });
  }



  preguntasSecretas = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿Cuál es el nombre de tu escuela primaria?',
    '¿Cuál es el nombre de tu mejor amigo de la infancia?',
    '¿En qué ciudad naciste?',
    '¿Cuál es el nombre de tu película favorita?'
  ];

  //hare cambios cuando me note es que a si lo dejes 
  //3
  verificarTelefono() {
    const telefono = this.formulario.get('Telefono')?.value;
    if (!telefono) return;

    this.apiService.recuperarConPreguntaSecreta(telefono).subscribe(
      (response) => {
        if (response.pregunta_secreta) {
          // Restablecer estados anteriores
          this.preguntaConfirmada = false;
          this.respuestaConfirmada = false;

          this.preguntaSecreta = response.pregunta_secreta;
          this.telefonoConfirmado = true;

          // Actualizar controles del formulario
          this.formulario.get('pregunta_secreta')?.setValue(response.pregunta_secreta);
          this.formulario.get('pregunta_secreta')?.enable();
          this.formulario.get('respuesta_secreta')?.reset();
          this.formulario.get('nuevaContraseña')?.reset();

          this.cdRef.detectChanges();
        } else {
          this.mensaje = 'Número no registrado';
        }
      },
      (error) => {
        console.error('Error:', error);
        this.mensaje = 'Error en la verificación';
      }
    );
  }

  verificarPregunta() {
    const { Telefono, pregunta_secreta } = this.formulario.value;
    if (!Telefono || !pregunta_secreta) return;

    this.apiService.recuperarConPreguntaSecreta(Telefono, pregunta_secreta).subscribe(
      (response) => {
        if (response.message && response.message.includes("ingresa la respuesta secreta")) {
          this.preguntaConfirmada = true;
          this.mensaje = '';
          this.cdRef.detectChanges();

          // Preparar siguiente paso
          this.formulario.get('respuesta_secreta')?.reset();
          this.formulario.get('respuesta_secreta')?.setValidators([Validators.required]);
          this.formulario.get('respuesta_secreta')?.updateValueAndValidity();
        } else {
          this.mensaje = response.message || 'La pregunta secreta no coincide.';
          this.preguntaConfirmada = false;
        }
      },
      (error) => {
        console.error('Error:', error);
        this.mensaje = 'Error al verificar la pregunta.';
        this.preguntaConfirmada = false;
      }
    );
    console.log('Valor de preguntaConfirmada después de respuesta:', this.preguntaConfirmada);
  }

  verificarRespuesta() {
    const { Telefono, pregunta_secreta, respuesta_secreta } = this.formulario.value;
    if (!Telefono || !pregunta_secreta || !respuesta_secreta) return;
  
    this.apiService.recuperarConPreguntaSecreta(Telefono, pregunta_secreta, respuesta_secreta).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        // Modificar esta condición
        if (response.message && response.message.includes("Ahora puedes ingresar una nueva contraseña")) {
          this.respuestaConfirmada = true;
          this.mensaje = '';
          
          // Actualizar validación de contraseña
          this.formulario.get('nuevaContraseña')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.formulario.get('nuevaContraseña')?.updateValueAndValidity();
          
          this.cdRef.detectChanges();
        } else {
          this.mensaje = 'La respuesta secreta no es correcta.';
        }
      },
      (error) => {
        console.error('Error en verificación:', error);
        this.mensaje = 'Error al verificar la respuesta.';
      }
    );
  }

  cambiarContrasena() {
    const { Telefono, pregunta_secreta, respuesta_secreta, nuevaContraseña } = this.formulario.value;

    this.apiService.recuperarConPreguntaSecreta(Telefono, pregunta_secreta, respuesta_secreta, nuevaContraseña).subscribe(
      (response) => {
        console.log('Respuesta cambio contraseña:', response); // Debug
        if (response.success) {
          this.contrasenaCambiada = true;
          this.mensaje = '¡Contraseña actualizada exitosamente!';
          setTimeout(() => {
            this.resetFormulario();
          }, 2000);
        } else {
          this.mensaje = response.message || 'Error al actualizar la contraseña';
        }
      },
      (error) => {
        console.error('Error en cambio:', error);
        this.mensaje = 'Error en el servidor. Intente nuevamente.';
      }
    );
  }

  private resetFormulario() {
    this.formulario.reset();
    this.preguntaSecreta = null;
    this.telefonoConfirmado = false;
    this.preguntaConfirmada = false;
    this.respuestaConfirmada = false;
  }
}
