import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Agregamos CurrencyPipe
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,    // <-- Añadido
  IonMenuButton, // <-- Añadido
  IonCard,       // <-- Añadido
  IonItem,       // <-- Añadido
  IonThumbnail,  // <-- Añadido
  IonLabel,      // <-- Añadido
  IonIcon,       // <-- Añadido
  IonMenu,       // <-- Añadido
  IonList        // <-- Añadido
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { MenuController, AlertController} from '@ionic/angular/standalone';
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
    IonButtons,    // <-- Añadido
    IonMenuButton, // <-- Añadido
    IonCard,       // <-- Añadido
    IonItem,       // <-- Añadido
    IonThumbnail,  // <-- Añadido
    IonLabel,      // <-- Añadido
    IonIcon,       // <-- Añadido
    IonMenu,       // <-- Añadido
    IonList,       // <-- Añadido
    CurrencyPipe   // <-- Añadido para formatear el precio
  ]
})
export class LimpiezaFacialPage implements OnInit {

  // Creamos el array con los datos de los cortes. El HTML usará esta variable.
  public listaDeCortes = [
    {
      categoria: 'Limpieza Facial Clásica',
      nombre: 'Eliminación de impurezas y puntos negros',
      precio: 30.00,
      imagen: 'assets/images/corte-militar.jpg'
    },
    {
      categoria: 'Limpieza Facial Profunda',
      nombre: 'Con extracción, vapor y mascarilla',
      precio: 45.00,
      imagen: 'assets/images/corte-moderno.jpg'
    },
    {
      categoria: 'Exfoliación Facial',
      nombre: 'Remueve células muertas, deja la piel suave',
      precio: 20.00,
      imagen: 'assets/images/Corte_Pompadour.jpg'
    },
    {
      categoria: 'Mascarilla Hidratante',
      nombre: 'Ideal para piel reseca o sensible',
      precio: 25.00,
      imagen: 'assets/images/arreglo-barba.jpg'
    },
        {
      categoria: 'Tratamiento Antiacné',
      nombre: 'Limpieza y control de brotes',
      precio: 35.00,
      imagen: 'assets/images/arreglo-barba.jpg'
    }
  ];

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController
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

  ngOnInit() {
  }

  // Métodos para el menú lateral
  async openMenu() {
    await this.menuCtrl.open('main-menu');
  }

  goToProfile() {
    this.menuCtrl.close();
    this.router.navigate(['/perfil']);
  }

  goToHistory() {
    this.menuCtrl.close();
    this.router.navigate(['/perfil'], { queryParams: { section: 'historial' } });
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  private performLogout() {
    // Aquí puedes limpiar datos de sesión si usas autenticación
    this.menuCtrl.close();
    this.router.navigate(['/bienvenida'], { replaceUrl: true });
  }

}