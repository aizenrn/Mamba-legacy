import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, ToastController, NavController } from '@ionic/angular'; // Added NavController
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, query, where, orderBy, doc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id?: string;
  name: string;
  address: string;
  items: OrderItem[];
  total: number;
  createdAt: any;
  status: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss']
})
export class OrdersPage implements OnInit {
  orders$: Observable<Order[]> | undefined;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private navCtrl: NavController // Inject NavController
  ) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;

    const ordersRef = collection(this.firestore, 'orders');
    const q = query(
      ordersRef,
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    this.orders$ = collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  // Back button function
  goBack() {
    this.navCtrl.back();
  }

  async viewDetails(order: Order) {
    const items = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
    const alert = await this.alertCtrl.create({
      header: 'Order Details',
      message: `Total: $${order.total}<br>Status: ${order.status}<br>Items: ${items}`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async cancelOrder(order: Order) {
    const alert = await this.alertCtrl.create({
      header: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { 
          text: 'Yes', 
          handler: async () => {
            try {
              if (!order.id) return;
              const orderRef = doc(this.firestore, 'orders', order.id);
              await updateDoc(orderRef, { status: 'Cancelled' });

              const toast = await this.toastCtrl.create({
                message: 'Order cancelled successfully.',
                duration: 2000,
                color: 'danger'
              });
              await toast.present();
            } catch (e) {
              console.error(e);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}