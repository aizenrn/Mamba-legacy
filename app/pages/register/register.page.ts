import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './register.page.html', // Pointing to your HTML file
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async register() {
  try {
    // Step 1: Create the User in Auth
    const res = await createUserWithEmailAndPassword(
      this.auth, 
      this.email.trim(), 
      this.password.trim()
    );
    console.log("1. Auth account created:", res.user.uid);

    // Step 2: Create the User Document in Firestore
    // If this fails, the error will be caught in the 'catch' block
    await setDoc(doc(this.firestore, 'users', res.user.uid), {
      name: this.name,
      email: this.email.toLowerCase().trim(),
      uid: res.user.uid,
      createdAt: serverTimestamp()
    });
    
    console.log("2. Firestore document created!");
    this.showToast('Account created successfully!', 'success');
    this.router.navigateByUrl('/home', { replaceUrl: true });

  } catch (e: any) {
    console.error("Full Error Details:", e);
    
    if (e.code === 'permission-denied') {
      this.showToast('Database Error: Check your Firebase Rules.', 'danger');
    } else if (e.code === 'auth/email-already-in-use') {
      this.showToast('Email already exists. Try logging in.', 'warning');
    } else {
      this.showToast(e.message, 'danger');
    }
  }
}

  private getErrorMessage(code: string) {
    switch (code) {
      case 'auth/email-already-in-use': return 'This email is already in use.';
      case 'auth/weak-password': return 'Password is too weak.';
      default: return 'Registration failed. Try again.';
    }
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ 
      message: msg, 
      duration: 3000, 
      color: color 
    });
    await toast.present();
  }

  goToLogin() { this.router.navigate(['/login']); }
}