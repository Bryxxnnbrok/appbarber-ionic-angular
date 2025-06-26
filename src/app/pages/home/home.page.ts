import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
  username: string = 'Usuario'; // Se actualiza dinámicamente con el usuario autenticado

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
    private readonly router: Router,
    private readonly menuCtrl: MenuController,
    private readonly alertCtrl: AlertController,
    private readonly authService: AuthService
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
    this.loadUserData();

    // Debug: Escuchar errores de navegación
    this.router.events.subscribe(event => {
      console.log('Router event:', event);
    });
  }

  async loadUserData() {
    const user = await this.authService.getCurrentUser();
    if (user) {      // Obtener el nombre del usuario
      this.username = user.displayName ?? user.email?.split('@')[0] ?? 'Usuario';
    }
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
  }  // Navegar a reservas
  goToReservation() {
    console.log('Navegando a reservas');
    console.log('Router state:', this.router.url);

    // Navegar al nuevo flujo de reservas
    this.router.navigate(['/reservar/seleccionar-fecha']).then(
      (success) => {
        console.log('Navegación exitosa:', success);
        if (!success) {
          // Si falla, intentar con navigateByUrl
          console.log('Intentando con navigateByUrl...');
          this.router.navigateByUrl('/reservar/seleccionar-fecha').catch(error => {
            console.error('Error con navigateByUrl:', error);
            // Como último recurso, usar window.location
            window.location.href = '/reservar/seleccionar-fecha';
          });
        }
      },
      (error) => {
        console.error('Error en navegación:', error);
        // Usar window.location como backup
        window.location.href = '/reserva';
      }
    );
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
  private async performLogout() {
    try {
      await this.authService.logout();
      await this.menuCtrl.close();
      this.router.navigate(['/bienvenida'], { replaceUrl: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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

  // Función de prueba para debugging
  testNavigation() {
    console.log('Probando navegación...');
    console.log('Router disponible:', !!this.router);
    console.log('URL actual:', this.router.url);

    // Intentar navegación con diferentes métodos
    this.router.navigateByUrl('/reserva').then(
      (success) => {
        console.log('navigateByUrl exitosa:', success);
      },
      (error) => {
        console.error('Error con navigateByUrl:', error);
      }
    );
  }

}
