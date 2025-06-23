import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, NavController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule, FormsModule]
})
export class BienvenidaPage implements OnInit {

  constructor(
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    console.log('Página de bienvenida cargada');
    
    // Opcional: Auto-redirect después de algunos segundos
    // setTimeout(() => {
    //   this.goToLogin();
    // }, 5000); // 5 segundos
  }

  /**
   * Navega a la pantalla de login
   * Este método se ejecuta cuando el usuario presiona el botón "Empezar"
   */
  goToLogin() {
    console.log('Navegando al login...');
    
    // Opción 1: Usando Router (Navegación básica)
    this.router.navigate(['/login']);
    
    // Opción 2: Usando NavController (Más recomendado para Ionic)
    // this.navCtrl.navigateForward('/login');
    
    // Opción 3: Con animación personalizada y opciones adicionales
    // this.navCtrl.navigateForward('/login', {
    //   animationDirection: 'forward',
    //   animated: true
    // });
    
    // Opción 4: Si quieres reemplazar la página actual (no poder volver atrás)
    // this.navCtrl.navigateRoot('/login');
  }

  /**
   * Método alternativo para manejar el click del botón
   * Puedes usar este si necesitas lógica adicional antes de navegar
   */
  onEmpezarClick() {
    console.log('Usuario presionó el botón Empezar');
    
    // Aquí puedes agregar:
    // - Analytics tracking
    // - Validaciones
    // - Loading states
    // - Animaciones personalizadas
    
    // Ejemplo con loading
    // const loading = await this.loadingController.create({
    //   message: 'Cargando...',
    //   duration: 1000
    // });
    // await loading.present();
    // setTimeout(() => {
    //   this.goToLogin();
    // }, 1000);
    
    this.goToLogin();
  }

  /**
   * Método que se ejecuta cuando la página está a punto de entrar
   */
  ionViewWillEnter() {
    console.log('BienvenidaPage will enter');
  }

  /**
   * Método que se ejecuta cuando la página ha entrado completamente
   */
  ionViewDidEnter() {
    console.log('BienvenidaPage did enter');
  }

  /**
   * Método que se ejecuta cuando la página está a punto de salir
   */
  ionViewWillLeave() {
    console.log('BienvenidaPage will leave');
  }

}