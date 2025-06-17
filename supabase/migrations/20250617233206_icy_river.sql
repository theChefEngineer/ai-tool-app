/*
  # Stripe Integration Tables

  1. New Tables
    - `stripe_customers`
      - `id` (bigint, primary key)
      - `user_id` (uuid, foreign key to users)
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
      - `status` (text, default 'active')
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
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `deleted_at` (timestamp, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only access data linked to their user_id

  3. Indexes
    - Add performance indexes for common queries
    - Foreign key indexes for joins
</*/

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

-- Create policies for stripe_customers (with existence checks)
DO $$
BEGIN
    -- Main policy for stripe_customers
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'stripe_customers' 
        AND policyname = 'stripe_customers_policy'
    ) THEN
        CREATE POLICY "stripe_customers_policy" ON stripe_customers 
        FOR ALL TO authenticated 
        USING (user_id = auth.uid());
    END IF;

    -- View policy for stripe_customers
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'stripe_customers' 
        AND policyname = 'Users can view their own customer data'
    ) THEN
        CREATE POLICY "Users can view their own customer data" ON stripe_customers
        FOR SELECT TO authenticated
        USING (user_id = auth.uid() AND deleted_at IS NULL);
    END IF;
END $$;

-- Create policies for stripe_subscriptions (with existence checks)
DO $$
BEGIN
    -- Main policy for stripe_subscriptions
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'stripe_subscriptions' 
        AND policyname = 'stripe_subscriptions_policy'
    ) THEN
        CREATE POLICY "stripe_subscriptions_policy" ON stripe_subscriptions 
        FOR ALL TO authenticated 
        USING (customer_id IN (SELECT customer_id FROM stripe_customers WHERE user_id = auth.uid()));
    END IF;

    -- View policy for stripe_subscriptions
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'stripe_subscriptions' 
        AND policyname = 'Users can view their own subscription data'
    ) THEN
        CREATE POLICY "Users can view their own subscription data" ON stripe_subscriptions
        FOR SELECT TO authenticated
        USING (customer_id IN (
            SELECT customer_id FROM stripe_customers 
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        ) AND deleted_at IS NULL);
    END IF;
END $$;

-- Create policies for stripe_orders (with existence checks)
DO $$
BEGIN
    -- Main policy for stripe_orders
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'stripe_orders' 
        AND policyname = 'stripe_orders_policy'
    ) THEN
        CREATE POLICY "stripe_orders_policy" ON stripe_orders 
        FOR ALL TO authenticated 
        USING (customer_id IN (SELECT customer_id FROM stripe_customers WHERE user_id = auth.uid()));
    END IF;

    -- View policy for stripe_orders
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'stripe_orders' 
        AND policyname = 'Users can view their own order data'
    ) THEN
        CREATE POLICY "Users can view their own order data" ON stripe_orders
        FOR SELECT TO authenticated
        USING (customer_id IN (
            SELECT customer_id FROM stripe_customers 
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        ) AND deleted_at IS NULL);
    END IF;
END $$;