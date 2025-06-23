import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonSearchbar, 
  IonFabButton,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  MenuController, 
  AlertController 
} from '@ionic/angular/standalone';
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
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonSearchbar, 
    IonFabButton,
    IonMenu,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class HomePage implements OnInit {

  @ViewChild('servicesContainer', { static: false }) servicesContainer!: ElementRef;

  searchTerm: string = '';
  username: string = 'ryann'; // Aquí puedes obtener el nombre del usuario desde el servicio de autenticación

  services = [
    {
      id: 'cortes',
      name: 'cortes de cabello',
      description: 'mira nuestro catalogo de cortes que brindamos',
      image: 'assets/images/cortes-cabello.jpg'
    },
    {
      id: 'skincare',
      name: 'skincare',
      description: 'aqui podras ver una serie de mascarillas de rostro que brindamos',
      image: 'assets/images/skincare.jpg'
    },
    {
      id: 'barba',
      name: 'arreglo de barba',
      description: 'diferentes estilos de barba para tu rostro',
      image: 'assets/images/arreglo-barba.jpg'
    },
    {
      id: 'cejas',
      name: 'arreglo de cejas',
      description: 'perfilado y arreglo profesional de cejas',
      image: 'assets/images/arreglo-cejas.jpg'
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
    // Aquí puedes cargar datos del usuario desde tu servicio de autenticación
    this.loadUserData();
  }

  loadUserData() {
    // Implementar lógica para cargar datos del usuario
    // Por ejemplo, desde Firebase Auth o tu servicio de autenticación
  }

  // Función para buscar
  onSearchChange(event: any) {
    const searchValue = event.detail.value;
    this.searchTerm = searchValue;
    // Implementar lógica de búsqueda si es necesario
    console.log('Buscando:', searchValue);
  }

  // Navegar a servicio específico
  goToService(serviceId: string) {
    console.log('Navegando a servicio:', serviceId);
    this.router.navigate(['/catalogo-servicios'], { queryParams: { service: serviceId } });
  }

  // Scroll horizontal del carousel
  scrollServices(direction: string) {
    const container = this.servicesContainer.nativeElement;
    const scrollAmount = 220; // Ancho de la tarjeta + gap

    if (direction === 'right') {
      container.scrollLeft += scrollAmount;
    } else {
      container.scrollLeft -= scrollAmount;
    }
  }

  // Navegar a reservas
  goToReservation() {
    console.log('Navegando a reservas');
    this.router.navigate(['/reserva']);
  }

  // Navegar a IA
  goToAI() {
    console.log('Navegando a IA');
    this.router.navigate(['/ia-recomendaciones']);
  }

  // Abrir menú lateral
  async openMenu() {
    await this.menuCtrl.open('main-menu');
  }

  // Navegar a perfil
  goToProfile() {
    this.menuCtrl.close();
    this.router.navigate(['/perfil']);
  }

  // Navegar a historial
  goToHistory() {
    this.menuCtrl.close();
    // Puedes navegar al perfil y mostrar una sección de historial
    // o crear una nueva página para historial
    this.router.navigate(['/perfil'], { queryParams: { section: 'historial' } });
  }

  // Cerrar sesión
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
            // Implementar lógica de cierre de sesión
            // Por ejemplo, limpiar datos de Firebase Auth
            this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  private performLogout() {
    // Limpiar datos de sesión
    // Ejemplo: this.authService.logout();
    this.menuCtrl.close();
    this.router.navigate(['/bienvenida'], { replaceUrl: true });
  }

  // Método para obtener saludo según la hora
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Buenos días';
    } else if (hour < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

}