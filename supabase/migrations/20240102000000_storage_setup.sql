-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for portfolio-images bucket
-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');

-- Allow authenticated uploads (for admin)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- Create folders structure (optional, folders are virtual in Supabase)
-- Folders: projects, testimonials, certifications, misc
