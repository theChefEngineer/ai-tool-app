export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SVIhB2E1arLwLY',
    priceId: 'price_1RaI60QuiDoWEii08tD5PN6o',
    name: 'ParaText Pro',
    description: 'Unlimited AI-powered writing tools with premium features',
    mode: 'subscription',
    price: 500, // 5.00 EUR in cents
    currency: 'EUR',
    interval: 'month',
  },
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};