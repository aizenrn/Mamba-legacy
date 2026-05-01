import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: 'shop', loadComponent: () => import('./pages/shop/shop.page').then(m => m.ShopPage) },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.page').then(m => m.CartPage) },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.page').then(m => m.CheckoutPage) },

  { path: 'account', loadComponent: () => import('./pages/account/account.page').then(m => m.AccountPage), canActivate: [AuthGuard] },

  // ✅ Orders page
  { path: 'orders', loadComponent: () => import('./pages/orders/orders.page').then(m => m.OrdersPage), canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'login' },
];
