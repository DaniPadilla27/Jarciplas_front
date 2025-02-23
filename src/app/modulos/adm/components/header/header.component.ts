// src/app/header/header.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ``,
  standalone: false // (correcto, no es standalone)
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/public']);
  }
}