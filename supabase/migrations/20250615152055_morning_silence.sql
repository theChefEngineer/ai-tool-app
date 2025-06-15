/*
  # Stripe Integration Tables

  1. New Tables
    - `stripe_customers`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `customer_id` (text, unique)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz)
    - `stripe_subscriptions`
      - `id` (bigint, primary key)
      - `customer_id` (text, unique)
      - `subscription_id` (text)
      - `price_id` (text)
      - `current_period_start` (bigint)
      - `current_period_end` (bigint)
      - `cancel_at_period_end` (boolean)
      - `payment_method_brand` (text)
      - `payment_method_last4` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz)
    - `stripe_orders`
      - `id` (bigint, primary key)
      - `checkout_session_id` (text)
      - `payment_intent_id` (text)
      - `customer_id` (text)
      - `amount_subtotal` (bigint)
      - `amount_total` (bigint)
      - `currency` (text)
      - `payment_status` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create stripe_customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL,
    customer_id text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'stripe_customers_customer_id_key' 
        AND table_name = 'stripe_customers'
    ) THEN
        ALTER TABLE stripe_customers ADD CONSTRAINT stripe_customers_customer_id_key UNIQUE (customer_id);
    END IF;
END $$;

-- Create stripe_subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id text NOT NULL,
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

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'stripe_subscriptions_customer_id_key' 
        AND table_name = 'stripe_subscriptions'
    ) THEN
        ALTER TABLE stripe_subscriptions ADD CONSTRAINT stripe_subscriptions_customer_id_key UNIQUE (customer_id);
    END IF;
END $$;

-- Create stripe_orders table
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

-- Enable RLS (safe to run multiple times)
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "stripe_customers_policy" ON stripe_customers;
DROP POLICY IF EXISTS "stripe_subscriptions_policy" ON stripe_subscriptions;
DROP POLICY IF EXISTS "stripe_orders_policy" ON stripe_orders;

-- Create policies
CREATE POLICY "stripe_customers_policy" ON stripe_customers 
    FOR ALL TO authenticated 
    USING (user_id = auth.uid());

CREATE POLICY "stripe_subscriptions_policy" ON stripe_subscriptions 
    FOR ALL TO authenticated 
    USING (
        customer_id IN (
            SELECT customer_id 
            FROM stripe_customers 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "stripe_orders_policy" ON stripe_orders 
    FOR ALL TO authenticated 
    USING (
        customer_id IN (
            SELECT customer_id 
            FROM stripe_customers 
            WHERE user_id = auth.uid()
        )
    );