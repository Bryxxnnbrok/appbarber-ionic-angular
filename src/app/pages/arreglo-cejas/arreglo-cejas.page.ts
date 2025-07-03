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
  selector: 'app-arreglo-cejas',
  templateUrl: './arreglo-cejas.page.html',
  styleUrls: ['./arreglo-cejas.page.scss'],
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
export class ArregloCejasPage {

  // Creamos el array con los datos de los cortes. El HTML usará esta variable.
  public listaDeCortes = [
    {
      categoria: 'Perfilado de Cejas con Pinza o Navaja',
      nombre: 'Diseño natural y limpieza de vello',
      precio: 10.00,
      imagen: 'assets/images/cejas_1.jpg'
    },
    {
      categoria: 'Diseño de Cejas Personalizado',
      nombre: 'Según la forma del rostro (con guía profesional)',
      precio: 15.00,
      imagen: 'assets/images/cejas_2.jpg'
    },
    {
      categoria: 'Tinte de Cejas',
      nombre: 'Realce de color para mayor definición',
      precio: 20.00,
      imagen: 'assets/images/cejas_3.jpg'
    },
    {
      categoria: 'Laminado de Cejas',
      nombre: 'Fijación y peinado semipermanente',
      precio: 30.00,
      imagen: 'assets/images/cejas_4.jpg'
    },
        {
      categoria: 'Cejas + Limpieza Facial Exprés',
      nombre: 'Combinado ideal para eventos o rutina de cuidado',
      precio: 25.00,
      imagen: 'assets/images/cejas_5.jpg'
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