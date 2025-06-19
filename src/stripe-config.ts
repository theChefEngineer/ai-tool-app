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
    description: 'Basic AI-powered writing tools',
    mode: 'subscription',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    features: [
      '10 operations per day',
      'Basic paraphrasing',
      'Basic summarization',
      'Standard translation',
      'Limited grammar checking',
      'Basic document transcription'
    ]
  },
  {
    id: 'prod_SVIhB2E1arLwLY',
    priceId: 'price_1RaI60QuiDoWEii08tD5PN6o',
    name: 'Pro',
    description: 'Unlimited AI-powered writing tools with premium features',
    mode: 'subscription',
    price: 899, // 8.99 EUR in cents
    currency: 'EUR',
    interval: 'month',
    popular: true,
    features: [
      'Unlimited operations',
      'All paraphrasing modes',
      'Advanced summarization',
      'Multi-language translation',
      'Advanced grammar checking',
      'Document transcription',
      'Image OCR extraction',
      'Standard plagiarism detection',
      'Export capabilities',
      'Priority support'
    ]
  },
  {
    id: 'prod_proplus',
    priceId: 'price_proplus',
    name: 'Pro Plus',
    description: 'Enterprise-grade AI tools with advanced features',
    mode: 'subscription',
    price: 1500, // 15.00 EUR in cents
    currency: 'EUR',
    interval: 'month',
    features: [
      'Everything in Pro plan',
      'AI Content Humanizer',
      'Advanced OCR capabilities',
      'Highest quality AI models',
      'Batch processing',
      'API access',
      'Team collaboration',
      'Custom branding',
      'Dedicated support',
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