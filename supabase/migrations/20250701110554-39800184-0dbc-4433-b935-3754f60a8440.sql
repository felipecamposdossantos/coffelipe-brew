
-- Verificar e adicionar campos necessários na tabela brew_history
ALTER TABLE brew_history ADD COLUMN IF NOT EXISTS coffee_bean_id uuid;
ALTER TABLE brew_history ADD COLUMN IF NOT EXISTS grinder_brand text;
ALTER TABLE brew_history ADD COLUMN IF NOT EXISTS grinder_clicks integer;
ALTER TABLE brew_history ADD COLUMN IF NOT EXISTS paper_brand text;
ALTER TABLE brew_history ADD COLUMN IF NOT EXISTS water_temperature integer;
ALTER TABLE brew_history ADD COLUMN IF NOT EXISTS coffee_ratio integer;
ALTER TABLE brew_history ADD COLUMN IF NOT EXISTS water_ratio integer;

-- Adicionar políticas RLS se não existirem
ALTER TABLE brew_history ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seu próprio histórico
DROP POLICY IF EXISTS "Users can view their own brew history" ON brew_history;
CREATE POLICY "Users can view their own brew history" 
  ON brew_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários insiram seu próprio histórico
DROP POLICY IF EXISTS "Users can insert their own brew history" ON brew_history;
CREATE POLICY "Users can insert their own brew history" 
  ON brew_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem seu próprio histórico
DROP POLICY IF EXISTS "Users can update their own brew history" ON brew_history;
CREATE POLICY "Users can update their own brew history" 
  ON brew_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários deletem seu próprio histórico
DROP POLICY IF EXISTS "Users can delete their own brew history" ON brew_history;
CREATE POLICY "Users can delete their own brew history" 
  ON brew_history 
  FOR DELETE 
  USING (auth.uid() = user_id);
