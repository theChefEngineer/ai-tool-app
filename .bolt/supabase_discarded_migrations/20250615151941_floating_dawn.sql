/*
  # Stripe Integration Tables

  1. New Tables
    - `stripe_customers`
      - `id` (bigint, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `customer_id` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `deleted_at` (timestamp, nullable)
    
    - `stripe_subscriptions`
      - `id` (bigint, primary key)
      - `customer_id` (text, unique)
      - `subscription_id` (text, nullable)
      - `price_id` (text, nullable)
      - `current_period_start` (bigint, nullable)
      - `current_period_end` (bigint, nullable)
      - `cancel_at_period_end` (boolean, default false)
      - `payment_method_brand` (text, nullable)
      - `payment_method_last4` (text, nullable)
      - `status` (enum)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `deleted_at` (timestamp, nullable)
    
    - `stripe_orders`
      - `id` (bigint, primary key)
      - `checkout_session_id` (text)
      - `payment_intent_id` (text)
      - `customer_id` (text)
      - `amount_subtotal` (bigint)
      - `amount_total` (bigint)
      - `currency` (text)
      - `payment_status` (text)
      - `status` (enum, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `deleted_at` (timestamp, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create stripe_customers table
CREATE TABLE stripe_customers (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL,
    customer_id text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- Create stripe_subscriptions table
CREATE TABLE stripe_subscriptions (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id text NOT NULL UNIQUE,
    subscription_id text,
    price_id text,
    current_period_start bigint,
    current_period_end bigint,
    cancel_at_period_end boolean DEFAULT false,
    payment_method_brand text,
    payment_method_last4 text,
    status text NOT NULL DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- Create stripe_orders table
CREATE TABLE stripe_orders (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    checkout_session_id text NOT NULL,
    payment_intent_id text NOT NULL,
    customer_id text NOT NULL,
    amount_subtotal bigint NOT NULL,
    amount_total bigint NOT NULL,
    currency text NOT NULL,
    payment_status text NOT NULL,
    status text DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Create simple policies
CREATE POLICY "stripe_customers_policy" ON stripe_customers FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "stripe_subscriptions_policy" ON stripe_subscriptions FOR ALL TO authenticated USING (customer_id IN (SELECT customer_id FROM stripe_customers WHERE user_id = auth.uid()));
CREATE POLICY "stripe_orders_policy" ON stripe_orders FOR ALL TO authenticated USING (customer_id IN (SELECT customer_id FROM stripe_customers WHERE user_id = auth.uid()));