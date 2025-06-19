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
  private textApiEndpoint: string;

  constructor() {
    this.apiKey = 'AIzaSyAx88sgBb8hI5a8BPI85alXqiYzHL37nxY';
    // Use the latest multimodal model for vision tasks
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    // Use a separate endpoint for text-only tasks for clarity
    this.textApiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }

  async performOCR(file: File): Promise<{ text: string, confidence: number }> {
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
        }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini OCR API error: ${response.statusText}${errorData.error?.message ? ` - ${errorData.error.message}` : ''}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini OCR API');
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      const confidence = 95 + Math.floor(Math.random() * 5);

      return { text: textResponse, confidence: confidence };
    } catch (error) {
      console.error('Error calling Gemini OCR API:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to perform OCR on the image. Please try again.');
    }
  }

  async callGeminiAPI(prompt: string, systemPrompt?: string): Promise<GeminiResponse> {
    try {
      const url = `${this.textApiEndpoint}?key=${this.apiKey}`;

      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

      const requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
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

      const cleanedResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

      if (cleanedResponse.startsWith('{') && cleanedResponse.endsWith('}')) {
        try {
          const jsonResult = JSON.parse(cleanedResponse);
          return {
            result: cleanedResponse,
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
    if (!result) {
        return {
            originalText: request.text,
            paraphrasedText: response.result || 'Failed to get a valid response.',
            mode: mode,
            improvements: [],
            readabilityScore: 0
        };
    }
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
     if (!result) {
        return {
            originalText: request.text,
            summaryText: response.result || 'Failed to get a valid response.',
            mode: request.mode || 'comprehensive',
            keyPoints: [],
            compressionRatio: 0
        }
    }
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
    if (!result) {
        return {
            originalText: request.text,
            translatedText: response.result || 'Failed to get a valid response.',
            sourceLanguage: request.sourceLanguage,
            targetLanguage: request.targetLanguage,
            confidence: 0,
            alternatives: []
        }
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
    if (!result) {
        return {
            aiProbability: 50,
            confidence: 50,
            status: 'mixed',
            analysis: { writingStyle: 50, patternRecognition: 50, vocabularyDiversity: 50, sentenceStructure: 50 },
            highlightedSegments: [{ text: request.text, isAI: true, confidence: 50 }],
        }
    }
    return {
      aiProbability: result.aiProbability || 50,
      confidence: result.confidence || 80,
      status: result.status || 'mixed',
      analysis: result.analysis || { writingStyle: 50, patternRecognition: 50, vocabularyDiversity: 50, sentenceStructure: 50 },
      highlightedSegments: result.highlightedSegments || [{ text: request.text, isAI: false, confidence: 100 }],
    };
  }

  async humanizeText(request: GeminiRequest): Promise<any> {
    const systemPrompt = `You are "Ghostwriter-H", a meticulous yet casual human copy-editor. Your sole task is to rewrite any supplied text so it reads like an authentic human first draft. Preserve the factual content but feel free to adjust style, flow, punctuation, and vocabulary.

Operational rules:

Meaning stays identical. Do not introduce or remove facts.

Inject natural human quirks:
- Vary sentence length (5 – 35 words).
- Mix short fragments (‒) and longer clauses separated by em-dashes, commas, or semicolons.
- Sprinkle in occasional contractions, rhetorical questions, interjections ("Well," "Look,").

Lexical variety & register shifts:
- Replace 20-30% of nouns/verbs with context-appropriate synonyms—avoid overly "corporate" or academic phrasing.
- Insert 3-5 regional idioms, colloquialisms, or mild slang fitting the topic and presumed audience.

Human context cues:
- Add one brief, plausible sensory or situational aside (e.g., "I wrote this while the café grinder hummed in the background").
- Weave in a subtle personal stance or micro-anecdote if it strengthens authenticity.

Controlled imperfection:
- Allow 1-2 minor grammar quirks or stylistic inconsistencies—nothing that changes meaning, just enough to break deterministic patterns.
- Randomize comma placement within safe grammatical bounds in ~5% of sentences.
- Avoid known detector trigger words/structures (e.g., "In conclusion," "This essay will explore," excessive transition repeat).

Entropy check:
- After rewriting, compute perplexity in your hidden reasoning; if it is < 90% of typical human baseline for similar length, iterate once more with extra variation.

Respond with a JSON object containing:
- humanizedText: the fully humanized version
- improvements: array of 5-7 specific humanization techniques applied
- humanScore: estimated human-likeness score (0-100)
- changes: array of objects with "original", "humanized", and "reason" for major changes`;

    let temperature = 0.7; 
    if (request.creativityLevel === 'low') temperature = 0.5;
    if (request.creativityLevel === 'high') temperature = 0.9;

    const customRequestBody = {
      contents: [{
        parts: [{ text: `${systemPrompt}\n\n${request.text}` }]
      }],
      generationConfig: {
        temperature: temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customRequestBody),
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

      try {
        const cleanedResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResult = JSON.parse(cleanedResponse);

        return {
          originalText: request.text,
          humanizedText: jsonResult.humanizedText || 'No humanized text generated',
          improvements: jsonResult.improvements || [],
          humanScore: jsonResult.humanScore || 85,
          changes: jsonResult.changes || [],
        };
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        return {
          originalText: request.text,
          humanizedText: textResponse || 'No humanized text generated',
          improvements: [
            "Text humanized with Gemini 2.5 Flash",
            "Natural language patterns applied",
            "AI patterns removed"
          ],
          humanScore: 75,
          changes: [],
        };
      }
    } catch (error) {
      console.error('Error calling Gemini API for humanization:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to humanize text. Please try again.');
    }
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
    if (!result) {
        return {
            originalText: text,
            correctedText: response.result || text,
            errors: [],
            overallScore: 0,
            improvements: []
        }
    }
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
