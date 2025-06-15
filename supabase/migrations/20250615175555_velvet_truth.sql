/*
  # Stripe Integration Tables and Policies

  1. Tables
    - `stripe_customers` - Maps Supabase users to Stripe customers
    - `stripe_subscriptions` - Stores subscription data from Stripe
    - `stripe_orders` - Stores one-time payment data from Stripe

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Proper foreign key relationships

  3. Indexes
    - Optimized for common query patterns
    - Customer ID lookups
    - User ID lookups
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
        AND table_name = 'stripe_customers'
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

-- Enable RLS on all tables
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for these tables to avoid conflicts
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all policies for stripe_customers
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'stripe_customers'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON stripe_customers';
    END LOOP;
    
    -- Drop all policies for stripe_subscriptions
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'stripe_subscriptions'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON stripe_subscriptions';
    END LOOP;
    
    -- Drop all policies for stripe_orders
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'stripe_orders'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON stripe_orders';
    END LOOP;
END $$;

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