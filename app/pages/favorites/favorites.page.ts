import { Component, signal, computed } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, Shoe } from 'src/app/services/cart.service';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './favorites.page.html', // Best practice to use separate HTML
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage {
  favorites = signal<Shoe[]>([]);
  count = computed(() => this.favorites().length);

  constructor(
    private cartService: CartService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.favorites.set(this.cartService.getFavorites());
  }

  async addToCart(item: Shoe) {
  const user = this.auth.currentUser;
  
  // 1. Local update
  this.cartService.addToCart(item);

  // 2. Database update
  if (user) {
    try {
      await this.cartService.saveCartToFirestore(this.firestore, user.uid);
      const toast = await this.toastCtrl.create({
        message: `${item.name} added to cloud cart!`,
        duration: 1500,
        color: 'success'
      });
      await toast.present();
    } catch (e) {
      console.error("Firestore Error:", e);
    }
  } else {
    // If not logged in, just show local feedback
    const toast = await this.toastCtrl.create({
      message: 'Added locally. Login to save your cart!',
      duration: 2000,
      color: 'primary'
    });
    await toast.present();
  }
}

  removeFavorite(id: any) {
    this.cartService.removeFavorite(id);
    this.favorites.set(this.cartService.getFavorites());
  }

  goToShop() { this.router.navigateByUrl('/shop'); }

  async clearFavorites() {
    const alert = await this.alertCtrl.create({
      header: 'Clear all favorites?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Clear',
          handler: () => {
            this.cartService.clearFavorites();
            this.favorites.set([]);
          }
        }
      ]
    });
    await alert.present();
  }
}