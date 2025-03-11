import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service'; // Asegúrate de importar el servicio
import { Router } from '@angular/router'; // Para redirigir al usuario

@Component({
  selector: 'app-recuperar',
  standalone: false,
  templateUrl: './recuperar.component.html',
  styles: ``
})
export class RecuperarComponent implements OnInit,OnChanges{
  nuevaContrasenaForm: FormGroup; // Formulario para la nueva contraseña
  mensajeExito: string = ''; // Mensaje de éxito
  mensajeError: string = ''; // Mensaje de error
  @Input() correoUsuario!: any; // Recibe el correo desde el componente padre
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService, // Inyecta el servicio
    private router: Router // Inyecta el Router
  ) {
    // Inicializa el formulario para la nueva contraseña
    this.nuevaContrasenaForm = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]], // Nueva contraseña
      confirmarContrasena: ['', [Validators.required]] // Confirmar contraseña
    }, { validator: this.coincidenContrasenas }); // Validador personalizado
  }

  ngOnInit(): void {
    alert(this.correoUsuario)
  }
  // Método para detectar cambios en las propiedades de entrada (@Input)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['correoUsuario']) {
      const nuevoCorreo = changes['correoUsuario'].currentValue;
      const correoAnterior = changes['correoUsuario'].previousValue;

      console.log('Correo anterior:', correoAnterior);
      console.log('Correo nuevo:', nuevoCorreo);

      // Aquí puedes realizar acciones cuando el correo cambie
      if (nuevoCorreo) {
        alert('Correo actualizado 2: ' + nuevoCorreo);
      }
    }
  }
  // Validador personalizado para verificar que las contraseñas coincidan
  coincidenContrasenas(form: FormGroup) {
    const nuevaContrasena = form.get('nuevaContrasena')?.value;
    const confirmarContrasena = form.get('confirmarContrasena')?.value;
    return nuevaContrasena === confirmarContrasena ? null : { noCoinciden: true };
  }

  // Método para actualizar la contraseña
  actualizarContrasena(): void {
    if (this.nuevaContrasenaForm.invalid) {
      this.mensajeError = 'Por favor, completa el formulario correctamente.';
      return;
    }
  
    const nuevaContrasena = this.nuevaContrasenaForm.value.nuevaContrasena;
    const correo = this.correoUsuario; // Obtén el correo del localStorage
  
    if (!correo) {
      this.mensajeError = 'No se encontró el correo electrónico. Intenta de nuevo.';
      return;
    }
  
    // Llama al servicio para actualizar la contraseña
    this.apiService.actualizarContrasena(correo, nuevaContrasena).subscribe(
      (response) => {
        console.log('Contraseña actualizada correctamente:', response);
        this.mensajeExito = 'Contraseña actualizada correctamente.';
        this.mensajeError = ''; // Limpiar mensaje de error
        localStorage.removeItem('correoRecuperacion'); // Elimina el correo del localStorage
        this.router.navigate(['/login']); // Redirige al usuario al login
      },
      (error) => {
        console.error('Error al actualizar la contraseña:', error);
        this.mensajeError = 'Ocurrió un problema. Intenta más tarde.';
        this.mensajeExito = ''; // Limpiar mensaje de éxito
      }
    );
  }
}