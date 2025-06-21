import { Injectable } from '@angular/core';
// 👆 Injectable = Esta clase puede ser "inyectada" en otras partes de la app

import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
// 👆 Importamos todas las funciones de Firebase Authentication

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
// 👆 Importamos funciones para manejar la base de datos Firestore

import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';
// 👆 Para navegar entre pantallas de la app

import { Observable } from 'rxjs';
// 👆 Para manejar datos que cambian en tiempo real

// 🔥 INTERFAZ: Define cómo debe verse la información del usuario
export interface UserData {
  uid: string;        // ID único del usuario
  email: string;      // Email del usuario
  nombre: string;     // Nombre completo
  telefono?: string;  // Teléfono (opcional, por eso el ?)
  createdAt: Date;    // Fecha cuando se registró
  ultimaReserva?: Date; // Última vez que hizo una reserva
}

// 🔥 INTERFAZ: Define cómo debe verse una reserva
export interface Reserva {
  id?: string;           // ID de la reserva (opcional)
  usuarioId: string;     // ID del usuario que hace la reserva
  servicio: string;      // Tipo de servicio (corte, barba, etc.)
  fecha: Date;           // Fecha de la cita
  hora: string;          // Hora de la cita (ej: "14:30")
  precio: number;        // Costo del servicio
  estado: 'pendiente' | 'confirmada' | 'cancelada'; // Estado de la reserva
  createdAt: Date;       // Cuándo se creó la reserva
}

@Injectable({
  providedIn: 'root' // 👈 Significa que este servicio estará disponible en toda la app
})
export class AuthService {

  // 🎯 VARIABLES PRIVADAS (solo este servicio las puede usar)
  private currentUser: User | null = null; // Usuario actual logueado
  
  // 🏗️ CONSTRUCTOR: Se ejecuta cuando se crea el servicio
  constructor(
    private auth: Auth,        // 👈 Conexión con Firebase Auth
    private firestore: Firestore, // 👈 Conexión con Firestore Database
    private router: Router     // 👈 Para navegar entre pantallas
  ) {
    // 👂 ESCUCHAR cambios en el estado de autenticación
    // Cada vez que el usuario hace login/logout, esto se ejecuta
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user; // Guardamos el usuario actual
      console.log('Estado de auth cambió:', user ? 'Logueado' : 'No logueado');
    });
  }

  // 📝 FUNCIÓN: Registrar nuevo usuario
  async register(email: string, password: string, userData: { nombre: string, telefono?: string }
  ): Promise<UserCredential>{  //tipo de retorno añadido
    try {
      console.log('🚀 Iniciando registro de usuario...');
      
      // 1️⃣ Crear cuenta en Firebase Authentication
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('✅ Usuario creado en Auth:', result.user.uid);


        // 3️⃣ Crear documento del usuario en Firestore
        const userDocData: UserData = {
          uid: result.user.uid,        // ID único del usuario
          email: email,                // Email proporcionado
          nombre: userData.nombre,     // Nombre proporcionado
          telefono: userData.telefono, // Teléfono (puede ser undefined)
          createdAt: new Date()        // Fecha actual
        };

        // 4️⃣ Guardar en la colección 'users' con el UID como ID del documento
        await setDoc(doc(this.firestore, 'users', result.user.uid), userDocData);
        console.log('✅ Datos del usuario guardados en Firestore');

        // 5️⃣ Navegar a la pantalla principal
        this.router.navigate(['/tabs']);
        
        return result; // Retornar resultado exitoso
      
    } 
    catch (error: any) {
      console.error('❌ Error en registro:', error);
      
      // 🚨 Manejar diferentes tipos de errores
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
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage); // Lanzar error personalizado
    }
  }

  // 🔐 FUNCIÓN: Hacer login con email y contraseña
  async login(email: string, password: string) {
    try {
      console.log('🚀 Iniciando login...');
      
      // 1️⃣ Intentar hacer login en Firebase
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('✅ Login exitoso:', result.user.uid);
      
      // 2️⃣ Navegar a la pantalla principal
      this.router.navigate(['/tabs']);
      
      return result;
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      
      // 🚨 Manejar errores de login
      let errorMessage = 'Error desconocido';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado';
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
        default:
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  // 🎯 FUNCIÓN: Login con Google
  async loginWithGoogle() {
    try {
      console.log('🚀 Iniciando login con Google...');
      
      // 1️⃣ Crear proveedor de Google
      const provider = new GoogleAuthProvider();
      
      // 2️⃣ Abrir popup de Google para login
      const result = await signInWithPopup(this.auth, provider);
      console.log('✅ Login con Google exitoso:', result.user.uid);
      
      // 3️⃣ Verificar si es la primera vez que se loguea
      const userDoc = await getDoc(doc(this.firestore, 'users', result.user.uid));
      
      // 4️⃣ Si no existe el documento, crear uno (usuario nuevo)
      if (!userDoc.exists()) {
        const userData: UserData = {
          uid: result.user.uid,
          email: result.user.email || '',
          nombre: result.user.displayName || 'Usuario Google',
          createdAt: new Date()
        };
        
        await setDoc(doc(this.firestore, 'users', result.user.uid), userData);
        console.log('✅ Nuevo usuario de Google guardado en Firestore');
      }
      
      // 5️⃣ Navegar a pantalla principal
      this.router.navigate(['/tabs']);
      
      return result;
    } catch (error: any) {
      console.error('❌ Error en login con Google:', error);
      throw new Error('Error al iniciar sesión con Google');
    }
  }

  // 🚪 FUNCIÓN: Cerrar sesión
  async logout() {
    try {
      console.log('🚀 Cerrando sesión...');
      
      // 1️⃣ Cerrar sesión en Firebase
      await signOut(this.auth);
      console.log('✅ Sesión cerrada exitosamente');
      
      // 2️⃣ Limpiar usuario actual
      this.currentUser = null;
      
      // 3️⃣ Navegar a pantalla de login
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  // 👤 FUNCIÓN: Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUser; // Retorna el usuario logueado o null
  }

  // ✅ FUNCIÓN: Verificar si hay usuario logueado
  isLoggedIn(): boolean {
    return this.currentUser !== null; // true si hay usuario, false si no
  }

  // 👂 FUNCIÓN: Escuchar cambios en el estado de autenticación
  getAuthState(): Observable<User | null> {
    return new Observable(observer => {
      // Cada vez que cambie el estado de auth, notificar al observador
      return onAuthStateChanged(this.auth, observer);
    });
  }

  // 📊 FUNCIÓN: Obtener datos completos del usuario desde Firestore
  async getUserData(): Promise<UserData | null> {
    try {
      // 1️⃣ Verificar que hay usuario logueado
      if (!this.currentUser) {
        console.log('⚠️ No hay usuario logueado');
        return null;
      }
      
      // 2️⃣ Obtener documento del usuario desde Firestore
      const userDoc = await getDoc(doc(this.firestore, 'users', this.currentUser.uid));
      
      // 3️⃣ Si existe el documento, retornar los datos
      if (userDoc.exists()) {
        console.log('✅ Datos del usuario obtenidos:', userDoc.data());
        return userDoc.data() as UserData;
      } else {
        console.log('⚠️ Documento del usuario no encontrado');
        return null;
      }
    } catch (error) {
      console.error('❌ Error al obtener datos del usuario:', error);
      return null;
    }
  }

  // 📅 FUNCIÓN: Crear nueva reserva
  async createReserva(reservaData: Omit<Reserva, 'usuarioId' | 'createdAt'>) {
    try {
      // 1️⃣ Verificar que hay usuario logueado
      if (!this.currentUser) {
        throw new Error('Debes estar logueado para hacer una reserva');
      }
      
      console.log('🚀 Creando nueva reserva...');
      
      // 2️⃣ Crear objeto de reserva completo
      const reserva: Omit<Reserva, 'id'> = {
        ...reservaData,                    // Datos proporcionados
        usuarioId: this.currentUser.uid,   // ID del usuario actual
        createdAt: new Date()              // Fecha de creación
      };
      
      // 3️⃣ Guardar en la colección 'reservas'
      const docRef = await addDoc(collection(this.firestore, 'reservas'), reserva);
      console.log('✅ Reserva creada con ID:', docRef.id);
      
      return docRef.id; // Retornar ID de la reserva creada
    } catch (error) {
      console.error('❌ Error al crear reserva:', error);
      throw error;
    }
  }

  // 📋 FUNCIÓN: Obtener historial de reservas del usuario
  async getUserReservas(): Promise<Reserva[]> {
    try {
      // 1️⃣ Verificar que hay usuario logueado
      if (!this.currentUser) {
        console.log('⚠️ No hay usuario logueado');
        return [];
      }
      
      console.log('🚀 Obteniendo reservas del usuario...');
      
      // 2️⃣ Crear consulta para obtener solo las reservas del usuario actual
      const q = query(
        collection(this.firestore, 'reservas'),
        where('usuarioId', '==', this.currentUser.uid)
      );
      
      // 3️⃣ Ejecutar consulta
      const querySnapshot = await getDocs(q);
      
      // 4️⃣ Convertir documentos a array de reservas
      const reservas: Reserva[] = [];
      querySnapshot.forEach((doc) => {
        reservas.push({
          id: doc.id,           // ID del documento
          ...doc.data()         // Datos de la reserva
        } as Reserva);
      });
      
      console.log(`✅ Se encontraron ${reservas.length} reservas`);
      return reservas;
    } catch (error) {
      console.error('❌ Error al obtener reservas:', error);
      return [];
    }
  }

  // 🔄 FUNCIÓN: Actualizar datos del usuario
  async updateUserData(userData: Partial<UserData>) {
    try {
      // 1️⃣ Verificar que hay usuario logueado
      if (!this.currentUser) {
        throw new Error('Debes estar logueado para actualizar datos');
      }
      
      console.log('🚀 Actualizando datos del usuario...');
      
      // 2️⃣ Actualizar documento en Firestore
      await setDoc(
        doc(this.firestore, 'users', this.currentUser.uid),
        userData,
        { merge: true } // merge: true = solo actualizar campos proporcionados
      );
      
      console.log('✅ Datos actualizados exitosamente');
    } catch (error) {
      console.error('❌ Error al actualizar datos:', error);
      throw error;
    }
  }
}