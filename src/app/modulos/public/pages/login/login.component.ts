import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';

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
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { correo, password } = this.loginForm.value;

    this.apiService.login(correo, password).subscribe({
      next: (response: any) => {
        if (response?.tipo_usuario !== undefined) {
          this.authService.login(); // Actualizar estado de autenticación
          
          switch (response.tipo_usuario) {
            case 1:
              this.router.navigate(['/adm']);
              break;
            case 2:
              this.router.navigate(['/public']);
              break;
            case 3:
              this.router.navigate(['/trabajador']);
              break;
            case 4:
              this.router.navigate(['/cliente']);
              break;
            default:
              console.error('Tipo de usuario no reconocido');
              this.authService.logout(); // Limpiar autenticación en caso de error
          }
        } else {
          console.error('Error en la autenticación');
          this.authService.logout();
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.authService.logout();
      }
    });
  }
}