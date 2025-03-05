// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isAuthenticated';

  constructor(private router: Router) {}

  login(): void {
    localStorage.setItem(this.AUTH_KEY, 'true');
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.router.navigate(['/public']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.AUTH_KEY);
  }
}