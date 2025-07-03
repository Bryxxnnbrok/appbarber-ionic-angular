import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

interface IARecommendation {
  message: string;
  recommendation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
  private readonly API_KEY = environment.geminiApiKey;

  private readonly FACE_ANALYSIS_PROMPT = `
    Eres un barbero amigable y experto. Analiza la forma del rostro en la imagen.
    Basado en eso, recomienda 3 cortes de cabello con nombres que existen en una barberia y que se verían geniales.
    Tu tono debe ser cercano y profesional, como si hablaras con un cliente. Sé conciso pero no robótico.

    Usa este formato:

    ¡Hecho! Por la forma de tu rostro, diría que es **[Forma detectada]**.

    Aquí tienes 3 estilos que te quedarían muy bien:
    1. **[Nombre del corte]**: [Descripción breve y amigable del estilo].
    2. **[Nombre del corte]**: [Descripción breve y amigable del estilo].
    3. **[Nombre del corte]**: [Descripción breve y amigable del estilo].

    ¡Espero que te animes a probar alguno!
  `;

  constructor(private http: HttpClient) {}

  async processTextMessage(message: string): Promise<IARecommendation> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = {
      contents: [
        {
          parts: [
            { text: `Eres un barbero virtual muy amigable (añadir emojis) y experto. Tu objetivo es recomendar cortes de cabello.
- Si el usuario pide una recomendación sin dar detalles (forma de rostro, tipo de cabello), DEBES responder pidiendo esa información de forma amable. Por ejemplo: "¡Claro! Para darte una buena recomendación, ¿podrías decirme la forma de tu rostro y tu tipo de cabello (liso, ondulado, rizado)?".
- Si el usuario YA proporciona detalles sobre su rostro o cabello, dale unas recomendaciónes concisas y amigable basada en esa información con nombres de los cortes reales que existen en una barberia.
    Usa este formato:

    ¡Hecho! Por la forma de tu rostro**[Forma detectada]**.

    Aquí tienes 3 estilos que te quedarían muy bien:
    1. **[Nombre del corte]**: [Descripción breve y amigable del estilo].
    2. **[Nombre del corte]**: [Descripción breve y amigable del estilo].
    3. **[Nombre del corte]**: [Descripción breve y amigable del estilo].

    ¡Espero que te animes a probar alguno!
- Para cualquier otra pregunta sobre estilos o barbería, responde de forma breve y cercana.

La pregunta del cliente es: ${message}` }
          ]
        }
      ]
    };

    try {
      const response = await lastValueFrom(this.http.post<any>(
        `${this.GEMINI_API_URL}?key=${this.API_KEY}`,
        body,
        { headers }
      ));

      const result = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo responder.';
      return { message: result };

    } catch (error) {
      console.error('Error llamando a Gemini:', error);
      if (error instanceof HttpErrorResponse) {
        throw new Error(`Error de red o API: ${error.status} - ${error.message || error.statusText}`);
      } else {
        throw new Error('Error procesando el mensaje con Gemini IA');
      }
    }
  }

  async analyzeImage(imageBase64: string): Promise<IARecommendation> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const parts = imageBase64.split(',');
    const mimeType = parts[0].split(':')[1].split(';')[0]; // Extraer mimeType dinámicamente
    const base64Data = parts[1]; // Quitar el prefijo "data:image/jpeg;base64,"

    const body = {
      contents: [
        {
          parts: [
            { text: this.FACE_ANALYSIS_PROMPT },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ]
    };

    try {
      const response = await lastValueFrom(this.http.post<any>(
        `${this.GEMINI_API_URL}?key=${this.API_KEY}`,
        body,
        { headers }
      ));

      const result = response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo analizar la imagen.';
      return {
        message: result,
        recommendation: result
      };

    } catch (error) {
      console.error('Error llamando a Gemini Vision:', error);
      if (error instanceof HttpErrorResponse) {
        throw new Error(`Error de red o API: ${error.status} - ${error.message || error.statusText}`);
      } else {
        throw new Error('Error procesando la imagen con Gemini');
      }
    }
  }
}