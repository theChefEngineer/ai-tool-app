/*
  # Stripe Integration Tables

  1. New Tables
    - `stripe_customers`
      - `id` (bigint, primary key)
      - `user_id` (uuid, foreign key to users)
      - `customer_id` (text, unique Stripe customer ID)
      - `created_at`, `updated_at`, `deleted_at` (timestamps)
    
    - `stripe_subscriptions`
      - `id` (bigint, primary key)
      - `customer_id` (text, unique, references Stripe customer)
      - `subscription_id` (text, Stripe subscription ID)
      - `price_id` (text, Stripe price ID)
      - `current_period_start`, `current_period_end` (bigint, Unix timestamps)
      - `cancel_at_period_end` (boolean)
      - `payment_method_brand`, `payment_method_last4` (text)
      - `status` (text, subscription status)
      - `created_at`, `updated_at`, `deleted_at` (timestamps)
    
    - `stripe_orders`
      - `id` (bigint, primary key)
      - `checkout_session_id` (text, Stripe session ID)
      - `payment_intent_id` (text, Stripe payment intent ID)
      - `customer_id` (text, Stripe customer ID)
      - `amount_subtotal`, `amount_total` (bigint, amounts in cents)
      - `currency` (text, currency code)
      - `payment_status` (text, payment status)
      - `status` (text, order status)
      - `created_at`, `updated_at`, `deleted_at` (timestamps)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Users can only access data linked to their Stripe customer records

  3. Indexes
    - Add indexes for frequently queried columns
    - Ensure efficient lookups by user_id and customer_id
*/

-- Create stripe_customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_customers (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL,
    customer_id text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- Create stripe_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
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

-- Create stripe_orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_orders (
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

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'stripe_customers_user_id_fkey'
    ) THEN
        ALTER TABLE stripe_customers 
        ADD CONSTRAINT stripe_customers_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;
END $$;

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_customer_id ON stripe_customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id ON stripe_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_subscription_id ON stripe_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id ON stripe_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_checkout_session_id ON stripe_orders(checkout_session_id);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "stripe_customers_policy" ON stripe_customers;
DROP POLICY IF EXISTS "stripe_subscriptions_policy" ON stripe_subscriptions;
DROP POLICY IF EXISTS "stripe_orders_policy" ON stripe_orders;

-- Create policies for stripe_customers
CREATE POLICY "stripe_customers_policy" ON stripe_customers 
FOR ALL TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own customer data" ON stripe_customers
FOR SELECT TO authenticated
USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Create policies for stripe_subscriptions
CREATE POLICY "stripe_subscriptions_policy" ON stripe_subscriptions 
FOR ALL TO authenticated 
USING (customer_id IN (SELECT customer_id FROM stripe_customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own subscription data" ON stripe_subscriptions
FOR SELECT TO authenticated
USING (customer_id IN (
    SELECT customer_id FROM stripe_customers 
    WHERE user_id = auth.uid() AND deleted_at IS NULL
) AND deleted_at IS NULL);

-- Create policies for stripe_orders
CREATE POLICY "stripe_orders_policy" ON stripe_orders 
FOR ALL TO authenticated 
USING (customer_id IN (SELECT customer_id FROM stripe_customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own order data" ON stripe_orders
FOR SELECT TO authenticated
USING (customer_id IN (
    SELECT customer_id FROM stripe_customers 
    WHERE user_id = auth.uid() AND deleted_at IS NULL
) AND deleted_at IS NULL);