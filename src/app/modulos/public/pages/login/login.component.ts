import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Componente para manejar el proceso de autenticación de usuarios
 * @remarks
 * Valida credenciales y redirige según tipo de usuario
 */
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarContrasena: boolean = false; // Variable para mostrar/ocultar la contraseña

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
    
  ) {
    this.loginForm = this.fb.group({
      correo: [
        '',
        [Validators.required, Validators.email, Validators.pattern(/^\S+@\S+\.\S+$/)]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)]
      ]
    });
  }

  recuperarContra() {
    this.router.navigate(['/public/olvidecontra']);
    }

  sanitizeHtml(input: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(input);
  }
  
  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { correo, password } = this.loginForm.value;

    this.apiService.login(correo, password).subscribe({
      next: (response: any) => {
        if (response?.tipo_usuario !== undefined) {
          this.authService.login();
          
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
              this.authService.logout();
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

  logout() {
    this.authService.logout();
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    this.router.navigate(['/login']);
  }
}
