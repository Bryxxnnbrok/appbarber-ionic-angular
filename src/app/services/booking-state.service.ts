import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Servicio {
  id: number;
  nombre: string;
  duracionMin: number;
  precio: number;
  img: string;
  categoria: string;
}

/**
 * Servicio singleton para mantener el estado del proceso de reserva
 * a través de las diferentes pantallas del flujo
 */
@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  // BehaviorSubjects para mantener el estado
  private fechaHoraSubject = new BehaviorSubject<Date | null>(null);
  private categoriaSubject = new BehaviorSubject<string>(''); // Iniciamos vacío para mostrar placeholder
  private servicioSubject = new BehaviorSubject<Servicio | null>(null);

  // Observables públicos para suscribirse desde los componentes
  readonly fechaHora$: Observable<Date | null> = this.fechaHoraSubject.asObservable();
  readonly categoria$: Observable<string> = this.categoriaSubject.asObservable();
  readonly servicio$: Observable<Servicio | null> = this.servicioSubject.asObservable();

  constructor() { }

  /**
   * Establece la fecha y hora seleccionada para la reserva
   * @param fechaHora Objeto Date con la fecha y hora seleccionada
   */
  setFechaHora(fechaHora: Date): void {
    this.fechaHoraSubject.next(fechaHora);
  }

  /**
   * Establece la categoría de servicio seleccionada
   * @param categoria String con el nombre de la categoría
   */
  setCategoria(categoria: string): void {
    this.categoriaSubject.next(categoria);
  }

  /**
   * Establece el servicio específico seleccionado
   * @param servicio Objeto Servicio con la información completa
   */
  setServicio(servicio: Servicio): void {
    this.servicioSubject.next(servicio);
  }

  /**
   * Obtiene el valor actual de la fecha/hora
   */
  getFechaHora(): Date | null {
    return this.fechaHoraSubject.value;
  }

  /**
   * Obtiene el valor actual de la categoría
   */
  getCategoria(): string {
    return this.categoriaSubject.value;
  }

  /**
   * Obtiene el valor actual del servicio
   */
  getServicio(): Servicio | null {
    return this.servicioSubject.value;
  }

  /**
   * Reinicia todos los valores del estado
   */
  reset(): void {
    this.fechaHoraSubject.next(null);
    this.categoriaSubject.next('Todo');
    this.servicioSubject.next(null);
  }
}
