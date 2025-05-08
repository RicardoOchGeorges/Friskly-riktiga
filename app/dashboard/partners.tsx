import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Switch,
  Alert,
  Dimensions,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import Swiper from 'react-native-deck-swiper';

// Mock data for training partners
const MOCK_PARTNERS = [
  {
    id: '1',
    name: 'Emma Johansson',
    age: 28,
    distance: 1.2,
    goals: ['Weight loss', 'Strength'],
    experience: 'Beginner',
    schedule: 'Mornings, Weekends',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isNearby: true,
  },
  {
    id: '2',
    name: 'Johan Andersson',
    age: 32,
    distance: 2.5,
    goals: ['Muscle gain', 'Endurance'],
    experience: 'Intermediate',
    schedule: 'Evenings, Weekdays',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isNearby: false,
  },
  {
    id: '3',
    name: 'Sara Lindberg',
    age: 24,
    distance: 3.7,
    goals: ['Toning', 'Flexibility'],
    experience: 'Beginner',
    schedule: 'Afternoons, Weekdays',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    isNearby: true,
  },
  {
    id: '4',
    name: 'Erik Nilsson',
    age: 35,
    distance: 4.1,
    goals: ['Strength', 'Cardio'],
    experience: 'Advanced',
    schedule: 'Mornings, Weekdays',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    isNearby: false,
  },
  {
    id: '5',
    name: 'Lina Karlsson',
    age: 29,
    distance: 5.3,
    goals: ['Weight loss', 'Cardio'],
    experience: 'Intermediate',
    schedule: 'Evenings, Weekends',
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    isNearby: true,
  },
];

export default function TrainingPartners() {
  const router = useRouter();
  const [partners, setPartners] = useState(MOCK_PARTNERS);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [matchedPartners, setMatchedPartners] = useState<typeof MOCK_PARTNERS>([]);
  const [showMatches, setShowMatches] = useState(false);
  const swiperRef = useRef<any>(null);
  
  // Animation values for card actions
  const [likeOpacity] = useState(new Animated.Value(0));
  const [nopeOpacity] = useState(new Animated.Value(0));
  const [superLikeOpacity] = useState(new Animated.Value(0));

  // Request location permissions
  useEffect(() => {
    (async () => {
      if (locationEnabled) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Permission to access location was denied. Some features may be limited.',
            [{ text: 'OK', onPress: () => setLocationEnabled(false) }]
          );
        }
      }
    })();
  }, [locationEnabled]);
  
  // Animation functions for swipe actions
  const showLikeAnimation = () => {
    Animated.sequence([
      Animated.timing(likeOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(likeOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const showNopeAnimation = () => {
    Animated.sequence([
      Animated.timing(nopeOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(nopeOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const showSuperLikeAnimation = () => {
    Animated.sequence([
      Animated.timing(superLikeOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(superLikeOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleLocationServices = () => {
    if (!locationEnabled) {
      Alert.alert(
        'Enable Location Services',
        'This will allow you to receive notifications when your training partners are at the gym near you.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: () => setLocationEnabled(true) }
        ]
      );
    } else {
      setLocationEnabled(false);
    }
  };
  
  const handleSwipeLeft = (cardIndex: number) => {
    // Check if the card index is valid
    if (cardIndex >= 0 && cardIndex < partners.length) {
      console.log(`Swiped left on ${partners[cardIndex].name}`);
      showNopeAnimation();
    } else {
      console.log('No more cards to swipe');
    }
  };
  
  const handleSwipeRight = (cardIndex: number) => {
    // Check if the card index is valid
    if (cardIndex >= 0 && cardIndex < partners.length) {
      console.log(`Swiped right on ${partners[cardIndex].name}`);
      showLikeAnimation();
      
      // Simulate a match with 30% probability
      if (Math.random() < 0.3) {
        setTimeout(() => {
          const matchedPartner = partners[cardIndex];
          setMatchedPartners(prev => [...prev, matchedPartner]);
          Alert.alert(
            'New Match!',
            `You matched with ${matchedPartner.name}! You can now start training together.`,
            [{ text: 'OK' }]
          );
        }, 500);
      }
    } else {
      console.log('No more cards to swipe');
      // Handle the case when all cards have been swiped
      Alert.alert(
        'No More Partners',
        'You have viewed all potential training partners. Check your matches or come back later for more.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleSwipeTop = (cardIndex: number) => {
    // Check if the card index is valid
    if (cardIndex >= 0 && cardIndex < partners.length) {
      console.log(`Super liked ${partners[cardIndex].name}`);
      showSuperLikeAnimation();
      
      // Super likes have a 70% match probability
      if (Math.random() < 0.7) {
        setTimeout(() => {
          const matchedPartner = partners[cardIndex];
          setMatchedPartners(prev => [...prev, matchedPartner]);
          Alert.alert(
            'Super Match!',
            `You super matched with ${matchedPartner.name}! They're excited to train with you!`,
            [{ text: 'OK' }]
          );
        }, 500);
      }
    } else {
      console.log('No more cards to swipe');
    }
  };

  const renderCard = (item: typeof MOCK_PARTNERS[0], cardIndex: number) => {
    if (!item) return null;
    
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.avatar }} style={styles.cardImage} />
        
        {item.isNearby && locationEnabled && (
          <View style={styles.nearbyBadge}>
            <Ionicons name="location" size={14} color="#fff" />
            <Text style={styles.nearbyBadgeText}>At the gym now!</Text>
          </View>
        )}
        
        <View style={styles.cardContent}>
          <Text style={styles.cardName}>{item.name}, {item.age}</Text>
          <Text style={styles.cardDistance}>{item.distance} km away</Text>
          
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Experience</Text>
            <Text style={styles.sectionValue}>{item.experience}</Text>
          </View>
          
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Schedule</Text>
            <Text style={styles.sectionValue}>{item.schedule}</Text>
          </View>
          
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Goals</Text>
            <View style={styles.goalTags}>
              {item.goals.map((goal, index) => (
                <View key={index} style={styles.goalTag}>
                  <Text style={styles.goalText}>{goal}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  const renderMatchItem = (item: typeof MOCK_PARTNERS[0], index: number) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.matchItem}
      onPress={() => {
        Alert.alert(
          'Start Training',
          `Would you like to message ${item.name} to set up a training session?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Message', onPress: () => console.log(`Messaging ${item.name}`) }
          ]
        );
      }}
    >
      <Image source={{ uri: item.avatar }} style={styles.matchAvatar} />
      <Text style={styles.matchName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Training Partners</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.headerButton, showMatches && styles.activeHeaderButton]}
            onPress={() => setShowMatches(true)}
          >
            <Ionicons name="people" size={24} color={showMatches ? '#4CAF50' : '#757575'} />
            {matchedPartners.length > 0 && (
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>{matchedPartners.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, !showMatches && styles.activeHeaderButton]}
            onPress={() => setShowMatches(false)}
          >
            <Ionicons name="search" size={24} color={!showMatches ? '#4CAF50' : '#757575'} />
          </TouchableOpacity>
          
          <View style={styles.locationToggle}>
            <Switch
              value={locationEnabled}
              onValueChange={toggleLocationServices}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={locationEnabled ? '#4CAF50' : '#f4f3f4'}
            />
            <Ionicons name="location" size={18} color={locationEnabled ? '#4CAF50' : '#757575'} />
          </View>
        </View>
      </View>
      
      {!showMatches ? (
        <View style={styles.swiperContainer}>
          <Swiper
            ref={swiperRef}
            cards={partners}
            renderCard={renderCard}
            onSwipedLeft={handleSwipeLeft}
            onSwipedRight={handleSwipeRight}
            onSwipedTop={handleSwipeTop}
            cardIndex={0}
            backgroundColor={'#f5f5f5'}
            stackSize={3}
            stackSeparation={15}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
            verticalSwipe={true}
            cardStyle={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            containerStyle={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: '#ff0000',
                    color: '#fff',
                    fontSize: 24,
                    borderRadius: 10,
                    padding: 10,
                    fontWeight: 'bold'
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30
                  }
                }
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    fontSize: 24,
                    borderRadius: 10,
                    padding: 10,
                    fontWeight: 'bold'
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30
                  }
                }
              },
              top: {
                title: 'SUPER LIKE',
                style: {
                  label: {
                    backgroundColor: '#00bfff',
                    color: '#fff',
                    fontSize: 24,
                    borderRadius: 10,
                    padding: 10,
                    fontWeight: 'bold'
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }
              }
            }}
          />
          
          <Animated.View style={[styles.animatedLabel, styles.likeLabel, { opacity: likeOpacity }]}>
            <Text style={styles.animatedLabelText}>LIKE</Text>
          </Animated.View>
          
          <Animated.View style={[styles.animatedLabel, styles.nopeLabel, { opacity: nopeOpacity }]}>
            <Text style={styles.animatedLabelText}>NOPE</Text>
          </Animated.View>
          
          <Animated.View style={[styles.animatedLabel, styles.superLikeLabel, { opacity: superLikeOpacity }]}>
            <Text style={styles.animatedLabelText}>SUPER LIKE</Text>
          </Animated.View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.nopeButton]}
              onPress={() => swiperRef.current?.swipeLeft()}
            >
              <Ionicons name="close" size={30} color="#ff0000" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.superLikeButton]}
              onPress={() => swiperRef.current?.swipeTop()}
            >
              <Ionicons name="star" size={30} color="#00bfff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.likeButton]}
              onPress={() => swiperRef.current?.swipeRight()}
            >
              <Ionicons name="heart" size={30} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.matchesContainer}>
          <Text style={styles.matchesTitle}>Your Matches</Text>
          {matchedPartners.length > 0 ? (
            <View style={styles.matchesList}>
              {matchedPartners.map(renderMatchItem)}
            </View>
          ) : (
            <View style={styles.noMatchesContainer}>
              <Ionicons name="people" size={80} color="#e0e0e0" />
              <Text style={styles.noMatchesText}>No matches yet</Text>
              <Text style={styles.noMatchesSubtext}>Swipe right on potential training partners to match with them</Text>
              <TouchableOpacity 
                style={styles.startSwipingButton}
                onPress={() => setShowMatches(false)}
              >
                <Text style={styles.startSwipingButtonText}>Start Swiping</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeHeaderButton: {
    backgroundColor: '#e8f5e9',
  },
  matchBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff4081',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  locationText: {
    marginRight: 8,
    fontSize: 14,
    color: '#666',
  },
  swiperContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  card: {
    width: 320,
    height: 480,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  nearbyBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyBadgeText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 16,
    color: '#333',
  },
  goalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  goalTag: {
    backgroundColor: '#e0f2f1',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 4,
  },
  goalText: {
    color: '#00897b',
    fontSize: 12,
  },
  animatedLabel: {
    position: 'absolute',
    padding: 10,
    borderRadius: 10,
    zIndex: 100,
  },
  likeLabel: {
    backgroundColor: '#4CAF50',
    right: 20,
  },
  nopeLabel: {
    backgroundColor: '#ff0000',
    left: 20,
  },
  superLikeLabel: {
    backgroundColor: '#00bfff',
    top: 20,
  },
  animatedLabelText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nopeButton: {
    borderWidth: 2,
    borderColor: '#ff0000',
  },
  superLikeButton: {
    borderWidth: 2,
    borderColor: '#00bfff',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  matchesContainer: {
    flex: 1,
    padding: 16,
  },
  matchesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  matchesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  matchItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  matchAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  matchName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  noMatchesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noMatchesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noMatchesSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  startSwipingButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  startSwipingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
