import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { BookingStateService, Servicio } from '../../services/booking-state.service';

/**
 * Página para seleccionar el servicio específico para la reserva
 */
@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.page.html',
  styleUrls: ['./select-service.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class SelectServicePage implements OnInit {
  // Categoría seleccionada que se recupera del servicio
  selectedCategory: string = 'Todo';

  // Propiedades para el dropdown personalizado
  isDropdownOpen: boolean = false;

  // Lista completa de servicios (demo data)
  services: Servicio[] = [
    {
      id: 1,
      nombre: 'Limpieza Facial para Piel Mixta',
      duracionMin: 30,
      precio: 30.00,
      img: '/assets/images/skincare.jpg',
      categoria: 'Rostro'
    },
    {
      id: 2,
      nombre: 'Corte de Cabello Moderno',
      duracionMin: 45,
      precio: 35.00,
      img: '/assets/images/cortes-cabello.jpg',
      categoria: 'Cabello'
    },
    {
      id: 3,
      nombre: 'Arreglo de Barba',
      duracionMin: 20,
      precio: 25.00,
      img: '/assets/images/arreglo-barba.jpg',
      categoria: 'Barba'
    },
    {
      id: 4,
      nombre: 'Arreglo de Cejas',
      duracionMin: 15,
      precio: 15.00,
      img: '/assets/images/arreglo-cejas.jpg',
      categoria: 'Rostro'
    },
    {
      id: 5,
      nombre: 'Combo Completo (Corte + Barba)',
      duracionMin: 60,
      precio: 55.00,
      img: '/assets/images/barber.jpg',
      categoria: 'Combo'
    },
    {
      id: 6,
      nombre: 'Corte con Diseño',
      duracionMin: 50,
      precio: 45.00,
      img: '/assets/images/cortes-cabello.jpg',
      categoria: 'Cabello'
    }
  ];

  // Servicios filtrados según la categoría seleccionada
  filteredServices: Servicio[] = [];

  // Categorías disponibles para el select
  categories: string[] = ['Todo', 'Combo', 'Cabello', 'Barba', 'Rostro'];

  constructor(
    private bookingService: BookingStateService,
    private router: Router
  ) { }

  ngOnInit() {
    // Recuperar la categoría del servicio de estado
    this.bookingService.categoria$.subscribe(cat => {
      this.selectedCategory = cat;
      this.filterServices();
    });
  }

  /**
   * Filtra los servicios según la categoría seleccionada
   */
  filterServices() {
    if (this.selectedCategory === 'Todo') {
      this.filteredServices = [...this.services];
    } else {
      this.filteredServices = this.services.filter(
        service => service.categoria === this.selectedCategory
      );
    }
  }

  /**
   * Alterna el estado del dropdown (abrir/cerrar)
   */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Selecciona una categoría del dropdown
   * @param category Categoría seleccionada
   */
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.bookingService.setCategoria(this.selectedCategory);
    this.filterServices();
    this.isDropdownOpen = false; // Cerrar el dropdown
  }

  /**
   * Maneja el cambio de categoría en el select
   * @param event Evento de cambio del IonSelect
   */
  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.bookingService.setCategoria(this.selectedCategory);
    this.filterServices();
  }

  /**
   * Selecciona un servicio y navega a la página de confirmación
   * @param service Servicio seleccionado
   */
  selectService(service: Servicio) {
    // Guardar el servicio en el servicio de estado
    this.bookingService.setServicio(service);

    // Navegar a la página de confirmación
    this.router.navigateByUrl('/reservar/confirmar');
  }
}
