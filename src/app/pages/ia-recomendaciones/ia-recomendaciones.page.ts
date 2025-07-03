import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  ToastController,
  ActionSheetController,
  LoadingController,
  IonButtons,
  IonBackButton,
  IonFooter,
  IonTextarea
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IaService } from '../../services/ia.service';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  sendOutline
} from 'ionicons/icons';

interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
  image?: string;
}

@Component({
  selector: 'app-ia-recomendaciones',
  templateUrl: './ia-recomendaciones.page.html',
  styleUrls: ['./ia-recomendaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonContent,
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonFooter,
    IonTextarea
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IaRecomendacionesPage {
  @ViewChild('messagesArea', { static: false }) messagesArea!: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  messageText: string = '';
  messages: ChatMessage[] = [];
  selectedImage: string | null = null;
  isProcessing: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private iaService: IaService
  ) {
    addIcons({ cameraOutline, sendOutline });

    // Mensaje de bienvenida original restaurado para mantener la personalidad del bot
   // this.addBotMessage('¡Hola! Soy tu asistente de barbería con IA. Puedes enviarme una foto de tu rostro y te recomendaré el mejor corte según la forma de tu cara. También puedes preguntarme sobre estilos y tendencias. 💇‍♂️✨');
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
    }
  }

  async selectImage(): Promise<void> {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.showToast('Por favor selecciona una imagen válida');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showToast('La imagen es muy grande. Máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        this.sendImageMessage();
      };
      reader.readAsDataURL(file);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.messageText.trim()) return;

    const userMessage = this.messageText.trim();
    this.addUserMessage(userMessage);
    this.messageText = '';

    await this.processTextMessage(userMessage);
  }

  private async sendImageMessage(): Promise<void> {
    if (!this.selectedImage) return;

    this.addUserMessage('📸 Imagen enviada', this.selectedImage);
    await this.processImageMessage(this.selectedImage);
    this.selectedImage = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private async processTextMessage(message: string): Promise<void> {
    this.isProcessing = true;
    const loading = await this.loadingController.create({
      message: 'Consultando con la IA...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
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

  private async processImageMessage(imageData: string): Promise<void> {
    this.isProcessing = true;
    
    const loading = await this.loadingController.create({
      message: 'Analizando tu rostro con IA...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const response = await this.iaService.analyzeImage(imageData);
      this.addBotMessage(response.message);

    } catch (error) {
      console.error('Error procesando la imagen con IA:', error);
      this.addBotMessage('Lo siento, ocurrió un error al analizar tu foto. Asegúrate de que tu rostro se vea claramente e inténtalo de nuevo. 🤖');
    
    } finally {
      await loading.dismiss();
      this.isProcessing = false;
    }
  }

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

  private addBotMessage(text: string): void {
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const message: ChatMessage = {
      id: this.generateMessageId(),
      text: formattedText,
      type: 'bot',
      timestamp: new Date()
    };
    this.messages.push(message);
    this.scrollToBottom();
  }

  private generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesArea) {
        const element = this.messagesArea.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 150);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: 'primary'
    });
    await toast.present();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
