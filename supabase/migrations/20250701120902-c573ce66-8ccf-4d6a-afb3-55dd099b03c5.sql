
-- Create a table for filter papers
CREATE TABLE public.filter_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own filter papers
ALTER TABLE public.filter_papers ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own filter papers
CREATE POLICY "Users can view their own filter papers" 
  ON public.filter_papers 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own filter papers
CREATE POLICY "Users can create their own filter papers" 
  ON public.filter_papers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own filter papers
CREATE POLICY "Users can update their own filter papers" 
  ON public.filter_papers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own filter papers
CREATE POLICY "Users can delete their own filter papers" 
  ON public.filter_papers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add a foreign key to user_recipes table to reference filter papers
ALTER TABLE public.user_recipes 
ADD COLUMN filter_paper_id UUID REFERENCES public.filter_papers(id);
