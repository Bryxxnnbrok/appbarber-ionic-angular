import { Injectable, NgZone } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider
} from '@angular/fire/auth';

import { 
  Firestore, 
  doc,
  setDoc, 
  getDoc, 
  collection,
  addDoc,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';

import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';
import { Observable } from 'rxjs';

// 📦 Interfaz para los datos del usuario
export interface UserData {
  uid: string;
  email: string;
  nombre: string;
  telefono?: string;
  createdAt: Date;
  ultimaReserva?: Date;
}

// 📦 Interfaz para las reservas
export interface Reserva {
  id?: string;
  usuarioId: string;
  servicio: string;
  fecha: Date;
  hora: string;
  precio: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private ngZone: NgZone
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      console.log('Estado de auth cambió:', user ? 'Logueado' : 'No logueado');
    });
  }

  // ✅ REGISTRO con correo/contraseña - MEJORADO
  async register(email: string, password: string, userData: { nombre: string, telefono?: string }): Promise<UserCredential> {
    try {
      // 🔍 PRIMERO: Verificar si el email ya existe y con qué método
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
      
      if (signInMethods.length > 0) {
        // El email ya existe
        if (signInMethods.includes('google.com')) {
          throw new Error('Este email ya está registrado con Google. Usa el botón de Google para iniciar sesión.');
        } else if (signInMethods.includes('password')) {
          throw new Error('Este email ya está registrado. Ve a iniciar sesión.');
        }
      }

      // Si llegamos aquí, el email no existe, proceder con el registro
      const result = await createUserWithEmailAndPassword(this.auth, email, password);

      // Guardar datos adicionales del usuario en Firestore
      const userDocData: UserData = {
        uid: result.user.uid,
        email,
        nombre: userData.nombre,
        telefono: userData.telefono,
        createdAt: new Date()
      };

      await setDoc(doc(this.firestore, 'users', result.user.uid), userDocData);

      // Redirigir al home
      this.ngZone.run(() => this.router.navigate(['/home']));
      return result;

    } catch (error: any) {
      console.error('Error en register:', error);
      let errorMessage = 'Error desconocido';
      
      switch (error.code) {
        case 'auth/email-already-in-use': 
          errorMessage = 'Este email ya está registrado'; 
          break;
        case 'auth/weak-password': 
          errorMessage = 'La contraseña debe tener al menos 6 caracteres'; 
          break;
        case 'auth/invalid-email': 
          errorMessage = 'Email inválido'; 
          break;
        default: 
          // Si es nuestro mensaje personalizado, usarlo
          errorMessage = error.message || 'Error al registrarse';
      }
      throw new Error(errorMessage);
    }
  }

  // ✅ INICIO DE SESIÓN con correo y contraseña - MEJORADO
  async login(email: string, password: string) {
    try {
      // 🔍 PRIMERO: Verificar los métodos de autenticación disponibles
      const methods = await fetchSignInMethodsForEmail(this.auth, email);

      if (methods.length === 0) {
        throw new Error('No existe una cuenta con este email. Regístrate primero.');
      }

      // Si el correo fue registrado SOLO con Google (no tiene password)
      if (methods.includes('google.com') && !methods.includes('password')) {
        throw new Error('Este correo está registrado con Google. Usa el botón "Iniciar con Google".');
      }

      // Si no tiene método de contraseña
      if (!methods.includes('password')) {
        throw new Error('Este email no tiene configurada una contraseña. Usa otro método de inicio de sesión.');
      }

      // Si es válido, iniciar sesión con correo y contraseña
      const result = await signInWithEmailAndPassword(this.auth, email, password);

      // Redirigir al home
      this.ngZone.run(() => this.router.navigate(['/home']));
      return result;

    } catch (error: any) {
      console.error('Error en login:', error);
      let errorMessage = error.message || 'Error desconocido';
      
      switch (error.code) {
        case 'auth/user-not-found': 
          errorMessage = 'No existe una cuenta con este email'; 
          break;
        case 'auth/wrong-password': 
          errorMessage = 'Contraseña incorrecta'; 
          break;
        case 'auth/invalid-email': 
          errorMessage = 'Email inválido'; 
          break;
        case 'auth/too-many-requests': 
          errorMessage = 'Demasiados intentos. Intenta más tarde'; 
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada';
          break;
      }
      throw new Error(errorMessage);
    }
  }

  // ✅ INICIO DE SESIÓN con Google - MEJORADO
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      // Verificar si ya existe el documento del usuario en Firestore
      const userDoc = await getDoc(doc(this.firestore, 'users', result.user.uid));

      // Si no existe, crearlo
      if (!userDoc.exists()) {
        const userData: UserData = {
          uid: result.user.uid,
          email: result.user.email || '',
          nombre: result.user.displayName || 'Usuario Google',
          createdAt: new Date()
        };
        await setDoc(doc(this.firestore, 'users', result.user.uid), userData);
      }

      // Redirigir al home
      this.ngZone.run(() => this.router.navigate(['/home']));
      return result;

    } catch (error: any) {
      console.error('Error en loginWithGoogle:', error);
      let errorMessage = 'Error al iniciar sesión con Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Cancelaste el inicio de sesión';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'El popup fue bloqueado. Permite popups para este sitio';
          break;
      }
      throw new Error(errorMessage);
    }
  }

  // 🆕 FUNCIÓN PARA VINCULAR CUENTAS (opcional)
  async linkAccountWithPassword(email: string, password: string) {
    try {
      if (!this.currentUser) {
        throw new Error('Debes estar logueado para vincular cuentas');
      }

      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(this.currentUser, credential);
      
      return true;
    } catch (error: any) {
      console.error('Error al vincular cuenta:', error);
      throw new Error('No se pudo vincular la cuenta');
    }
  }

  // ✅ Cerrar sesión
  async logout() {
    try {
      await signOut(this.auth);
      this.currentUser = null;
      this.ngZone.run(() => this.router.navigate(['/login']));
    } catch (error) {
      throw new Error('Error al cerrar sesión');
    }
  }

  // ✅ Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // ✅ Saber si hay sesión activa
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // ✅ Escuchar cambios en la sesión
  getAuthState(): Observable<User | null> {
    return new Observable(observer => onAuthStateChanged(this.auth, observer));
  }

  // ✅ Obtener los datos de perfil desde Firestore
  async getUserData(): Promise<UserData | null> {
    try {
      if (!this.currentUser) return null;
      const userDoc = await getDoc(doc(this.firestore, 'users', this.currentUser.uid));
      return userDoc.exists() ? userDoc.data() as UserData : null;
    } catch (error) {
      return null;
    }
  }

  // ✅ Crear nueva reserva
  async createReserva(reservaData: Omit<Reserva, 'usuarioId' | 'createdAt'>) {
    if (!this.currentUser) throw new Error('Debes estar logueado para hacer una reserva');

    const reserva: Omit<Reserva, 'id'> = {
      ...reservaData,
      usuarioId: this.currentUser.uid,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(this.firestore, 'reservas'), reserva);
    return docRef.id;
  }

  // ✅ Obtener reservas del usuario actual
  async getUserReservas(): Promise<Reserva[]> {
    if (!this.currentUser) return [];

    const q = query(
      collection(this.firestore, 'reservas'),
      where('usuarioId', '==', this.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Reserva);
  }

  // ✅ Actualizar perfil del usuario
  async updateUserData(userData: Partial<UserData>) {
    if (!this.currentUser) throw new Error('Debes estar logueado para actualizar datos');
    await setDoc(doc(this.firestore, 'users', this.currentUser.uid), userData, { merge: true });
  }
}