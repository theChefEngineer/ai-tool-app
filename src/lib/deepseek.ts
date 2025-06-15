import { supabase } from './supabase';

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

export interface AIDetectionRequest {
  text: string;
}

export interface AIDetectionResponse {
  aiProbability: number;
  confidence: number;
  status: 'human' | 'mixed' | 'ai';
  analysis: {
    writingStyle: number;
    patternRecognition: number;
    vocabularyDiversity: number;
    sentenceStructure: number;
  };
  highlightedSegments: Array<{
    text: string;
    isAI: boolean;
    confidence: number;
  }>;
}

export interface HumanizeRequest {
  text: string;
  preserveMeaning?: boolean;
  creativityLevel?: 'low' | 'medium' | 'high';
}

export interface HumanizeResponse {
  originalText: string;
  humanizedText: string;
  improvements: string[];
  humanScore: number;
  changes: Array<{
    original: string;
    humanized: string;
    reason: string;
  }>;
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
      bullet: 'Create a structured summary using ONLY bullet points. Do not include any paragraph text or introductory sentences. Present all key information as a hierarchical list of bullet points with clear, concise statements. Use main bullet points for major topics and sub-bullets for supporting details.',
      quick: 'Create a brief summary that captures only the most essential information and key takeaways. Focus on the core message and primary conclusions.'
    };

    const systemPrompt = `You are an expert content summarizer. ${prompts[request.mode]}

    ${request.mode === 'bullet' ? 
      `For bullet point mode, respond with a JSON object containing:
      - summaryText: ONLY bullet points formatted as a list (no paragraph text)
      - keyPoints: array of 4-6 main bullet points
      - compressionRatio: percentage reduction from original (as integer, e.g., 35 for 35% shorter)
      
      Format the summaryText as bullet points using "•" symbols. Example:
      • Main point one with key information
      • Main point two with supporting details
        ◦ Sub-point with additional context
        ◦ Another sub-point
      • Main point three with conclusions` :
      `Respond with a JSON object containing:
      - summaryText: the comprehensive summary text
      - keyPoints: array of 4-6 main points captured in the summary
      - compressionRatio: percentage reduction from original (as integer, e.g., 35 for 35% shorter)`
    }

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

  async detectAI(request: AIDetectionRequest): Promise<AIDetectionResponse> {
    const systemPrompt = `You are an advanced AI content detection system powered by DeepSeek R1. Analyze the given text to determine if it was generated by AI or written by a human.

    Analyze the text for:
    1. Writing Style: Repetitive patterns, formulaic structures, overly perfect grammar
    2. Pattern Recognition: Common AI phrases, transitions, and sentence structures
    3. Vocabulary Diversity: Unnatural word choices, lack of colloquialisms
    4. Sentence Structure: Overly complex or artificially varied sentence patterns

    Respond with a JSON object containing:
    - aiProbability: percentage likelihood of AI generation (0-100)
    - confidence: confidence in the analysis (0-100)
    - status: "human" (0-30%), "mixed" (30-70%), or "ai" (70-100%)
    - analysis: object with scores for writingStyle, patternRecognition, vocabularyDiversity, sentenceStructure (0-100 each)
    - highlightedSegments: array of text segments with isAI boolean and confidence score

    Be thorough and accurate in your analysis.`;

    try {
      const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: request.text }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
          max_tokens: 2000,
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
        aiProbability: result.aiProbability || 50,
        confidence: result.confidence || 80,
        status: result.status || 'mixed',
        analysis: result.analysis || {
          writingStyle: 50,
          patternRecognition: 50,
          vocabularyDiversity: 50,
          sentenceStructure: 50,
        },
        highlightedSegments: result.highlightedSegments || request.text.split(' ').map(word => ({
          text: word,
          isAI: Math.random() > 0.7,
          confidence: Math.floor(Math.random() * 40) + 60
        })),
      };
    } catch (error) {
      console.error('Error calling Deepseek API for AI detection:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to analyze text for AI content. Please try again.');
    }
  }

  async humanizeText(request: HumanizeRequest): Promise<HumanizeResponse> {
    const creativityPrompts = {
      low: 'Make minimal changes to reduce AI detection while preserving the exact meaning and structure.',
      medium: 'Apply moderate humanization with natural language variations and improved flow.',
      high: 'Extensively humanize with creative language, varied sentence structures, and natural expressions.'
    };

    const systemPrompt = `You are DeepSeek R1, an advanced AI humanization system. Transform the given AI-generated text to make it appear naturally human-written while preserving the original meaning.

    Humanization Strategy (${request.creativityLevel || 'medium'} creativity):
    ${creativityPrompts[request.creativityLevel || 'medium']}

    Apply these techniques:
    1. Vary sentence structures and lengths naturally
    2. Replace formal/robotic language with conversational tone
    3. Add natural imperfections and human-like expressions
    4. Use contractions, colloquialisms, and personal touches
    5. Break up overly perfect grammar patterns
    6. Add transitional phrases that humans naturally use
    7. Introduce subtle inconsistencies in style (as humans do)
    8. Replace AI-typical phrases with more natural alternatives

    ${request.preserveMeaning ? 'CRITICAL: Preserve the exact meaning and all key information.' : 'You may slightly adjust meaning for better natural flow.'}

    Respond with a JSON object containing:
    - humanizedText: the fully humanized version
    - improvements: array of 5-7 specific humanization techniques applied
    - humanScore: estimated human-likeness score (0-100)
    - changes: array of objects with "original", "humanized", and "reason" for major changes

    Make the text sound like it was written by a knowledgeable human, not an AI.`;

    try {
      const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: request.text }
          ],
          response_format: { type: 'json_object' },
          temperature: request.creativityLevel === 'high' ? 0.8 : request.creativityLevel === 'low' ? 0.3 : 0.6,
          max_tokens: 2500,
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
        humanizedText: result.humanizedText || 'No humanized text generated',
        improvements: result.improvements || [],
        humanScore: result.humanScore || 85,
        changes: result.changes || [],
      };
    } catch (error) {
      console.error('Error calling Deepseek API for humanization:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to humanize text. Please try again.');
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