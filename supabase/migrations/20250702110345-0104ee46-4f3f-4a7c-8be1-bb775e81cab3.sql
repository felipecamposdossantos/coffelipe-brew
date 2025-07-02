
-- Add method column to user_recipes table
ALTER TABLE public.user_recipes 
ADD COLUMN method TEXT;

-- Update existing recipes to have a default method
UPDATE public.user_recipes 
SET method = 'V60' 
WHERE method IS NULL;

-- Make method required for new recipes
ALTER TABLE public.user_recipes 
ALTER COLUMN method SET NOT NULL;
