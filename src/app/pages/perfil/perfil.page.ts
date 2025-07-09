import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Importaciones de Ionic
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonItem,
  IonList,
  IonText,
  IonButtons,
  IonMenuButton,
  IonBackButton,
  IonIcon,
  IonSkeletonText,
  IonButton,
  IonBadge
} from '@ionic/angular/standalone';

// Servicios
import { AuthService, UserData, Reserva } from '../../services/auth.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent,
    IonItem, IonList, IonText, IonButtons, IonMenuButton, IonBackButton,
    IonIcon, IonSkeletonText, IonButton, IonBadge, CurrencyPipe
  ]
})
export class PerfilPage implements OnInit, OnDestroy {
  // Propiedades principales
  selectedSegment: string = 'perfil';
  userData: UserData | null = null;
  userReservas: Reserva[] = [];
  isLoading: boolean = false;
  hasError: boolean = false;

  // Manejo de suscripciones
  private destroy$ = new Subject<void>();

  // Referencias DOM
  @ViewChild('segmentElementRef', { static: false }) segmentElementRef!: ElementRef;
  @ViewChild('segmentWrapperRef', { static: false }) segmentWrapperRef!: ElementRef;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Escuchar cambios en query params
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['section'] === 'historial') {
          this.selectedSegment = 'historial';
        }
        this.loadData();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Cargar datos del usuario y reservas
  async loadData() {
    this.isLoading = true;
    this.hasError = false;

    try {
      // Cargar datos en paralelo
      const [userData, reservas] = await Promise.all([
        this.authService.getUserData(),
        this.authService.getUserReservas()
      ]);

      this.userData = userData;
      this.userReservas = reservas;

    } catch (error) {
      console.error('Error cargando datos:', error);
      this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  }

  // Manejar cambio de segmento
  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    
    // Hacer scroll al segmento activo
    setTimeout(() => {
      this.scrollToActiveSegment();
    }, 100);
  }

  // Scroll al segmento activo
  private scrollToActiveSegment() {
    if (!this.segmentElementRef?.nativeElement || !this.segmentWrapperRef?.nativeElement) {
      return;
    }

    const segmentEl = this.segmentElementRef.nativeElement;
    const wrapperEl = this.segmentWrapperRef.nativeElement;
    const activeBtn = segmentEl.querySelector('ion-segment-button.segment-button-checked');

    if (activeBtn) {
      const scrollOffset = activeBtn.offsetLeft - 16;
      wrapperEl.scrollTo({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  }

  // Formatear fechas
  formatDate(date: Date | Timestamp | undefined): string {
    if (!date) return '';
    
    try {
      const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return '';
    }
  }

  // Obtener color del badge según estado
  getStatusColor(estado: string): string {
    const colors: { [key: string]: string } = {
      'confirmada': 'success',
      'pendiente': 'warning',
      'cancelada': 'danger',
      'completada': 'success'
    };
    return colors[estado.toLowerCase()] || 'medium';
  }

  // TrackBy para optimizar *ngFor
  trackByReserva(index: number, reserva: Reserva): any {
    return reserva.id || index;
  }
}