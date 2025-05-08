import { ImageInfo } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// This is the endpoint for the Google Cloud Vision API
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

// You'll need to replace this with your actual API key
// IMPORTANT: In a production app, you should never store API keys directly in code
// Consider using environment variables or a secure backend service
const API_KEY = 'AIzaSyAl5WVuxgbU_P1h1JxSQYlkytzC89Zd1n8';

// Food database for nutrition information (this is a simplified mock)
// In a real app, you would use a more comprehensive database or API
const FOOD_DATABASE: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  'apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  'broccoli': { calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  'salmon': { calories: 206, protein: 22, carbs: 0, fat: 13 },
  'egg': { calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  'bread': { calories: 79, protein: 3, carbs: 15, fat: 1 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  'steak': { calories: 271, protein: 26, carbs: 0, fat: 19 },
  'potato': { calories: 161, protein: 4.3, carbs: 37, fat: 0.2 },
  'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  'avocado': { calories: 240, protein: 3, carbs: 12, fat: 22 },
  'cheese': { calories: 113, protein: 7, carbs: 0.4, fat: 9 },
  'yogurt': { calories: 59, protein: 3.5, carbs: 5, fat: 3.3 },
};

// Function to convert image to base64
export const imageToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

// Interface for the food item detected
export interface DetectedFoodItem {
  id: number;
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  confidence: number;
}

// Main function to analyze food image with Google Cloud Vision API
export const analyzeFoodImage = async (imageUri: string): Promise<DetectedFoodItem[]> => {
  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);
    
    // Prepare request body for Vision API
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10,
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 10,
            },
          ],
        },
      ],
    };
    
    // Make request to Vision API
    const response = await fetch(`${VISION_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vision API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    // Process the response to extract food items
    return processFoodDetectionResponse(data);
    
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw error;
  }
};

// Process the Vision API response to extract food items with nutrition info
const processFoodDetectionResponse = (apiResponse: any): DetectedFoodItem[] => {
  // Extract labels from the response
  const labels = apiResponse.responses[0]?.labelAnnotations || [];
  const objects = apiResponse.responses[0]?.localizedObjectAnnotations || [];
  
  // Combine and filter food-related labels and objects
  const foodItems = new Set<string>();
  const confidenceMap = new Map<string, number>();
  
  // Process labels
  labels.forEach((label: any) => {
    const description = label.description.toLowerCase();
    // Only include food-related items
    if (isFoodItem(description)) {
      foodItems.add(description);
      confidenceMap.set(description, label.score);
    }
  });
  
  // Process objects
  objects.forEach((object: any) => {
    const name = object.name.toLowerCase();
    if (isFoodItem(name)) {
      foodItems.add(name);
      confidenceMap.set(name, object.score);
    }
  });
  
  // Convert to array of food items with nutrition info
  const result: DetectedFoodItem[] = [];
  let id = 1;
  
  foodItems.forEach((foodName) => {
    // Look up nutrition info or use default values
    const nutritionInfo = getNutritionInfo(foodName);
    const confidence = confidenceMap.get(foodName) || 0;
    
    result.push({
      id: id++,
      name: capitalizeFirstLetter(foodName),
      calories: nutritionInfo.calories.toString(),
      protein: nutritionInfo.protein.toString(),
      carbs: nutritionInfo.carbs.toString(),
      fat: nutritionInfo.fat.toString(),
      confidence,
    });
  });
  
  // Sort by confidence (highest first)
  return result.sort((a, b) => b.confidence - a.confidence);
};

// Helper function to check if an item is food-related
const isFoodItem = (name: string): boolean => {
  // Simple check - in a real app, you would use a more comprehensive approach
  // For example, checking against a food database or using a food-specific ML model
  const foodKeywords = [
    'food', 'meal', 'dish', 'breakfast', 'lunch', 'dinner', 'snack',
    'fruit', 'vegetable', 'meat', 'protein', 'grain', 'dairy',
  ];
  
  // Check if the item is in our food database
  if (FOOD_DATABASE[name]) {
    return true;
  }
  
  // Check for food keywords
  for (const keyword of foodKeywords) {
    if (name.includes(keyword)) {
      return true;
    }
  }
  
  // Additional common food items
  const commonFoods = [
    'apple', 'banana', 'orange', 'chicken', 'beef', 'pork', 'fish',
    'rice', 'pasta', 'bread', 'cheese', 'egg', 'milk', 'yogurt',
    'salad', 'soup', 'sandwich', 'pizza', 'burger', 'taco', 'sushi',
    'chocolate', 'cake', 'cookie', 'ice cream', 'coffee', 'tea',
  ];
  
  return commonFoods.some(food => name.includes(food));
};

// Get nutrition information for a food item
const getNutritionInfo = (foodName: string) => {
  // Try to find an exact match
  if (FOOD_DATABASE[foodName]) {
    return FOOD_DATABASE[foodName];
  }
  
  // Try to find a partial match
  for (const [key, value] of Object.entries(FOOD_DATABASE)) {
    if (foodName.includes(key) || key.includes(foodName)) {
      return value;
    }
  }
  
  // Return default values if no match found
  return { calories: 100, protein: 5, carbs: 15, fat: 3 };
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
