import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, Shoe } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage {
  cart: Shoe[] = [];

  constructor(public cartService: CartService, private router: Router) {}

  ionViewWillEnter() {
    this.cart = this.cartService.getCart();
  }

  increaseQty(item: Shoe) {
    if (item.quantity !== undefined) item.quantity++;
  }

  decreaseQty(item: Shoe) {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
    } else {
      this.remove(this.cart.indexOf(item));
    }
  }

  get subTotal() {
    return this.cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  }

  remove(index: number) {
    this.cartService.removeFromCart(index);
    this.cart = this.cartService.getCart();
  }

  checkout() { this.router.navigateByUrl('/checkout'); }
  
  // FIXED: Added missing method
  goShop() { this.router.navigateByUrl('/shop'); }
  goBack() { this.router.navigateByUrl('/shop'); }
}