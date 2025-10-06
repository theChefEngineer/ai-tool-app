import { geminiService } from './gemini';

export class AIService {
  async performOCR(file: File) {
    return geminiService.performOCR(file);
  }

  async paraphrase(request: any) {
    return geminiService.paraphrase(request);
  }

  async summarize(request: any) {
    return geminiService.summarize(request);
  }

  async translate(request: any) {
    return geminiService.translate(request);
  }

  async detectAI(request: any) {
    return geminiService.detectAI(request);
  }

  async humanizeText(request: any) {
    return geminiService.humanizeText(request);
  }

  async checkGrammar(text: string) {
    return geminiService.checkGrammar(text);
  }

  async checkGrammarAdvanced(text: string) {
    return geminiService.checkGrammarAdvanced(text);
  }
}

export const aiService = new AIService();