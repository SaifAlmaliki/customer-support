-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Companies/Organizations table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    plan VARCHAR(50) DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'manager', 'viewer')),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data Sources table
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('postgresql', 'mysql', 'mongodb', 'api', 'documents', 'csv')),
    connection_config JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'syncing')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(20) DEFAULT 'manual' CHECK (sync_frequency IN ('manual', 'hourly', 'daily', 'weekly')),
    error_message TEXT,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base table for indexed content
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    data_source_id UUID REFERENCES data_sources(id) ON DELETE CASCADE,
    title VARCHAR(500),
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('text', 'document', 'table_row', 'api_response')),
    metadata JSONB DEFAULT '{}',
    embedding VECTOR(1536), -- OpenAI embedding dimension
    chunk_index INTEGER DEFAULT 0,
    source_reference TEXT,
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Configurations table
CREATE TABLE ai_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT 'Default Configuration',
    model_provider VARCHAR(50) DEFAULT 'openai' CHECK (model_provider IN ('openai', 'anthropic', 'groq')),
    model_name VARCHAR(100) DEFAULT 'gpt-4',
    model_parameters JSONB DEFAULT '{"temperature": 0.7, "max_tokens": 1000}',
    voice_provider VARCHAR(50) DEFAULT 'elevenlabs',
    voice_id VARCHAR(100),
    voice_settings JSONB DEFAULT '{"stability": 0.75, "similarity_boost": 0.8}',
    system_prompt TEXT,
    response_style VARCHAR(50) DEFAULT 'professional' CHECK (response_style IN ('professional', 'friendly', 'casual', 'formal')),
    escalation_rules JSONB DEFAULT '{}',
    webhook_url TEXT,
    webhook_settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    channel VARCHAR(20) DEFAULT 'voice' CHECK (channel IN ('voice', 'chat', 'email')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'escalated', 'abandoned')),
    resolution_status VARCHAR(20) CHECK (resolution_status IN ('resolved', 'escalated', 'abandoned')),
    ai_config_id UUID REFERENCES ai_configurations(id),
    total_exchanges INTEGER DEFAULT 0,
    duration_seconds INTEGER,
    customer_satisfaction_score INTEGER CHECK (customer_satisfaction_score BETWEEN 1 AND 5),
    resolution_category VARCHAR(100),
    conversation_summary TEXT,
    metadata JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation Messages table
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    speaker VARCHAR(20) NOT NULL CHECK (speaker IN ('customer', 'ai', 'human_agent')),
    message_text TEXT NOT NULL,
    audio_url TEXT,
    confidence_score DECIMAL(3,2),
    response_time_ms INTEGER,
    knowledge_sources JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Feedback table
CREATE TABLE customer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    customer_id VARCHAR(255),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    feedback_categories TEXT[],
    would_recommend BOOLEAN,
    improvement_suggestions TEXT,
    feedback_method VARCHAR(50) DEFAULT 'post_call_survey',
    response_status VARCHAR(20) DEFAULT 'pending' CHECK (response_status IN ('pending', 'responded', 'ignored')),
    admin_response TEXT,
    responded_by UUID REFERENCES user_profiles(id),
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Scenarios table
CREATE TABLE test_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_queries JSONB NOT NULL, -- Array of test queries
    expected_outcomes JSONB DEFAULT '{}',
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Results table
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES test_scenarios(id) ON DELETE CASCADE,
    ai_config_id UUID REFERENCES ai_configurations(id),
    test_type VARCHAR(50) DEFAULT 'single' CHECK (test_type IN ('single', 'batch')),
    results JSONB NOT NULL,
    overall_score DECIMAL(3,2),
    passed_tests INTEGER DEFAULT 0,
    total_tests INTEGER DEFAULT 0,
    execution_time_ms INTEGER,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    user_id UUID REFERENCES user_profiles(id),
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Alerts table
CREATE TABLE system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('performance', 'error', 'usage', 'security')),
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
    acknowledged_by UUID REFERENCES user_profiles(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_company_id ON user_profiles(company_id);
CREATE INDEX idx_data_sources_company_id ON data_sources(company_id);
CREATE INDEX idx_knowledge_base_company_id ON knowledge_base(company_id);
CREATE INDEX idx_knowledge_base_data_source_id ON knowledge_base(data_source_id);
CREATE INDEX idx_conversations_company_id ON conversations(company_id);
CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX idx_customer_feedback_company_id ON customer_feedback(company_id);
CREATE INDEX idx_analytics_events_company_id ON analytics_events(company_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Vector similarity search index
CREATE INDEX idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops);
