import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonList,
  IonText,
  IonButtons,
  IonMenuButton,
  IonBackButton
} from '@ionic/angular/standalone';
import { AuthService, UserData, Reserva } from '../../services/auth.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonList,
    IonText,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    CurrencyPipe // Añadir CurrencyPipe aquí
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilPage implements OnInit {
  selectedSegment: string = 'perfil';
  userData: UserData | null = null;
  userReservas: Reserva[] = [];

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['section'] === 'historial') {
        this.selectedSegment = 'historial';
      }
      this.loadUserDataAndReservas();
    });
  }

  async loadUserDataAndReservas() {
    this.userData = await this.authService.getUserData();
    this.userReservas = await this.authService.getUserReservas();
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  formatDate(date: Date | Timestamp | undefined): string {
    if (!date) return '';
    let d: Date;
    if (date instanceof Timestamp) {
      d = date.toDate();
    } else if (date instanceof Date) {
      d = date;
    } else {
      d = new Date(date);
    }
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatTime(date: Date | Timestamp | undefined): string {
    if (!date) return '';
    let d: Date;
    if (date instanceof Timestamp) {
      d = date.toDate();
    } else if (date instanceof Date) {
      d = date;
    } else {
      d = new Date(date);
    }
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}