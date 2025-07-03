import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonSearchbar, 
  IonFabButton
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
import { AuthService } from '../../services/auth.service'; // Importar AuthService

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
    IonToolbar, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonSearchbar, 
    IonFabButton
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    private authService: AuthService // Inyectar AuthService
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

  async loadUserData() {
    const user = await this.authService.getUserData();
    if (user && user.nombre) {
      this.username = user.nombre;
    }
  }

// Función para buscar
  onSearchChange(event: any) {
    const searchValue = event.detail.value;
    this.searchTerm = searchValue;
    // Implementar lógica de búsqueda si es necesario
    console.log('Buscando:', searchValue);
  }

 // Navegación estática a cada servicio
  goToCortes() {
    this.router.navigate(['/cortes-de-cabello'], { queryParams: { service: 'cortes' } });
  }

  goToSkincare() {
    this.router.navigate(['/limpieza-facial'], { queryParams: { service: 'skincare' } });
  }

  goToBarba() {
    this.router.navigate(['/arreglo-de-barba'], { queryParams: { service: 'barba' } });
  }

  goToCejas() {
    this.router.navigate(['/arreglo-cejas'], { queryParams: { service: 'cejas' } });
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
    this.router.navigate(['/reservar/seleccionar-fecha']).catch(error => {
      console.error('Error en navegación a reservas:', error);
      // Opcional: mostrar un mensaje de error al usuario
    });
  }

  // Navegar a IA
  goToAI() {
    console.log('Navegando a IA');
    this.router.navigate(['/ia-recomendaciones']);
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