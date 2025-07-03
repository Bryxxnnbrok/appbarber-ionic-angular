import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonApp,
  IonRouterOutlet,
  MenuController,
  AlertController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenu
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
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenu,
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet!: IonRouterOutlet;
  username: string = 'Usuario';

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {
    addIcons({ menu, chevronForward, chatbubbleEllipses, person, time, logOut });
  }

  ngOnInit() {
    this.menuCtrl.enable(true, 'main-menu');
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.loadUserData();
      } else {
        this.username = 'Usuario';
      }
    });
  }

  ngAfterViewInit() {
    // Esta función ya no es necesaria con el enfoque declarativo
    // Se mantiene por si hay lógica adicional que necesites
  }

  async loadUserData() {
    const userData = await this.authService.getUserData();
    if (userData && userData.nombre) {
      this.username = userData.nombre;
    }
  }

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
          handler: async () => {
            await this.authService.logout();
            this.menuCtrl.close();
            this.router.navigate(['/bienvenida'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

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