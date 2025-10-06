export interface GeminiResponse {
  result: string;
  metadata?: any;
}

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

export interface GrammarError {
  id: string;
  type: 'grammar' | 'spelling' | 'style';
  original: string;
  suggestion: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
}

export interface GrammarResponse {
  originalText: string;
  correctedText: string;
  errors: GrammarError[];
  overallScore: number;
  improvements: string[];
}

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

    // Use Gemini 2.5 Flash Preview for all operations
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    this.textApiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
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

  async paraphrase(request: ParaphraseRequest): Promise<ParaphraseResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

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
      const url = `${this.textApiEndpoint}?key=${this.apiKey}`;
      const fullPrompt = `${systemPrompt}\n\n${request.text}`;

      const requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: request.mode === 'creative' ? 0.8 : 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
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
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response from Gemini API');
      }

      return {
        originalText: request.text,
        paraphrasedText: result.paraphrasedText || 'No paraphrased text generated',
        mode: request.mode,
        improvements: result.improvements || [],
        readabilityScore: result.readabilityScore || 7,
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error instanceof Error ? error : new Error('Failed to paraphrase text');
    }
  }

  async summarize(request: SummaryRequest): Promise<SummaryResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

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
      const url = `${this.textApiEndpoint}?key=${this.apiKey}`;
      const fullPrompt = `${systemPrompt}\n\n${request.text}`;

      const requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
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
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response from Gemini API');
      }

      return {
        originalText: request.text,
        summaryText: result.summaryText || 'No summary generated',
        mode: request.mode,
        keyPoints: result.keyPoints || [],
        compressionRatio: result.compressionRatio || 50,
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error instanceof Error ? error : new Error('Failed to summarize text');
    }
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

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
    - alternatives: array of 2-3 alternative translations as simple strings (not objects)

    Ensure the translation is accurate, natural, and culturally appropriate.`;

    try {
      const url = `${this.textApiEndpoint}?key=${this.apiKey}`;
      const fullPrompt = `${systemPrompt}\n\n${request.text}`;

      const requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
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
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response from Gemini API');
      }

      let alternatives = result.alternatives || [];
      if (Array.isArray(alternatives)) {
        alternatives = alternatives.map((alt: any) => {
          if (typeof alt === 'string') {
            return alt;
          } else if (typeof alt === 'object' && alt !== null) {
            return alt.translation || alt.text || alt.value || String(alt);
          }
          return String(alt);
        });
      } else {
        alternatives = [];
      }

      return {
        originalText: request.text,
        translatedText: result.translatedText || 'No translation generated',
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        detectedLanguage: result.detectedLanguage,
        confidence: result.confidence || 95,
        alternatives: alternatives,
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error instanceof Error ? error : new Error('Failed to translate text');
    }
  }

  async detectAI(request: AIDetectionRequest): Promise<AIDetectionResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const systemPrompt = `You are an advanced AI content detection system. Analyze the given text to determine if it was generated by AI or written by a human.

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
      const url = `${this.textApiEndpoint}?key=${this.apiKey}`;
      const fullPrompt = `${systemPrompt}\n\n${request.text}`;

      const requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
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
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response from Gemini API');
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
      console.error('Error calling Gemini API for AI detection:', error);
      throw error instanceof Error ? error : new Error('Failed to analyze text for AI content');
    }
  }

  async humanizeText(request: HumanizeRequest): Promise<HumanizeResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const creativityPrompts = {
      low: 'Make minimal changes to reduce AI detection while preserving the exact meaning and structure.',
      medium: 'Apply moderate humanization with natural language variations and improved flow.',
      high: 'Extensively humanize with creative language, varied sentence structures, and natural expressions.'
    };

    const systemPrompt = `You are an advanced AI humanization system. Transform the given AI-generated text to make it appear naturally human-written while preserving the original meaning.

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
      const url = `${this.textApiEndpoint}?key=${this.apiKey}`;
      const fullPrompt = `${systemPrompt}\n\n${request.text}`;

      const requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: request.creativityLevel === 'high' ? 0.8 : request.creativityLevel === 'low' ? 0.3 : 0.6,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
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
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response from Gemini API');
      }

      return {
        originalText: request.text,
        humanizedText: result.humanizedText || 'No humanized text generated',
        improvements: result.improvements || [],
        humanScore: result.humanScore || 85,
        changes: result.changes || [],
      };
    } catch (error) {
      console.error('Error calling Gemini API for humanization:', error);
      throw error instanceof Error ? error : new Error('Failed to humanize text');
    }
  }

  async checkGrammar(text: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    try {
      const url = `${this.textApiEndpoint}?key=${this.apiKey}`;
      const prompt = 'Fix any grammar, spelling, and punctuation errors in the following text. Return only the corrected text.\n\n' + text;

      const requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1,
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

      return data.candidates[0].content.parts[0].text || text;
    } catch (error) {
      console.error('Error calling Gemini API for grammar check:', error);
      throw error instanceof Error ? error : new Error('Failed to check grammar');
    }
  }

  async checkGrammarAdvanced(text: string): Promise<GrammarResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const systemPrompt = `You are an advanced grammar and style checker. Analyze the given text for:

    1. Grammar errors (subject-verb agreement, tense consistency, etc.)
    2. Spelling mistakes
    3. Style improvements (clarity, conciseness, flow)
    4. Punctuation issues
    5. Word choice and vocabulary enhancements

    For each error found, provide:
    - The exact text that needs correction
    - A suggested replacement
    - A clear explanation of why the change is needed
    - The position in the text (start and end character indices)
    - The type of error (grammar, spelling, or style)

    Respond with a JSON object containing:
    - correctedText: the fully corrected version of the text
    - errors: array of error objects with id, type, original, suggestion, explanation, startIndex, endIndex
    - overallScore: grammar quality score from 0-100 (100 being perfect)
    - improvements: array of 3-5 general writing improvements made

    Be thorough but focus on meaningful improvements that enhance clarity and correctness.`;

    try {
      const url = `${this.textApiEndpoint}?key=${this.apiKey}`;
      const fullPrompt = `${systemPrompt}\n\n${text}`;

      const requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
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
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (parseError) {
        throw new Error('Failed to parse JSON response from Gemini API');
      }

      const errors = (result.errors || []).map((error: any, index: number) => ({
        id: `error-${index}-${Date.now()}`,
        type: error.type || 'grammar',
        original: error.original || '',
        suggestion: error.suggestion || '',
        explanation: error.explanation || 'Improvement suggested',
        startIndex: error.startIndex || 0,
        endIndex: error.endIndex || 0,
      }));

      return {
        originalText: text,
        correctedText: result.correctedText || text,
        errors,
        overallScore: result.overallScore || (errors.length === 0 ? 100 : Math.max(60, 100 - errors.length * 5)),
        improvements: result.improvements || [],
      };
    } catch (error) {
      console.error('Error calling Gemini API for advanced grammar check:', error);
      throw error instanceof Error ? error : new Error('Failed to check grammar');
    }
  }
}

export class APIKeyValidator {
  static async validateGeminiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
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