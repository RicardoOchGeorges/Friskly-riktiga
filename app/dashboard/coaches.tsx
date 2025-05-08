import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data for certified coaches
const MOCK_COACHES = [
  {
    id: '1',
    name: 'Marcus Lindholm',
    specialty: 'Strength & Conditioning',
    experience: '8 years',
    certifications: ['CSCS', 'NSCA-CPT'],
    rating: 4.9,
    reviews: 127,
    price: 799,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Former competitive powerlifter with 8 years of coaching experience. Specializing in strength development and proper form for beginners and intermediate lifters.',
    programs: [
      { id: 'p1', name: 'Beginner Strength Foundations', weeks: 12, price: 499 },
      { id: 'p2', name: 'Intermediate Hypertrophy', weeks: 16, price: 699 },
    ]
  },
  {
    id: '2',
    name: 'Sofia Bergman',
    specialty: 'Weight Loss & Nutrition',
    experience: '6 years',
    certifications: ['PN Level 2', 'ACE-CPT'],
    rating: 4.8,
    reviews: 94,
    price: 699,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Certified nutritionist and personal trainer focused on sustainable weight loss and healthy eating habits. I help clients build lasting lifestyle changes.',
    programs: [
      { id: 'p3', name: '8-Week Fat Loss Kickstart', weeks: 8, price: 399 },
      { id: 'p4', name: 'Complete Nutrition Overhaul', weeks: 12, price: 599 },
    ]
  },
  {
    id: '3',
    name: 'Erik Johansson',
    specialty: 'Bodybuilding',
    experience: '12 years',
    certifications: ['IFBB Pro', 'NASM-CPT'],
    rating: 4.7,
    reviews: 156,
    price: 999,
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'IFBB Pro bodybuilder with over a decade of coaching experience. I have helped hundreds of clients transform their physiques through proper training and nutrition.',
    programs: [
      { id: 'p5', name: 'Mass Building Program', weeks: 16, price: 799 },
      { id: 'p6', name: 'Competition Prep Package', weeks: 20, price: 1299 },
    ]
  },
  {
    id: '4',
    name: 'Anna Karlsson',
    specialty: 'Functional Fitness',
    experience: '5 years',
    certifications: ['CrossFit L3', 'NASM-CES'],
    rating: 4.6,
    reviews: 78,
    price: 649,
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'CrossFit coach specializing in functional movement and mobility. My approach focuses on building a strong foundation for everyday life and athletic performance.',
    programs: [
      { id: 'p7', name: 'Functional Fitness Basics', weeks: 8, price: 349 },
      { id: 'p8', name: 'Mobility & Movement Mastery', weeks: 10, price: 499 },
    ]
  },
  {
    id: '5',
    name: 'Johan Nilsson',
    specialty: 'Sports Performance',
    experience: '10 years',
    certifications: ['CSCS', 'EXOS Performance Specialist'],
    rating: 4.9,
    reviews: 112,
    price: 899,
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    bio: 'Former professional athlete turned performance coach. I work with athletes of all levels to improve speed, power, agility, and sport-specific conditioning.',
    programs: [
      { id: 'p9', name: 'Athletic Development Program', weeks: 12, price: 699 },
      { id: 'p10', name: 'Speed & Agility Training', weeks: 8, price: 549 },
    ]
  },
];

export default function CertifiedCoaches() {
  const router = useRouter();
  const [coaches, setCoaches] = useState(MOCK_COACHES);
  const [selectedCoach, setSelectedCoach] = useState<typeof MOCK_COACHES[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredCoaches = coaches.filter(coach => {
    if (activeTab === 'all') return true;
    return coach.specialty.toLowerCase().includes(activeTab.toLowerCase());
  });

  const handleCoachSelect = (coach: typeof MOCK_COACHES[0]) => {
    setSelectedCoach(coach);
    setModalVisible(true);
  };

  const handlePurchase = (programId: string, programName: string, price: number) => {
    Alert.alert(
      'Confirm Purchase',
      `Are you sure you want to purchase ${programName} for ${price} SEK?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: () => {
            Alert.alert(
              'Purchase Successful',
              `You have successfully purchased ${programName}. Your coach will contact you within 24 hours to get started!`,
              [{ text: 'OK', onPress: () => setModalVisible(false) }]
            );
          } 
        }
      ]
    );
  };

  const renderCoachItem = ({ item }: { item: typeof MOCK_COACHES[0] }) => (
    <TouchableOpacity 
      style={styles.coachCard}
      onPress={() => handleCoachSelect(item)}
    >
      <Image source={{ uri: item.image }} style={styles.coachImage} />
      <View style={styles.coachInfo}>
        <Text style={styles.coachName}>{item.name}</Text>
        <Text style={styles.coachSpecialty}>{item.specialty}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
        </View>
        <View style={styles.certificationContainer}>
          {item.certifications.map((cert, index) => (
            <View key={index} style={styles.certBadge}>
              <Text style={styles.certText}>{cert}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>From</Text>
        <Text style={styles.priceValue}>{item.price} SEK</Text>
        <Text style={styles.priceUnit}>/month</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCoachModal = () => {
    if (!selectedCoach) return null;
    
    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.coachProfileHeader}>
              <Image source={{ uri: selectedCoach.image }} style={styles.profileImage} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{selectedCoach.name}</Text>
                <Text style={styles.profileSpecialty}>{selectedCoach.specialty}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    {selectedCoach.rating} ({selectedCoach.reviews} reviews)
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bioText}>{selectedCoach.bio}</Text>
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Experience & Certifications</Text>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={18} color="#4CAF50" />
                <Text style={styles.detailText}>{selectedCoach.experience} of experience</Text>
              </View>
              <View style={styles.certificationList}>
                {selectedCoach.certifications.map((cert, index) => (
                  <View key={index} style={styles.certBadgeLarge}>
                    <Text style={styles.certTextLarge}>{cert}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Training Programs</Text>
              {selectedCoach.programs.map((program) => (
                <View key={program.id} style={styles.programCard}>
                  <View style={styles.programInfo}>
                    <Text style={styles.programName}>{program.name}</Text>
                    <Text style={styles.programDuration}>{program.weeks} weeks</Text>
                    <Text style={styles.programPrice}>{program.price} SEK</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.purchaseButton}
                    onPress={() => handlePurchase(program.id, program.name, program.price)}
                  >
                    <Text style={styles.purchaseButtonText}>Purchase</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Custom Coaching</Text>
              <Text style={styles.customCoachingText}>
                Get personalized 1-on-1 coaching with {selectedCoach.name} for {selectedCoach.price} SEK per month.
                Includes custom training plans, nutrition guidance, and weekly check-ins.
              </Text>
              <TouchableOpacity 
                style={styles.customCoachingButton}
                onPress={() => handlePurchase('custom', 'Custom Coaching (Monthly)', selectedCoach.price)}
              >
                <Text style={styles.customCoachingButtonText}>Start Custom Coaching</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Certified Coaches</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'strength' && styles.activeTab]}
            onPress={() => setActiveTab('strength')}
          >
            <Text style={[styles.tabText, activeTab === 'strength' && styles.activeTabText]}>
              Strength
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'weight loss' && styles.activeTab]}
            onPress={() => setActiveTab('weight loss')}
          >
            <Text style={[styles.tabText, activeTab === 'weight loss' && styles.activeTabText]}>
              Weight Loss
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'bodybuilding' && styles.activeTab]}
            onPress={() => setActiveTab('bodybuilding')}
          >
            <Text style={[styles.tabText, activeTab === 'bodybuilding' && styles.activeTabText]}>
              Bodybuilding
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'functional' && styles.activeTab]}
            onPress={() => setActiveTab('functional')}
          >
            <Text style={[styles.tabText, activeTab === 'functional' && styles.activeTabText]}>
              Functional
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredCoaches}
        renderItem={renderCoachItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      {renderCoachModal()}
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
    marginBottom: 16,
  },
  tabScroll: {
    paddingRight: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
  },
  coachCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coachImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  coachSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  certificationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  certText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceUnit: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 50,
  },
  closeButton: {
    padding: 8,
  },
  coachProfileHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileSpecialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  certificationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certBadgeLarge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  certTextLarge: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  programCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  programDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  programPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  purchaseButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customCoachingText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  customCoachingButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  customCoachingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
