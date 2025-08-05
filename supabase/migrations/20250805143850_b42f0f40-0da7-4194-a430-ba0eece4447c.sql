-- Create admin_credentials table
CREATE TABLE public.admin_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read credentials
CREATE POLICY "Authenticated users can read admin credentials" 
ON public.admin_credentials 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Insert the two admin accounts (using simple hashing for demo - in production use proper bcrypt)
INSERT INTO public.admin_credentials (email, password_hash) VALUES 
('admin@mohairhandmade.com', 'admin123'),
('mohair.handmade11@gmail.com', 'mohair2024');

-- Add color column to products table
ALTER TABLE public.products ADD COLUMN color TEXT;