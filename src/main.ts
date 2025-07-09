import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// 🔥 FIREBASE IMPORTS
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// ✅ IONICONS: Importar y registrar iconos necesarios
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  callOutline,
  calendarOutline,
  timeOutline,
  documentTextOutline,
  menuOutline,
  arrowBackOutline
} from 'ionicons/icons';

addIcons({
  'person-outline': personOutline,
  'mail-outline': mailOutline,
  'call-outline': callOutline,
  'calendar-outline': calendarOutline,
  'time-outline': timeOutline,
  'document-text-outline': documentTextOutline,
  'menu-outline': menuOutline,
  'arrow-back-outline': arrowBackOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),

    // 🔥 FIREBASE PROVIDERS
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});

console.log('Environment:', environment);
console.log('Firebase Config:', environment.firebaseConfig);
console.log('Gemini API Key:', environment.geminiApiKey);

// TODO: Eliminar en producción
if (!environment.production) {
  console.warn('Modo de desarrollo activo. Las claves API están expuestas en el código fuente.');
}
