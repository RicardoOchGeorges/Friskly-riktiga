-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    meal_date DATE NOT NULL,
    meal_time TIME NOT NULL,
    total_calories INTEGER NOT NULL DEFAULT 0,
    total_protein INTEGER NOT NULL DEFAULT 0,
    total_carbs INTEGER NOT NULL DEFAULT 0,
    total_fat INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create meal_items table
CREATE TABLE IF NOT EXISTS public.meal_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    calories INTEGER NOT NULL DEFAULT 0,
    protein INTEGER NOT NULL DEFAULT 0,
    carbs INTEGER NOT NULL DEFAULT 0,
    fat INTEGER NOT NULL DEFAULT 0,
    serving_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security (RLS) policies
-- Enable RLS on meals table
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Create policy for meals table - users can only see their own meals
CREATE POLICY "Users can only view their own meals" 
ON public.meals FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for meals table - users can only insert their own meals
CREATE POLICY "Users can only insert their own meals" 
ON public.meals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for meals table - users can only update their own meals
CREATE POLICY "Users can only update their own meals" 
ON public.meals FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for meals table - users can only delete their own meals
CREATE POLICY "Users can only delete their own meals" 
ON public.meals FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on meal_items table
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;

-- Create policy for meal_items table - users can only see items from their own meals
CREATE POLICY "Users can only view their own meal items" 
ON public.meal_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.meals 
        WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()
    )
);

-- Create policy for meal_items table - users can only insert items to their own meals
CREATE POLICY "Users can only insert items to their own meals" 
ON public.meal_items FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.meals 
        WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()
    )
);

-- Create policy for meal_items table - users can only update items from their own meals
CREATE POLICY "Users can only update their own meal items" 
ON public.meal_items FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.meals 
        WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()
    )
);

-- Create policy for meal_items table - users can only delete items from their own meals
CREATE POLICY "Users can only delete their own meal items" 
ON public.meal_items FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.meals 
        WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()
    )
);

-- Create storage bucket for meal images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('meal-images', 'meal-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for meal images
CREATE POLICY "Anyone can view meal images"
ON storage.objects FOR SELECT
USING (bucket_id = 'meal-images');

CREATE POLICY "Authenticated users can upload meal images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'meal-images' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own meal images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'meal-images' AND
    auth.uid() = owner
);

CREATE POLICY "Users can delete their own meal images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'meal-images' AND
    auth.uid() = owner
);
