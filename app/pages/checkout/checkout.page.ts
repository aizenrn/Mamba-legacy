import { Component } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage {
  cartItems: any[] = [];
  total = 0;
  formData = { name: '', address: '', card: '', cardType: '' };

  constructor(
    private cartService: CartService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  ionViewWillEnter() {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity ?? 1)), 0);
  }

  async payNow() {
    // ⚡ Ensure currentUser is ready
    const user = this.auth.currentUser;
    if (!user) {
      const toast = await this.toastCtrl.create({ message: 'You must be logged in!', duration: 2000, color: 'warning' });
      await toast.present();
      this.router.navigateByUrl('/login');
      return;
    }

    if (!this.formData.name || !this.formData.address) {
      const toast = await this.toastCtrl.create({ message: 'Please fill in delivery details', duration: 2000, color: 'warning' });
      await toast.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirm Purchase',
      message: `Total to pay: $${this.total}`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Confirm', handler: () => this.confirmPayment(user.uid) }
      ]
    });

    await alert.present();
  }

  private async confirmPayment(uid: string) {
    try {
      // ✅ Save order to Firestore
      await addDoc(collection(this.firestore, 'orders'), {
        ...this.formData,
        items: this.cartItems,
        total: this.total,
        uid: uid,
        createdAt: serverTimestamp(),
        status: 'Paid'
      });

      // ✅ Clear cart
      this.cartService.clearCart();

      // ✅ Show success toast and navigate to Orders page
      const toast = await this.toastCtrl.create({
        message: 'Payment Successful! Redirecting to Orders page...',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      toast.onDidDismiss().then(() => {
        this.router.navigateByUrl('/orders');
      });

    } catch (e) {
      console.error("Payment failed:", e);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Could not save order. Check your internet or Firebase rules.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goShopping() {
    this.router.navigateByUrl('/shop');
    
  }

  detectCardType() {
    // implement card type detection if needed
  }
}
