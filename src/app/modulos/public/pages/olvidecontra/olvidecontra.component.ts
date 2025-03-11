import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-olvidecontra',
  standalone: false,

  templateUrl: './olvidecontra.component.html',
  styles: ``
})
export class OlvidecontraComponent implements OnInit {
  recuperarForm: FormGroup; // Formulario para recuperar contraseña
  frmVerfiCode: FormGroup; // Formulario para recuperar contraseña
  mensajeExito: string = ''; // Mensaje de éxito al enviar el código
  correoUsuario: string = ''; // Mensaje de éxito al enviar el código
  mensajeError: string = ''; // Mensaje de error en caso de fallo
  mostrarCampoCodigo: boolean = false; // Controla si se muestra el campo de código
  mostrar: boolean = false; // Controla si se muestra el campo de código

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.recuperarForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]], // Validación de correo
      // codigo: [''] // Campo para el código de verificación
    });
    this.frmVerfiCode = this.fb.group({
      // correo: ['', [Validators.required, Validators.email]], // Validación de correo
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
    const correo= this.recuperarForm.get('correo')?.value;
    if(correo){
      this.correoUsuario= correo;
      alert('Correo actualizado 1: ' + correo);

  }

    // this.correoUsuario = correo;
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
  // verificarCodigo(): void {
  //   const codigo = this.frmVerfiCode.value.codigo;
  //   const correo = this.recuperarForm.value.correo;

  //   if (!codigo || !correo) {
  //     this.mensajeError = 'Por favor, ingresa el código de verificación.';
  //     return;
  //   }

  //   // Llama al servicio para verificar el código
  //   this.apiService.verificarCodigo(codigo, correo).subscribe(
  //     (response) => {
  //       console.log('Código verificado correctamente:', response);
  //       this.mensajeExito = 'Código verificado correctamente.';
  //       this.mensajeError = ''; // Limpiar mensaje de error
  //       this.router.navigate(['/public/cambiarcontra']);
  //       // Aquí puedes redirigir al usuario a la página de cambio de contraseña
  //     },
  //     (error) => {
  //       console.error('Error al verificar el código:', error);
  //       this.mensajeError = 'Código incorrecto o expirado. Intenta de nuevo.';
  //       this.mensajeExito = ''; // Limpiar mensaje de éxito
  //     }
  //   );
  // }

  // En el método verificarCodigo del primer formulario
  verificarCodigo(): void {
    const codigo = this.frmVerfiCode.value.codigo;
    const correo= this.recuperarForm.get('correo')?.value;
    // this.correoUsuario = correo;
    if (!codigo || !correo) {
      this.mensajeError = 'Por favor, ingresa el código de verificación.';
      return;
    }
    if(correo){
      this.correoUsuario= correo;
      alert('Correo actualizado 1: ' + correo);

  }

    // Llama al servicio para verificar el código
    this.apiService.verificarCodigo(codigo, correo).subscribe(
      (response) => {
        console.log('Código verificado correctamente:', response);
        this.mensajeExito = 'Código verificado correctamente.';
        this.mensajeError = ''; // Limpiar mensaje de error

        // Guardar el correo en localStorage
        localStorage.setItem('correoRecuperacion', correo);
        // Actualiza el correo en el componente padre
      this.mostrar=true;
      },
      (error) => {
      this.mostrar=false;

        console.error('Error al verificar el código:', error);
        this.mensajeError = 'Código incorrecto o expirado. Intenta de nuevo.';
        this.mensajeExito = ''; // Limpiar mensaje de éxito
      }
    );
  }



}
