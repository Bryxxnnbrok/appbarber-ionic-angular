import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Agregamos CurrencyPipe
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonIcon,
  IonBackButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router'; // Importar Router
import { addIcons } from 'ionicons';
import {
  menu,
  chevronForward,
  chatbubbleEllipses,
  person,
  time,
  logOut
} from 'ionicons/icons';

@Component({
  selector: 'app-cortes-de-cabello',
  templateUrl: './cortes-de-cabello.page.html',
  styleUrls: ['./cortes-de-cabello.page.scss'],
  standalone: true,
  // Aquí es donde se agregan todos los componentes y módulos que usa el HTML
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonIcon,
    CurrencyPipe,
    IonBackButton
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CortesDeCabelloPage {

  // Creamos el array con los datos de los cortes. El HTML usará esta variable.
  public listaDeCortes = [
    {
      categoria: 'Cortes Clásicos',
      nombre: 'Corte Militar',
      precio: 15.00,
      imagen: 'assets/images/corte-militar.jpg'
    },
    {
      categoria: 'Cortes Modernos',
      nombre: 'Fade con Diseño',
      precio: 25.00,
      imagen: 'assets/images/corte-moderno.jpg'
    },
    {
      categoria: 'Cortes Clásicos',
      nombre: 'Corte Pompadour',
      precio: 20.00,
      imagen: 'assets/images/Corte_Pompadour.jpg'
    },
    {
      categoria: 'Corte Infantil',
      nombre: 'Ideal para niños de 12 años',
      precio: 18.00,
      imagen: 'assets/images/corte_niño.jpeg'
    },
        {
      categoria: 'Servicios Adicionales',
      nombre: 'Arreglo de Barba',
      precio: 10.00,
      imagen: 'assets/images/arreglo-barba.jpg'
    }
  ];

  constructor(
    private router: Router
  ) {

    // Registrar los iconos que vamos a usar
    addIcons({
      menu,
      chevronForward,
      chatbubbleEllipses,
      person,
      time,
      logOut
    });
  }
}