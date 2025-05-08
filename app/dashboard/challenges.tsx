import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Modal,
  Alert,
  ProgressBarAndroid
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data for challenges
const MOCK_CHALLENGES = [
  {
    id: '1',
    title: '2km Daily Run Challenge',
    description: 'Run 2km every day for 3 days this month',
    category: 'Cardio',
    difficulty: 'Beginner',
    participants: 247,
    daysLeft: 12,
    progress: 0.33,
    prize: 'Friskly Water Bottle',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    steps: [
      { id: 's1', title: 'Day 1: Complete 2km run', completed: true },
      { id: 's2', title: 'Day 2: Complete 2km run', completed: false },
      { id: 's3', title: 'Day 3: Complete 2km run', completed: false },
    ]
  },
  {
    id: '2',
    title: 'Protein Challenge',
    description: 'Consume at least 100g of protein daily for 5 days',
    category: 'Nutrition',
    difficulty: 'Intermediate',
    participants: 189,
    daysLeft: 8,
    progress: 0.6,
    prize: 'Protein Shaker & Supplements',
    image: 'https://images.unsplash.com/photo-1506224772180-d75b3efbe9be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    steps: [
      { id: 's1', title: 'Day 1: 100g protein', completed: true },
      { id: 's2', title: 'Day 2: 100g protein', completed: true },
      { id: 's3', title: 'Day 3: 100g protein', completed: true },
      { id: 's4', title: 'Day 4: 100g protein', completed: false },
      { id: 's5', title: 'Day 5: 100g protein', completed: false },
    ]
  },
  {
    id: '3',
    title: 'Push-Up Master',
    description: 'Complete 100 push-ups in a week (any distribution)',
    category: 'Strength',
    difficulty: 'Intermediate',
    participants: 312,
    daysLeft: 5,
    progress: 0.75,
    prize: 'Training Gloves',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    steps: [
      { id: 's1', title: 'Complete 100 push-ups within 7 days', completed: false },
    ]
  },
  {
    id: '4',
    title: 'Hydration Hero',
    description: 'Drink 2 liters of water daily for 7 days',
    category: 'Wellness',
    difficulty: 'Beginner',
    participants: 423,
    daysLeft: 3,
    progress: 0.43,
    prize: 'Smart Water Bottle',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    steps: [
      { id: 's1', title: 'Track water intake for 7 consecutive days', completed: false },
    ]
  },
  {
    id: '5',
    title: 'Squat Challenge',
    description: 'Complete 300 squats in 5 days',
    category: 'Strength',
    difficulty: 'Advanced',
    participants: 156,
    daysLeft: 10,
    progress: 0,
    prize: 'Resistance Bands Set',
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    steps: [
      { id: 's1', title: 'Complete 300 squats within 5 days', completed: false },
    ]
  },
];

// Mock data for competitions
const MOCK_COMPETITIONS = [
  {
    id: 'c1',
    title: 'Summer Weight Loss Challenge',
    description: 'Lose the most weight percentage in 30 days',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    participants: 532,
    prizes: [
      { place: '1st', reward: '1000 SEK Gift Card' },
      { place: '2nd', reward: '500 SEK Gift Card' },
      { place: '3rd', reward: '250 SEK Gift Card' },
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: 'c2',
    title: 'Strength Gains Competition',
    description: 'Increase your strength the most in 8 weeks',
    startDate: '2025-07-15',
    endDate: '2025-09-15',
    participants: 347,
    prizes: [
      { place: '1st', reward: 'Premium Gym Membership (1 Year)' },
      { place: '2nd', reward: 'Premium Gym Membership (6 Months)' },
      { place: '3rd', reward: 'Premium Gym Membership (3 Months)' },
    ],
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
];

export default function Challenges() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('challenges');
  const [selectedChallenge, setSelectedChallenge] = useState<typeof MOCK_CHALLENGES[0] | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<typeof MOCK_COMPETITIONS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleChallengeSelect = (challenge: typeof MOCK_CHALLENGES[0]) => {
    setSelectedChallenge(challenge);
    setSelectedCompetition(null);
    setModalVisible(true);
  };

  const handleCompetitionSelect = (competition: typeof MOCK_COMPETITIONS[0]) => {
    setSelectedCompetition(competition);
    setSelectedChallenge(null);
    setModalVisible(true);
  };

  const handleJoinChallenge = () => {
    Alert.alert(
      'Challenge Joined',
      'You have successfully joined this challenge. Good luck!',
      [{ text: 'OK', onPress: () => setModalVisible(false) }]
    );
  };

  const handleJoinCompetition = () => {
    Alert.alert(
      'Competition Joined',
      'You have successfully joined this competition. Good luck!',
      [{ text: 'OK', onPress: () => setModalVisible(false) }]
    );
  };

  const renderChallengeItem = ({ item }: { item: typeof MOCK_CHALLENGES[0] }) => (
    <TouchableOpacity 
      style={styles.challengeCard}
      onPress={() => handleChallengeSelect(item)}
    >
      <Image source={{ uri: item.image }} style={styles.challengeImage} />
      <View style={styles.challengeContent}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{item.title}</Text>
          <View style={styles.challengeBadge}>
            <Text style={styles.challengeBadgeText}>{item.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.challengeDescription}>{item.description}</Text>
        <View style={styles.challengeStats}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.participants} participants</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.daysLeft} days left</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(item.progress * 100)}% complete</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCompetitionItem = ({ item }: { item: typeof MOCK_COMPETITIONS[0] }) => (
    <TouchableOpacity 
      style={styles.competitionCard}
      onPress={() => handleCompetitionSelect(item)}
    >
      <Image source={{ uri: item.image }} style={styles.competitionImage} />
      <View style={styles.competitionContent}>
        <Text style={styles.competitionTitle}>{item.title}</Text>
        <Text style={styles.competitionDescription}>{item.description}</Text>
        <View style={styles.competitionDates}>
          <Text style={styles.dateText}>{item.startDate} - {item.endDate}</Text>
        </View>
        <View style={styles.competitionStats}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.participants} participants</Text>
          </View>
          <View style={styles.prizePreview}>
            <Ionicons name="trophy-outline" size={16} color="#FFD700" />
            <Text style={styles.prizeText}>1st: {item.prizes[0].reward}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderChallengeModal = () => {
    if (!selectedChallenge && !selectedCompetition) return null;
    
    if (selectedChallenge) {
      return (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedChallenge.image }} style={styles.modalImage} />
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedChallenge.title}</Text>
                  <View style={styles.challengeBadge}>
                    <Text style={styles.challengeBadgeText}>{selectedChallenge.difficulty}</Text>
                  </View>
                </View>
                
                <Text style={styles.modalDescription}>{selectedChallenge.description}</Text>
                
                <View style={styles.modalStats}>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="people-outline" size={20} color="#666" />
                    <Text style={styles.modalStatText}>{selectedChallenge.participants} participants</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="time-outline" size={20} color="#666" />
                    <Text style={styles.modalStatText}>{selectedChallenge.daysLeft} days left</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="fitness-outline" size={20} color="#666" />
                    <Text style={styles.modalStatText}>{selectedChallenge.category}</Text>
                  </View>
                </View>
                
                <View style={styles.progressSection}>
                  <Text style={styles.sectionTitle}>Your Progress</Text>
                  <View style={styles.modalProgressContainer}>
                    <View style={styles.modalProgressBar}>
                      <View style={[styles.modalProgressFill, { width: `${selectedChallenge.progress * 100}%` }]} />
                    </View>
                    <Text style={styles.modalProgressText}>{Math.round(selectedChallenge.progress * 100)}% complete</Text>
                  </View>
                </View>
                
                <View style={styles.stepsSection}>
                  <Text style={styles.sectionTitle}>Challenge Steps</Text>
                  {selectedChallenge.steps.map((step) => (
                    <View key={step.id} style={styles.stepItem}>
                      <View style={[styles.stepCheckbox, step.completed && styles.stepCompleted]}>
                        {step.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
                      </View>
                      <Text style={[styles.stepText, step.completed && styles.stepTextCompleted]}>
                        {step.title}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.prizeSection}>
                  <Text style={styles.sectionTitle}>Prize</Text>
                  <View style={styles.prizeContainer}>
                    <Ionicons name="gift-outline" size={24} color="#4CAF50" />
                    <Text style={styles.prizeDescription}>{selectedChallenge.prize}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={handleJoinChallenge}
                >
                  <Text style={styles.joinButtonText}>Join Challenge</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      );
    } else if (selectedCompetition) {
      return (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedCompetition.image }} style={styles.modalImage} />
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedCompetition.title}</Text>
                <Text style={styles.modalDescription}>{selectedCompetition.description}</Text>
                
                <View style={styles.dateSection}>
                  <Text style={styles.sectionTitle}>Competition Dates</Text>
                  <View style={styles.dateContainer}>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateLabel}>Start Date</Text>
                      <Text style={styles.dateValue}>{selectedCompetition.startDate}</Text>
                    </View>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateLabel}>End Date</Text>
                      <Text style={styles.dateValue}>{selectedCompetition.endDate}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.participantsSection}>
                  <Text style={styles.sectionTitle}>Participants</Text>
                  <View style={styles.participantsContainer}>
                    <Ionicons name="people-outline" size={24} color="#4CAF50" />
                    <Text style={styles.participantsText}>
                      {selectedCompetition.participants} people have joined
                    </Text>
                  </View>
                </View>
                
                <View style={styles.prizesSection}>
                  <Text style={styles.sectionTitle}>Prizes</Text>
                  {selectedCompetition.prizes.map((prize, index) => (
                    <View key={index} style={styles.prizeItem}>
                      <View style={styles.placeContainer}>
                        <Ionicons 
                          name={index === 0 ? "trophy" : "medal-outline"} 
                          size={24} 
                          color={index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32"} 
                        />
                        <Text style={styles.placeText}>{prize.place}</Text>
                      </View>
                      <Text style={styles.rewardText}>{prize.reward}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={handleJoinCompetition}
                >
                  <Text style={styles.joinButtonText}>Join Competition</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges & Competitions</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>
            Challenges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'competitions' && styles.activeTab]}
          onPress={() => setActiveTab('competitions')}
        >
          <Text style={[styles.tabText, activeTab === 'competitions' && styles.activeTabText]}>
            Competitions
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'challenges' ? (
        <FlatList
          data={MOCK_CHALLENGES}
          renderItem={renderChallengeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={MOCK_COMPETITIONS}
          renderItem={renderCompetitionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {renderChallengeModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengeImage: {
    width: '100%',
    height: 120,
  },
  challengeContent: {
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  challengeBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  challengeBadgeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  challengeStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  competitionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  competitionImage: {
    width: '100%',
    height: 150,
  },
  competitionContent: {
    padding: 16,
  },
  competitionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  competitionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  competitionDates: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  competitionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prizePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizeText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalContent: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  modalStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  modalStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  progressSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  modalProgressContainer: {
    marginTop: 8,
  },
  modalProgressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 8,
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  modalProgressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  stepsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
  },
  stepTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  prizeSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizeDescription: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  participantsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  prizesSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  prizeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  placeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  rewardText: {
    fontSize: 16,
    color: '#333',
  },
});
