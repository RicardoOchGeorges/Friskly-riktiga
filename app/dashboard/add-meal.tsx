import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { analyzeFoodImage, DetectedFoodItem } from '../../lib/vision-api';
import FoodCoach from '../../lib/food-coach';
import { useRouter } from 'expo-router';

// Define types for meal items
interface MealItem {
  id: number;
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export default function AddMeal() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Add meal state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mealName, setMealName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  // Food coach state
  const [showFoodCoach, setShowFoodCoach] = useState(false);
  const [detectedFoodNames, setDetectedFoodNames] = useState<string[]>([]);
  
  const [mealItems, setMealItems] = useState<MealItem[]>([
    { id: 1, name: '', calories: '', protein: '', carbs: '', fat: '' }
  ]);

  // Launch camera to take a photo
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  // Pick an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };
  
  // Use Google Cloud Vision API to analyze food image
  const analyzeImage = async (imageUri: string) => {
    if (!imageUri) {
      Alert.alert('Error', 'No image to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Call the Vision API to analyze the image
      const detectedItems = await analyzeFoodImage(imageUri);
      
      if (detectedItems.length > 0) {
        // Set a default meal name based on time of day
        const hour = new Date().getHours();
        let mealNameSuggestion = 'Snack';
        
        if (hour >= 5 && hour < 10) {
          mealNameSuggestion = 'Breakfast';
        } else if (hour >= 10 && hour < 14) {
          mealNameSuggestion = 'Lunch';
        } else if (hour >= 17 && hour < 22) {
          mealNameSuggestion = 'Dinner';
        }
        
        setMealName(mealNameSuggestion);
        setMealItems(detectedItems);
        
        // Extract food names for the AI coach
        const foodNames = detectedItems
          .filter(item => item.name && item.name.trim() !== '')
          .map(item => item.name);
        
        setDetectedFoodNames(foodNames);
      } else {
        // No food items detected
        Alert.alert(
          'No Food Detected',
          'We couldn\'t identify any food items in this image. Please try again with a clearer image or add items manually.'
        );
        // Keep one empty item for manual entry
        setMealItems([{ id: 1, name: '', calories: '', protein: '', carbs: '', fat: '' }]);
        setDetectedFoodNames([]);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert(
        'Analysis Failed',
        'There was a problem analyzing your food image. Please try again or add items manually.',
        [{ text: 'OK' }]
      );
      // Keep one empty item for manual entry
      setMealItems([{ id: 1, name: '', calories: '', protein: '', carbs: '', fat: '' }]);
      setDetectedFoodNames([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addMealItem = () => {
    const newId = mealItems.length > 0 ? Math.max(...mealItems.map(item => item.id)) + 1 : 1;
    setMealItems([...mealItems, { id: newId, name: '', calories: '', protein: '', carbs: '', fat: '' }]);
  };

  const updateMealItem = (id: number, field: string, value: string) => {
    setMealItems(mealItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeMealItem = (id: number) => {
    setMealItems(mealItems.filter(item => item.id !== id));
  };

  // Calculate totals
  const totalCalories = mealItems.reduce((sum, item) => sum + (parseInt(item.calories) || 0), 0);
  const totalProtein = mealItems.reduce((sum, item) => sum + (parseInt(item.protein) || 0), 0);
  const totalCarbs = mealItems.reduce((sum, item) => sum + (parseInt(item.carbs) || 0), 0);
  const totalFat = mealItems.reduce((sum, item) => sum + (parseInt(item.fat) || 0), 0);

  const resetAddMealForm = () => {
    setMealName('');
    setImage(null);
    setMealItems([{ id: 1, name: '', calories: '', protein: '', carbs: '', fat: '' }]);
    setIsAnalyzing(false);
    setIsSaving(false);
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save meals');
      return;
    }
    
    if (!mealName) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }
    
    if (mealItems.length === 0 || (mealItems.length === 1 && !mealItems[0].name)) {
      Alert.alert('Error', 'Please add at least one food item');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Get current date and time
      const now = new Date();
      const mealDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const mealTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
      
      // Insert meal record
      const { data: mealData, error: mealError } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          name: mealName,
          meal_date: mealDate,
          meal_time: mealTime,
          total_calories: totalCalories,
          total_protein: totalProtein,
          total_carbs: totalCarbs,
          total_fat: totalFat
        })
        .select();
      
      if (mealError) {
        console.error('Error saving meal:', mealError);
        Alert.alert('Error', 'Failed to save meal. Please try again.');
        setIsSaving(false);
        return;
      }
      
      // Get the meal ID from the inserted record
      const mealId = mealData[0].id;
      
      // Insert meal items
      const mealItemsToInsert = mealItems
        .filter(item => item.name.trim() !== '') // Filter out empty items
        .map(item => ({
          meal_id: mealId,
          name: item.name,
          calories: parseInt(item.calories) || 0,
          protein: parseInt(item.protein) || 0,
          carbs: parseInt(item.carbs) || 0,
          fat: parseInt(item.fat) || 0
        }));
      
      if (mealItemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('meal_items')
          .insert(mealItemsToInsert);
        
        if (itemsError) {
          console.error('Error saving meal items:', itemsError);
          Alert.alert('Warning', 'Meal saved but some items may not have been recorded.');
        }
      }
      
      Alert.alert('Success', 'Meal saved successfully!');
      router.back(); // Navigate back to the meals screen
    } catch (error) {
      console.error('Error in save process:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Meal</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.saveButton}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Meal Name</Text>
          <TextInput
            style={styles.input}
            value={mealName}
            onChangeText={setMealName}
            placeholder="Enter meal name"
          />
        </View>

        <View style={styles.imageSection}>
          <Text style={styles.label}>Add Image</Text>
          <View style={styles.imageButtons}>
            <TouchableOpacity onPress={takePicture} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
          {isAnalyzing && (
            <View style={styles.analyzing}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.analyzingText}>Analyzing your meal with Google Vision AI...</Text>
            </View>
          )}
          {image && (
            <View>
              <Image source={{ uri: image }} style={styles.mealImage} />
              {!isAnalyzing && (
                <View style={styles.imageActionButtons}>
                  <TouchableOpacity 
                    style={styles.reanalyzeButton}
                    onPress={() => analyzeImage(image)}
                  >
                    <Text style={styles.reanalyzeButtonText}>Re-analyze Image</Text>
                  </TouchableOpacity>
                  
                  {detectedFoodNames.length > 0 && (
                    <TouchableOpacity 
                      style={styles.aiAdviceButton}
                      onPress={() => setShowFoodCoach(true)}
                    >
                      <Text style={styles.aiAdviceButtonText}>Get AI Nutrition Advice</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Food Coach Modal */}
        <FoodCoach 
          foodItems={detectedFoodNames}
          visible={showFoodCoach}
          onClose={() => setShowFoodCoach(false)}
        />
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Food Items</Text>
          {mealItems.map((item, index) => (
            <View key={item.id} style={styles.foodItem}>
              <View style={styles.foodItemHeader}>
                <Text style={styles.foodItemNumber}>Item {index + 1}</Text>
                {mealItems.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => removeMealItem(item.id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <TextInput
                style={styles.foodNameInput}
                value={item.name}
                onChangeText={(value) => updateMealItem(item.id, 'name', value)}
                placeholder="Food name"
              />
              
              <View style={styles.nutritionInputs}>
                <View style={styles.nutritionInput}>
                  <Text style={styles.nutritionInputLabel}>Calories</Text>
                  <TextInput
                    style={styles.nutritionInputField}
                    value={item.calories}
                    onChangeText={(value) => updateMealItem(item.id, 'calories', value)}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.nutritionInput}>
                  <Text style={styles.nutritionInputLabel}>Protein (g)</Text>
                  <TextInput
                    style={styles.nutritionInputField}
                    value={item.protein}
                    onChangeText={(value) => updateMealItem(item.id, 'protein', value)}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.nutritionInput}>
                  <Text style={styles.nutritionInputLabel}>Carbs (g)</Text>
                  <TextInput
                    style={styles.nutritionInputField}
                    value={item.carbs}
                    onChangeText={(value) => updateMealItem(item.id, 'carbs', value)}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.nutritionInput}>
                  <Text style={styles.nutritionInputLabel}>Fat (g)</Text>
                  <TextInput
                    style={styles.nutritionInputField}
                    value={item.fat}
                    onChangeText={(value) => updateMealItem(item.id, 'fat', value)}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            onPress={addMealItem}
            style={styles.addItemButton}
          >
            <Text style={styles.addItemButtonText}>+ Add Another Item</Text>
          </TouchableOpacity>
          
          <View style={styles.totals}>
            <Text style={styles.totalsTitle}>Meal Totals</Text>
            <View style={styles.totalsRow}>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{totalCalories}</Text>
                <Text style={styles.totalLabel}>calories</Text>
              </View>
              
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{totalProtein}g</Text>
                <Text style={styles.totalLabel}>protein</Text>
              </View>
              
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{totalCarbs}g</Text>
                <Text style={styles.totalLabel}>carbs</Text>
              </View>
              
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{totalFat}g</Text>
                <Text style={styles.totalLabel}>fat</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageSection: {
    marginBottom: 25,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  analyzing: {
    alignItems: 'center',
    marginVertical: 20,
  },
  analyzingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  mealImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  imageActionButtons: {
    marginBottom: 20,
  },
  reanalyzeButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  reanalyzeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  aiAdviceButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  aiAdviceButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  foodItem: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  foodItemNumber: {
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  foodNameInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  nutritionInputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionInput: {
    width: '48%',
    marginBottom: 10,
  },
  nutritionInputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  nutritionInputField: {
    backgroundColor: '#f9f9f9',
    borderRadius: 3,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addItemButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  addItemButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  totals: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  totalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalItem: {
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
  },
});
