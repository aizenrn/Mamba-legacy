import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';

@Component({
  standalone: true,
  selector: 'app-account',
  imports: [IonicModule, CommonModule],
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss']
})
export class AccountPage implements OnInit {

  userData$: Observable<DocumentData | undefined> | undefined;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this.userData$ = undefined;
        this.router.navigateByUrl('/login', { replaceUrl: true }); // extra safety
      }
    });
  }

  private loadUserData(uid: string) {
    const ref = doc(this.firestore, 'users', uid);
    this.userData$ = docData(ref); // Firebase live connection
  }

  goHome() { this.router.navigateByUrl('/home'); }
  goOrders() { this.router.navigateByUrl('/orders'); }
  goAbout() { this.router.navigateByUrl('/about'); }
  goTerms() { this.router.navigateByUrl('/terms'); }
  goPrivacy() { this.router.navigateByUrl('/privacy'); }

  async deleteAccount() {
    const user = this.auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(this.firestore, 'users', user.uid));
    await user.delete();
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
