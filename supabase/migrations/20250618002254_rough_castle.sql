-- Create enum types if they don't exist
DO $$ 
BEGIN
    -- Create stripe_subscription_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_subscription_status') THEN
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
    END IF;

    -- Create stripe_order_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_order_status') THEN
        CREATE TYPE stripe_order_status AS ENUM (
            'pending',
            'completed',
            'canceled'
        );
    END IF;
END $$;

-- Create stripe_customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_customers (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- Add constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'stripe_customers_user_id_key'
    ) THEN
        ALTER TABLE stripe_customers ADD CONSTRAINT stripe_customers_user_id_key UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'stripe_customers_customer_id_key'
    ) THEN
        ALTER TABLE stripe_customers ADD CONSTRAINT stripe_customers_customer_id_key UNIQUE (customer_id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'stripe_customers_select_policy'
    ) THEN
        CREATE POLICY "stripe_customers_select_policy" ON stripe_customers
            FOR SELECT TO authenticated
            USING (user_id = auth.uid() AND deleted_at IS NULL);
    END IF;
END $$;

-- Create stripe_subscriptions table if it doesn't exist
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
    status stripe_subscription_status NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- Add constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'stripe_subscriptions_customer_id_key'
    ) THEN
        ALTER TABLE stripe_subscriptions ADD CONSTRAINT stripe_subscriptions_customer_id_key UNIQUE (customer_id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'stripe_subscriptions_select_policy'
    ) THEN
        CREATE POLICY "stripe_subscriptions_select_policy" ON stripe_subscriptions
            FOR SELECT TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM stripe_customers 
                    WHERE customer_id = stripe_subscriptions.customer_id 
                    AND user_id = auth.uid() 
                    AND deleted_at IS NULL
                )
                AND deleted_at IS NULL
            );
    END IF;
END $$;

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
    status stripe_order_status DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

-- Enable RLS
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'stripe_orders_select_policy'
    ) THEN
        CREATE POLICY "stripe_orders_select_policy" ON stripe_orders
            FOR SELECT TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM stripe_customers 
                    WHERE customer_id = stripe_orders.customer_id 
                    AND user_id = auth.uid() 
                    AND deleted_at IS NULL
                )
                AND deleted_at IS NULL
            );
    END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_stripe_customers_user_id'
    ) THEN
        CREATE INDEX idx_stripe_customers_user_id ON stripe_customers(user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_stripe_customers_customer_id'
    ) THEN
        CREATE INDEX idx_stripe_customers_customer_id ON stripe_customers(customer_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_stripe_subscriptions_customer_id'
    ) THEN
        CREATE INDEX idx_stripe_subscriptions_customer_id ON stripe_subscriptions(customer_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_stripe_orders_customer_id'
    ) THEN
        CREATE INDEX idx_stripe_orders_customer_id ON stripe_orders(customer_id);
    END IF;
END $$;