import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: false,
  
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {

  constructor(private router: Router) {}

  redirectToLogin() {
    this.router.navigate(['/public/login']); // Asegúrate de usar '/public/Login'
  }
  redirectToRegistro() {
    this.router.navigate(['/public/registro']); // Asegúrate de usar '/public/Login'
  }
  
  

}
