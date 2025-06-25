
-- Criar tabela para receitas personalizadas dos usuários
CREATE TABLE public.user_recipes (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  coffee_ratio INTEGER NOT NULL,
  water_ratio INTEGER NOT NULL,
  water_temperature INTEGER DEFAULT 94,
  paper_brand TEXT,
  grinder_brand TEXT,
  grinder_clicks INTEGER,
  steps JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para histórico de extrações
CREATE TABLE public.brew_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  recipe_id TEXT NOT NULL,
  recipe_name TEXT NOT NULL,
  brewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar Row Level Security (RLS)
ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brew_history ENABLE ROW LEVEL SECURITY;

-- Políticas para user_recipes
CREATE POLICY "Users can view their own recipes" 
  ON public.user_recipes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recipes" 
  ON public.user_recipes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" 
  ON public.user_recipes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" 
  ON public.user_recipes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas para brew_history
CREATE POLICY "Users can view their own brew history" 
  ON public.brew_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brew history" 
  ON public.brew_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brew history" 
  ON public.brew_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brew history" 
  ON public.brew_history 
  FOR DELETE 
  USING (auth.uid() = user_id);
