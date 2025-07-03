import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonCheckbox,
  IonIcon,
  IonSpinner,
  IonText,
  IonLabel,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { logoGoogle, eye, eyeOff } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonCheckbox,
    IonIcon,
    IonSpinner,
    IonText,
    IonLabel
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  recordarme: boolean = false;
  mostrarPassword: boolean = false;
  isLoading: boolean = false;
  isGoogleLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    addIcons({ logoGoogle, eye, eyeOff });
  }

  async iniciarSesion() {
    if (!this.email || !this.password) {
      await this.mostrarToast('Por favor, completa todos los campos');
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.login(this.email, this.password);
      await this.mostrarToast('Inicio de sesión exitoso');
    } catch (error: any) {
      await this.mostrarToast(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  async iniciarConGoogle() {
    this.isGoogleLoading = true;
    try {
      const result = await this.authService.loginWithGoogle();
      const userName = result.user.displayName || 'Usuario';
      await this.mostrarToast(`¡Bienvenido ${userName}!`);
    } catch (error: any) {
      await this.mostrarToast(error.message);
    } finally {
      this.isGoogleLoading = false;
    }
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  private async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: 'primary',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }
}