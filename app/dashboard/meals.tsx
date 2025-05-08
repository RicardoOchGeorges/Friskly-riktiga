import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, RefreshControl, Modal, TextInput, ScrollView, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { analyzeFoodImage, DetectedFoodItem } from '../../lib/vision-api';
import FoodCoach from '../../lib/food-coach';
import { Ionicons } from '@expo/vector-icons';

// Define types for meal data
interface Meal {
  id: number;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DaySection {
  id: string;
  date: string;
  meals: Meal[];
}

// Define types for meal items when adding a new meal
interface MealItem {
  id: number;
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export default function Meals() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Add meal state
  const [addMealModalVisible, setAddMealModalVisible] = useState(false);
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
  
  // Meal history data
  const [mealHistory, setMealHistory] = useState<DaySection[]>([
    {
      id: '1',
      date: 'Today',
      meals: [
        { id: 1, name: 'Breakfast', time: '8:30 AM', calories: 450, protein: 25, carbs: 45, fat: 15 },
        { id: 2, name: 'Lunch', time: '12:45 PM', calories: 650, protein: 40, carbs: 60, fat: 25 },
        { id: 3, name: 'Snack', time: '3:30 PM', calories: 150, protein: 10, carbs: 15, fat: 5 },
      ]
    },
    {
      id: '2',
      date: 'Yesterday',
      meals: [
        { id: 4, name: 'Breakfast', time: '7:45 AM', calories: 420, protein: 22, carbs: 50, fat: 12 },
        { id: 5, name: 'Lunch', time: '1:00 PM', calories: 580, protein: 35, carbs: 65, fat: 20 },
        { id: 6, name: 'Dinner', time: '7:30 PM', calories: 750, protein: 45, carbs: 70, fat: 30 },
      ]
    },
    {
      id: '3',
      date: 'May 5, 2025',
      meals: [
        { id: 7, name: 'Breakfast', time: '8:15 AM', calories: 380, protein: 20, carbs: 40, fat: 15 },
        { id: 8, name: 'Lunch', time: '12:30 PM', calories: 620, protein: 38, carbs: 55, fat: 22 },
        { id: 9, name: 'Dinner', time: '6:45 PM', calories: 720, protein: 42, carbs: 65, fat: 28 },
      ]
    },
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMeals();
  }, []);
  
  const openAddMealModal = () => {
    // Reset form state
    setMealName('');
    setImage(null);
    setMealItems([{ id: 1, name: '', calories: '', protein: '', carbs: '', fat: '' }]);
    setShowFoodCoach(false);
    setAddMealModalVisible(true);
  };
  
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
        
        // Extract food names for the food coach
        const foodNames = detectedItems.map(item => item.name).filter(name => name.trim() !== '');
        setDetectedFoodNames(foodNames);
        
        if (foodNames.length > 0) {
          setShowFoodCoach(true);
        }
      } else {
        Alert.alert('No food detected', 'Try taking a clearer picture of your meal');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze the image');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Add a new empty meal item
  const addMealItem = () => {
    const newId = mealItems.length > 0 ? Math.max(...mealItems.map(item => item.id)) + 1 : 1;
    setMealItems([...mealItems, { id: newId, name: '', calories: '', protein: '', carbs: '', fat: '' }]);
  };
  
  // Update a meal item field
  const updateMealItem = (id: number, field: keyof MealItem, value: string) => {
    setMealItems(mealItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  
  // Remove a meal item
  const removeMealItem = (id: number) => {
    if (mealItems.length > 1) {
      setMealItems(mealItems.filter(item => item.id !== id));
    } else {
      // If it's the last item, just clear it
      setMealItems([{ id: 1, name: '', calories: '', protein: '', carbs: '', fat: '' }]);
    }
  };
  
  // Save the meal to Supabase
  const saveMeal = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save a meal');
      return;
    }
    
    if (!mealName.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }
    
    // Validate meal items
    const validMealItems = mealItems.filter(item => item.name.trim() !== '');
    if (validMealItems.length === 0) {
      Alert.alert('Error', 'Please add at least one food item');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Calculate totals
      const totalCalories = validMealItems.reduce((sum, item) => sum + (parseInt(item.calories) || 0), 0);
      const totalProtein = validMealItems.reduce((sum, item) => sum + (parseInt(item.protein) || 0), 0);
      const totalCarbs = validMealItems.reduce((sum, item) => sum + (parseInt(item.carbs) || 0), 0);
      const totalFat = validMealItems.reduce((sum, item) => sum + (parseInt(item.fat) || 0), 0);
      
      const now = new Date();
      const mealDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const mealTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      
      // Insert the meal into Supabase
      const { data, error } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          name: mealName,
          meal_date: mealDate,
          meal_time: mealTime,
          total_calories: totalCalories,
          total_protein: totalProtein,
          total_carbs: totalCarbs,
          total_fat: totalFat,
          food_items: validMealItems.map(item => ({
            name: item.name,
            calories: parseInt(item.calories) || 0,
            protein: parseInt(item.protein) || 0,
            carbs: parseInt(item.carbs) || 0,
            fat: parseInt(item.fat) || 0,
          })),
          image_url: image,
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      Alert.alert('Success', 'Meal saved successfully');
      setAddMealModalVisible(false);
      loadMeals(); // Refresh the meal list
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert('Error', 'Failed to save the meal');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Render the add meal modal
  const renderAddMealModal = () => (
    <Modal
      visible={addMealModalVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setAddMealModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setAddMealModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Meal</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveMeal}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#4CAF50" />
            ) : (
              <Ionicons name="checkmark" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
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
            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageButton} onPress={takePicture}>
                <Ionicons name="camera-outline" size={24} color="#4CAF50" />
                <Text style={styles.imageButtonText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={24} color="#4CAF50" />
                <Text style={styles.imageButtonText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
            
            {isAnalyzing && (
              <View style={styles.analyzingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.analyzingText}>Analyzing your meal...</Text>
              </View>
            )}
            
            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
              </View>
            )}
          </View>
          
          {showFoodCoach && detectedFoodNames.length > 0 && (
            <View style={styles.foodCoachContainer}>
              <Text style={styles.foodCoachTitle}>Food Coach Analysis</Text>
              <FoodCoach foodItems={detectedFoodNames} visible={true} onClose={() => setShowFoodCoach(false)} />
            </View>
          )}
          
          <Text style={styles.sectionTitle}>Food Items</Text>
          
          {mealItems.map((item, index) => (
            <View key={item.id} style={styles.mealItemContainer}>
              <View style={styles.mealItemHeader}>
                <Text style={styles.mealItemTitle}>Item {index + 1}</Text>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeMealItem(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Food Name</Text>
                <TextInput
                  style={styles.input}
                  value={item.name}
                  onChangeText={(value) => updateMealItem(item.id, 'name', value)}
                  placeholder="Enter food name"
                />
              </View>
              
              <View style={styles.nutritionRow}>
                <View style={styles.nutritionInput}>
                  <Text style={styles.label}>Calories</Text>
                  <TextInput
                    style={styles.input}
                    value={item.calories}
                    onChangeText={(value) => updateMealItem(item.id, 'calories', value)}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.nutritionInput}>
                  <Text style={styles.label}>Protein (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={item.protein}
                    onChangeText={(value) => updateMealItem(item.id, 'protein', value)}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.nutritionRow}>
                <View style={styles.nutritionInput}>
                  <Text style={styles.label}>Carbs (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={item.carbs}
                    onChangeText={(value) => updateMealItem(item.id, 'carbs', value)}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.nutritionInput}>
                  <Text style={styles.label}>Fat (g)</Text>
                  <TextInput
                    style={styles.input}
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
            style={styles.addItemButton}
            onPress={addMealItem}
          >
            <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
            <Text style={styles.addItemButtonText}>Add Another Food Item</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  // Load real meals from Supabase
  useEffect(() => {
    if (user) {
      loadMeals();
    }
  }, [user]);

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading meals:', error);
      } else {
        console.log('Meals loaded:', data);
        
        // Transform the data into the DaySection format
        const mealsByDate = new Map<string, Meal[]>();
        
        data.forEach((meal: any) => {
          const date = meal.meal_date;
          const mealObj: Meal = {
            id: meal.id,
            name: meal.name,
            time: meal.meal_time.substring(0, 5), // HH:MM format
            calories: meal.total_calories,
            protein: meal.total_protein,
            carbs: meal.total_carbs,
            fat: meal.total_fat
          };
          
          if (mealsByDate.has(date)) {
            mealsByDate.get(date)!.push(mealObj);
          } else {
            mealsByDate.set(date, [mealObj]);
          }
        });
        
        // Convert map to array of DaySections
        const sections: DaySection[] = [];
        let sectionId = 1;
        
        // Helper function to format the date
        const formatDate = (dateStr: string) => {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          
          if (dateStr === today) return 'Today';
          if (dateStr === yesterday) return 'Yesterday';
          
          // Format as Month Day, Year
          const date = new Date(dateStr);
          return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        };
        
        // Sort dates in descending order
        const sortedDates = Array.from(mealsByDate.keys()).sort().reverse();
        
        sortedDates.forEach(date => {
          const meals = mealsByDate.get(date) || [];
          sections.push({
            id: String(sectionId++),
            date: formatDate(date),
            meals: meals
          });
        });
        
        setMealHistory(sections);
      }
    } catch (error) {
      console.error('Error in loadMeals:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Memoized meal item component for better performance
  const MealItem = React.memo(({ item }: { item: Meal }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealTime}>{item.time}</Text>
      </View>
      
      <View style={styles.mealNutrition}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.calories}</Text>
          <Text style={styles.nutritionLabel}>cal</Text>
        </View>
        
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.protein}g</Text>
          <Text style={styles.nutritionLabel}>protein</Text>
        </View>
        
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.carbs}g</Text>
          <Text style={styles.nutritionLabel}>carbs</Text>
        </View>
        
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{item.fat}g</Text>
          <Text style={styles.nutritionLabel}>fat</Text>
        </View>
      </View>
    </View>
  ));
  
  const renderMealItem = ({ item }: { item: Meal }) => <MealItem item={item} />;

  // Memoized day section component for better performance
  const DaySection = React.memo(({ item }: { item: DaySection }) => {
    // Create a stable key extractor function
    const keyExtractor = React.useCallback((meal: Meal) => meal.id.toString(), []);
    
    return (
      <View style={styles.daySection}>
        <Text style={styles.dayTitle}>{item.date}</Text>
        <FlatList
          data={item.meals}
          renderItem={renderMealItem}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={5}
        />
      </View>
    );
  });
  
  const renderDaySection = ({ item }: { item: DaySection }) => <DaySection item={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal History</Text>
      </View>

      <FlatList
        data={mealHistory}
        renderItem={renderDaySection}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <TouchableOpacity style={styles.addMealButton} onPress={openAddMealModal}>
            <Text style={styles.addMealButtonText}>+ Log New Meal</Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={3}
        getItemLayout={(data, index) => (
          {length: 200, offset: 200 * index, index}
        )}
      />
      {renderAddMealModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  // Add meal modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageSection: {
    marginBottom: 24,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  imageButton: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    width: '45%',
  },
  imageButtonText: {
    marginTop: 8,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  analyzingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  analyzingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  foodCoachContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  foodCoachTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  mealItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  mealItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nutritionInput: {
    width: '48%',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  addItemButtonText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontWeight: 'bold',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  list: {
    flex: 1,
    padding: 15,
  },
  addMealButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addMealButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  daySection: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
  },
  mealNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
  },
  // Add meal modal styles
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#388E3C',
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
    fontSize: 14,
    fontWeight: '500',
  },
  analyzing: {
    alignItems: 'center',
    padding: 20,
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
  // ... (rest of the styles remain the same)
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  foodItemNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    color: '#F44336',
    fontSize: 14,
  },
  nutritionInputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  nutritionInput: {
    width: '48%',
    marginBottom: 10,
  },
  addItemButton: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  addItemButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  totals: {
    backgroundColor: '#E8F5E9',
    borderRadius: 5,
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  totalsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
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
    fontSize: 14,
    color: '#666',
  },
});
