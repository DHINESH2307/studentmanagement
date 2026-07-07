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
ON CONFLICT (id) DO NOTHING;

-- 6. Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 7. Storage Policies
CREATE POLICY "Public Access to Student Images" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'student-images');

CREATE POLICY "Authenticated users can upload student images" 
    ON storage.objects FOR INSERT 
    WITH CHECK (
        bucket_id = 'student-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own uploaded images" 
    ON storage.objects FOR UPDATE 
    USING (
        bucket_id = 'student-images' 
        AND auth.uid() = owner
    );

CREATE POLICY "Users can delete their own uploaded images" 
    ON storage.objects FOR DELETE 
    USING (
        bucket_id = 'student-images' 
        AND auth.uid() = owner
    );
