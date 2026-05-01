import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

export interface Shoe {
  id: number;
  name: string;
  image: string;
  price: number;
  colors?: string[];
  category?: string;
  quantity?: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart: Shoe[] = [];
  private favorites: Shoe[] = [];

  getCart() { return this.cart; }

  addToCart(item: Shoe) {
    const existing = this.cart.find(i => i.id === item.id);
    if (existing) {
      existing.quantity = (existing.quantity ?? 1) + 1;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
  }

  removeFromCart(index: number) { this.cart.splice(index, 1); }
  
  clearCart() { this.cart = []; }

  // ☁️ Sync local cart state to Firestore "carts" collection
  async saveCartToFirestore(firestore: Firestore, uid: string) {
    if (!uid) return;
    return setDoc(doc(firestore, 'carts', uid), { 
      items: this.cart,
      updatedAt: new Date() 
    }, { merge: true });
  }

  getFavorites() { return this.favorites; }
  removeFavorite(id: number) { this.favorites = this.favorites.filter(f => f.id !== id); }
  clearFavorites() { this.favorites = []; }
}