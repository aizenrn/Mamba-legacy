import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [IonicModule, FormsModule, CommonModule],
  template: `
    <ion-content class="nike-bg" fullscreen="true">
      <div class="login-wrapper">
        <div class="logo-container">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" class="logo">
        </div>

        <div class="header-text">
          <h1>Welcome Back</h1>
          <p>Sign in to continue shopping</p>
        </div>

        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="input-group">
            <ion-item lines="none" class="custom-input">
              <ion-input
                type="email"
                name="email"
                placeholder="Email Address"
                [(ngModel)]="email"
                required>
              </ion-input>
            </ion-item>

            <ion-item lines="none" class="custom-input">
              <ion-input
                type="password"
                name="password"
                placeholder="Password"
                [(ngModel)]="password"
                required>
              </ion-input>
            </ion-item>
          </div>

          <ion-button
            expand="block"
            type="submit"
            [disabled]="!loginForm.form.valid"
            class="nike-button">
            Log In
          </ion-button>
        </form> <div class="footer-text">
          <p (click)="goToRegister()">New here? <b>Create Account</b></p>
        </div>
      </div> </ion-content>
  `,
  styleUrls: ['./login.page.scss'], 
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email.trim(), this.password.trim());
      const toast = await this.toastCtrl.create({
        message: '✅ Login successful!',
        color: 'success',
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error: any) {
      const toast = await this.toastCtrl.create({
        message: `❌ ${this.getErrorMessage(error.code)}`,
        color: 'danger',
        duration: 2500,
        position: 'bottom',
      });
      await toast.present();
    }
  }

  goToRegister() { this.router.navigate(['/register']); }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-credential': return 'Invalid email or password';
      case 'auth/user-not-found': return 'No account found';
      case 'auth/wrong-password': return 'Incorrect password';
      default: return 'Login failed. Try again.';
    }
  }
}