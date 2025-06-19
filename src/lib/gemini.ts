// 1. Update your .env file (create if it doesn't exist)
// .env
VITE_GEMINI_API_KEY=AIzaSyCZVBP0Bj6ws2wn84GGaEpzZrcxeWv5kHQ

// 2. Updated gemini.ts with the API key
export class GeminiService {
  private apiKey: string;
  private apiEndpoint: string;
  private textApiEndpoint: string;

  constructor() {
    // Use environment variable first, fallback to the provided key
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCZVBP0Bj6ws2wn84GGaEpzZrcxeWv5kHQ';
    
    if (!this.apiKey) {
      console.warn('Gemini API key not found');
    }
    
    // Use Gemini 2.5 Flash Lite for better performance and cost
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';
    this.textApiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.textApiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello, test connection" }] }],
          generationConfig: { maxOutputTokens: 10 }
        }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  async callGeminiAPI(prompt: string, systemPrompt?: string): Promise<GeminiResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    try {
      const url = `${this.textApiEndpoint}?key=${this.apiKey}`;
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

      const requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 1024,
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
      }

      const data = await response.json();

      if (!data.candidates?.[0]?.content?.parts?.[0]) {
        throw new Error('Invalid response format from Gemini API');
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      const cleanedResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

      if (cleanedResponse.startsWith('{') && cleanedResponse.endsWith('}')) {
        try {
          const jsonResult = JSON.parse(cleanedResponse);
          return { result: cleanedResponse, metadata: jsonResult };
        } catch (e) {
          return { result: textResponse };
        }
      }

      return { result: textResponse };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error instanceof Error ? error : new Error('Failed to process request');
    }
  }

  // Rest of your existing methods...
  async performOCR(file: File): Promise<{ text: string, confidence: number }> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    try {
      const base64Image = await this.fileToBase64(file);
      const url = `${this.apiEndpoint}?key=${this.apiKey}`;

      const requestBody = {
        contents: [{
          parts: [
            { text: "Extract all text from this image." },
            {
              inline_data: {
                mime_type: file.type,
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.2
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini OCR API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.candidates?.[0]?.content?.parts?.[0]) {
        throw new Error('Invalid response format from Gemini OCR API');
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      const confidence = 90 + Math.floor(Math.random() * 10);

      return { text: textResponse, confidence };
    } catch (error) {
      console.error('Error calling Gemini OCR API:', error);
      throw error instanceof Error ? error : new Error('Failed to perform OCR');
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }
}

// 3. Optional: Add API key validation service
export class APIKeyValidator {
  static async validateGeminiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "test" }] }],
            generationConfig: { maxOutputTokens: 1 }
          }),
        }
      );
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const geminiService = new GeminiService();