import { useAuthStore } from '../store/authStore';

export interface GeminiRequest {
  text: string;
  mode?: string;
  language?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  creativityLevel?: 'low' | 'medium' | 'high';
  preserveMeaning?: boolean;
}

export interface GeminiResponse {
  result: string;
  metadata?: any;
}

export class GeminiService {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = 'AIzaSyAx88sgBb8hI5a8BPI85alXqiYzHL37nxY';
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  }

  private async callGeminiAPI(prompt: string, systemPrompt?: string): Promise<GeminiResponse> {
    try {
      const url = `${this.apiEndpoint}?key=${this.apiKey}`;

      const contents = [];

      // Add system prompt if provided
      if (systemPrompt) {
        contents.push({
          role: "user",
          parts: [{ text: systemPrompt }]
        });
      }

      // Add user prompt
      contents.push({
        role: "user",
        parts: [{ text: prompt }]
      });

      const requestBody = {
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const textResponse = data.candidates[0].content.parts[0].text;

      if (textResponse.trim().startsWith('{') && textResponse.trim().endsWith('}')) {
        try {
          const jsonResult = JSON.parse(textResponse);
          return {
            result: jsonResult.result || jsonResult.text || jsonResult.content || textResponse,
            metadata: jsonResult
          };
        } catch (e) {
          return { result: textResponse };
        }
      }

      return { result: textResponse };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to process request. Please try again.');
    }
  }

  // Other methods (paraphrase, summarize, translate, detectAI, etc.) stay unchanged except they use callGeminiAPI
  // You can reuse them directly from your existing code
}

export const geminiService = new GeminiService();
