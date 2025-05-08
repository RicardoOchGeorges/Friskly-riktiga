import { supabase } from './supabase';

// Types for meal data
export interface MealItem {
  id: string;
  meal_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size?: string;
  created_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  meal_date: string;
  meal_time: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  image_url?: string;
  created_at: string;
  items?: MealItem[];
}

// Function to get all meals for the current user
export async function getUserMeals(userId: string): Promise<Meal[]> {
  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching meals:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserMeals:', error);
    return [];
  }
}

// Function to get a single meal with its items
export async function getMealWithItems(mealId: string): Promise<Meal | null> {
  try {
    // Get the meal
    const { data: mealData, error: mealError } = await supabase
      .from('meals')
      .select('*')
      .eq('id', mealId)
      .single();
    
    if (mealError || !mealData) {
      console.error('Error fetching meal:', mealError);
      return null;
    }
    
    // Get the meal items
    const { data: itemsData, error: itemsError } = await supabase
      .from('meal_items')
      .select('*')
      .eq('meal_id', mealId);
    
    if (itemsError) {
      console.error('Error fetching meal items:', itemsError);
      return mealData;
    }
    
    // Combine meal with its items
    return {
      ...mealData,
      items: itemsData || []
    };
  } catch (error) {
    console.error('Error in getMealWithItems:', error);
    return null;
  }
}

// Function to get meals grouped by date
export async function getMealsByDate(userId: string): Promise<{ [date: string]: Meal[] }> {
  try {
    const meals = await getUserMeals(userId);
    
    // Group meals by date
    const mealsByDate = meals.reduce((acc, meal) => {
      const date = meal.meal_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(meal);
      return acc;
    }, {} as { [date: string]: Meal[] });
    
    return mealsByDate;
  } catch (error) {
    console.error('Error in getMealsByDate:', error);
    return {};
  }
}

// Function to delete a meal
export async function deleteMeal(mealId: string): Promise<boolean> {
  try {
    // First delete all meal items
    const { error: itemsError } = await supabase
      .from('meal_items')
      .delete()
      .eq('meal_id', mealId);
    
    if (itemsError) {
      console.error('Error deleting meal items:', itemsError);
      return false;
    }
    
    // Then delete the meal
    const { error: mealError } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId);
    
    if (mealError) {
      console.error('Error deleting meal:', mealError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMeal:', error);
    return false;
  }
}
