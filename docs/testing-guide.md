# Testing Guide for SaaS Customer Support Admin Portal

## Overview
This guide covers how to test the complete integration between the frontend, backend, and Supabase database.

## Prerequisites
- Supabase project configured with all environment variables
- Database schema and seed data loaded
- Next.js application running

## Running Database Tests

### 1. Execute SQL Scripts
Run the SQL scripts in order to set up the database:

\`\`\`bash
# In the v0 interface, these scripts will be executed automatically:
scripts/01_create_tables.sql
scripts/02_create_functions.sql
scripts/03_seed_data.sql
scripts/04_create_rls_policies.sql
scripts/05_comprehensive_seed_data.sql
\`\`\`

### 2. Run Integration Tests
Execute the Node.js test script:

\`\`\`bash
# This will test database connectivity, RLS policies, and functions
node scripts/test-integration.ts
\`\`\`

## Manual Testing Checklist

### Authentication Flow
- [ ] User can sign up with company name and email
- [ ] User receives confirmation email (check Supabase Auth logs)
- [ ] User can sign in with valid credentials
- [ ] User is redirected to admin dashboard after login
- [ ] User can log out successfully
- [ ] Unauthorized users are redirected to login page

### Data Source Management
- [ ] User can view existing data sources
- [ ] User can add new data sources (PostgreSQL, API, Documents)
- [ ] Connection testing works for different source types
- [ ] User can edit data source configurations
- [ ] User can delete data sources
- [ ] Sync status updates correctly

### Knowledge Base
- [ ] Indexed content displays correctly
- [ ] Search functionality works
- [ ] Content can be filtered by source and type
- [ ] Reindexing jobs can be triggered
- [ ] Vector search returns relevant results

### AI Configuration
- [ ] User can view and edit AI settings
- [ ] Voice configuration saves correctly
- [ ] Model parameters update properly
- [ ] Webhook settings are saved
- [ ] Configuration can be activated/deactivated

### Testing Tools
- [ ] Single query testing returns simulated responses
- [ ] Batch testing processes multiple scenarios
- [ ] Test results are saved and displayed
- [ ] Scenario management works correctly

### Monitoring Dashboard
- [ ] Real-time metrics display correctly
- [ ] Charts render with actual data
- [ ] System health indicators work
- [ ] Alerts are displayed and manageable

### Conversation Logs
- [ ] Conversation history loads correctly
- [ ] Message details display properly
- [ ] Filtering and search work
- [ ] Feedback can be viewed and responded to

## Performance Testing

### Database Performance
- Test with larger datasets (1000+ conversations)
- Verify vector search performance with many embeddings
- Check query performance with proper indexes

### API Response Times
- Monitor API endpoint response times
- Test with concurrent requests
- Verify rate limiting works correctly

### Frontend Performance
- Test dashboard loading with large datasets
- Verify real-time updates work smoothly
- Check mobile responsiveness

## Security Testing

### Row Level Security
- Verify users can only access their company's data
- Test cross-company data isolation
- Confirm admin roles work correctly

### API Security
- Test authentication on all endpoints
- Verify proper error handling
- Check input validation and sanitization

## Troubleshooting Common Issues

### Database Connection Issues
- Verify environment variables are set correctly
- Check Supabase project status
- Ensure RLS policies are properly configured

### Authentication Problems
- Check Supabase Auth configuration
- Verify email confirmation settings
- Test with different email providers

### Data Loading Issues
- Confirm all SQL scripts executed successfully
- Check for foreign key constraint violations
- Verify seed data was inserted correctly

### Frontend Errors
- Check browser console for JavaScript errors
- Verify API endpoints are responding correctly
- Test with different browsers and devices

## Success Criteria

The integration is successful when:
- All automated tests pass
- Users can complete the full workflow from signup to dashboard usage
- Data is properly isolated between companies
- Real-time features work correctly
- Performance meets acceptable standards
- Security measures are functioning properly

## Next Steps

After successful testing:
1. Deploy to production environment
2. Set up monitoring and alerting
3. Configure backup and disaster recovery
4. Implement additional security measures
5. Begin user acceptance testing
