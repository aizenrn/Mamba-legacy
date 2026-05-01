import { Component } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss']
})
export class ShopPage {
  shoes = [
    { id: 1, name: 'Yellow Sneaker', image: 'assets/images/shoe-yellow.png', price: 89 },
    { id: 2, name: 'Black Runner', image: 'assets/images/shoe-black.png', price: 99 },
    { id: 3, name: 'Blue Air Max', image: 'assets/images/shoe-blue.png', price: 109 },
    { id: 4, name: 'Red Urban Kicks', image: 'assets/images/shoe-red.png', price: 119 }
  ];

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    public cartService: CartService,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  // FIXED: Added cartCount getter for the badge in HTML
  get cartCount() {
    return this.cartService.getCart().length;
  }

  shopNow() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  onLearnMore() {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  }

  // shop.page.ts

async addToCart(item: any) {
  this.cartService.addToCart(item); // Update local memory
  const user = this.auth.currentUser;

  if (user) {
    try {
      // FORCE the database sync immediately
      await this.cartService.saveCartToFirestore(this.firestore, user.uid);
      const toast = await this.toastCtrl.create({ 
        message: 'Added to Cloud Cart!', 
        duration: 1000, 
        color: 'success' 
      });
      await toast.present();
    } catch (e) {
      console.error("Database Error:", e);
    }
  }
}

async buyNow(item: any) {
  this.cartService.addToCart(item);
  const user = this.auth.currentUser;

  // Sync to database BEFORE navigating so Checkout has the data
  if (user) {
    await this.cartService.saveCartToFirestore(this.firestore, user.uid);
  }

  this.router.navigateByUrl('/checkout');
}
  goBackHome() { this.router.navigateByUrl('/home'); }
  goToCart() { this.router.navigateByUrl('/cart'); }
}