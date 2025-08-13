-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_data_sources_updated_at BEFORE UPDATE ON data_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_configurations_updated_at BEFORE UPDATE ON ai_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_scenarios_updated_at BEFORE UPDATE ON test_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to search knowledge base using vector similarity
CREATE OR REPLACE FUNCTION search_knowledge_base(
    company_uuid UUID,
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.8,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(500),
    content TEXT,
    similarity FLOAT,
    metadata JSONB,
    source_reference TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb.id,
        kb.title,
        kb.content,
        1 - (kb.embedding <=> query_embedding) AS similarity,
        kb.metadata,
        kb.source_reference
    FROM knowledge_base kb
    WHERE kb.company_id = company_uuid
        AND 1 - (kb.embedding <=> query_embedding) > match_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Function to get conversation analytics
CREATE OR REPLACE FUNCTION get_conversation_analytics(
    company_uuid UUID,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    total_conversations BIGINT,
    avg_duration_seconds NUMERIC,
    resolution_rate NUMERIC,
    avg_satisfaction_score NUMERIC,
    escalation_rate NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) AS total_conversations,
        AVG(c.duration_seconds) AS avg_duration_seconds,
        (COUNT(*) FILTER (WHERE c.resolution_status = 'resolved')::NUMERIC / COUNT(*)) * 100 AS resolution_rate,
        AVG(c.customer_satisfaction_score) AS avg_satisfaction_score,
        (COUNT(*) FILTER (WHERE c.resolution_status = 'escalated')::NUMERIC / COUNT(*)) * 100 AS escalation_rate
    FROM conversations c
    WHERE c.company_id = company_uuid
        AND c.created_at BETWEEN start_date AND end_date;
END;
$$;

-- Function to get system health metrics
CREATE OR REPLACE FUNCTION get_system_health(company_uuid UUID)
RETURNS TABLE (
    active_data_sources BIGINT,
    total_indexed_content BIGINT,
    recent_conversations BIGINT,
    active_alerts BIGINT,
    avg_response_time_ms NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM data_sources WHERE company_id = company_uuid AND status = 'connected') AS active_data_sources,
        (SELECT COUNT(*) FROM knowledge_base WHERE company_id = company_uuid) AS total_indexed_content,
        (SELECT COUNT(*) FROM conversations WHERE company_id = company_uuid AND created_at > NOW() - INTERVAL '24 hours') AS recent_conversations,
        (SELECT COUNT(*) FROM system_alerts WHERE company_id = company_uuid AND status = 'active') AS active_alerts,
        (SELECT AVG(response_time_ms) FROM conversation_messages WHERE conversation_id IN (SELECT id FROM conversations WHERE company_id = company_uuid) AND created_at > NOW() - INTERVAL '24 hours') AS avg_response_time_ms;
END;
$$;
