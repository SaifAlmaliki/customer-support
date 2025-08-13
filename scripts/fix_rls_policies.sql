-- Fix infinite recursion in user_profiles RLS policies
-- Drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create new policies that avoid circular references
-- Allow users to insert their own profile during signup
CREATE POLICY "Enable insert for authenticated users during signup" ON user_profiles
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Enable read access for own profile" ON user_profiles
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Enable update for own profile" ON user_profiles
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Also fix companies table policies to avoid issues
DROP POLICY IF EXISTS "Companies are viewable by company members" ON companies;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON companies;

-- Create simpler company policies
CREATE POLICY "Enable insert for authenticated users" ON companies
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Enable read for company members" ON companies
    FOR SELECT 
    TO authenticated 
    USING (
        id IN (
            SELECT company_id 
            FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Enable update for company members" ON companies
    FOR UPDATE 
    TO authenticated 
    USING (
        id IN (
            SELECT company_id 
            FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

-- Ensure RLS is enabled for companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
