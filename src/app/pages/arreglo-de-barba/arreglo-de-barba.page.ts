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
  selector: 'app-arreglo-de-barba',
  templateUrl: './arreglo-de-barba.page.html',
  styleUrls: ['./arreglo-de-barba.page.scss'],
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
export class ArregloDeBarbaPage implements OnInit {

  // Creamos el array con los datos de los cortes. El HTML usará esta variable.
  public listaDeCortes = [
    {
      categoria: 'Perfilado de Barba con Navaja',
      nombre: 'Delimitado preciso con toalla caliente',
      precio: 15.00,
      imagen: 'assets/images/Perfilado_de_Barba_Navaja.jpg'
    },
    {
      categoria: 'Diseño de Barba Personalizado',
      nombre: 'Diseño y simetría según tipo de rostro',
      precio: 25.00,
      imagen: 'assets/images/Barba_Personalizado.jpg'
    },
    {
      categoria: 'Recorte y Alineado de Barba',
      nombre: 'Recorte con tijera y máquina + afeitado',
      precio: 20.00,
      imagen: 'assets/images/Alineado_Barba.jpg'
    },
    {
      categoria: 'Barba + Exfoliación Facial',
      nombre: 'Acondicionamiento y limpieza profunda',
      precio: 30.00,
      imagen: 'assets/images/Barba_Exfoliacion_Facial.jpg'
    },
    {
      categoria: 'Mascarilla para Barba y Piel',
      nombre: 'Hidratación y suavidad para piel sensible',
      precio: 10.00,
      imagen: 'assets/images/skincare.jpg'
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