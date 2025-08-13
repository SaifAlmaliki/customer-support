-- Insert sample company
INSERT INTO companies (id, name, domain, plan, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Demo Company', 'demo.com', 'professional', 'active');

-- Insert sample AI configuration
INSERT INTO ai_configurations (
    id, 
    company_id, 
    name, 
    model_provider, 
    model_name, 
    system_prompt,
    voice_id,
    response_style
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Default Customer Support AI',
    'openai',
    'gpt-4',
    'You are a helpful customer support assistant. Be professional, empathetic, and provide accurate information based on the company knowledge base.',
    'elevenlabs_voice_123',
    'professional'
);

-- Insert sample test scenarios
INSERT INTO test_scenarios (
    company_id,
    name,
    description,
    test_queries,
    category
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Password Reset Scenarios',
    'Test scenarios for password reset inquiries',
    '[
        {"query": "How do I reset my password?", "expected_category": "account_management"},
        {"query": "I forgot my login credentials", "expected_category": "account_management"},
        {"query": "My password is not working", "expected_category": "account_management"}
    ]'::jsonb,
    'account_management'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Billing Inquiries',
    'Test scenarios for billing and payment questions',
    '[
        {"query": "What is my current plan?", "expected_category": "billing"},
        {"query": "How do I upgrade my subscription?", "expected_category": "billing"},
        {"query": "I was charged incorrectly", "expected_category": "billing"}
    ]'::jsonb,
    'billing'
);

-- Insert sample knowledge base content
INSERT INTO knowledge_base (
    company_id,
    title,
    content,
    content_type,
    metadata,
    source_reference
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Password Reset Instructions',
    'To reset your password: 1. Go to the login page 2. Click "Forgot Password" 3. Enter your email address 4. Check your email for reset instructions 5. Follow the link in the email to create a new password',
    'document',
    '{"category": "account_management", "priority": "high"}'::jsonb,
    'help_docs/password_reset.md'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Subscription Plans',
    'We offer three subscription plans: Starter ($29/month) - Basic features, Professional ($99/month) - Advanced features, Enterprise ($299/month) - Full features with priority support',
    'document',
    '{"category": "billing", "priority": "high"}'::jsonb,
    'help_docs/pricing.md'
);
