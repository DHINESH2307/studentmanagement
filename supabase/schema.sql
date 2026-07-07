-- ====================================================================
-- STUDENT MANAGEMENT SYSTEM - SUPABASE DATABASE & STORAGE SCHEMA
-- ====================================================================

-- 1. Create the 'students' table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1 AND year <= 6),
    avatar_url TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_email_per_user UNIQUE (email, user_id)
);

-- 2. Create index for faster search and ordering
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON public.students(name);
CREATE INDEX IF NOT EXISTS idx_students_department ON public.students(department);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students(created_at);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for authenticated users to manage ONLY their own records
CREATE POLICY "Users can view their own students" 
    ON public.students FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own students" 
    ON public.students FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own students" 
    ON public.students FOR UPDATE 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own students" 
    ON public.students FOR DELETE 
    USING (auth.uid() = user_id);

-- ====================================================================
-- STORAGE BUCKET CONFIGURATION ('student-images')
-- ====================================================================

-- 5. Create storage bucket named 'student-images' (public for viewing avatars)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-images', 'student-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies if any to avoid conflicts when re-running
DROP POLICY IF EXISTS "Public Access to Student Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload student images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own uploaded images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own uploaded images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- 8. Storage Policies for 'student-images' bucket
CREATE POLICY "Public Access to Student Images" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'student-images');

CREATE POLICY "Allow authenticated uploads" 
    ON storage.objects FOR INSERT 
    TO authenticated
    WITH CHECK (bucket_id = 'student-images');

CREATE POLICY "Allow authenticated updates" 
    ON storage.objects FOR UPDATE 
    TO authenticated
    USING (bucket_id = 'student-images');

CREATE POLICY "Allow authenticated deletes" 
    ON storage.objects FOR DELETE 
    TO authenticated
    USING (bucket_id = 'student-images');
