-- =====================================================
-- SaaS Customer Support Admin Portal - Complete Database Setup
-- This script creates all tables, functions, policies, and seed data
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 1. CREATE CORE TABLES
-- =====================================================

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_plan VARCHAR(50) DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'professional', 'enterprise')),
    subscription_status VARCHAR(50) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'past_due')),
    stripe_customer_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'agent')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data sources table
CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('database', 'api', 'document', 'website')),
    connection_config JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'syncing')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(50) DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge base table with vector embeddings
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    data_source_id UUID REFERENCES data_sources(id) ON DELETE CASCADE,
    title VARCHAR(500),
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('text', 'markdown', 'html', 'pdf')),
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    chunk_index INTEGER DEFAULT 0,
    total_chunks INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI configurations table
CREATE TABLE IF NOT EXISTS ai_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT 'Default Configuration',
    ai_model VARCHAR(100) DEFAULT 'gpt-4',
    ai_temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (ai_temperature >= 0 AND ai_temperature <= 2),
    max_tokens INTEGER DEFAULT 500 CHECK (max_tokens > 0),
    voice_provider VARCHAR(50) DEFAULT 'elevenlabs' CHECK (voice_provider IN ('elevenlabs', 'openai', 'azure')),
    voice_id VARCHAR(255),
    voice_settings JSONB DEFAULT '{"stability": 0.75, "similarity_boost": 0.8}',
    system_prompt TEXT DEFAULT 'You are a helpful customer support assistant.',
    escalation_rules JSONB DEFAULT '{"confidence_threshold": 0.7, "max_attempts": 3}',
    webhook_url TEXT,
    webhook_token VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    customer_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    channel VARCHAR(50) DEFAULT 'voice' CHECK (channel IN ('voice', 'chat', 'email', 'phone')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'escalated', 'abandoned')),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    customer_sentiment VARCHAR(50) DEFAULT 'neutral' CHECK (customer_sentiment IN ('positive', 'neutral', 'negative', 'frustrated')),
    resolution_status VARCHAR(50) CHECK (resolution_status IN ('resolved', 'escalated', 'abandoned', 'transferred')),
    resolution_category VARCHAR(100),
    ai_confidence_avg DECIMAL(3,2),
    duration_seconds INTEGER DEFAULT 0,
    total_exchanges INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation messages table
CREATE TABLE IF NOT EXISTS conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    speaker VARCHAR(20) NOT NULL CHECK (speaker IN ('customer', 'ai', 'human')),
    message TEXT NOT NULL,
    audio_url TEXT,
    confidence_score DECIMAL(3,2),
    knowledge_sources JSONB DEFAULT '[]',
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer feedback table
CREATE TABLE IF NOT EXISTS customer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    customer_id VARCHAR(255) NOT NULL,
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    specific_ratings JSONB DEFAULT '{}',
    feedback_text TEXT,
    feedback_categories TEXT[] DEFAULT '{}',
    would_recommend BOOLEAN,
    improvement_suggestions TEXT[],
    issue_fully_resolved BOOLEAN,
    feedback_method VARCHAR(50) DEFAULT 'post_conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test scenarios table
CREATE TABLE IF NOT EXISTS test_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_queries JSONB NOT NULL DEFAULT '[]',
    expected_outcomes JSONB DEFAULT '{}',
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES test_scenarios(id) ON DELETE CASCADE,
    test_type VARCHAR(50) DEFAULT 'single' CHECK (test_type IN ('single', 'batch')),
    results JSONB NOT NULL DEFAULT '{}',
    success_rate DECIMAL(5,2),
    avg_response_time_ms INTEGER,
    avg_confidence_score DECIMAL(3,2),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL DEFAULT '{}',
    customer_id VARCHAR(255),
    session_id VARCHAR(255),
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription usage table
CREATE TABLE IF NOT EXISTS subscription_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    usage_type VARCHAR(50) NOT NULL CHECK (usage_type IN ('conversations', 'ai_queries', 'voice_minutes', 'data_sources', 'knowledge_items')),
    current_usage INTEGER DEFAULT 0,
    usage_limit INTEGER NOT NULL,
    reset_date DATE DEFAULT CURRENT_DATE + INTERVAL '1 month',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, usage_type)
);

-- System alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    alert_data JSONB DEFAULT '{}',
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Companies indexes
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer ON companies(stripe_customer_id);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Data sources indexes
CREATE INDEX IF NOT EXISTS idx_data_sources_company ON data_sources(company_id);
CREATE INDEX IF NOT EXISTS idx_data_sources_type ON data_sources(type);
CREATE INDEX IF NOT EXISTS idx_data_sources_status ON data_sources(status);

-- Knowledge base indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_base_company ON knowledge_base(company_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_data_source ON knowledge_base(data_source_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_search ON knowledge_base USING gin (to_tsvector('english', content));

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_company ON conversations(company_id);
CREATE INDEX IF NOT EXISTS idx_conversations_customer ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- Conversation messages indexes
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at ON conversation_messages(created_at);

-- Analytics events indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_company ON analytics_events(company_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- =====================================================
-- 3. CREATE UTILITY FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION search_knowledge_base(
    company_uuid UUID,
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(500),
    content TEXT,
    similarity float,
    metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb.id,
        kb.title,
        kb.content,
        1 - (kb.embedding <=> query_embedding) as similarity,
        kb.metadata
    FROM knowledge_base kb
    WHERE kb.company_id = company_uuid
        AND 1 - (kb.embedding <=> query_embedding) > match_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Function to get company analytics
CREATE OR REPLACE FUNCTION get_company_analytics(
    company_uuid UUID,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    total_conversations BIGINT,
    resolved_conversations BIGINT,
    avg_resolution_time INTERVAL,
    avg_customer_satisfaction DECIMAL,
    total_ai_queries BIGINT,
    escalation_rate DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(c.id) as total_conversations,
        COUNT(CASE WHEN c.resolution_status = 'resolved' THEN 1 END) as resolved_conversations,
        AVG(c.ended_at - c.started_at) as avg_resolution_time,
        AVG(cf.overall_rating) as avg_customer_satisfaction,
        COUNT(cm.id) FILTER (WHERE cm.speaker = 'ai') as total_ai_queries,
        ROUND(
            COUNT(CASE WHEN c.status = 'escalated' THEN 1 END)::DECIMAL / 
            NULLIF(COUNT(c.id), 0) * 100, 2
        ) as escalation_rate
    FROM conversations c
    LEFT JOIN customer_feedback cf ON c.id = cf.conversation_id
    LEFT JOIN conversation_messages cm ON c.id = cm.conversation_id
    WHERE c.company_id = company_uuid
        AND c.created_at >= start_date
        AND c.created_at <= end_date;
END;
$$;

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_usage(
    company_uuid UUID,
    usage_type_param VARCHAR(50),
    increment_by INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    current_count INTEGER;
    usage_limit_count INTEGER;
BEGIN
    -- Get current usage and limit
    SELECT current_usage, usage_limit
    INTO current_count, usage_limit_count
    FROM subscription_usage
    WHERE company_id = company_uuid AND usage_type = usage_type_param;
    
    -- Check if usage exists
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if increment would exceed limit
    IF current_count + increment_by > usage_limit_count THEN
        RETURN FALSE;
    END IF;
    
    -- Increment usage
    UPDATE subscription_usage
    SET current_usage = current_usage + increment_by,
        updated_at = NOW()
    WHERE company_id = company_uuid AND usage_type = usage_type_param;
    
    RETURN TRUE;
END;
$$;

-- =====================================================
-- 4. CREATE TRIGGERS
-- =====================================================

-- Updated at triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_data_sources_updated_at BEFORE UPDATE ON data_sources FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ai_configurations_updated_at BEFORE UPDATE ON ai_configurations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_test_scenarios_updated_at BEFORE UPDATE ON test_scenarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_subscription_usage_updated_at BEFORE UPDATE ON subscription_usage FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREATE RLS POLICIES
-- =====================================================

-- Companies policies
CREATE POLICY "Users can view their own company" ON companies FOR SELECT USING (
    id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can update their own company" ON companies FOR UPDATE USING (
    id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

-- User profiles policies
CREATE POLICY "Users can view profiles in their company" ON user_profiles FOR SELECT USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Data sources policies
CREATE POLICY "Users can manage data sources in their company" ON data_sources FOR ALL USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

-- Knowledge base policies
CREATE POLICY "Users can manage knowledge base in their company" ON knowledge_base FOR ALL USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

-- AI configurations policies
CREATE POLICY "Users can manage AI configs in their company" ON ai_configurations FOR ALL USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

-- Conversations policies
CREATE POLICY "Users can manage conversations in their company" ON conversations FOR ALL USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

-- Conversation messages policies
CREATE POLICY "Users can manage messages in their company conversations" ON conversation_messages FOR ALL USING (
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
    )
);

-- Customer feedback policies
CREATE POLICY "Users can view feedback in their company" ON customer_feedback FOR ALL USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

-- Test scenarios policies
CREATE POLICY "Users can manage test scenarios in their company" ON test_scenarios FOR ALL USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

-- Test results policies
CREATE POLICY "Users can manage test results in their company" ON test_results FOR ALL USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

-- Analytics events policies
CREATE POLICY "Users can view analytics in their company" ON analytics_events FOR SELECT USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "System can insert analytics events" ON analytics_events FOR INSERT WITH CHECK (true);

-- Subscription usage policies
CREATE POLICY "Users can view usage in their company" ON subscription_usage FOR SELECT USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "System can manage subscription usage" ON subscription_usage FOR ALL USING (true);

-- System alerts policies
CREATE POLICY "Users can view alerts in their company" ON system_alerts FOR SELECT USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can update alerts in their company" ON system_alerts FOR UPDATE USING (
    company_id IN (SELECT company_id FROM user_profiles WHERE id = auth.uid())
);

-- =====================================================
-- 7. SEED DATA
-- =====================================================

-- Insert sample companies
INSERT INTO companies (id, name, email, subscription_plan, subscription_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Acme Corporation', 'admin@acme.com', 'professional', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'TechStart Inc', 'hello@techstart.com', 'starter', 'trial'),
('550e8400-e29b-41d4-a716-446655440003', 'Enterprise Solutions', 'contact@enterprise.com', 'enterprise', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample AI configurations
INSERT INTO ai_configurations (company_id, name, ai_model, system_prompt) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Customer Support Assistant', 'gpt-4', 'You are a helpful customer support assistant for Acme Corporation. Be professional, empathetic, and solution-focused.'),
('550e8400-e29b-41d4-a716-446655440002', 'Tech Support Bot', 'gpt-3.5-turbo', 'You are a technical support assistant. Help users with technical issues and provide clear step-by-step solutions.'),
('550e8400-e29b-41d4-a716-446655440003', 'Enterprise Assistant', 'gpt-4', 'You are an enterprise-grade customer support assistant. Maintain high professionalism and escalate complex issues appropriately.')
ON CONFLICT DO NOTHING;

-- Insert sample data sources
INSERT INTO data_sources (company_id, name, type, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Product Documentation', 'document', 'connected'),
('550e8400-e29b-41d4-a716-446655440001', 'Customer Database', 'database', 'connected'),
('550e8400-e29b-41d4-a716-446655440002', 'API Documentation', 'document', 'connected'),
('550e8400-e29b-41d4-a716-446655440003', 'Knowledge Base', 'website', 'connected')
ON CONFLICT DO NOTHING;

-- Insert sample knowledge base entries
INSERT INTO knowledge_base (company_id, data_source_id, title, content, content_type) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM data_sources WHERE name = 'Product Documentation' LIMIT 1), 'Password Reset Guide', 'To reset your password: 1. Go to the login page 2. Click "Forgot Password" 3. Enter your email 4. Check your email for reset instructions 5. Follow the link and create a new password', 'text'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM data_sources WHERE name = 'Product Documentation' LIMIT 1), 'Account Billing Information', 'Billing questions: Your billing cycle starts on the day you subscribed. You can view invoices in your account settings. For billing disputes, contact our billing team at billing@acme.com', 'text'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM data_sources WHERE name = 'API Documentation' LIMIT 1), 'API Rate Limits', 'Our API has the following rate limits: Free tier: 100 requests/hour, Pro tier: 1000 requests/hour, Enterprise: 10000 requests/hour. Rate limit headers are included in all responses.', 'text')
ON CONFLICT DO NOTHING;

-- Insert subscription usage limits
INSERT INTO subscription_usage (company_id, usage_type, current_usage, usage_limit) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'conversations', 0, 1000),
('550e8400-e29b-41d4-a716-446655440001', 'ai_queries', 0, 5000),
('550e8400-e29b-41d4-a716-446655440001', 'voice_minutes', 0, 500),
('550e8400-e29b-41d4-a716-446655440001', 'data_sources', 2, 10),
('550e8400-e29b-41d4-a716-446655440002', 'conversations', 0, 100),
('550e8400-e29b-41d4-a716-446655440002', 'ai_queries', 0, 1000),
('550e8400-e29b-41d4-a716-446655440002', 'voice_minutes', 0, 50),
('550e8400-e29b-41d4-a716-446655440002', 'data_sources', 1, 3),
('550e8400-e29b-41d4-a716-446655440003', 'conversations', 0, 10000),
('550e8400-e29b-41d4-a716-446655440003', 'ai_queries', 0, 50000),
('550e8400-e29b-41d4-a716-446655440003', 'voice_minutes', 0, 2000),
('550e8400-e29b-41d4-a716-446655440003', 'data_sources', 1, 50)
ON CONFLICT (company_id, usage_type) DO NOTHING;

-- Insert sample test scenarios
INSERT INTO test_scenarios (company_id, name, description, test_queries, category) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Password Reset Scenarios', 'Test various password reset scenarios', '["How do I reset my password?", "I forgot my password", "Password reset not working"]', 'authentication'),
('550e8400-e29b-41d4-a716-446655440001', 'Billing Questions', 'Test billing-related queries', '["When is my next bill due?", "How do I update my payment method?", "I have a billing dispute"]', 'billing'),
('550e8400-e29b-41d4-a716-446655440002', 'API Support', 'Test API-related support queries', '["What are the API rate limits?", "How do I authenticate with the API?", "API returning 429 error"]', 'technical')
ON CONFLICT DO NOTHING;

-- Insert sample conversations
INSERT INTO conversations (company_id, customer_id, session_id, status, resolution_status, duration_seconds, total_exchanges) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'cust_001', 'sess_001', 'completed', 'resolved', 180, 4),
('550e8400-e29b-41d4-a716-446655440001', 'cust_002', 'sess_002', 'completed', 'escalated', 420, 8),
('550e8400-e29b-41d4-a716-446655440002', 'cust_003', 'sess_003', 'completed', 'resolved', 95, 2)
ON CONFLICT DO NOTHING;

-- Insert sample customer feedback
INSERT INTO customer_feedback (company_id, conversation_id, customer_id, overall_rating, feedback_text, would_recommend, issue_fully_resolved) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM conversations WHERE customer_id = 'cust_001' LIMIT 1), 'cust_001', 5, 'Great service! The AI understood my issue immediately and provided clear instructions.', true, true),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM conversations WHERE customer_id = 'cust_002' LIMIT 1), 'cust_002', 3, 'The AI tried to help but eventually needed to escalate to a human agent.', true, true),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM conversations WHERE customer_id = 'cust_003' LIMIT 1), 'cust_003', 4, 'Quick and helpful response for my API question.', true, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. CREATE VIEWS FOR ANALYTICS
-- =====================================================

-- Company dashboard view
CREATE OR REPLACE VIEW company_dashboard_stats AS
SELECT 
    c.id as company_id,
    c.name as company_name,
    c.subscription_plan,
    c.subscription_status,
    COUNT(DISTINCT conv.id) as total_conversations,
    COUNT(DISTINCT CASE WHEN conv.resolution_status = 'resolved' THEN conv.id END) as resolved_conversations,
    COUNT(DISTINCT ds.id) as connected_data_sources,
    COUNT(DISTINCT kb.id) as knowledge_base_items,
    AVG(cf.overall_rating) as avg_customer_satisfaction
FROM companies c
LEFT JOIN conversations conv ON c.id = conv.company_id
LEFT JOIN data_sources ds ON c.id = ds.company_id AND ds.status = 'connected'
LEFT JOIN knowledge_base kb ON c.id = kb.company_id
LEFT JOIN customer_feedback cf ON c.id = cf.company_id
GROUP BY c.id, c.name, c.subscription_plan, c.subscription_status;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Created tables: companies, user_profiles, data_sources, knowledge_base, ai_configurations, conversations, conversation_messages, customer_feedback, test_scenarios, test_results, analytics_events, subscription_usage, system_alerts';
    RAISE NOTICE 'Created functions: search_knowledge_base, get_company_analytics, increment_usage';
    RAISE NOTICE 'Enabled RLS and created security policies';
    RAISE NOTICE 'Inserted sample data for testing';
    RAISE NOTICE 'Ready for production use!';
END $$;
