import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;

export default function Dashboard() {
  const router = useRouter();
  
  // Mock data for the dashboard
  const userName = 'Sofia';
  const caloriesConsumed = 1250;
  const caloriesGoal = 2000;
  const caloriesRemaining = caloriesGoal - caloriesConsumed;
  const caloriesPercentage = Math.round((caloriesConsumed / caloriesGoal) * 100);
  const proteinConsumed = 75;
  const proteinGoal = 150;
  const proteinPercentage = Math.round((proteinConsumed / proteinGoal) * 100);
  const carbsConsumed = 120;
  const carbsGoal = 200;
  const carbsPercentage = Math.round((carbsConsumed / carbsGoal) * 100);
  const fatConsumed = 45;
  const fatGoal = 65;
  const fatPercentage = Math.round((fatConsumed / fatGoal) * 100);
  
  const handleProfilePress = () => {
    router.push('/dashboard/profile');
  };

  // Mock meal data
  const meals = [
    { id: 1, name: 'Breakfast', time: '8:30 AM', calories: 450, protein: 25, carbs: 45, fat: 15 },
    { id: 2, name: 'Lunch', time: '12:45 PM', calories: 650, protein: 40, carbs: 60, fat: 25 },
    { id: 3, name: 'Snack', time: '3:30 PM', calories: 150, protein: 10, carbs: 15, fat: 5 },
  ];
  
  // Mock activity recommendations
  const activityRecommendations = [
    { id: 1, title: 'Daily Mission', subtitle: 'Complete your daily steps', image: require('../../assets/images/activity-steps.jpg') },
    { id: 2, title: 'Calories Burned', subtitle: 'Track your recent workouts', image: require('../../assets/images/activity-calories.jpg') },
    { id: 3, title: 'Recent Meals', subtitle: 'View your nutrition history', image: require('../../assets/images/activity-meals.jpg') },
    { id: 4, title: 'Your AI Coach', subtitle: 'Get personalized guidance', image: require('../../assets/images/activity-coach.jpg') },
  ];

  // Function to render circular progress indicator
  const CircularProgress = ({ 
    percentage, 
    size, 
    strokeWidth, 
    color, 
    textColor 
  }: {
    percentage: number;
    size: number;
    strokeWidth: number;
    color: string;
    textColor: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E6E6E6"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: size * 0.3, fontWeight: 'bold', color: textColor }}>{percentage}%</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#4CAF50', '#FF9800']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{width: 32}} />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.name}>{userName}'s Progress</Text>
          </View>
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={36} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </LinearGradient>

      {/* Main content container with negative margin to overlap with header */}
      <View style={styles.contentContainer}>
        {/* Calories Summary Card */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieHeader}>
            <Text style={styles.calorieTitle}>Today's Calories</Text>
            <Text style={styles.calorieRemaining}>{caloriesRemaining} remaining</Text>
          </View>
          
          <View style={styles.calorieContent}>
            <View style={styles.circularProgressContainer}>
              <CircularProgress 
                percentage={caloriesPercentage} 
                size={120} 
                strokeWidth={12} 
                color="#4CAF50" 
                textColor="#333" 
              />
            </View>
            
            <View style={styles.calorieStats}>
              <View style={styles.calorieStat}>
                <Text style={styles.calorieStatLabel}>Goal</Text>
                <Text style={styles.calorieStatValue}>{caloriesGoal}</Text>
              </View>
              <View style={styles.calorieStat}>
                <Text style={styles.calorieStatLabel}>Consumed</Text>
                <Text style={styles.calorieStatValue}>{caloriesConsumed}</Text>
              </View>
              <View style={styles.calorieStat}>
                <Text style={styles.calorieStatLabel}>Remaining</Text>
                <Text style={[styles.calorieStatValue, styles.calorieRemainingValue]}>{caloriesRemaining}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Macros Card */}
        <View style={styles.macrosCard}>
          <Text style={styles.macrosTitle}>Macronutrients</Text>
          
          <View style={styles.macroCirclesContainer}>
            <View style={styles.macroCircle}>
              <CircularProgress 
                percentage={proteinPercentage} 
                size={80} 
                strokeWidth={8} 
                color="#FF5722" 
                textColor="#333" 
              />
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{proteinConsumed}g / {proteinGoal}g</Text>
            </View>
            
            <View style={styles.macroCircle}>
              <CircularProgress 
                percentage={carbsPercentage} 
                size={80} 
                strokeWidth={8} 
                color="#2196F3" 
                textColor="#333" 
              />
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{carbsConsumed}g / {carbsGoal}g</Text>
            </View>
            
            <View style={styles.macroCircle}>
              <CircularProgress 
                percentage={fatPercentage} 
                size={80} 
                strokeWidth={8} 
                color="#FFC107" 
                textColor="#333" 
              />
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>{fatConsumed}g / {fatGoal}g</Text>
            </View>
          </View>
        </View>

        {/* Activity Recommendations */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Activities</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityScroll}>
            {activityRecommendations.map(activity => (
              <TouchableOpacity key={activity.id} style={styles.activityCard}>
                <ImageBackground 
                  source={activity.image} 
                  style={styles.activityImage}
                  imageStyle={styles.activityImageStyle}>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.activityGradient}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Today's Meals */}
        <View style={styles.mealsContainer}>
          <View style={styles.mealsTitleRow}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <Link href="/dashboard/meals" asChild>
              <TouchableOpacity style={styles.addMealButton}>
                <Text style={styles.addMealButtonText}>+ Add Meal</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          {meals.map(meal => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View style={styles.mealNameContainer}>
                  <MaterialCommunityIcons 
                    name={meal.name === 'Breakfast' ? 'food-apple' : meal.name === 'Lunch' ? 'food' : 'food-fork-drink'} 
                    size={24} 
                    color="#4CAF50" 
                    style={styles.mealIcon} 
                  />
                  <View>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </View>
                </View>
                <Text style={styles.mealCalories}>{meal.calories} cal</Text>
              </View>
              
              <View style={styles.mealNutrition}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{meal.protein}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{meal.carbs}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{meal.fat}g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Core container styles
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingBottom: 30,
    marginTop: -20,
  },
  
  // Header styles
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  profileButton: {
    padding: 5,
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    textAlign: 'center',
  },
  
  // Calorie card styles
  calorieCard: {
    marginHorizontal: 20,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    color: '#333',
  },
  calorieRemaining: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  calorieContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  calorieStats: {
    width: '55%',
  },
  calorieStat: {
    marginBottom: 12,
  },
  calorieStatLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  calorieStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calorieRemainingValue: {
    color: '#4CAF50',
  },
  
  // Macros card styles
  macrosCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  macroCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  macroValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  
  // Activity section
  activitySection: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  activityScroll: {
    paddingBottom: 10,
  },
  activityCard: {
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    width: cardWidth * 0.7,
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  activityImageStyle: {
    borderRadius: 15,
  },
  activityGradient: {
    padding: 15,
    justifyContent: 'flex-end',
    height: '50%',
  },
  activityTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activitySubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  
  // Meals section
  mealsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  mealsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addMealButton: {
    backgroundColor: '#6200EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addMealButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    marginRight: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  mealNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
