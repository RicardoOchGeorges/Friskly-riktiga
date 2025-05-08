import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';

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

export default function Meals() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Add meal state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mealName, setMealName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  // Define types for meal items
  interface MealItem {
    id: number;
    name: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  }
  
  const [mealItems, setMealItems] = useState<MealItem[]>([
    { id: 1, name: '', calories: '', protein: '', carbs: '', fat: '' }
  ]);
  
  // Mock meal history data
  const mealHistory: DaySection[] = [
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
  ];

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
      analyzeImage();
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
      analyzeImage();
    }
  };
  
  // Mock function to simulate AI image analysis
  const analyzeImage = () => {
    setIsAnalyzing(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Simulate AI detection results
      setMealName('Lunch');
      setMealItems([
        { id: 1, name: 'Grilled Chicken Breast', calories: '250', protein: '35', carbs: '0', fat: '12' },
        { id: 2, name: 'Brown Rice', calories: '150', protein: '3', carbs: '32', fat: '1' },
        { id: 3, name: 'Steamed Broccoli', calories: '55', protein: '4', carbs: '11', fat: '0' }
      ]);
    }, 2000);
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
      setShowAddMeal(false);
      resetAddMealForm();
      loadMeals(); // Refresh the meals list
    } catch (error) {
      console.error('Error in save process:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
        // Here you would transform the data and update state
      }
    } catch (error) {
      console.error('Error in loadMeals:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderMealItem = ({ item }: { item: Meal }) => (
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
  );

  const renderDaySection = ({ item }: { item: DaySection }) => (
    <View style={styles.daySection}>
      <Text style={styles.dayTitle}>{item.date}</Text>
      <FlatList
        data={item.meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal History</Text>
      </View>

      <FlatList
        style={styles.list}
        data={mealHistory}
        renderItem={renderDaySection}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <TouchableOpacity 
            style={styles.addMealButton}
            onPress={() => {
              resetAddMealForm();
              setShowAddMeal(true);
            }}
          >
            <Text style={styles.addMealButtonText}>+ Log New Meal</Text>
          </TouchableOpacity>
        }
      />
      
      {/* Add Meal Modal */}
      <Modal
        visible={showAddMeal}
        animationType="slide"
        onRequestClose={() => setShowAddMeal(false)}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowAddMeal(false)} style={styles.backButton}>
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
                  <Text style={styles.analyzingText}>Analyzing your meal...</Text>
                </View>
              )}
              {image && (
                <Image source={{ uri: image }} style={styles.mealImage} />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Food Items</Text>
              {mealItems.map((item, index) => (
                <View key={item.id} style={styles.foodItem}>
                  <View style={styles.foodItemHeader}>
                    <Text style={styles.foodItemNumber}>Item {index + 1}</Text>
                    {mealItems.length > 1 && (
                      <TouchableOpacity onPress={() => removeMealItem(item.id)}>
                        <Text style={styles.removeButton}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <TextInput
                    style={styles.input}
                    value={item.name}
                    onChangeText={(value) => updateMealItem(item.id, 'name', value)}
                    placeholder="Food name"
                  />
                  
                  <View style={styles.nutritionInputs}>
                    <View style={styles.nutritionInput}>
                      <Text style={styles.nutritionLabel}>Calories</Text>
                      <TextInput
                        style={styles.nutritionValue}
                        value={item.calories}
                        onChangeText={(value) => updateMealItem(item.id, 'calories', value)}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                    
                    <View style={styles.nutritionInput}>
                      <Text style={styles.nutritionLabel}>Protein (g)</Text>
                      <TextInput
                        style={styles.nutritionValue}
                        value={item.protein}
                        onChangeText={(value) => updateMealItem(item.id, 'protein', value)}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                    
                    <View style={styles.nutritionInput}>
                      <Text style={styles.nutritionLabel}>Carbs (g)</Text>
                      <TextInput
                        style={styles.nutritionValue}
                        value={item.carbs}
                        onChangeText={(value) => updateMealItem(item.id, 'carbs', value)}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                    
                    <View style={styles.nutritionInput}>
                      <Text style={styles.nutritionLabel}>Fat (g)</Text>
                      <TextInput
                        style={styles.nutritionValue}
                        value={item.fat}
                        onChangeText={(value) => updateMealItem(item.id, 'fat', value)}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                  </View>
                </View>
              ))}
              
              <TouchableOpacity onPress={addMealItem} style={styles.addItemButton}>
                <Text style={styles.addItemButtonText}>+ Add Another Item</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.totals}>
              <Text style={styles.totalsTitle}>Meal Totals</Text>
              <View style={styles.totalsRow}>
                <View style={styles.totalItem}>
                  <Text style={styles.totalValue}>{totalCalories}</Text>
                  <Text style={styles.totalLabel}>Calories</Text>
                </View>
                
                <View style={styles.totalItem}>
                  <Text style={styles.totalValue}>{totalProtein}g</Text>
                  <Text style={styles.totalLabel}>Protein</Text>
                </View>
                
                <View style={styles.totalItem}>
                  <Text style={styles.totalValue}>{totalCarbs}g</Text>
                  <Text style={styles.totalLabel}>Carbs</Text>
                </View>
                
                <View style={styles.totalItem}>
                  <Text style={styles.totalValue}>{totalFat}g</Text>
                  <Text style={styles.totalLabel}>Fat</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
    borderRadius: 5,
    marginTop: 10,
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
