-- Enable RLS (Row Level Security) by default
ALTER DATABASE postgres SET row_security = on;

-- Create custom types
CREATE TYPE item_category AS ENUM ('Dairy', 'Fruits', 'Vegetables', 'Meat', 'Pantry', 'Frozen');
CREATE TYPE item_location AS ENUM ('Fridge', 'Pantry', 'Freezer', 'Counter');
CREATE TYPE recipe_difficulty AS ENUM ('Easy', 'Medium', 'Hard');

-- =============================================
-- USER PROFILES TABLE
-- =============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- STORES TABLE
-- =============================================
CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Stores policies
CREATE POLICY "Users can manage own stores" ON stores
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- GROCERY ITEMS TABLE
-- =============================================
CREATE TABLE grocery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity TEXT DEFAULT '1',
  checked BOOLEAN DEFAULT FALSE,
  added_by TEXT,
  meta TEXT, -- For "Running low", etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE grocery_items ENABLE ROW LEVEL SECURITY;

-- Grocery items policies
CREATE POLICY "Users can manage own grocery items" ON grocery_items
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- INVENTORY ITEMS TABLE (FIXED)
-- =============================================
CREATE TABLE inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category item_category NOT NULL,
  location item_location DEFAULT 'Pantry',
  emoji TEXT,
  quantity DECIMAL NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'count',
  expires_at TIMESTAMP WITH TIME ZONE,
  days_left INTEGER DEFAULT 365,
  percentage INTEGER DEFAULT 100 CHECK (percentage >= 0 AND percentage <= 100),
  details TEXT[], -- Array for details like ['Fresh', '2 lbs', '5 days left']
  expiring BOOLEAN DEFAULT FALSE,
  running_low BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Inventory items policies
CREATE POLICY "Users can manage own inventory items" ON inventory_items
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- RECIPES TABLE
-- =============================================
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  cuisine_tags TEXT[] DEFAULT '{}', -- e.g., ['italian', 'quick']
  time_minutes INTEGER NOT NULL DEFAULT 30,
  difficulty recipe_difficulty DEFAULT 'Easy',
  servings INTEGER DEFAULT 4,
  ingredients TEXT[] NOT NULL, -- Array of ingredient names
  instructions TEXT,
  image_url TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  section TEXT DEFAULT 'all', -- 'expiring', 'quick', 'favorites', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Recipes policies
CREATE POLICY "Users can manage own recipes" ON recipes
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- USER PREFERENCES TABLE
-- =============================================
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  dark_mode BOOLEAN DEFAULT FALSE,
  shopping_mode BOOLEAN DEFAULT FALSE,
  default_store_id UUID REFERENCES stores(id),
  expiration_alert_days INTEGER DEFAULT 2,
  low_stock_threshold INTEGER DEFAULT 25,
  enable_notifications BOOLEAN DEFAULT TRUE,
  enable_recipe_suggestions BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');

  -- Create default stores for new user
  INSERT INTO public.stores (user_id, name, emoji, sort_order) VALUES
    (NEW.id, 'Farmers Market', '🥬', 1),
    (NEW.id, 'Costco', '🏪', 2),
    (NEW.id, 'Whole Foods', '🌿', 3),
    (NEW.id, 'Trader Joe''s', '🛒', 4),
    (NEW.id, 'Target', '🎯', 5);

  -- Create default user preferences
  INSERT INTO public.user_preferences (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_grocery_items_updated_at BEFORE UPDATE ON grocery_items
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =============================================
-- FUNCTIONS FOR CALCULATED FIELDS
-- =============================================

-- Function to update inventory expiration status
CREATE OR REPLACE FUNCTION update_inventory_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate days_left
  IF NEW.expires_at IS NULL THEN
    NEW.days_left := 365;
    NEW.expiring := FALSE;
  ELSE
    NEW.days_left := GREATEST(0, EXTRACT(DAY FROM NEW.expires_at - NOW()));
    NEW.expiring := (NEW.expires_at <= NOW() + INTERVAL '3 days');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update expiration fields
CREATE TRIGGER update_inventory_expiration_trigger
  BEFORE INSERT OR UPDATE ON inventory_items
  FOR EACH ROW EXECUTE PROCEDURE update_inventory_expiration();

-- =============================================
-- HELPFUL VIEWS
-- =============================================

-- View for recipes with availability status
CREATE VIEW recipes_with_availability AS
SELECT
  r.*,
  COALESCE(
    ARRAY_AGG(
      CASE WHEN ii.name IS NULL THEN ingredient END
    ) FILTER (WHERE ii.name IS NULL),
    '{}'::text[]
  ) AS missing_ingredients,
  CASE
    WHEN COUNT(ingredient) = COUNT(ii.name) THEN true
    ELSE false
  END as ready
FROM recipes r
CROSS JOIN UNNEST(r.ingredients) AS ingredient
LEFT JOIN inventory_items ii ON
  ii.user_id = r.user_id AND
  LOWER(ii.name) LIKE LOWER('%' || ingredient || '%') AND
  ii.percentage > 0
GROUP BY r.id, r.user_id, r.title, r.cuisine_tags, r.time_minutes,
         r.difficulty, r.servings, r.ingredients, r.instructions,
         r.image_url, r.is_favorite, r.section, r.created_at, r.updated_at;