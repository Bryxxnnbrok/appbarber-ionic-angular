import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface IARecommendation {
  message: string;
  recommendation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IaService {
  // ✅ Endpoint actualizado según la documentación oficial
  private readonly GEMINI_TEXT_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private readonly GEMINI_VISION_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
  private readonly API_KEY = environment.geminiApiKey;

  private readonly FACE_ANALYSIS_PROMPT = `
    Eres un experto barbero con años de experiencia analizando formas de rostro.
    Analiza la imagen que te envío y determina la forma del rostro (ovalado, redondo, cuadrado, rectangular, triangular, corazón).

    Basándote en la forma del rostro identificada, recomienda 3 cortes de cabello específicos que mejor le queden.

    Responde en español con el siguiente formato:

    🔍 **Análisis del rostro:**
    [Describe brevemente la forma del rostro identificada]

    ✂️ **Recomendaciones de cortes:**

    1. **[Nombre del corte]**: [Breve descripción y por qué funciona bien]
    2. **[Nombre del corte]**: [Breve descripción y por qué funciona bien]  
    3. **[Nombre del corte]**: [Breve descripción y por qué funciona bien]

    💡 **Consejo adicional:**
    [Un consejo extra sobre styling o cuidado]
  `;

  constructor(private http: HttpClient) {}

  async processTextMessage(message: string): Promise<IARecommendation> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = {
      contents: [
        {
          parts: [
            { text: `Eres un barbero profesional experto. Responde en español: ${message}` }
          ]
        }
      ]
    };

    try {
      const response = await this.http.post<any>(
        `${this.GEMINI_TEXT_URL}?key=${this.API_KEY}`,
        body,
        { headers }
      ).toPromise();

      const result = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo responder.';
      return { message: result };

    } catch (error) {
      console.error('Error llamando a Gemini:', error);
      throw new Error('Error procesando el mensaje con Gemini IA');
    }
  }

  async analyzeImage(imageBase64: string): Promise<IARecommendation> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const base64Data = imageBase64.split(',')[1]; // Quitar el prefijo "data:image/jpeg;base64,"

    const body = {
      contents: [
        {
          parts: [
            { text: this.FACE_ANALYSIS_PROMPT },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
              }
            }
          ]
        }
      ]
    };

    try {
      const response = await this.http.post<any>(
        `${this.GEMINI_VISION_URL}?key=${this.API_KEY}`,
        body,
        { headers }
      ).toPromise();

      const result = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo analizar la imagen.';
      return {
        message: result,
        recommendation: result
      };

    } catch (error) {
      console.error('Error llamando a Gemini Vision:', error);
      throw new Error('Error procesando la imagen con Gemini');
    }
  }
}
