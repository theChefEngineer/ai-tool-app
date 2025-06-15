const DEEPSEEK_API_KEY = 'sk-79ed40b434d140a0a0fa9becefe4b5aa';
const DEEPSEEK_API_ENDPOINT = 'https://api.deepseek.com/v1';

export interface ParaphraseRequest {
  text: string;
  mode: 'standard' | 'formal' | 'creative' | 'shorten' | 'expand';
  language?: string;
}

export interface ParaphraseResponse {
  originalText: string;
  paraphrasedText: string;
  mode: string;
  improvements: string[];
  readabilityScore: number;
}

export interface SummaryRequest {
  text: string;
  mode: 'comprehensive' | 'executive' | 'academic' | 'bullet' | 'quick';
}

export interface SummaryResponse {
  originalText: string;
  summaryText: string;
  mode: string;
  keyPoints: string[];
  compressionRatio: number;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedLanguage?: string;
  confidence?: number;
  alternatives?: string[];
}

export class DeepseekService {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    if (!DEEPSEEK_API_KEY) {
      throw new Error('Deepseek API key is required');
    }
    this.apiKey = DEEPSEEK_API_KEY;
    this.apiEndpoint = DEEPSEEK_API_ENDPOINT;
  }

  async paraphrase(request: ParaphraseRequest): Promise<ParaphraseResponse> {
    const prompts = {
      standard: 'Rewrite the following text while maintaining the original meaning but using different words and sentence structures:',
      formal: 'Rewrite the following text in a more formal, professional tone suitable for academic or business contexts:',
      creative: 'Rewrite the following text with more creativity, using varied vocabulary, metaphors, and engaging language:',
      shorten: 'Rewrite the following text to be more concise while preserving all key information:',
      expand: 'Rewrite the following text with more detail, examples, and elaboration while maintaining clarity:'
    };

    const systemPrompt = `You are an expert writing assistant. ${prompts[request.mode]} 

    Respond with a JSON object containing:
    - paraphrasedText: the rewritten text
    - improvements: array of 3-5 specific improvements made
    - readabilityScore: score from 1-10 (10 being most readable)

    Ensure the rewritten text is natural, grammatically correct, and maintains the original intent.`;

    try {
      const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: request.text }
          ],
          response_format: { type: 'json_object' },
          temperature: request.mode === 'creative' ? 0.8 : 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Deepseek API error: ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Deepseek API');
      }

      let result;
      try {
        result = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response from Deepseek API');
      }

      return {
        originalText: request.text,
        paraphrasedText: result.paraphrasedText || 'No paraphrased text generated',
        mode: request.mode,
        improvements: result.improvements || [],
        readabilityScore: result.readabilityScore || 7,
      };
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to paraphrase text. Please try again.');
    }
  }

  async summarize(request: SummaryRequest): Promise<SummaryResponse> {
    const prompts = {
      comprehensive: 'Create a comprehensive summary that maintains the same level of detail and accuracy as a paraphrase. Capture all key ideas and main points while using clear, straightforward language. The summary should be approximately 60-70% of the original length while preserving all important information, statistics, and context.',
      executive: 'Create an executive summary focusing on high-level insights, key decisions, and strategic implications. Present information in a format suitable for senior leadership and decision-makers.',
      academic: 'Create an academic summary that maintains scholarly precision, includes technical terms, and follows formal academic structure. Preserve methodological details and research findings.',
      bullet: 'Create a structured summary using bullet points that organize information hierarchically. Use clear headings and sub-points to present key information in an easily scannable format.',
      quick: 'Create a brief summary that captures only the most essential information and key takeaways. Focus on the core message and primary conclusions.'
    };

    const systemPrompt = `You are an expert content summarizer. ${prompts[request.mode]}

    Respond with a JSON object containing:
    - summaryText: the comprehensive summary text
    - keyPoints: array of 4-6 main points captured in the summary
    - compressionRatio: percentage reduction from original (as integer, e.g., 35 for 35% shorter)

    Ensure the summary maintains accuracy, preserves context, and follows a logical flow without introducing new information.`;

    try {
      const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: request.text }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Deepseek API error: ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Deepseek API');
      }

      let result;
      try {
        result = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response from Deepseek API');
      }

      return {
        originalText: request.text,
        summaryText: result.summaryText || 'No summary generated',
        mode: request.mode,
        keyPoints: result.keyPoints || [],
        compressionRatio: result.compressionRatio || 50,
      };
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to summarize text. Please try again.');
    }
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const systemPrompt = `You are an expert translator with deep knowledge of linguistics and cultural nuances. 
    
    Translate the given text from ${request.sourceLanguage === 'auto' ? 'the detected language' : request.sourceLanguage} to ${request.targetLanguage}.
    
    Requirements:
    - Maintain the original meaning, tone, and context
    - Use natural, fluent language in the target language
    - Preserve formatting and structure
    - Consider cultural context and idiomatic expressions
    - If source language is 'auto', detect the language first
    
    Respond with a JSON object containing:
    - translatedText: the translated text
    - detectedLanguage: the detected source language (if auto-detect was used)
    - confidence: translation confidence score from 1-100
    - alternatives: array of 2-3 alternative translations (if applicable)
    
    Ensure the translation is accurate, natural, and culturally appropriate.`;

    try {
      const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: request.text }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Deepseek API error: ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Deepseek API');
      }

      let result;
      try {
        result = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response from Deepseek API');
      }

      return {
        originalText: request.text,
        translatedText: result.translatedText || 'No translation generated',
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        detectedLanguage: result.detectedLanguage,
        confidence: result.confidence || 95,
        alternatives: result.alternatives || [],
      };
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to translate text. Please try again.');
    }
  }

  async checkGrammar(text: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Fix any grammar, spelling, and punctuation errors in the following text. Return only the corrected text.'
            },
            { role: 'user', content: text }
          ],
          temperature: 0.1,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Deepseek API error: ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Deepseek API');
      }

      return data.choices[0].message.content || text;
    } catch (error) {
      console.error('Error calling Deepseek API for grammar check:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to check grammar. Please try again.');
    }
  }
}

export const deepseekService = new DeepseekService();