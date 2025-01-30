import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    // Inicializar el FormGroup
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    const correo = this.loginForm.get('correo')?.value;
    const contraseña = this.loginForm.get('password')?.value; // Usar minúscula para la variable local

    if (!correo || !contraseña) {
      console.error('Correo o contraseña no proporcionados');
      return;
    }

    // Llamar al servicio con las claves correctas
    this.apiService.login(correo, contraseña).subscribe(
      (response: any) => {
        if (response && response.tipo_usuario !== undefined) {
          switch (response.tipo_usuario) {
            case 1:
              this.router.navigate(['/adm/']); // Redirige a administrador
              break;
            case 2:
              this.router.navigate(['/public/']); // Redirige a administrador
              break;
            case 3:
              this.router.navigate(['/trabajador/']); // Redirige a trabajador
              break;
            case 4:
              this.router.navigate(['/cliente/']); // Redirige a cliente
              break;
            default:
              console.error('Tipo de usuario no reconocido');
          }
        } else {
          console.error('Error en la autenticación');
        }
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
      }
    );
    
  }
}
