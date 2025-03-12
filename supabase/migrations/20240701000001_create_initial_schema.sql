-- Create users table to store user profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('officer', 'member')),
  alliance_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create alliances table
CREATE TABLE IF NOT EXISTS alliances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create battlegroups table
CREATE TABLE IF NOT EXISTS battlegroups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alliance_id UUID REFERENCES alliances(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create champions table
CREATE TABLE IF NOT EXISTS champions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  class TEXT NOT NULL CHECK (class IN ('cosmic', 'mutant', 'mystic', 'science', 'skill', 'tech')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_champions table to track which champions each user has
CREATE TABLE IF NOT EXISTS user_champions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  champion_id UUID REFERENCES champions(id) ON DELETE CASCADE NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('6-Star', '7-Star')),
  rank TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, champion_id, rarity, rank)
);

-- Create battlegroup_members table
CREATE TABLE IF NOT EXISTS battlegroup_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  battlegroup_id UUID REFERENCES battlegroups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(battlegroup_id, user_id)
);

-- Create war_seasons table
CREATE TABLE IF NOT EXISTS war_seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wars table
CREATE TABLE IF NOT EXISTS wars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alliance_id UUID REFERENCES alliances(id) ON DELETE CASCADE NOT NULL,
  opponent_name TEXT NOT NULL,
  season_id UUID REFERENCES war_seasons(id) ON DELETE CASCADE NOT NULL,
  war_date TIMESTAMPTZ NOT NULL,
  result TEXT CHECK (result IN ('win', 'loss', 'draw', 'upcoming')),
  alliance_score INTEGER,
  opponent_score INTEGER,
  tier INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create defense_nodes table
CREATE TABLE IF NOT EXISTS defense_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  war_id UUID REFERENCES wars(id) ON DELETE CASCADE NOT NULL,
  battlegroup_id UUID REFERENCES battlegroups(id) ON DELETE CASCADE NOT NULL,
  node_number INTEGER NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('left', 'center', 'right')),
  path_type TEXT NOT NULL CHECK (path_type IN ('A', 'B', 'C', 'boss', 'bottleneck')),
  path_number INTEGER NOT NULL,
  assigned_champion_id UUID REFERENCES user_champions(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(war_id, battlegroup_id, node_number)
);

-- Create attack_assignments table
CREATE TABLE IF NOT EXISTS attack_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  war_id UUID REFERENCES wars(id) ON DELETE CASCADE NOT NULL,
  battlegroup_id UUID REFERENCES battlegroups(id) ON DELETE CASCADE NOT NULL,
  node_number INTEGER NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  champion_id UUID REFERENCES user_champions(id) ON DELETE SET NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(war_id, battlegroup_id, node_number, user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE alliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE battlegroups ENABLE ROW LEVEL SECURITY;
ALTER TABLE champions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_champions ENABLE ROW LEVEL SECURITY;
ALTER TABLE battlegroup_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wars ENABLE ROW LEVEL SECURITY;
ALTER TABLE defense_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attack_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read all users
DROP POLICY IF EXISTS "Users can read all users" ON users;
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can read all alliances
DROP POLICY IF EXISTS "Users can read all alliances" ON alliances;
CREATE POLICY "Users can read all alliances" ON alliances FOR SELECT USING (true);

-- Officers can create/update alliances
DROP POLICY IF EXISTS "Officers can manage alliances" ON alliances;
CREATE POLICY "Officers can manage alliances" ON alliances FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'officer')
);

-- Users can read all champions
DROP POLICY IF EXISTS "Users can read all champions" ON champions;
CREATE POLICY "Users can read all champions" ON champions FOR SELECT USING (true);

-- Users can manage their own champions
DROP POLICY IF EXISTS "Users can manage their own champions" ON user_champions;
CREATE POLICY "Users can manage their own champions" ON user_champions FOR ALL USING (auth.uid() = user_id);

-- Users can read all user champions
DROP POLICY IF EXISTS "Users can read all user champions" ON user_champions;
CREATE POLICY "Users can read all user champions" ON user_champions FOR SELECT USING (true);

-- Enable realtime for all tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table alliances;
alter publication supabase_realtime add table battlegroups;
alter publication supabase_realtime add table champions;
alter publication supabase_realtime add table user_champions;
alter publication supabase_realtime add table battlegroup_members;
alter publication supabase_realtime add table war_seasons;
alter publication supabase_realtime add table wars;
alter publication supabase_realtime add table defense_nodes;
alter publication supabase_realtime add table attack_assignments;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, avatar_url, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'avatar_url', 'member');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
