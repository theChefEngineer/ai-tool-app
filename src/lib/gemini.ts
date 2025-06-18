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

  async paraphrase(request: GeminiRequest): Promise<any> {
    const prompts = {
      standard: 'Rewrite the following text while maintaining the original meaning but using different words and sentence structures:',
      formal: 'Rewrite the following text in a more formal, professional tone suitable for academic or business contexts:',
      creative: 'Rewrite the following text with more creativity, using varied vocabulary, metaphors, and engaging language:',
      shorten: 'Rewrite the following text to be more concise while preserving all key information:',
      expand: 'Rewrite the following text with more detail, examples, and elaboration while maintaining clarity:'
    };
    const mode = request.mode || 'standard';
    const systemPrompt = `You are an expert writing assistant. ${prompts[mode]}

    Respond with a JSON object containing:
    - paraphrasedText: the rewritten text
    - improvements: array of 3-5 specific improvements made
    - readabilityScore: score from 1-10 (10 being most readable)

    Ensure the rewritten text is natural, grammatically correct, and maintains the original intent.`;
    const response = await this.callGeminiAPI(request.text, systemPrompt);
    const result = response.metadata;
    return {
      originalText: request.text,
      paraphrasedText: result.paraphrasedText || 'No paraphrased text generated',
      mode: mode,
      improvements: result.improvements || [],
      readabilityScore: result.readabilityScore || 7,
    };
  }

  async summarize(request: GeminiRequest): Promise<any> {
    const prompts = {
      comprehensive: 'Create a comprehensive summary that maintains the same level of detail and accuracy as a paraphrase. Capture all key ideas and main points while using clear, straightforward language. The summary should be approximately 60-70% of the original length while preserving all important information, statistics, and context.',
      executive: 'Create an executive summary focusing on high-level insights, key decisions, and strategic implications. Present information in a format suitable for senior leadership and decision-makers.',
      academic: 'Create an academic summary that maintains scholarly precision, includes technical terms, and follows formal academic structure. Preserve methodological details and research findings.',
      bullet: 'Create a structured summary using ONLY bullet points. Do not include any paragraph text or introductory sentences. Present all key information as a hierarchical list of bullet points with clear, concise statements. Use main bullet points for major topics and sub-bullets for supporting details.',
      quick: 'Create a brief summary that captures only the most essential information and key takeaways. Focus on the core message and primary conclusions.'
    };
    const mode = request.mode || 'comprehensive';
    const systemPrompt = `You are an expert content summarizer. ${prompts[mode]}

    Respond with a JSON object containing:
    - summaryText: the summary text
    - keyPoints: array of 4-6 main points
    - compressionRatio: percentage reduction from original (as integer)
    
    Ensure the summary is accurate and maintains context.`;
    const response = await this.callGeminiAPI(request.text, systemPrompt);
    const result = response.metadata;
    return {
      originalText: request.text,
      summaryText: result.summaryText || 'No summary generated',
      mode: mode,
      keyPoints: result.keyPoints || [],
      compressionRatio: result.compressionRatio || 50,
    };
  }

  async translate(request: GeminiRequest): Promise<any> {
    const systemPrompt = `You are an expert translator. Translate the given text from ${request.sourceLanguage === 'auto' ? 'the detected language' : request.sourceLanguage} to ${request.targetLanguage}.
    
    Respond with a JSON object containing:
    - translatedText: the translated text
    - detectedLanguage: the detected source language (if auto-detect was used)
    - confidence: translation confidence score from 1-100
    - alternatives: array of 2-3 alternative translations (if applicable)`;
    const response = await this.callGeminiAPI(request.text, systemPrompt);
    const result = response.metadata;
    return {
      originalText: request.text,
      translatedText: result.translatedText || 'No translation generated',
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      detectedLanguage: result.detectedLanguage,
      confidence: result.confidence || 95,
      alternatives: result.alternatives || [],
    };
  }

  async detectAI(request: GeminiRequest): Promise<any> {
    const systemPrompt = `Analyze the given text to determine if it was generated by AI or written by a human.
    
    Respond with a JSON object containing:
    - aiProbability: percentage likelihood of AI generation (0-100)
    - confidence: confidence in the analysis (0-100)
    - status: "human", "mixed", or "ai"
    - analysis: object with scores for writingStyle, patternRecognition, vocabularyDiversity, sentenceStructure (0-100 each)
    - highlightedSegments: array of text segments with isAI boolean and confidence score`;
    const response = await this.callGeminiAPI(request.text, systemPrompt);
    const result = response.metadata;
    return {
      aiProbability: result.aiProbability || 50,
      confidence: result.confidence || 80,
      status: result.status || 'mixed',
      analysis: result.analysis || { writingStyle: 50, patternRecognition: 50, vocabularyDiversity: 50, sentenceStructure: 50 },
      highlightedSegments: result.highlightedSegments || [{ text: request.text, isAI: false, confidence: 100 }],
    };
  }

  async humanizeText(request: GeminiRequest): Promise<any> {
    const creativityPrompts = {
      low: 'Make minimal changes to reduce AI detection while preserving the exact meaning and structure.',
      medium: 'Apply moderate humanization with natural language variations and improved flow.',
      high: 'Extensively humanize with creative language, varied sentence structures, and natural expressions.'
    };
    const creativity = request.creativityLevel || 'medium';
    const systemPrompt = `You are an advanced AI humanization system. Transform the given AI-generated text to make it appear naturally human-written.
    
    Humanization Strategy (${creativity} creativity): ${creativityPrompts[creativity]}
    
    ${request.preserveMeaning ? 'CRITICAL: Preserve the exact meaning and all key information.' : 'You may slightly adjust meaning for better natural flow.'}
    
    Respond with a JSON object containing:
    - humanizedText: the fully humanized version
    - improvements: array of 5-7 specific humanization techniques applied
    - humanScore: estimated human-likeness score (0-100)
    - changes: array of objects with "original", "humanized", and "reason" for major changes`;
    const response = await this.callGeminiAPI(request.text, systemPrompt);
    const result = response.metadata;
    return {
      originalText: request.text,
      humanizedText: result.humanizedText || 'No humanized text generated',
      improvements: result.improvements || [],
      humanScore: result.humanScore || 85,
      changes: result.changes || [],
    };
  }

  async checkGrammar(text: string): Promise<string> {
    const systemPrompt = 'Fix any grammar, spelling, and punctuation errors in the following text. Return only the corrected text.';
    const response = await this.callGeminiAPI(text, systemPrompt);
    return response.result;
  }

  async checkGrammarAdvanced(text: string): Promise<any> {
    const systemPrompt = `You are an advanced grammar and style checker. Analyze the given text and respond with a JSON object containing:
    - correctedText: the fully corrected version
    - errors: array of error objects with id, type, original, suggestion, explanation, startIndex, endIndex
    - overallScore: grammar quality score from 0-100
    - improvements: array of 3-5 general writing improvements made`;
    const response = await this.callGeminiAPI(text, systemPrompt);
    const result = response.metadata;
    const errors = (result.errors || []).map((error: any, index: number) => ({
      id: `error-${index}-${Date.now()}`,
      ...error
    }));
    return {
      originalText: text,
      correctedText: result.correctedText || text,
      errors,
      overallScore: result.overallScore || (errors.length === 0 ? 100 : Math.max(60, 100 - errors.length * 5)),
      improvements: result.improvements || [],
    };
  }
}

export const geminiService = new GeminiService();
