-- Insert additional test companies
INSERT INTO companies (id, name, domain, plan, status) VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'TechCorp Solutions', 'techcorp.com', 'enterprise', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'StartupXYZ', 'startupxyz.io', 'starter', 'active');

-- Insert sample data sources for Demo Company
INSERT INTO data_sources (id, company_id, name, type, connection_config, status, sync_frequency, last_sync_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440000',
    'Customer Database',
    'postgresql',
    '{"host": "localhost", "database": "customers", "username": "admin", "encrypted": true}',
    'connected',
    'daily',
    NOW() - INTERVAL '2 hours'
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440000',
    'Help Documentation',
    'documents',
    '{"source_type": "confluence", "base_url": "https://company.atlassian.net", "space_key": "HELP"}',
    'connected',
    'weekly',
    NOW() - INTERVAL '1 day'
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440000',
    'Support API',
    'api',
    '{"base_url": "https://api.support.com", "auth_type": "bearer", "endpoints": ["/tickets", "/users"]}',
    'connected',
    'hourly',
    NOW() - INTERVAL '30 minutes'
);

-- Insert more comprehensive knowledge base content
INSERT INTO knowledge_base (company_id, data_source_id, title, content, content_type, metadata, source_reference) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440011',
    'Account Management Guide',
    'Account management includes creating new accounts, updating profile information, managing billing details, and handling account suspension or deletion. Users can access their account settings through the dashboard.',
    'document',
    '{"category": "account_management", "priority": "high", "last_updated": "2024-01-15"}'::jsonb,
    'help_docs/account_management.md'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440011',
    'Billing and Payments',
    'We accept all major credit cards and PayPal. Billing occurs monthly on the anniversary of your signup date. You can view invoices, update payment methods, and manage subscriptions in the billing section.',
    'document',
    '{"category": "billing", "priority": "high", "last_updated": "2024-01-10"}'::jsonb,
    'help_docs/billing.md'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440010',
    'Customer Support Hours',
    'Our customer support team is available Monday through Friday, 9 AM to 6 PM EST. For urgent issues outside business hours, please use our emergency contact form.',
    'table_row',
    '{"category": "support", "priority": "medium", "table": "support_info"}'::jsonb,
    'database/support_info/hours'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440012',
    'API Rate Limits',
    'API rate limits are set at 1000 requests per hour for standard plans and 5000 requests per hour for premium plans. Rate limit headers are included in all API responses.',
    'api_response',
    '{"category": "technical", "priority": "medium", "endpoint": "/api/limits"}'::jsonb,
    'api/rate_limits'
);

-- Insert sample conversations
INSERT INTO conversations (id, company_id, session_id, customer_id, customer_phone, customer_email, channel, status, resolution_status, ai_config_id, total_exchanges, duration_seconds, customer_satisfaction_score, resolution_category, conversation_summary, started_at, ended_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440000',
    'sess_abc123',
    'cust_john_doe',
    '+1234567890',
    'john.doe@email.com',
    'voice',
    'completed',
    'resolved',
    '550e8400-e29b-41d4-a716-446655440001',
    6,
    420,
    4,
    'password_reset',
    'Customer needed help resetting password. Provided step-by-step instructions and confirmed successful reset.',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours' + INTERVAL '420 seconds'
),
(
    '550e8400-e29b-41d4-a716-446655440021',
    '550e8400-e29b-41d4-a716-446655440000',
    'sess_def456',
    'cust_jane_smith',
    '+1987654321',
    'jane.smith@email.com',
    'voice',
    'completed',
    'escalated',
    '550e8400-e29b-41d4-a716-446655440001',
    12,
    780,
    2,
    'billing_dispute',
    'Customer disputed a charge. Issue required human agent intervention for account review.',
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '4 hours' + INTERVAL '780 seconds'
),
(
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440000',
    'sess_ghi789',
    'cust_bob_wilson',
    '+1555123456',
    'bob.wilson@email.com',
    'voice',
    'completed',
    'resolved',
    '550e8400-e29b-41d4-a716-446655440001',
    4,
    180,
    5,
    'general_inquiry',
    'Customer asked about support hours. Provided information quickly and customer was satisfied.',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour' + INTERVAL '180 seconds'
);

-- Insert conversation messages
INSERT INTO conversation_messages (conversation_id, speaker, message_text, confidence_score, response_time_ms, knowledge_sources, created_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440020',
    'customer',
    'Hi, I forgot my password and can''t log into my account',
    NULL,
    NULL,
    '[]'::jsonb,
    NOW() - INTERVAL '2 hours'
),
(
    '550e8400-e29b-41d4-a716-446655440020',
    'ai',
    'I can help you reset your password. To reset your password, please go to the login page and click "Forgot Password", then enter your email address.',
    0.92,
    1200,
    '[{"source_type": "document", "source_id": "password_reset_guide", "relevance_score": 0.95}]'::jsonb,
    NOW() - INTERVAL '2 hours' + INTERVAL '5 seconds'
),
(
    '550e8400-e29b-41d4-a716-446655440020',
    'customer',
    'I tried that but I''m not receiving the email',
    NULL,
    NULL,
    '[]'::jsonb,
    NOW() - INTERVAL '2 hours' + INTERVAL '30 seconds'
),
(
    '550e8400-e29b-41d4-a716-446655440020',
    'ai',
    'Please check your spam folder first. If you still don''t see the email, make sure you''re using the correct email address associated with your account.',
    0.88,
    1100,
    '[{"source_type": "document", "source_id": "email_troubleshooting", "relevance_score": 0.87}]'::jsonb,
    NOW() - INTERVAL '2 hours' + INTERVAL '35 seconds'
);

-- Insert customer feedback
INSERT INTO customer_feedback (company_id, conversation_id, customer_id, rating, feedback_text, feedback_categories, would_recommend, improvement_suggestions, feedback_method) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440020',
    'cust_john_doe',
    4,
    'The AI was helpful and resolved my issue quickly. The instructions were clear.',
    ARRAY['helpful', 'clear_instructions'],
    true,
    'Maybe provide alternative solutions if the first one doesn''t work',
    'post_call_survey'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440021',
    'cust_jane_smith',
    2,
    'The AI couldn''t help with my billing issue and I had to wait for a human agent.',
    ARRAY['escalation_needed', 'long_wait'],
    false,
    'Better training on billing issues',
    'post_call_survey'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440022',
    'cust_bob_wilson',
    5,
    'Perfect! Got the information I needed immediately.',
    ARRAY['quick_resolution', 'accurate'],
    true,
    NULL,
    'post_call_survey'
);

-- Insert analytics events
INSERT INTO analytics_events (company_id, event_type, event_data, created_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'conversation_started',
    '{"session_id": "sess_abc123", "channel": "voice", "customer_id": "cust_john_doe"}'::jsonb,
    NOW() - INTERVAL '2 hours'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'ai_response_generated',
    '{"session_id": "sess_abc123", "response_time_ms": 1200, "confidence_score": 0.92}'::jsonb,
    NOW() - INTERVAL '2 hours' + INTERVAL '5 seconds'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'conversation_completed',
    '{"session_id": "sess_abc123", "resolution_status": "resolved", "duration_seconds": 420}'::jsonb,
    NOW() - INTERVAL '2 hours' + INTERVAL '420 seconds'
);

-- Insert system alerts
INSERT INTO system_alerts (company_id, alert_type, severity, title, message, status, metadata) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'performance',
    'medium',
    'Response Time Increase',
    'Average AI response time has increased by 15% over the last hour. Monitor for continued degradation.',
    'active',
    '{"avg_response_time_ms": 1380, "threshold_ms": 1200, "affected_conversations": 12}'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'usage',
    'low',
    'Monthly Usage Update',
    'You have used 75% of your monthly conversation quota. Consider upgrading if you expect high volume.',
    'acknowledged',
    '{"current_usage": 750, "monthly_limit": 1000, "days_remaining": 8}'::jsonb
);

-- Insert additional test scenarios
INSERT INTO test_scenarios (company_id, name, description, test_queries, category, created_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Technical Support Scenarios',
    'Test scenarios for technical support inquiries',
    '[
        {"query": "My API calls are being rate limited", "expected_category": "technical"},
        {"query": "How do I integrate with your webhook system?", "expected_category": "technical"},
        {"query": "The dashboard is loading slowly", "expected_category": "technical"}
    ]'::jsonb,
    'technical_support',
    NOW() - INTERVAL '1 day'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'General Inquiries',
    'Test scenarios for general customer inquiries',
    '[
        {"query": "What are your business hours?", "expected_category": "general"},
        {"query": "How do I contact support?", "expected_category": "general"},
        {"query": "Do you offer phone support?", "expected_category": "general"}
    ]'::jsonb,
    'general_inquiry',
    NOW() - INTERVAL '2 days'
);

-- Insert test results
INSERT INTO test_results (company_id, scenario_id, ai_config_id, test_type, results, overall_score, passed_tests, total_tests, execution_time_ms, created_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    (SELECT id FROM test_scenarios WHERE name = 'Password Reset Scenarios' LIMIT 1),
    '550e8400-e29b-41d4-a716-446655440001',
    'batch',
    '{
        "test_results": [
            {"query": "How do I reset my password?", "confidence": 0.95, "category": "account_management", "passed": true},
            {"query": "I forgot my login credentials", "confidence": 0.88, "category": "account_management", "passed": true},
            {"query": "My password is not working", "confidence": 0.82, "category": "account_management", "passed": true}
        ],
        "summary": "All password reset scenarios passed with high confidence scores"
    }'::jsonb,
    0.88,
    3,
    3,
    2450,
    NOW() - INTERVAL '3 hours'
);
