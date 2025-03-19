import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];

  addToCart(product: any) {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({...product, quantity: 1});
    }
  }

  getCartItems() {
    return this.cartItems;
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }

  getTotal() {
    return this.cartItems.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
  }

  clearCart() {
    this.cartItems = [];
  }

  updateQuantity(item: any, newQuantity: number) {
    const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (index > -1) {
      this.cartItems[index].quantity = newQuantity;
    }
  }
}