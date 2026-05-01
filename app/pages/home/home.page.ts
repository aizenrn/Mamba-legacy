import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, Shoe } from 'src/app/services/cart.service';
import { addIcons } from 'ionicons';
import { heartOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  q = '';
  selectedCategory = 'New Release';

  products: Shoe[] = [
    { id: 1, name: 'Nike Air Max SC', image: 'assets/images/about-shoe.png', price: 97.88, colors: ['#000', '#fff'], category: 'New Release' },
    { id: 2, name: 'Nike Runner Pro', image: 'assets/images/shoe-yellow.png', price: 143.5, colors: ['#000', '#fff'], category: 'New Release' },
    { id: 3, name: 'Creter Impact', image: 'assets/images/hero-shoe.png', price: 99.56, colors: ['#333', '#eee'], category: 'Lifestyle' },
    { id: 4, name: 'Air Max Pre-Day', image: 'assets/images/shoe-blue.png', price: 137.5, colors: ['#555', '#ccc'], category: 'Lifestyle' },
  ];

  categories = ['New Release', 'Men', 'Women', 'Kids'];

  constructor(
    public cartService: CartService,
    private router: Router
  ) {
    addIcons({ heartOutline, arrowForwardOutline });
  }

  goToFavorites() { this.router.navigateByUrl('/favorites'); }
  goToShop() { this.router.navigateByUrl('/shop'); }

  // ✅ Always navigate to /account, AuthGuard will redirect guests
  goToAccount() { this.router.navigateByUrl('/account'); }

  filtered(): Shoe[] {
    const query = this.q.trim().toLowerCase();
    return this.products.filter(
      (p) =>
        (this.selectedCategory === 'New Release' || p.category === this.selectedCategory) &&
        (!query || p.name.toLowerCase().includes(query))
    );
  }

  addToCart(p: Shoe) {
    this.cartService.addToCart(p);
  }
}
