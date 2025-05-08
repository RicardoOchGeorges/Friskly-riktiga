import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const router = useRouter();
  
  // Mock data for the dashboard
  const caloriesConsumed = 1250;
  const caloriesGoal = 2000;
  const caloriesRemaining = caloriesGoal - caloriesConsumed;
  const proteinConsumed = 75;
  const proteinGoal = 150;
  const carbsConsumed = 120;
  const carbsGoal = 200;
  const fatConsumed = 45;
  const fatGoal = 65;
  
  const handleProfilePress = () => {
    router.push('/dashboard/profile');
  };

  // Mock meal data
  const meals = [
    { id: 1, name: 'Breakfast', time: '8:30 AM', calories: 450, protein: 25, carbs: 45, fat: 15 },
    { id: 2, name: 'Lunch', time: '12:45 PM', calories: 650, protein: 40, carbs: 60, fat: 25 },
    { id: 3, name: 'Snack', time: '3:30 PM', calories: 150, protein: 10, carbs: 15, fat: 5 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{width: 32}} />
          <Text style={styles.title}>Today's Progress</Text>
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>

      {/* Calories Summary Card */}
      <View style={styles.calorieCard}>
        <View style={styles.calorieHeader}>
          <Text style={styles.calorieTitle}>Calories</Text>
          <Text style={styles.calorieRemaining}>{caloriesRemaining} remaining</Text>
        </View>
        
        <View style={styles.calorieNumbers}>
          <View style={styles.calorieNumberBox}>
            <Text style={styles.calorieNumberValue}>{caloriesGoal}</Text>
            <Text style={styles.calorieNumberLabel}>Goal</Text>
          </View>
          <Text style={styles.calorieMinus}>-</Text>
          <View style={styles.calorieNumberBox}>
            <Text style={styles.calorieNumberValue}>{caloriesConsumed}</Text>
            <Text style={styles.calorieNumberLabel}>Food</Text>
          </View>
          <Text style={styles.calorieEquals}>=</Text>
          <View style={styles.calorieNumberBox}>
            <Text style={[styles.calorieNumberValue, styles.calorieRemainingValue]}>{caloriesRemaining}</Text>
            <Text style={styles.calorieNumberLabel}>Remaining</Text>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(caloriesConsumed / caloriesGoal) * 100}%` }]} />
        </View>
      </View>

      {/* Macros Card */}
      <View style={styles.macrosCard}>
        <Text style={styles.macrosTitle}>Macronutrients</Text>
        
        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>Protein</Text>
          <View style={styles.macroProgressContainer}>
            <View style={[styles.macroProgress, styles.proteinProgress, { width: `${(proteinConsumed / proteinGoal) * 100}%` }]} />
          </View>
          <Text style={styles.macroText}>{proteinConsumed}g / {proteinGoal}g</Text>
        </View>
        
        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <View style={styles.macroProgressContainer}>
            <View style={[styles.macroProgress, styles.carbsProgress, { width: `${(carbsConsumed / carbsGoal) * 100}%` }]} />
          </View>
          <Text style={styles.macroText}>{carbsConsumed}g / {carbsGoal}g</Text>
        </View>
        
        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>Fat</Text>
          <View style={styles.macroProgressContainer}>
            <View style={[styles.macroProgress, styles.fatProgress, { width: `${(fatConsumed / fatGoal) * 100}%` }]} />
          </View>
          <Text style={styles.macroText}>{fatConsumed}g / {fatGoal}g</Text>
        </View>
      </View>

      {/* Today's Meals */}
      <View style={styles.mealsContainer}>
        <View style={styles.mealsTitleRow}>
          <Text style={styles.mealsTitle}>Today's Meals</Text>
          <Link href="/dashboard/add-meal" asChild>
            <TouchableOpacity style={styles.addMealButton}>
              <Text style={styles.addMealButtonText}>+ Add Meal</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {meals.map(meal => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealTime}>{meal.time}</Text>
            </View>
            
            <View style={styles.mealNutrition}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{meal.calories}</Text>
                <Text style={styles.nutritionLabel}>cal</Text>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{meal.protein}g</Text>
                <Text style={styles.nutritionLabel}>protein</Text>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{meal.carbs}g</Text>
                <Text style={styles.nutritionLabel}>carbs</Text>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{meal.fat}g</Text>
                <Text style={styles.nutritionLabel}>fat</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Missions Section */}
      <View style={styles.missionsContainer}>
        <Text style={styles.missionsTitle}>Daily Missions</Text>
        
        <View style={styles.missionCard}>
          <View style={styles.missionInfo}>
            <Text style={styles.missionName}>Hit Your Protein Goal</Text>
            <Text style={styles.missionDescription}>Consume 150g of protein today</Text>
          </View>
          <View style={styles.missionProgress}>
            <Text style={styles.missionProgressText}>{Math.round((proteinConsumed / proteinGoal) * 100)}%</Text>
          </View>
        </View>
        
        <View style={styles.missionCard}>
          <View style={styles.missionInfo}>
            <Text style={styles.missionName}>Log All Meals</Text>
            <Text style={styles.missionDescription}>Log at least 3 meals today</Text>
          </View>
          <View style={styles.missionProgress}>
            <Text style={styles.missionProgressText}>100%</Text>
          </View>
        </View>
        
        <View style={styles.missionCard}>
          <View style={styles.missionInfo}>
            <Text style={styles.missionName}>Stay Under Calorie Goal</Text>
            <Text style={styles.missionDescription}>Keep your calories under your daily goal</Text>
          </View>
          <View style={styles.missionProgress}>
            <Text style={styles.missionProgressText}>In Progress</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  calorieCard: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calorieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calorieRemaining: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  calorieNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calorieNumberBox: {
    alignItems: 'center',
  },
  calorieNumberValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  calorieRemainingValue: {
    color: '#4CAF50',
  },
  calorieNumberLabel: {
    fontSize: 14,
    color: '#666',
  },
  calorieMinus: {
    fontSize: 20,
    color: '#666',
  },
  calorieEquals: {
    fontSize: 20,
    color: '#666',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  macrosCard: {
    margin: 15,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  macroLabel: {
    width: 60,
    fontSize: 16,
  },
  macroProgressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  macroProgress: {
    height: '100%',
  },
  proteinProgress: {
    backgroundColor: '#FF5722',
  },
  carbsProgress: {
    backgroundColor: '#2196F3',
  },
  fatProgress: {
    backgroundColor: '#FFC107',
  },
  macroText: {
    width: 80,
    fontSize: 14,
    textAlign: 'right',
  },
  mealsContainer: {
    margin: 15,
    marginTop: 0,
  },
  mealsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addMealButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addMealButtonText: {
    color: 'white',
    fontWeight: '500',
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
  missionsContainer: {
    margin: 15,
    marginTop: 0,
    marginBottom: 30,
  },
  missionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  missionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionInfo: {
    flex: 1,
  },
  missionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  missionDescription: {
    fontSize: 14,
    color: '#666',
  },
  missionProgress: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  missionProgressText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
});
