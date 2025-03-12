-- Add ingame_name and line_id fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS ingame_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS line_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_ingame_name ON users(ingame_name);
CREATE INDEX IF NOT EXISTS idx_users_line_id ON users(line_id);

-- Update existing users with default values
UPDATE users SET ingame_name = username WHERE ingame_name IS NULL;
