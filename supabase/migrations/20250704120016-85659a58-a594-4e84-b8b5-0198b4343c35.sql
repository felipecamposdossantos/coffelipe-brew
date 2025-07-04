
-- Tabela para avaliações de receitas
CREATE TABLE public.recipe_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  recipe_id TEXT NOT NULL,
  recipe_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Tabela para conquistas/badges dos usuários
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  achievement_type TEXT NOT NULL, -- 'first_brew', 'streak_7', 'streak_30', 'explorer', 'perfectionist', etc.
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  achievement_icon TEXT,
  points_earned INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Tabela para controle de sequências de preparos
CREATE TABLE public.brewing_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_brew_date DATE,
  streak_start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela para feed de atividades
CREATE TABLE public.activity_feed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  activity_type TEXT NOT NULL, -- 'brew', 'rating', 'achievement', 'streak', 'recipe_created'
  activity_title TEXT NOT NULL,
  activity_description TEXT,
  activity_data JSONB,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para desafios
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL, -- 'monthly', 'seasonal', 'special'
  requirements JSONB NOT NULL, -- critérios do desafio
  rewards JSONB, -- recompensas
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para participação em desafios
CREATE TABLE public.user_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  challenge_id UUID REFERENCES public.challenges NOT NULL,
  progress JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Habilitar RLS para todas as novas tabelas
ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brewing_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para recipe_ratings
CREATE POLICY "Anyone can view recipe ratings" 
  ON public.recipe_ratings FOR SELECT 
  USING (TRUE);

CREATE POLICY "Users can create their own ratings" 
  ON public.recipe_ratings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
  ON public.recipe_ratings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
  ON public.recipe_ratings FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para user_achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create achievements" 
  ON public.user_achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para brewing_streaks
CREATE POLICY "Users can view their own streaks" 
  ON public.brewing_streaks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage streaks" 
  ON public.brewing_streaks FOR ALL 
  USING (auth.uid() = user_id);

-- Políticas RLS para activity_feed
CREATE POLICY "Users can view public activities and their own" 
  ON public.activity_feed FOR SELECT 
  USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
  ON public.activity_feed FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" 
  ON public.activity_feed FOR UPDATE 
  USING (auth.uid() = user_id);

-- Políticas RLS para challenges
CREATE POLICY "Anyone can view active challenges" 
  ON public.challenges FOR SELECT 
  USING (is_active = TRUE);

-- Políticas RLS para user_challenges
CREATE POLICY "Users can view their own challenge progress" 
  ON public.user_challenges FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges" 
  ON public.user_challenges FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their challenge progress" 
  ON public.user_challenges FOR UPDATE 
  USING (auth.uid() = user_id);

-- Função para atualizar streaks automaticamente
CREATE OR REPLACE FUNCTION update_brewing_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_brew_date DATE;
  current_streak INTEGER;
  longest_streak INTEGER;
BEGIN
  -- Buscar dados atuais do streak
  SELECT 
    COALESCE(bs.last_brew_date, CURRENT_DATE - INTERVAL '2 days'), 
    COALESCE(bs.current_streak, 0),
    COALESCE(bs.longest_streak, 0)
  INTO last_brew_date, current_streak, longest_streak
  FROM public.brewing_streaks bs 
  WHERE bs.user_id = NEW.user_id;

  -- Se é o primeiro preparo do usuário ou não existe registro
  IF last_brew_date IS NULL THEN
    INSERT INTO public.brewing_streaks (user_id, current_streak, longest_streak, last_brew_date, streak_start_date)
    VALUES (NEW.user_id, 1, 1, CURRENT_DATE, CURRENT_DATE);
  ELSE
    -- Se é consecutivo (hoje ou ontem)
    IF CURRENT_DATE - last_brew_date = 1 OR (CURRENT_DATE = last_brew_date) THEN
      current_streak := current_streak + 1;
      longest_streak := GREATEST(longest_streak, current_streak);
      
      UPDATE public.brewing_streaks 
      SET 
        current_streak = current_streak,
        longest_streak = longest_streak,
        last_brew_date = CURRENT_DATE,
        updated_at = now()
      WHERE user_id = NEW.user_id;
    ELSE
      -- Streak quebrado, começar novo
      UPDATE public.brewing_streaks 
      SET 
        current_streak = 1,
        last_brew_date = CURRENT_DATE,
        streak_start_date = CURRENT_DATE,
        updated_at = now()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar streaks
CREATE TRIGGER update_brewing_streak_trigger
  AFTER INSERT ON public.brew_history
  FOR EACH ROW
  EXECUTE FUNCTION update_brewing_streak();

-- Função para criar atividade no feed
CREATE OR REPLACE FUNCTION create_activity_feed()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar atividade para novo preparo
  INSERT INTO public.activity_feed (user_id, activity_type, activity_title, activity_description, activity_data)
  VALUES (
    NEW.user_id,
    'brew',
    'Novo preparo realizado',
    'Preparou ' || NEW.recipe_name,
    jsonb_build_object(
      'recipe_id', NEW.recipe_id,
      'recipe_name', NEW.recipe_name,
      'method', COALESCE(NEW.grinder_brand, 'Método não especificado')
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar atividades
CREATE TRIGGER create_activity_feed_trigger
  AFTER INSERT ON public.brew_history
  FOR EACH ROW
  EXECUTE FUNCTION create_activity_feed();

-- Inserir alguns desafios iniciais
INSERT INTO public.challenges (title, description, challenge_type, requirements, rewards, start_date, end_date) VALUES
('Explorador de Janeiro', 'Prepare 5 métodos diferentes durante o mês', 'monthly', 
 '{"different_methods": 5, "timeframe": "month"}', 
 '{"points": 100, "badge": "explorer"}', 
 '2025-01-01', '2025-01-31'),
('Consistência Semanal', 'Prepare café por 7 dias consecutivos', 'special',
 '{"consecutive_days": 7}',
 '{"points": 50, "badge": "consistent"}',
 '2025-01-01', '2025-12-31'),
('Mestre Barista', 'Avalie 10 receitas diferentes', 'special',
 '{"ratings_count": 10}',
 '{"points": 75, "badge": "critic"}',
 '2025-01-01', '2025-12-31');
