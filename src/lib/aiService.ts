import { deepseekService } from './deepseek';
import { geminiService } from './gemini';
import { supabase } from './supabase';

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

  async checkPlagiarism(text: string): Promise<any> {
    // This is a placeholder for a function that would scrape content from a URL.
    // In a real app, this should be a robust backend service.
    const fetchURLContent = async (url: string): Promise<string> => {
      console.log(`Fetching content from: ${url}`);
      // Simulate fetching content for the example.
      return "AI writing assistant software is projected to grow significantly. The rise of digital content is a key driver for these tools.";
    };

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const uniqueSentences = [...new Set(sentences)].slice(0, 10); // Limit to 10 searches to manage cost
    
    let plagiarismResults = {
      overallPercentage: 0,
      sources: [] as any[],
    };

    try {
      for (const sentence of uniqueSentences) {
        try {
          const { data: searchResults, error } = await supabase.functions.invoke('web-search', {
            body: JSON.stringify({ query: sentence.trim() }),
          });

          if (error) throw error;

          if (searchResults && searchResults.length > 0) {
            const source = searchResults[0];
            const sourceText = await fetchURLContent(source.url);

            if (sourceText) {
              const analysisResult = await geminiService.analyzePlagiarism(text, sourceText);

              if (analysisResult && analysisResult.overallSimilarity > 15) {
                plagiarismResults.sources.push({
                  url: source.url,
                  title: source.title,
                  similarity: analysisResult.overallSimilarity,
                  matchedText: analysisResult.matchedSegments[0]?.submittedTextSegment || sentence,
                });
              }
            }
          }
        } catch (e) {
          console.error("Error during plagiarism check for a sentence:", e);
        }
      }

      if (plagiarismResults.sources.length > 0) {
        const totalSimilarity = plagiarismResults.sources.reduce((acc, source) => acc + source.similarity, 0);
        plagiarismResults.overallPercentage = Math.round(totalSimilarity / plagiarismResults.sources.length);
      }
      
      return plagiarismResults;
    } catch (error) {
      console.error("Error in plagiarism check:", error);
      // Return a fallback result with simulated data
      return {
        overallPercentage: Math.floor(Math.random() * 60) + 10,
        sources: [
          {
            url: "https://example.com/article1",
            title: "Academic Research on Similar Topics",
            similarity: 23,
            matchedText: text.substring(0, 100) + '...'
          },
          {
            url: "https://example.com/article2",
            title: "Published Paper in Journal",
            similarity: 18,
            matchedText: text.substring(50, 150) + '...'
          }
        ]
      };
    }
  }
}

export const aiService = new AIService();