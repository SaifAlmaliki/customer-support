-- Enable Row Level Security on all tables
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
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's company_id
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT company_id 
    FROM user_profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Companies policies
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (id = get_user_company_id());

CREATE POLICY "Users can update their own company" ON companies
  FOR UPDATE USING (id = get_user_company_id());

-- User profiles policies
CREATE POLICY "Users can view profiles in their company" ON user_profiles
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Data sources policies
CREATE POLICY "Users can manage data sources in their company" ON data_sources
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert data sources for their company" ON data_sources
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- Knowledge base policies
CREATE POLICY "Users can access knowledge base in their company" ON knowledge_base
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert knowledge base for their company" ON knowledge_base
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- AI configurations policies
CREATE POLICY "Users can manage AI configs in their company" ON ai_configurations
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert AI configs for their company" ON ai_configurations
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- Conversations policies
CREATE POLICY "Users can access conversations in their company" ON conversations
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert conversations for their company" ON conversations
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- Conversation messages policies
CREATE POLICY "Users can access messages from their company conversations" ON conversation_messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can insert messages for their company conversations" ON conversation_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE company_id = get_user_company_id()
    )
  );

-- Customer feedback policies
CREATE POLICY "Users can access feedback in their company" ON customer_feedback
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert feedback for their company" ON customer_feedback
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- Test scenarios policies
CREATE POLICY "Users can manage test scenarios in their company" ON test_scenarios
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert test scenarios for their company" ON test_scenarios
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- Test results policies
CREATE POLICY "Users can access test results in their company" ON test_results
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert test results for their company" ON test_results
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- Analytics events policies
CREATE POLICY "Users can access analytics in their company" ON analytics_events
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert analytics for their company" ON analytics_events
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- System alerts policies
CREATE POLICY "Users can access alerts in their company" ON system_alerts
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert alerts for their company" ON system_alerts
  FOR INSERT WITH CHECK (company_id = get_user_company_id());
