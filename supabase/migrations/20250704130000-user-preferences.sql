
-- Tabela para preferências do usuário
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  coffee_intensity INTEGER DEFAULT 3 CHECK (coffee_intensity >= 1 AND coffee_intensity <= 5),
  acidity_preference INTEGER DEFAULT 3 CHECK (acidity_preference >= 1 AND acidity_preference <= 5),
  bitterness_preference INTEGER DEFAULT 3 CHECK (bitterness_preference >= 1 AND bitterness_preference <= 5),
  preferred_method TEXT DEFAULT 'V60',
  daily_coffee_goal INTEGER DEFAULT 2,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
  ON public.user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);
