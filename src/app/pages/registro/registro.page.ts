import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonInput,
  
  IonIcon,
  IonText,
  
  IonSpinner,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    
    IonIcon,
    IonText,
    
    IonSpinner
  ]
})
export class RegistroPage {
  nombre: string = '';
  email: string = '';
  celular: string = '';
  password: string = '';
  confirmarPassword: string = '';
  mostrarPassword: boolean = false;
  mostrarConfirmarPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    addIcons({ eye, eyeOff });
  }

  async registrarse() {
    if (!this.validarFormulario()) return;

    // Mostrar loading
    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
      translucent: true
    });
    await loading.present();

    try {
      const userData = {
        nombre: this.nombre.trim(),
        telefono: this.celular.trim()
      };

      await this.authService.register(this.email.trim(), this.password, userData);
      await this.mostrarToast('¡Registro exitoso! Bienvenido');
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      await this.mostrarToast(this.obtenerMensajeError(error), 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private validarFormulario(): boolean {
    // Limpiar espacios en blanco
    this.nombre = this.nombre.trim();
    this.email = this.email.trim();
    this.celular = this.celular.trim();

    if (!this.nombre || !this.email || !this.celular || !this.password || !this.confirmarPassword) {
      this.mostrarToast('Por favor, completa todos los campos', 'warning');
      return false;
    }

    if (!this.validarEmail(this.email)) {
      this.mostrarToast('Por favor, ingresa un email válido', 'warning');
      return false;
    }

    if (!this.validarTelefono(this.celular)) {
      this.mostrarToast('Ingresa un número de teléfono válido', 'warning');
      return false;
    }

    if (this.password !== this.confirmarPassword) {
      this.mostrarToast('Las contraseñas no coinciden', 'warning');
      return false;
    }

    if (this.password.length < 6) {
      this.mostrarToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return false;
    }

    return true;
  }

  // 🔧 REGEX CORREGIDA - Sin escapes dobles
  private validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // 🆕 Validación de teléfono básica
  private validarTelefono(telefono: string): boolean {
    // Permite números con o sin espacios, guiones, paréntesis
    const re = /^[\d\s\-\(\)\+]{7,15}$/;
    return re.test(telefono);
  }

  private obtenerMensajeError(error: any): string {
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use': 
          return 'El email ya está registrado. Ve a iniciar sesión.';
        case 'auth/invalid-email': 
          return 'Email inválido';
        case 'auth/weak-password': 
          return 'La contraseña es muy débil (mínimo 6 caracteres)';
        case 'auth/network-request-failed':
          return 'Error de conexión. Verifica tu internet';
        default: 
          return 'Error al registrarse. Intenta nuevamente';
      }
    }
    return error.message || 'Error desconocido al registrarse';
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.mostrarPassword = !this.mostrarPassword;
    } else {
      this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  private async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 4000,
      position: 'top',
      color: color,
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }
}