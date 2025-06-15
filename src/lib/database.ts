import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ParaphraseHistoryItem {
  id: string;
  user_id: string;
  original_text: string;
  paraphrased_text: string;
  mode: string;
  readability_score: number;
  improvements: string[];
  created_at: string;
}

export interface SummaryHistoryItem {
  id: string;
  user_id: string;
  original_text: string;
  summary_text: string;
  mode: string;
  compression_ratio: number;
  key_points: string[];
  created_at: string;
}

export interface TranslationHistoryItem {
  id: string;
  user_id: string;
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  detected_language?: string;
  confidence?: number;
  created_at: string;
}

export class DatabaseService {
  // User Profile Methods
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, create one
          return await this.createUserProfile(userId);
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  static async createUserProfile(userId: string, profileData?: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: user?.email || '',
          first_name: profileData?.first_name || '',
          last_name: profileData?.last_name || '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
          email: updates.email,
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  // Paraphrase History Methods
  static async getParaphraseHistory(userId: string, limit = 50): Promise<ParaphraseHistoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('paraphrase_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching paraphrase history:', error);
      return [];
    }
  }

  static async addParaphraseHistory(userId: string, item: Omit<ParaphraseHistoryItem, 'id' | 'user_id' | 'created_at'>): Promise<ParaphraseHistoryItem | null> {
    try {
      const { data, error } = await supabase
        .from('paraphrase_history')
        .insert({
          user_id: userId,
          original_text: item.original_text,
          paraphrased_text: item.paraphrased_text,
          mode: item.mode,
          readability_score: item.readability_score,
          improvements: item.improvements,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding paraphrase history:', error);
      return null;
    }
  }

  static async clearParaphraseHistory(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('paraphrase_history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing paraphrase history:', error);
      return false;
    }
  }

  // Summary History Methods
  static async getSummaryHistory(userId: string, limit = 50): Promise<SummaryHistoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('summary_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching summary history:', error);
      return [];
    }
  }

  static async addSummaryHistory(userId: string, item: Omit<SummaryHistoryItem, 'id' | 'user_id' | 'created_at'>): Promise<SummaryHistoryItem | null> {
    try {
      const { data, error } = await supabase
        .from('summary_history')
        .insert({
          user_id: userId,
          original_text: item.original_text,
          summary_text: item.summary_text,
          mode: item.mode,
          compression_ratio: item.compression_ratio,
          key_points: item.key_points,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding summary history:', error);
      return null;
    }
  }

  static async clearSummaryHistory(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('summary_history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing summary history:', error);
      return false;
    }
  }

  // Translation History Methods
  static async getTranslationHistory(userId: string, limit = 50): Promise<TranslationHistoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('translation_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching translation history:', error);
      return [];
    }
  }

  static async addTranslationHistory(userId: string, item: Omit<TranslationHistoryItem, 'id' | 'user_id' | 'created_at'>): Promise<TranslationHistoryItem | null> {
    try {
      const { data, error } = await supabase
        .from('translation_history')
        .insert({
          user_id: userId,
          original_text: item.original_text,
          translated_text: item.translated_text,
          source_language: item.source_language,
          target_language: item.target_language,
          detected_language: item.detected_language,
          confidence: item.confidence,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding translation history:', error);
      return null;
    }
  }

  static async clearTranslationHistory(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('translation_history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing translation history:', error);
      return false;
    }
  }

  // Combined History Methods
  static async clearAllHistory(userId: string): Promise<boolean> {
    try {
      const [paraphraseResult, summaryResult, translationResult] = await Promise.all([
        this.clearParaphraseHistory(userId),
        this.clearSummaryHistory(userId),
        this.clearTranslationHistory(userId),
      ]);

      return paraphraseResult && summaryResult && translationResult;
    } catch (error) {
      console.error('Error clearing all history:', error);
      return false;
    }
  }

  static async exportAllHistory(userId: string) {
    try {
      const [paraphraseHistory, summaryHistory, translationHistory, userProfile] = await Promise.all([
        this.getParaphraseHistory(userId),
        this.getSummaryHistory(userId),
        this.getTranslationHistory(userId),
        this.getUserProfile(userId),
      ]);

      return {
        user_profile: userProfile,
        paraphrase_history: paraphraseHistory,
        summary_history: summaryHistory,
        translation_history: translationHistory,
        export_date: new Date().toISOString(),
        total_items: paraphraseHistory.length + summaryHistory.length + translationHistory.length,
      };
    } catch (error) {
      console.error('Error exporting history:', error);
      return null;
    }
  }
}