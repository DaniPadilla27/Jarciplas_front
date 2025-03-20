// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isAuthenticated';

  constructor(private router: Router) {}

  login(userId: number = 0): void {
    localStorage.setItem(this.AUTH_KEY, 'true');
    
    localStorage.setItem('userId', userId.toString());
     console.log("Usuario autenticado con ID:", userId);
  }
  

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem('userId');
    this.router.navigate(['/public']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.AUTH_KEY);
  }
  getUserId(): number {
    // Por ejemplo, si lo guardas en localStorage tras iniciar sesión:
    return Number(localStorage.getItem('userId'));
  }
}