import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'bienvenida',
    pathMatch: 'full'
  },
  {
    path: 'bienvenida',
    loadComponent: () => import('./pages/bienvenida/bienvenida.page').then(m => m.BienvenidaPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'reservar',
    children: [
      {
        path: 'seleccionar-fecha',
        loadComponent: () => import('./pages/select-date/select-date.page').then(m => m.SelectDatePage)
      },
      {
        path: 'seleccionar-servicio',
        loadComponent: () => import('./pages/select-service/select-service.page').then(m => m.SelectServicePage)
      },
      {
        path: 'confirmar',
        loadComponent: () => import('./pages/confirm-booking/confirm-booking.page').then(m => m.ConfirmBookingPage)
      },
      {
        path: '',
        redirectTo: 'seleccionar-fecha',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'catalogo-servicios',
    loadComponent: () => import('./pages/catalogo-servicios/catalogo-servicios.page').then(m => m.CatalogoServiciosPage)
  },
  {
    path: 'ia-recomendaciones',
    loadComponent: () => import('./pages/ia-recomendaciones/ia-recomendaciones.page').then(m => m.IaRecomendacionesPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage)
  },
  {
    path: 'reserva',
    redirectTo: 'reservar/seleccionar-fecha',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'bienvenida' // Cambiado a redirect en lugar de recargar el mismo componente
  }
];
