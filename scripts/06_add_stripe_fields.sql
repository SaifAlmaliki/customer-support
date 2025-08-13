-- Add Stripe-related fields to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'starter';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;

-- Create subscription_usage table for tracking usage limits
CREATE TABLE IF NOT EXISTS subscription_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
    conversations_used INTEGER DEFAULT 0,
    data_sources_used INTEGER DEFAULT 0,
    users_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, month_year)
);

-- Create index for efficient usage queries
CREATE INDEX IF NOT EXISTS idx_subscription_usage_company_month 
ON subscription_usage(company_id, month_year);

-- Function to get current usage for a company
CREATE OR REPLACE FUNCTION get_current_usage(company_uuid UUID)
RETURNS JSON AS $$
DECLARE
    current_month TEXT;
    usage_data JSON;
BEGIN
    current_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    SELECT json_build_object(
        'conversations_used', COALESCE(conversations_used, 0),
        'data_sources_used', COALESCE(data_sources_used, 0),
        'users_count', COALESCE(users_count, 0),
        'month_year', current_month
    ) INTO usage_data
    FROM subscription_usage
    WHERE company_id = company_uuid AND month_year = current_month;
    
    -- If no usage record exists, return zeros
    IF usage_data IS NULL THEN
        usage_data := json_build_object(
            'conversations_used', 0,
            'data_sources_used', 0,
            'users_count', 0,
            'month_year', current_month
        );
    END IF;
    
    RETURN usage_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage counters
CREATE OR REPLACE FUNCTION increment_usage(
    company_uuid UUID,
    usage_type TEXT,
    increment_by INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
    current_month TEXT;
BEGIN
    current_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    -- Insert or update usage record
    INSERT INTO subscription_usage (company_id, month_year, conversations_used, data_sources_used, users_count)
    VALUES (company_uuid, current_month, 
        CASE WHEN usage_type = 'conversations' THEN increment_by ELSE 0 END,
        CASE WHEN usage_type = 'data_sources' THEN increment_by ELSE 0 END,
        CASE WHEN usage_type = 'users' THEN increment_by ELSE 0 END
    )
    ON CONFLICT (company_id, month_year)
    DO UPDATE SET
        conversations_used = CASE 
            WHEN usage_type = 'conversations' THEN subscription_usage.conversations_used + increment_by
            ELSE subscription_usage.conversations_used
        END,
        data_sources_used = CASE 
            WHEN usage_type = 'data_sources' THEN subscription_usage.data_sources_used + increment_by
            ELSE subscription_usage.data_sources_used
        END,
        users_count = CASE 
            WHEN usage_type = 'users' THEN subscription_usage.users_count + increment_by
            ELSE subscription_usage.users_count
        END,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
