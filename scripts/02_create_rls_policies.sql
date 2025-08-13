-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view their own company" ON public.companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own company" ON public.companies
    FOR UPDATE USING (
        id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow service role to insert companies (for signup)
CREATE POLICY "Service role can insert companies" ON public.companies
    FOR INSERT WITH CHECK (true);

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (id = auth.uid());

-- Allow service role to insert user profiles (for signup)
CREATE POLICY "Service role can insert user profiles" ON public.user_profiles
    FOR INSERT WITH CHECK (true);

-- Subscription usage policies
CREATE POLICY "Users can view their company usage" ON public.subscription_usage
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM public.user_profiles 
            WHERE id = auth.uid()
        )
    );

-- Allow service role to manage subscription usage
CREATE POLICY "Service role can manage subscription usage" ON public.subscription_usage
    FOR ALL WITH CHECK (true);
