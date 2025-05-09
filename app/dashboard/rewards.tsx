import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.42;

export default function Rewards() {
  // Mock user rewards data
  const userPoints = 1250;
  const userLevel = 8;
  const userXP = 750;
  const xpToNextLevel = 1000;
  const xpPercentage = Math.round((userXP / xpToNextLevel) * 100);
  
  // Function to render circular progress indicator
  const CircularProgress = ({ 
    percentage, 
    size, 
    strokeWidth, 
    color, 
    textColor,
    showPercentage = true,
    children
  }: {
    percentage: number;
    size: number;
    strokeWidth: number;
    color: string;
    textColor: string;
    showPercentage?: boolean;
    children?: React.ReactNode;
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
          {showPercentage ? (
            <Text style={{ fontSize: size * 0.3, fontWeight: 'bold', color: textColor }}>{percentage}%</Text>
          ) : children}
        </View>
      </View>
    );
  };
  
  // Mock rewards data
  const availableRewards = [
    { 
      id: 1, 
      name: 'Protein Shaker Bottle', 
      points: 500, 
      image: require('../../assets/images/rewards/shaker.jpg'),
      category: 'Fitness Gear'
    },
    { 
      id: 2, 
      name: 'Fitness Resistance Bands', 
      points: 750, 
      image: require('../../assets/images/rewards/bands.jpg'),
      category: 'Fitness Gear'
    },
    { 
      id: 3, 
      name: 'Premium Workout Plan', 
      points: 1000, 
      image: require('../../assets/images/rewards/workout.jpg'),
      category: 'Digital'
    },
    { 
      id: 4, 
      name: 'Running Armband', 
      points: 1200, 
      image: require('../../assets/images/rewards/armband.jpg'),
      category: 'Fitness Gear'
    },
    { 
      id: 5, 
      name: 'Wireless Earbuds', 
      points: 2500, 
      image: require('../../assets/images/rewards/earbuds.jpg'),
      category: 'Electronics'
    },
    { 
      id: 6, 
      name: 'Smart Water Bottle', 
      points: 3000, 
      image: require('../../assets/images/rewards/bottle.jpg'),
      category: 'Fitness Gear'
    },
  ];
  
  // Mock badges data
  const earnedBadges = [
    { 
      id: 1, 
      name: 'Protein Pro', 
      description: 'Hit your protein goal 7 days in a row', 
      icon: <MaterialCommunityIcons name="food-steak" size={32} color="#FF5722" />
    },
    { 
      id: 2, 
      name: 'Early Bird', 
      description: 'Log breakfast before 8 AM for 5 days', 
      icon: <Ionicons name="sunny" size={32} color="#FFC107" />
    },
    { 
      id: 3, 
      name: 'Consistency King', 
      description: 'Log all meals for 14 consecutive days', 
      icon: <MaterialCommunityIcons name="chart-timeline-variant" size={32} color="#4CAF50" />
    },
  ];
  
  const upcomingBadges = [
    { 
      id: 4, 
      name: 'Hydration Hero', 
      description: 'Log 2L of water daily for 10 days', 
      icon: <Ionicons name="water" size={32} color="#2196F3" />
    },
    { 
      id: 5, 
      name: 'Macro Master', 
      description: 'Hit all macro targets for 7 days', 
      icon: <Ionicons name="checkmark-circle" size={32} color="#9C27B0" />
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6200EA', '#FF5722']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <Text style={styles.title}>Redeem Rewards</Text>
        <Text style={styles.subtitle}>Use your points to get exclusive rewards</Text>
      </LinearGradient>

      {/* Main content with negative margin to overlap with header */}
      <View style={styles.contentContainer}>
        {/* Points and Level Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsBadge}>
              <FontAwesome5 name="award" size={28} color="#FFC107" />
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsValue}>{userPoints}</Text>
              <Text style={styles.pointsLabel}>Available Points</Text>
            </View>
          </View>
          
          <View style={styles.levelContainer}>
            <CircularProgress 
              percentage={xpPercentage} 
              size={90} 
              strokeWidth={8} 
              color="#6200EA" 
              textColor="#333" 
              showPercentage={false}
            >
              <View style={styles.levelCenter}>
                <Text style={styles.levelNumber}>{userLevel}</Text>
                <Text style={styles.levelLabel}>Level</Text>
              </View>
            </CircularProgress>
            <Text style={styles.levelProgress}>{userXP}/{xpToNextLevel} XP</Text>
          </View>
        </View>

        {/* Available Rewards */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.rewardsScroll}
            decelerationRate="fast"
            snapToInterval={cardWidth + 15}
            snapToAlignment="start"
          >
            {availableRewards.map(reward => (
              <View key={reward.id} style={styles.rewardCard}>
                <ImageBackground 
                  source={reward.image} 
                  style={styles.rewardImage}
                  imageStyle={styles.rewardImageStyle}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.rewardGradient}>
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardCategory}>{reward.category}</Text>
                      <Text style={styles.rewardName}>{reward.name}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
                
                <View style={styles.rewardBottom}>
                  <View style={styles.rewardPoints}>
                    <Text style={styles.rewardPointsText}>{reward.points}</Text>
                    <Text style={styles.rewardPointsLabel}>points</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.redeemButton, 
                      userPoints < reward.points && styles.disabledButton
                    ]}
                    disabled={userPoints < reward.points}
                  >
                    <Text style={[
                      styles.redeemButtonText,
                      userPoints < reward.points && styles.disabledButtonText
                    ]}>
                      {userPoints >= reward.points ? 'Redeem' : 'Locked'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Earned Badges */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Badges</Text>
          
          <View style={styles.badgesContainer}>
            {earnedBadges.map(badge => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={styles.badgeIconContainer}>
                  {badge.icon}
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Badges */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Badges to Earn</Text>
          
          <View style={styles.badgesContainer}>
            {upcomingBadges.map(badge => (
              <View key={badge.id} style={[styles.badgeCard, styles.upcomingBadge]}>
                <View style={[styles.badgeIconContainer, styles.upcomingBadgeIcon]}>
                  {badge.icon}
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            ))}
          </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Summary card styles
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pointsBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF5E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  levelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  levelLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: -2,
  },
  levelProgress: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  
  // Section styles
  sectionContainer: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  
  // Rewards styles
  rewardsScroll: {
    marginBottom: 5,
  },
  rewardCard: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  rewardImage: {
    width: '100%',
    height: 140,
  },
  rewardImageStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  rewardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  rewardInfo: {
    justifyContent: 'flex-end',
  },
  rewardCategory: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  rewardName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  rewardPoints: {
    flex: 1,
  },
  rewardPointsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EA',
  },
  rewardPointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  redeemButton: {
    backgroundColor: '#6200EA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  redeemButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButtonText: {
    color: '#999',
  },
  
  // Badges styles
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  badgeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingBadge: {
    backgroundColor: 'white',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  upcomingBadgeIcon: {
    backgroundColor: '#f9f9f9',
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    color: '#333',
  },
  badgeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});
