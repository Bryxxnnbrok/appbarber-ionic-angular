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
      this.router.navigate(['/home']); // Puedes cambiar '/home' por otra ruta en el futuro
    } catch (error: any) {
      await this.mostrarToast(this.getErrorMessage(error));
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
      await this.mostrarToast(this.getErrorMessage(error, 'Google'));
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

  private getErrorMessage(error: any, provider: string = ''): string {
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-email': return 'Email inválido';
        case 'auth/user-disabled': return 'Cuenta deshabilitada';
        case 'auth/user-not-found': return 'Usuario no encontrado';
        case 'auth/wrong-password': return 'Contraseña incorrecta';
        case 'auth/popup-closed-by-user': return 'Cancelaste el inicio con Google';
        case 'auth/account-exists-with-different-credential':
          return 'Este email ya está registrado con otro método';
        case 'auth/network-request-failed':
          return 'Error de conexión. Verifica tu internet';
        default: return `Error al iniciar sesión${provider ? ' con ' + provider : ''}`;
      }
    }
    return error.message || `Error al iniciar sesión${provider ? ' con ' + provider : ''}`;
  }
}