import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonDatetime, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonBackButton, IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { BookingStateService } from '../../services/booking-state.service';

/**
 * Página para seleccionar fecha y hora de la reserva
 */
@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.page.html',
  styleUrls: ['./select-date.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonDatetime, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonBackButton, IonContent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectDatePage implements OnInit {
  // Referencias a los componentes del datetime
  @ViewChild('dateSelect') dateSelect!: IonDatetime;
  @ViewChild('timeSelect') timeSelect!: IonDatetime;

  // Variables para almacenar selecciones
  selectedDate: string = ''; // Formato YYYY-MM-DD
  selectedTime: string = ''; // Formato HH:mm
  selectedCategory: string = ''; // Inicialmente vacío para mostrar placeholder

  // Fecha seleccionada como objeto Date para el calendario personalizado
  selectedDay: Date | null = null;

  // Array de días para el calendario personalizado
  calendarDays: Date[] = [];

  // Variable para mostrar el mes y año actual
  currentMonthDisplay: string = '';
  currentDate: Date = new Date();

  // Valores para los componentes
  minDate: string = new Date().toISOString(); // Fecha mínima es hoy

  // Categorías disponibles para el select (incluyendo "Todo")
  categories: string[] = ['Todo', 'Combo', 'Cabello', 'Barba', 'Rostro'];

  // Propiedades para el dropdown personalizado
  isDropdownOpen: boolean = false;

  // Propiedades para el selector de hora tipo rueda (Wheel Picker)
  wheelHours: string[] = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  wheelMinutes: string[] = ['00', '15', '30', '45'];
  wheelPeriods: string[] = ['AM', 'PM'];

  selectedHourIndex: number = 0;
  selectedMinuteIndex: number = 0;
  selectedPeriodIndex: number = 0;

  // Propiedades para el scroll suave
  private scrollTimeout: any;
  private itemHeight: number = 44; // Altura de cada item en px

  constructor(
    private bookingService: BookingStateService,
    private router: Router
  ) { }

  ngOnInit() {
    // Recuperar estado previo si existe
    this.bookingService.categoria$.subscribe(cat => {
      // Solo asignar si hay una categoría válida, sino mantener vacío para mostrar placeholder
      this.selectedCategory = cat || '';
    });

    // Inicializar el mes actual para mostrar
    this.generateCalendarDays();
    console.log('Calendar Days:', this.calendarDays);
  }

  /**
   * Genera el array de días para el calendario del mes actual
   */
  generateCalendarDays() {
    this.calendarDays = [];

    // Crear una fecha del primer día del mes
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);

    // Determinar el día de la semana del primer día (0: domingo, 1: lunes, ...)
    // Ajustamos para que la semana comience en lunes (0: lunes, 1: martes, ...)
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    // Añadir días del mes anterior para completar la primera semana
    for (let i = firstDayOfWeek; i > 0; i--) {
      const prevDate = new Date(firstDay);
      prevDate.setDate(prevDate.getDate() - i);
      this.calendarDays.push(prevDate);
    }

    // Añadir todos los días del mes actual
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i);
      this.calendarDays.push(date);
    }

    // Añadir días del mes siguiente para completar la última semana
    const lastDayOfWeek = lastDay.getDay() === 0 ? 6 : lastDay.getDay() - 1;
    const daysToAdd = 6 - lastDayOfWeek;

    for (let i = 1; i <= daysToAdd; i++) {
      const nextDate = new Date(lastDay);
      nextDate.setDate(nextDate.getDate() + i);
      this.calendarDays.push(nextDate);
    }
  }

  /**
   * Verifica si el día es el día seleccionado
   */
  isSelectedDay(day: Date): boolean {
    if (!this.selectedDay) return false;
    return day.getDate() === this.selectedDay.getDate() &&
           day.getMonth() === this.selectedDay.getMonth() &&
           day.getFullYear() === this.selectedDay.getFullYear();
  }

  /**
   * Verifica si el día es hoy
   */
  isToday(day: Date): boolean {
    const today = new Date();
    return day.getDate() === today.getDate() &&
           day.getMonth() === today.getMonth() &&
           day.getFullYear() === today.getFullYear();
  }

  /**
   * Verifica si el día es del mes actual
   */
  isSameMonth(day: Date): boolean {
    return day.getMonth() === this.currentDate.getMonth();
  }

  /**
   * Selecciona un día del calendario
   */
  selectDay(day: Date) {
    this.selectedDay = new Date(day);

    // Actualizar el valor del ion-datetime oculto para mantener la consistencia
    this.selectedDate = this.selectedDay.toISOString();
    this.dateSelect.value = this.selectedDate;

    // También actualizar el servicio de estado
    const combinedDate = new Date(this.selectedDate);
    if (this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':');
      combinedDate.setHours(parseInt(hours), parseInt(minutes));
    }

    // Verificar si se puede navegar automáticamente
    this.checkAutoNavigation();
  }

  /**
   * Maneja el cambio de fecha en el calendario
   * @param event Evento de cambio del IonDatetime
   */
  onDateChange(event: any) {
    this.selectedDate = event.detail.value as string;
  }

  /**
   * Maneja el cambio de hora en el selector
   * @param event Evento de cambio del IonDatetime
   */
  onTimeChange(event: any) {
    this.selectedTime = event.detail.value as string;
  }

  /**
   * Maneja el cambio de categoría en el select
   * @param event Evento de cambio del IonSelect
   */
  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.bookingService.setCategoria(this.selectedCategory);

    // Navegación automática si ya se han seleccionado fecha y hora
    if (this.selectedDate && this.selectedTime) {
      this.goToNextStep();
    }
  }

  /**
   * Navega a la siguiente página si se han seleccionado fecha y hora
   */
  goToNextStep() {
    if (this.selectedDate && this.selectedTime) {
      // Combinamos fecha y hora en un solo objeto Date
      const dateStr = this.selectedDate.substring(0, 10); // YYYY-MM-DD
      const timeStr = this.selectedTime;

      const combinedDate = new Date(`${dateStr}T${timeStr}`);

      // Guardamos en el servicio
      this.bookingService.setFechaHora(combinedDate);

      // Navegamos a la siguiente página
      this.router.navigateByUrl('/reservar/seleccionar-servicio');
    }
  }

  /**
   * Cambia el mes actual mostrado en el calendario
   * @param increment Incremento en meses (puede ser positivo o negativo)
   */
  changeMonth(increment: number) {
    const currentMonth = this.currentDate.getMonth();
    this.currentDate.setMonth(currentMonth + increment);

    // Actualiza la cadena que muestra el mes y año actuales
    this.updateCurrentMonthDisplay();
  }

  /**
   * Actualiza la visualización del mes actual
   */
  updateCurrentMonthDisplay() {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const month = months[this.currentDate.getMonth()];
    const year = this.currentDate.getFullYear();

    this.currentMonthDisplay = `${month}, ${year}`;
  }
  /**
   * Navega al mes anterior
   */
  previousMonth() {
    // Crear una nueva fecha con el mes anterior
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() - 1);

    // Actualizar la fecha actual
    this.currentDate = newDate;
    this.updateCurrentMonthDisplay();

    // Regenerar los días del calendario
    this.generateCalendarDays();

    // Actualizar el calendario oculto
    this.dateSelect.value = newDate.toISOString();
  }

  /**
   * Navega al mes siguiente
   */
  nextMonth() {
    // Crear una nueva fecha con el mes siguiente
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() + 1);

    // Actualizar la fecha actual
    this.currentDate = newDate;
    this.updateCurrentMonthDisplay();

    // Regenerar los días del calendario
    this.generateCalendarDays();

    // Actualizar el calendario oculto
    this.dateSelect.value = newDate.toISOString();
  }

  /**
   * Métodos del Wheel Picker
   */

  // Selección por índice (click directo)
  selectHourByIndex(index: number) {
    this.selectedHourIndex = index;
    this.scrollToIndex('hours-wheel', index);
    this.updateSelectedTime();
  }

  selectMinuteByIndex(index: number) {
    this.selectedMinuteIndex = index;
    this.scrollToIndex('minutes-wheel', index);
    this.updateSelectedTime();
  }

  selectPeriodByIndex(index: number) {
    this.selectedPeriodIndex = index;
    this.scrollToIndex('period-wheel', index);
    this.updateSelectedTime();
  }

  // Manejadores de scroll
  onHourScroll(event: Event) {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.handleWheelScroll(event, 'hour');
    }, 150);
  }

  onMinuteScroll(event: Event) {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.handleWheelScroll(event, 'minute');
    }, 150);
  }

  onPeriodScroll(event: Event) {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.handleWheelScroll(event, 'period');
    }, 150);
  }

  // Manejo del scroll con auto-centrado
  private handleWheelScroll(event: Event, type: 'hour' | 'minute' | 'period') {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const index = Math.round(scrollTop / this.itemHeight);

    switch (type) {
      case 'hour':
        const maxHourIndex = this.wheelHours.length - 1;
        this.selectedHourIndex = Math.max(0, Math.min(index, maxHourIndex));
        this.scrollToIndex('hours-wheel', this.selectedHourIndex);
        break;
      case 'minute':
        const maxMinuteIndex = this.wheelMinutes.length - 1;
        this.selectedMinuteIndex = Math.max(0, Math.min(index, maxMinuteIndex));
        this.scrollToIndex('minutes-wheel', this.selectedMinuteIndex);
        break;
      case 'period':
        const maxPeriodIndex = this.wheelPeriods.length - 1;
        this.selectedPeriodIndex = Math.max(0, Math.min(index, maxPeriodIndex));
        this.scrollToIndex('period-wheel', this.selectedPeriodIndex);
        break;
    }

    this.updateSelectedTime();
  }

  // Scroll suave a un índice específico
  private scrollToIndex(className: string, index: number) {
    setTimeout(() => {
      const element = document.querySelector(`.${className}`) as HTMLElement;
      if (element) {
        element.scrollTo({
          top: index * this.itemHeight,
          behavior: 'smooth'
        });
      }
    }, 10);
  }

  /**
   * Actualiza el selectedTime basado en las selecciones del wheel
   */
  private updateSelectedTime() {
    const hour = this.wheelHours[this.selectedHourIndex];
    const minute = this.wheelMinutes[this.selectedMinuteIndex];
    const period = this.wheelPeriods[this.selectedPeriodIndex];

    if (hour && minute && period) {
      // Convertir a formato 24 horas para almacenamiento interno
      let hour24 = parseInt(hour);
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }

      this.selectedTime = `${hour24.toString().padStart(2, '0')}:${minute}`;

      // Verificar si se puede navegar automáticamente
      this.checkAutoNavigation();
    }
  }

  /**
   * Guarda la fecha y hora seleccionadas en el servicio y navega a la siguiente página
   */
  confirmarReserva() {
    if (this.selectedDate && this.selectedTime) {
      // Combinamos fecha y hora en un solo objeto Date
      const dateStr = this.selectedDate.substring(0, 10); // YYYY-MM-DD
      const timeStr = this.selectedTime;

      const combinedDate = new Date(`${dateStr}T${timeStr}`);

      // Guardamos en el servicio
      this.bookingService.setFechaHora(combinedDate);

      // Navegamos a la siguiente página
      this.router.navigateByUrl('/reservar/seleccionar-servicio');
    }
  }

  /**
   * Verifica si se pueden navegar automáticamente al tener todos los datos requeridos
   */
  private checkAutoNavigation() {
    // Solo navegar automáticamente si se han seleccionado fecha, hora y categoría
    if (this.selectedDate && this.selectedTime && this.selectedCategory) {
      // Pequeño delay para mejorar la experiencia de usuario
      setTimeout(() => {
        this.goToNextStep();
      }, 500);
    }
  }

  /**
   * Métodos para el dropdown personalizado
   */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.isDropdownOpen = false;
    this.bookingService.setCategoria(this.selectedCategory);

    // Verificar navegación automática
    this.checkAutoNavigation();
  }
}