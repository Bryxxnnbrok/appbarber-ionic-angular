import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ToastController, 
  LoadingController, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonMenuButton, 
  IonBackButton, 
  IonContent,
  IonButton, 
  IonSpinner 
} from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';
import { BookingStateService, Servicio } from '../../services/booking-state.service';
import { AuthService } from '../../services/auth.service'; // Importar AuthService

/**
 * Página para confirmar la reserva con el resumen de la información seleccionada
 */
@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.page.html',
  styleUrls: ['./confirm-booking.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonContent,
    IonButton,
    IonSpinner
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfirmBookingPage implements OnInit {
  // Datos de la reserva
  selectedService: Servicio | null = null;
  selectedDate: Date | null = null;

  // Variables para mostrar en la UI
  formattedDate: string = '';
  formattedTimeRange: string = '';

  // Estado de la confirmación
  isConfirming: boolean = false;

  constructor(
    private bookingService: BookingStateService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private authService: AuthService // Inyectar AuthService
  ) { }

  ngOnInit() {
    // Recuperar los datos del servicio y fecha/hora del servicio de estado
    this.bookingService.servicio$.subscribe(service => {
      this.selectedService = service;
    });

    this.bookingService.fechaHora$.subscribe(date => {
      if (date) {
        this.selectedDate = date;
        this.formatDateAndTime(date);
      }
    });
  }

  /**
   * Formatea la fecha y genera el rango horario
   * @param date Fecha y hora de inicio de la reserva
   */
  formatDateAndTime(date: Date) {
    // Formatear la fecha: "17 de junio de 2025"
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    this.formattedDate = date.toLocaleDateString('es-ES', options);

    // Formatear la hora: "4:30 pm – 5:00 pm"
    const startHour = date.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();

    // Calcular la hora de fin basado en la duración del servicio
    const endHour = new Date(date.getTime() + (this.selectedService?.duracionMin || 0) * 60000).toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();

    this.formattedTimeRange = `${startHour} – ${endHour}`;
  }

  /**
   * Confirma la reserva
   */
  async confirmBooking() {
    // Evitar múltiples clicks
    if (this.isConfirming) return;

    this.isConfirming = true;

    // Mostrar loading
    const loading = await this.loadingController.create({
      message: 'Confirmando reserva...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });
    await loading.present();

    try {
      if (!this.selectedService || !this.selectedDate) {
        throw new Error('Datos de reserva incompletos.');
      }

      // Guardar la reserva en Firestore
      await this.authService.createReserva({
        servicio: this.selectedService.nombre,
        fecha: this.selectedDate,
        hora: this.formattedTimeRange,
        precio: this.selectedService.precio,
        estado: 'confirmada'
      });

      // Cerrar loading
      await loading.dismiss();

      // Mostrar toast de éxito
      const toast = await this.toastController.create({
        message: '¡Reserva confirmada exitosamente! Te esperamos en la fecha seleccionada.',
        duration: 3000,
        position: 'top',
        color: 'success',
        cssClass: 'custom-toast',
        buttons: [
          {
            text: 'Ver detalles',
            role: 'info',
            handler: () => {
              this.goToHistory();
            }
          },
          {
            text: 'Cerrar',
            role: 'cancel'
          }
        ]
      });
      await toast.present();

      // Limpiar el estado de la reserva
      this.bookingService.reset();

      // Navegar al home después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 3500);

    } catch (error) {
      // Cerrar loading en caso de error
      await loading.dismiss();

      // Mostrar toast de error
      const errorToast = await this.toastController.create({
        message: 'Error al confirmar la reserva. Por favor, inténtalo de nuevo.',
        duration: 3000,
        position: 'top',
        color: 'danger',
        cssClass: 'custom-toast'
      });
      await errorToast.present();

      console.error('Error al confirmar la reserva:', error);
    } finally {
      this.isConfirming = false;
    }
  }

  /**
   * Navega al historial de reservas
   */
  private goToHistory() {
    this.router.navigate(['/perfil'], { queryParams: { section: 'historial' } });
  }
}