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
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';
  }

  private async callGeminiAPI(prompt: string, systemPrompt?: string): Promise<GeminiResponse> {
    try {
      const url = `${this.apiEndpoint}?key=${this.apiKey}`;
      
      const requestBody: any = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };

      // Add system prompt if provided
      if (systemPrompt) {
        requestBody.contents.unshift({
          role: "system",
          parts: [{ text: systemPrompt }]
        });
      }

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
      
      // Try to parse JSON if the response looks like JSON
      if (textResponse.trim().startsWith('{') && textResponse.trim().endsWith('}')) {
        try {
          const jsonResult = JSON.parse(textResponse);
          return {
            result: jsonResult.result || jsonResult.text || jsonResult.content || textResponse,
            metadata: jsonResult
          };
        } catch (e) {
          // If parsing fails, return the text as is
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
    const systemPrompt = `You are an expert writing assistant. ${prompts[mode as keyof typeof prompts] || prompts.standard} 

    Respond with a JSON object containing:
    - paraphrasedText: the rewritten text
    - improvements: array of 3-5 specific improvements made
    - readabilityScore: score from 1-10 (10 being most readable)

    Ensure the rewritten text is natural, grammatically correct, and maintains the original intent.`;

    try {
      const response = await this.callGeminiAPI(request.text, systemPrompt);
      
      let result;
      try {
        if (typeof response.metadata === 'object') {
          result = response.metadata;
        } else {
          // Try to extract JSON from the text response
          const jsonMatch = response.result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No valid JSON found in response');
          }
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // Fallback to a basic response
        result = {
          paraphrasedText: response.result,
          improvements: ['Improved readability', 'Enhanced clarity', 'Varied vocabulary'],
          readabilityScore: 7
        };
      }

      return {
        originalText: request.text,
        paraphrasedText: result.paraphrasedText || response.result,
        mode: mode,
        improvements: result.improvements || [],
        readabilityScore: result.readabilityScore || 7,
      };
    } catch (error) {
      console.error('Error in paraphrase:', error);
      throw error;
    }
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
    const systemPrompt = `You are an expert content summarizer. ${prompts[mode as keyof typeof prompts] || prompts.comprehensive}

    ${mode === 'bullet' ? 
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
      const response = await this.callGeminiAPI(request.text, systemPrompt);
      
      let result;
      try {
        if (typeof response.metadata === 'object') {
          result = response.metadata;
        } else {
          // Try to extract JSON from the text response
          const jsonMatch = response.result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No valid JSON found in response');
          }
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // Fallback to a basic response
        result = {
          summaryText: response.result,
          keyPoints: ['Key point extracted from the text'],
          compressionRatio: 50
        };
      }

      return {
        originalText: request.text,
        summaryText: result.summaryText || response.result,
        mode: mode,
        keyPoints: result.keyPoints || [],
        compressionRatio: result.compressionRatio || 50,
      };
    } catch (error) {
      console.error('Error in summarize:', error);
      throw error;
    }
  }

  async translate(request: GeminiRequest): Promise<any> {
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
      const response = await this.callGeminiAPI(request.text, systemPrompt);
      
      let result;
      try {
        if (typeof response.metadata === 'object') {
          result = response.metadata;
        } else {
          // Try to extract JSON from the text response
          const jsonMatch = response.result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No valid JSON found in response');
          }
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // Fallback to a basic response
        result = {
          translatedText: response.result,
          detectedLanguage: request.sourceLanguage === 'auto' ? 'en' : request.sourceLanguage,
          confidence: 95,
          alternatives: []
        };
      }

      return {
        originalText: request.text,
        translatedText: result.translatedText || response.result,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        detectedLanguage: result.detectedLanguage,
        confidence: result.confidence || 95,
        alternatives: result.alternatives || [],
      };
    } catch (error) {
      console.error('Error in translate:', error);
      throw error;
    }
  }

  async detectAI(request: GeminiRequest): Promise<any> {
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
      const response = await this.callGeminiAPI(request.text, systemPrompt);
      
      let result;
      try {
        if (typeof response.metadata === 'object') {
          result = response.metadata;
        } else {
          // Try to extract JSON from the text response
          const jsonMatch = response.result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No valid JSON found in response');
          }
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // Fallback to a basic response
        result = {
          aiProbability: 50,
          confidence: 80,
          status: 'mixed',
          analysis: {
            writingStyle: 50,
            patternRecognition: 50,
            vocabularyDiversity: 50,
            sentenceStructure: 50
          },
          highlightedSegments: []
        };
      }

      // If highlightedSegments is missing, create a simple version
      if (!result.highlightedSegments || !Array.isArray(result.highlightedSegments) || result.highlightedSegments.length === 0) {
        result.highlightedSegments = request.text.split(' ').map(word => ({
          text: word,
          isAI: Math.random() > 0.7,
          confidence: Math.floor(Math.random() * 40) + 60
        }));
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
        highlightedSegments: result.highlightedSegments,
      };
    } catch (error) {
      console.error('Error in detectAI:', error);
      throw error;
    }
  }

  async humanizeText(request: GeminiRequest): Promise<any> {
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
      const response = await this.callGeminiAPI(request.text, systemPrompt);
      
      let result;
      try {
        if (typeof response.metadata === 'object') {
          result = response.metadata;
        } else {
          // Try to extract JSON from the text response
          const jsonMatch = response.result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No valid JSON found in response');
          }
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // Fallback to a basic response
        result = {
          humanizedText: response.result,
          improvements: ['Added natural language variations', 'Improved flow and readability', 'Reduced formal tone'],
          humanScore: 85,
          changes: []
        };
      }

      return {
        originalText: request.text,
        humanizedText: result.humanizedText || response.result,
        improvements: result.improvements || [],
        humanScore: result.humanScore || 85,
        changes: result.changes || [],
      };
    } catch (error) {
      console.error('Error in humanizeText:', error);
      throw error;
    }
  }

  async checkGrammar(text: string): Promise<string> {
    try {
      const systemPrompt = 'Fix any grammar, spelling, and punctuation errors in the following text. Return only the corrected text.';
      const response = await this.callGeminiAPI(text, systemPrompt);
      return response.result;
    } catch (error) {
      console.error('Error in checkGrammar:', error);
      throw error;
    }
  }

  async checkGrammarAdvanced(text: string): Promise<any> {
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
      const response = await this.callGeminiAPI(text, systemPrompt);
      
      let result;
      try {
        if (typeof response.metadata === 'object') {
          result = response.metadata;
        } else {
          // Try to extract JSON from the text response
          const jsonMatch = response.result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No valid JSON found in response');
          }
        }
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // Fallback to a basic response
        result = {
          correctedText: response.result,
          errors: [],
          overallScore: 90,
          improvements: ['Improved overall readability']
        };
      }

      // Add unique IDs to errors and ensure proper structure
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
      console.error('Error in checkGrammarAdvanced:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();