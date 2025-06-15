/*
  # Stripe Integration Schema

  1. New Tables
    - `stripe_customers`
      - Links Supabase users to Stripe customers
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `customer_id` (text, unique)
      - `created_at`, `updated_at`, `deleted_at` (timestamps)
    
    - `stripe_subscriptions`
      - Manages subscription data and status
      - `id` (bigint, primary key)
      - `customer_id` (text, unique)
      - `subscription_id`, `price_id` (text)
      - `current_period_start`, `current_period_end` (bigint)
      - `cancel_at_period_end` (boolean)
      - `payment_method_brand`, `payment_method_last4` (text)
      - `status` (enum)
      - `created_at`, `updated_at`, `deleted_at` (timestamps)
    
    - `stripe_orders`
      - Tracks one-time payments and orders
      - `id` (bigint, primary key)
      - `checkout_session_id`, `payment_intent_id`, `customer_id` (text)
      - `amount_subtotal`, `amount_total` (bigint)
      - `currency`, `payment_status` (text)
      - `status` (enum)
      - `created_at`, `updated_at`, `deleted_at` (timestamps)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to view their own data
    - Create secure views for user-specific data access

  3. Views
    - `stripe_user_subscriptions` - User's subscription data
    - `stripe_user_orders` - User's order history
*/

-- Create enum types first
DO $$ BEGIN
    CREATE TYPE stripe_subscription_status AS ENUM (
        'not_started',
        'incomplete',
        'incomplete_expired',
        'trialing',
        'active',
        'past_due',
        'canceled',
        'unpaid',
        'paused'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE stripe_order_status AS ENUM (
        'pending',
        'completed',
        'canceled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create stripe_customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid NOT NULL UNIQUE,
    customer_id text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz DEFAULT null,
    CONSTRAINT fk_stripe_customers_user_id 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on stripe_customers
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Create policy for stripe_customers
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Create stripe_subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    customer_id text NOT NULL UNIQUE,
    subscription_id text DEFAULT null,
    price_id text DEFAULT null,
    current_period_start bigint DEFAULT null,
    current_period_end bigint DEFAULT null,
    cancel_at_period_end boolean DEFAULT false,
    payment_method_brand text DEFAULT null,
    payment_method_last4 text DEFAULT null,
    status stripe_subscription_status NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz DEFAULT null
);

-- Enable RLS on stripe_subscriptions
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for stripe_subscriptions
DROP POLICY IF EXISTS "Users can view their own subscription data" ON stripe_subscriptions;
CREATE POLICY "Users can view their own subscription data"
    ON stripe_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Create stripe_orders table
CREATE TABLE IF NOT EXISTS stripe_orders (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    checkout_session_id text NOT NULL,
    payment_intent_id text NOT NULL,
    customer_id text NOT NULL,
    amount_subtotal bigint NOT NULL,
    amount_total bigint NOT NULL,
    currency text NOT NULL,
    payment_status text NOT NULL,
    status stripe_order_status NOT NULL DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz DEFAULT null
);

-- Enable RLS on stripe_orders
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Create policy for stripe_orders
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;
CREATE POLICY "Users can view their own order data"
    ON stripe_orders
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Create view for user subscriptions
DROP VIEW IF EXISTS stripe_user_subscriptions;
CREATE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    s.subscription_id,
    s.status as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
    AND c.deleted_at IS NULL
    AND (s.deleted_at IS NULL OR s.deleted_at IS NULL);

-- Grant permissions on the view
GRANT SELECT ON stripe_user_subscriptions TO authenticated;

-- Create view for user orders
DROP VIEW IF EXISTS stripe_user_orders;
CREATE VIEW stripe_user_orders WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_subtotal,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status as order_status,
    o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid()
    AND c.deleted_at IS NULL
    AND (o.deleted_at IS NULL OR o.deleted_at IS NULL);

-- Grant permissions on the view
GRANT SELECT ON stripe_user_orders TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_customer_id ON stripe_customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id ON stripe_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_subscription_id ON stripe_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id ON stripe_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_checkout_session_id ON stripe_orders(checkout_session_id);