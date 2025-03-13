-- Create invitation_codes table
CREATE TABLE IF NOT EXISTS invitation_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE
);

-- Add is_admin field to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create admin user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@mcocplanner.com',
  crypt('Muiesteaua', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin"}',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Create admin profile
INSERT INTO public.users (id, username, role, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin',
  'admin',
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Create default alliance for admin
INSERT INTO public.alliances (id, name, tag, description)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Admin Alliance',
  'ADMIN',
  'System admin alliance'
)
ON CONFLICT (id) DO NOTHING;

-- Link admin to alliance
UPDATE public.users
SET alliance_id = '00000000-0000-0000-0000-000000000000'
WHERE id = '00000000-0000-0000-0000-000000000000';

-- Create default battlegroups for admin alliance
INSERT INTO public.battlegroups (alliance_id, name)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Battlegroup 1'),
  ('00000000-0000-0000-0000-000000000000', 'Battlegroup 2'),
  ('00000000-0000-0000-0000-000000000000', 'Battlegroup 3')
ON CONFLICT DO NOTHING;

-- Create some initial invitation codes
INSERT INTO invitation_codes (code, description, created_by, is_active)
VALUES 
  ('WELCOME2024', 'Initial welcome code', '00000000-0000-0000-0000-000000000000', TRUE),
  ('MCOC2024', 'General invitation code', '00000000-0000-0000-0000-000000000000', TRUE)
ON CONFLICT DO NOTHING;

-- Enable RLS on invitation_codes
ALTER TABLE invitation_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for invitation_codes
CREATE POLICY "Admins can do everything with invitation codes"
  ON invitation_codes
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = TRUE));

CREATE POLICY "Users can view their own used codes"
  ON invitation_codes
  FOR SELECT
  USING (used_by = auth.uid());
