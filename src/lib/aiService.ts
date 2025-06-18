import { deepseekService } from './deepseek';
import { geminiService } from './gemini';

// This service acts as a facade to switch between different AI providers
export class AIService {
  private provider: 'deepseek' | 'gemini' = 'gemini'; // Default to Gemini

  constructor() {
    // Initialize with Gemini as the default provider
    this.setProvider('gemini');
  }

  setProvider(provider: 'deepseek' | 'gemini') {
    this.provider = provider;
  }

  getProvider() {
    return this.provider;
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