import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Rewards() {
  // Mock user rewards data
  const userPoints = 1250;
  const userLevel = 8;
  const userXP = 750;
  const xpToNextLevel = 1000;
  
  // Mock rewards data
  const availableRewards = [
    { id: 1, name: 'Protein Shaker Bottle', points: 500, image: '🥤' },
    { id: 2, name: 'Fitness Resistance Bands', points: 750, image: '🏋️' },
    { id: 3, name: 'Premium Workout Plan', points: 1000, image: '📋' },
    { id: 4, name: 'Running Armband', points: 1200, image: '💪' },
    { id: 5, name: 'Wireless Earbuds', points: 2500, image: '🎧' },
    { id: 6, name: 'Smart Water Bottle', points: 3000, image: '🍶' },
  ];
  
  // Mock badges data
  const earnedBadges = [
    { id: 1, name: 'Protein Pro', description: 'Hit your protein goal 7 days in a row', icon: '🥩' },
    { id: 2, name: 'Early Bird', description: 'Log breakfast before 8 AM for 5 days', icon: '🌅' },
    { id: 3, name: 'Consistency King', description: 'Log all meals for 14 consecutive days', icon: '📊' },
  ];
  
  const upcomingBadges = [
    { id: 4, name: 'Hydration Hero', description: 'Log 2L of water daily for 10 days', icon: '💧' },
    { id: 5, name: 'Macro Master', description: 'Hit all macro targets for 7 days', icon: '🎯' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards & Progress</Text>
      </View>

      {/* User Level and XP */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{userLevel}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Level {userLevel}</Text>
            <Text style={styles.levelSubtitle}>{userXP}/{xpToNextLevel} XP to Level {userLevel + 1}</Text>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(userXP / xpToNextLevel) * 100}%` }]} />
        </View>
      </View>

      {/* Points Balance */}
      <View style={styles.pointsCard}>
        <View style={styles.pointsHeader}>
          <Text style={styles.pointsTitle}>Your Points Balance</Text>
          <Text style={styles.pointsValue}>{userPoints}</Text>
        </View>
        <Text style={styles.pointsSubtitle}>Earn points by completing missions and logging meals</Text>
      </View>

      {/* Available Rewards */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rewardsScroll}>
          {availableRewards.map(reward => (
            <View key={reward.id} style={styles.rewardCard}>
              <Text style={styles.rewardImage}>{reward.image}</Text>
              <Text style={styles.rewardName}>{reward.name}</Text>
              <View style={styles.rewardPoints}>
                <Text style={styles.rewardPointsText}>{reward.points} pts</Text>
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
                  {userPoints >= reward.points ? 'Redeem' : 'Not Enough Points'}
                </Text>
              </TouchableOpacity>
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
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
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
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            </View>
          ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  levelCard: {
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
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  levelNumber: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelSubtitle: {
    fontSize: 14,
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
  pointsCard: {
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
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pointsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionContainer: {
    margin: 15,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  rewardsScroll: {
    flexDirection: 'row',
  },
  rewardCard: {
    width: 160,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  rewardImage: {
    fontSize: 40,
    marginBottom: 10,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  rewardPoints: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  rewardPointsText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  redeemButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  redeemButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  disabledButtonText: {
    color: '#999',
  },
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  upcomingBadge: {
    backgroundColor: '#f9f9f9',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  badgeIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  badgeDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
