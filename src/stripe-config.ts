import { StripeService } from './lib/stripe';

export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
  features?: string[];
  popular?: boolean;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_free',
    priceId: 'price_free',
    name: 'Free',
    description: 'Get started with essential AI writing tools',
    mode: 'subscription',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    features: [
      '10 operations per day',
      'All 8 core features access',
      'AI Paraphrasing (5 modes)',
      'Text Summarization (5 modes)',
      'Multi-language Translation',
      'Grammar Checking',
      'Document OCR',
      'AI Content Detection',
      'Export to PDF & DOCX',
      'Basic support'
    ]
  },
  {
    id: 'prod_SVIhB2E1arLwLY',
    priceId: 'price_1RaI60QuiDoWEii08tD5PN6o',
    name: 'Pro',
    description: 'Unlimited operations with all premium features',
    mode: 'subscription',
    price: 1499, // 14.99 EUR in cents
    currency: 'EUR',
    interval: 'month',
    popular: true,
    features: [
      'UNLIMITED operations',
      'No daily limits',
      'All paraphrasing modes',
      'Advanced summarization (5 modes)',
      'Multi-language translation (100+ languages)',
      'Advanced grammar & style checking',
      'Document transcription (PDF, DOC, DOCX)',
      'Image OCR extraction',
      'AI Content Detection',
      'Plagiarism detection',
      'Chat Assistant',
      'Export capabilities',
      'Priority support'
    ]
  },
  {
    id: 'prod_proplus',
    priceId: 'price_proplus',
    name: 'Enterprise',
    description: 'Advanced features for power users and teams',
    mode: 'subscription',
    price: 2999, // 29.99 EUR in cents
    currency: 'EUR',
    interval: 'month',
    features: [
      'Everything in Pro plan',
      'Priority AI processing (faster responses)',
      'Advanced AI Content Humanizer',
      'Usage analytics & insights',
      'Batch processing (multiple docs)',
      'Team collaboration features',
      'Custom AI model tuning',
      'API access for integration',
      'Higher rate limits',
      'Dedicated support channel',
      'Early access to new features'
    ]
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getFreePlan = (): StripeProduct => {
  return stripeProducts[0];
};

export const getProPlan = (): StripeProduct => {
  return stripeProducts[1];
};

export const getProPlusPlan = (): StripeProduct => {
  return stripeProducts[2];
};

export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return StripeService.formatPrice(price, currency);
};