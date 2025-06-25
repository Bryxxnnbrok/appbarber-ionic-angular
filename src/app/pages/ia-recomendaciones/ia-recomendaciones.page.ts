import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  ToastController,
  ActionSheetController,
  LoadingController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  menu, 
  camera, 
  hardwareChip, 
  send, 
  image, 
  cameraOutline 
} from 'ionicons/icons';
import { HttpClientModule } from '@angular/common/http';
import { IaService } from '../../services/ia.service'; // 🔥 IMPORTAR EL SERVICIO

// Interfaz para los mensajes del chat
interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
  image?: string; // Para imágenes enviadas por el usuario
}

@Component({
  selector: 'app-ia-recomendaciones',
  templateUrl: './ia-recomendaciones.page.html',
  styleUrls: ['./ia-recomendaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonIcon,
    HttpClientModule // Añade esto
  ]
})
export class IaRecomendacionesPage {
  
  // Referencia al área de mensajes para auto-scroll
  @ViewChild('messagesArea', { static: false }) messagesArea!: ElementRef;
  
  // Referencia al input de archivo oculto
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  // Texto del mensaje que está escribiendo el usuario
  messageText: string = '';
  
  // Array de mensajes del chat
  messages: ChatMessage[] = [];
  
  // Imagen seleccionada por el usuario (base64)
  selectedImage: string | null = null;
  
  // Estado de carga para cuando se está procesando la IA
  isProcessing: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private iaService: IaService // 🔥 INYECTAR EL SERVICIO
  ) {
    // Registrar los iconos que vamos a usar
    addIcons({ 
      menu, 
      camera, 
      hardwareChip, 
      send, 
      image, 
      cameraOutline 
    });
    
    // Mensaje de bienvenida inicial del bot
    this.addBotMessage('¡Hola! Soy tu asistente de barbería con IA. Puedes enviarme una foto de tu rostro y te recomendaré el mejor corte según la forma de tu cara. También puedes preguntarme sobre estilos y tendencias. 💇‍♂️✨');
  }

  // Función para mostrar/ocultar menú hamburguesa
  toggleMenu(): void {
    // AQUÍ: Implementar la lógica del menú lateral o modal
    console.log('Abrir menú hamburguesa');
  }

  // Función para manejar la tecla Enter en el input
  onKeyPress(event: any): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  // Función para mostrar opciones de selección de imagen
  async selectImage(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar imagen',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Elegir de galería',
          icon: 'image',
          handler: () => {
            this.chooseFromGallery();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // Función para tomar foto con la cámara
  private takePicture(): void {
    // AQUÍ: Implementar la funcionalidad de cámara
    // Usar Capacitor Camera plugin o similar
    console.log('Abrir cámara para tomar foto');
    
    // Ejemplo de implementación:
    // import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
    // const image = await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: false,
    //   resultType: CameraResultType.DataUrl,
    //   source: CameraSource.Camera
    // });
    // this.selectedImage = image.dataUrl;
  }

  // Función para elegir imagen de la galería
  private chooseFromGallery(): void {
    // Simular click en el input file oculto
    this.fileInput.nativeElement.click();
  }

  // Función que se ejecuta cuando se selecciona un archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        this.showToast('Por favor selecciona una imagen válida');
        return;
      }

      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('La imagen es muy grande. Máximo 5MB');
        return;
      }

      // Convertir a base64 para mostrar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        this.sendImageMessage();
      };
      reader.readAsDataURL(file);
    }
  }

  // Función para enviar mensaje de texto
  async sendMessage(): Promise<void> {
    if (!this.messageText.trim()) {
      return;
    }

    // Agregar mensaje del usuario
    const userMessage = this.messageText.trim();
    this.addUserMessage(userMessage);
    
    // Limpiar el input
    this.messageText = '';

    // 🔥 LLAMAR A LA IA REAL PARA PROCESAR TEXTO
    await this.processTextMessage(userMessage);
  }

  // Función para enviar mensaje con imagen
  private async sendImageMessage(): Promise<void> {
    if (!this.selectedImage) {
      return;
    }

    // Agregar mensaje del usuario con imagen
    this.addUserMessage('📸 Imagen enviada', this.selectedImage);

    // 🔥 LLAMAR A LA IA REAL PARA ANALIZAR IMAGEN
    await this.processImageMessage(this.selectedImage);
    
    // Limpiar imagen seleccionada
    this.selectedImage = null;
    
    // Resetear el input file
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // 🔥 FUNCIÓN ACTUALIZADA PARA PROCESAR TEXTO CON IA REAL
  private async processTextMessage(message: string): Promise<void> {
    this.isProcessing = true;
    
    // Mostrar indicador de carga
    const loading = await this.loadingController.create({
      message: 'Consultando con la IA...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // ✨ LLAMADA REAL A LA IA
      const response = await this.iaService.processTextMessage(message);
      this.addBotMessage(response.message);
      
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      this.addBotMessage('Lo siento, hubo un error procesando tu mensaje. Verifica tu conexión e intenta de nuevo. 🔧');
    } finally {
      await loading.dismiss();
      this.isProcessing = false;
    }
  }

  // 🔥 FUNCIÓN ACTUALIZADA PARA PROCESAR IMÁGENES CON IA REAL
  private async processImageMessage(imageData: string): Promise<void> {
    this.isProcessing = true;
    
    // Mostrar indicador de carga
    const loading = await this.loadingController.create({
      message: 'Analizando tu rostro con IA...',
      spinner: 'lines'
    });
    await loading.present();

    try {
      // ✨ LLAMADA REAL A LA IA PARA ANÁLISIS DE IMAGEN
      const response = await this.iaService.analyzeImage(imageData);
      this.addBotMessage(response.message);
      
    } catch (error) {
      console.error('Error analizando imagen:', error);
      this.addBotMessage('Lo siento, hubo un error analizando tu imagen. Asegúrate de que la foto muestre claramente tu rostro e intenta de nuevo. 📷');
    } finally {
      await loading.dismiss();
      this.isProcessing = false;
    }
  }

  // Función para agregar mensaje del usuario al chat
  private addUserMessage(text: string, image?: string): void {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      text: text,
      type: 'user',
      timestamp: new Date(),
      image: image
    };
    
    this.messages.push(message);
    this.scrollToBottom();
  }

  // Función para agregar mensaje del bot al chat
  private addBotMessage(text: string): void {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      text: text,
      type: 'bot',
      timestamp: new Date()
    };
    
    this.messages.push(message);
    this.scrollToBottom();
  }

  // Función para generar ID único para cada mensaje
  private generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Función para hacer scroll automático al último mensaje
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesArea) {
        this.messagesArea.nativeElement.scrollTop = this.messagesArea.nativeElement.scrollHeight;
      }
    }, 100);
  }

  // Función para mostrar toast messages
  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: 'primary'
    });
    await toast.present();
  }

  // Función para navegar de vuelta (si es necesario)
  goBack(): void {
    this.router.navigate(['/home']); // Cambiar por la ruta correcta
  }

  // Lifecycle hook - se ejecuta cuando la página se carga
  ionViewDidEnter(): void {
    console.log('Página de IA Recomendaciones cargada');
  }

  // Lifecycle hook - se ejecuta cuando la página se va a destruir
  ionViewDidLeave(): void {
    console.log('Saliendo de la página de IA Recomendaciones');
  }
}