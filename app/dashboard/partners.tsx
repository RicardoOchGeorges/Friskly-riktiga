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
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal
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

// Define message type
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'partner';
  timestamp: string;
};

// Mock data for chat messages
const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Hi! I saw we matched. Would you like to train together sometime?', sender: 'partner', timestamp: '10:30 AM' },
    { id: '2', text: 'Hey! Sure, I usually go to the gym around 6 PM on weekdays. Does that work for you?', sender: 'user', timestamp: '10:32 AM' },
    { id: '3', text: 'Perfect! I can do 6 PM on Wednesday and Friday this week.', sender: 'partner', timestamp: '10:35 AM' },
    { id: '4', text: 'Great! Let\'s meet at the entrance on Wednesday at 6 PM. I\'m focusing on upper body this week.', sender: 'user', timestamp: '10:37 AM' },
    { id: '5', text: 'Sounds good! I\'ll be there. Looking forward to it!', sender: 'partner', timestamp: '10:38 AM' },
  ],
  '2': [
    { id: '1', text: 'Hello! I see we have similar fitness goals. Would you be interested in a training session?', sender: 'partner', timestamp: '2:15 PM' },
    { id: '2', text: 'Hi there! Yes, I\'d love to. What\'s your usual routine?', sender: 'user', timestamp: '2:20 PM' },
  ],
  '3': [
    { id: '1', text: 'Hey! I noticed we matched. I\'m looking for a running partner. Do you run?', sender: 'partner', timestamp: '9:45 AM' },
  ],
  '4': [],
  '5': [],
};

export default function TrainingPartners() {
  const router = useRouter();
  const [partners, setPartners] = useState(MOCK_PARTNERS);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [matchedPartners, setMatchedPartners] = useState<typeof MOCK_PARTNERS>([]);
  const [showMatches, setShowMatches] = useState(false);
  const swiperRef = useRef<any>(null);
  
  // Chat state
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<typeof MOCK_PARTNERS[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
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
  
  const openChat = (partner: typeof MOCK_PARTNERS[0]) => {
    setSelectedPartner(partner);
    // Load mock messages based on partner ID
    if (partner.id && MOCK_MESSAGES[partner.id]) {
      setMessages(MOCK_MESSAGES[partner.id] || []);
    } else {
      setMessages([]);
    }
    setChatVisible(true);
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    
    // Simulate partner typing
    setIsTyping(true);
    
    // Simulate partner response after a delay
    setTimeout(() => {
      const responses = [
        "That sounds great! When would you like to meet up?",
        "I'm available this weekend for a training session. How about you?",
        "Perfect! I've been looking for someone to train with.",
        "I usually go to the gym in the evenings. Does that work for you?",
        "Great! I'm focusing on strength training this week. What about you?",
        "Awesome! Let's plan our first workout session.",
        "I'm excited to train together! What's your fitness goal?",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newPartnerMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'partner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, newPartnerMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const scheduleWorkout = () => {
    if (!selectedPartner) return;
    
    const workoutMessage: Message = {
      id: Date.now().toString(),
      text: "I'd like to schedule a workout with you. How about tomorrow at 6 PM?",
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, workoutMessage]);
    
    // Simulate partner typing
    setIsTyping(true);
    
    // Simulate partner response after a delay
    setTimeout(() => {
      const confirmationMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Tomorrow at 6 PM works perfectly for me! I'll meet you at the gym entrance. Looking forward to it! 💪",
        sender: 'partner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.partnerMessageContainer]}>
        {!isUser && selectedPartner && (
          <Image 
            source={{ uri: selectedPartner.avatar }} 
            style={styles.messageAvatar} 
          />
        )}
        <View style={[styles.messageBubble, isUser ? styles.userMessageBubble : styles.partnerMessageBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  const renderChatModal = () => {
    if (!selectedPartner) return null;
    
    return (
      <Modal
        visible={chatVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setChatVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setChatVisible(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Image source={{ uri: selectedPartner.avatar || '' }} style={styles.chatHeaderAvatar} />
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderName}>{selectedPartner.name}</Text>
              <Text style={styles.chatHeaderStatus}>Online</Text>
            </View>
            <TouchableOpacity style={styles.scheduleButton} onPress={scheduleWorkout}>
              <Ionicons name="calendar" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          
          {isTyping && (
            <View style={styles.typingContainer}>
              <Image source={{ uri: selectedPartner.avatar || '' }} style={styles.typingAvatar} />
              <View style={styles.typingBubble}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={24} color={inputText.trim() ? "#4CAF50" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const renderMatchItem = (item: typeof MOCK_PARTNERS[0], index: number) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.matchItem}
      onPress={() => openChat(item)}
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
      
      {renderChatModal()}
      
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
  // Chat styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 12,
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  scheduleButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  partnerMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 4,
  },
  partnerMessageBubble: {
    backgroundColor: '#E8E8E8',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#777',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: '#E8E8E8',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#777',
    marginRight: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
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
