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
  selector: 'app-limpieza-facial',
  templateUrl: './limpieza-facial.page.html',
  styleUrls: ['./limpieza-facial.page.scss'],
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
export class LimpiezaFacialPage {

  // Creamos el array con los datos de los cortes. El HTML usará esta variable.
  public listaDeCortes = [
    {
      categoria: 'Limpieza Facial Clásica',
      nombre: 'Eliminación de impurezas y puntos negros',
      precio: 30.00,
      imagen: 'assets/images/facial_3.jpg'
    },
    {
      categoria: 'Limpieza Facial Profunda',
      nombre: 'Con extracción, vapor y mascarilla',
      precio: 45.00,
      imagen: 'assets/images/facial_3.jpg'
    },
    {
      categoria: 'Exfoliación Facial',
      nombre: 'Remueve células muertas, deja la piel suave',
      precio: 20.00,
      imagen: 'assets/images/facial_3.jpg'
    },
    {
      categoria: 'Mascarilla Hidratante',
      nombre: 'Ideal para piel reseca o sensible',
      precio: 25.00,
      imagen: 'assets/images/facial_4.jpg'
    },
        {
      categoria: 'Tratamiento Antiacné',
      nombre: 'Limpieza y control de brotes',
      precio: 35.00,
      imagen: 'assets/images/facial_3.jpg'
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