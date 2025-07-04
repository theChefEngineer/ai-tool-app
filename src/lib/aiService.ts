import { deepseekService } from './deepseek';
import { geminiService } from './gemini';

// This service acts as a facade to switch between different AI providers
export class AIService {
  private provider: 'deepseek' | 'gemini' = 'deepseek'; // Default to Deepseek

  constructor() {
    // Initialize with Deepseek as the default provider to avoid Gemini overload issues
    this.setProvider('deepseek');
  }

  setProvider(provider: 'deepseek' | 'gemini') {
    this.provider = provider;
  }

  getProvider() {
    return this.provider;
  }

  async performOCR(file: File) {
    // For OCR, we will directly use the Gemini service.
    return geminiService.performOCR(file);
  }

  async paraphrase(request: any) {
    return this.provider === 'gemini'
      ? geminiService.paraphrase(request)
      : deepseekService.paraphrase(request);
  }

  async summarize(request: any) {
    return this.provider === 'gemini'
      ? geminiService.summarize(request)
      : deepseekService.summarize(request);
  }

  async translate(request: any) {
    return this.provider === 'gemini'
      ? geminiService.translate(request)
      : deepseekService.translate(request);
  }

  async detectAI(request: any) {
    return this.provider === 'gemini'
      ? geminiService.detectAI(request)
      : deepseekService.detectAI(request);
  }

  async humanizeText(request: any) {
    // Always use Gemini for humanization with the specialized prompt
    return geminiService.humanizeText(request);
  }

  async checkGrammar(text: string) {
    return this.provider === 'gemini'
      ? geminiService.checkGrammar(text)
      : deepseekService.checkGrammar(text);
  }

  async checkGrammarAdvanced(text: string) {
    return this.provider === 'gemini'
      ? geminiService.checkGrammarAdvanced(text)
      : deepseekService.checkGrammarAdvanced(text);
  }
}

export const aiService = new AIService();