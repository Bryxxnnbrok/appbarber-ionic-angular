import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-catalogo-servicios',
  templateUrl: './catalogo-servicios.page.html',
  styleUrls: ['./catalogo-servicios.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonImg,
    IonButton,
    CurrencyPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CatalogoServiciosPage {

  public listaDeServicios = [
    {
      id: 1,
      nombre: 'Corte Clásico',
      descripcion: 'Corte tradicional con tijera y máquina.',
      precio: 20.00,
      duracion: '30 min',
      imagen: 'assets/images/corte-clasico.jpg',
      categoria: 'Cabello'
    },
    {
      id: 2,
      nombre: 'Corte Moderno + Fade',
      descripcion: 'Diseño de vanguardia con degradado.',
      precio: 35.00,
      duracion: '45 min',
      imagen: 'assets/images/corte-moderno.jpg',
      categoria: 'Cabello'
    },
    {
      id: 3,
      nombre: 'Arreglo de Barba',
      descripcion: 'Perfilado y arreglo con navaja y toalla caliente.',
      precio: 15.00,
      duracion: '20 min',
      imagen: 'assets/images/arreglo-barba.jpg',
      categoria: 'Barba'
    },
    {
      id: 4,
      nombre: 'Limpieza Facial Profunda',
      descripcion: 'Eliminación de impurezas y mascarilla hidratante.',
      precio: 40.00,
      duracion: '60 min',
      imagen: 'assets/images/facial_2.jpg',
      categoria: 'Rostro'
    },
    {
      id: 5,
      nombre: 'Cejas y Pómulos',
      descripcion: 'Diseño de cejas y limpieza de pómulos.',
      precio: 10.00,
      duracion: '15 min',
      imagen: 'assets/images/arreglo-cejas.jpg',
      categoria: 'Rostro'
    },
    {
      id: 6,
      nombre: 'Combo Premium (Corte + Barba + Facial)',
      descripcion: 'Experiencia completa de cuidado personal.',
      precio: 60.00,
      duracion: '90 min',
      imagen: 'assets/images/Barba_Exfoliacion_Facial.jpg',
      categoria: 'Combo'
    }
  ];

  constructor() { }

}