import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'  // <- makes it available app-wide
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.currentUser;

    if (user) {
      return true; // user logged in → allow access
    } else {
      // user not logged in → redirect to login
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }
}
