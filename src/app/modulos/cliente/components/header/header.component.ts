import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
  cartCount: number = 0;
  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  mostrarAlertaCarrito(): void {
    if (!this.authService.isAuthenticated()) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
    } else {
      // Lógica para agregar al carrito
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/public']);
  }
  ngOnInit() {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

}
