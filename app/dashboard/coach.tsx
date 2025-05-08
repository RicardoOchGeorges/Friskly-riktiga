import { useState } from 'react';

// Define types for chat messages
interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Coach() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', sender: 'bot', text: 'Hello! I\'m your Friskly AI Coach. How can I help you with your nutrition and fitness goals today?' },
  ]);

  // Mock function to simulate AI response
  const sendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
    };
    
    setChatHistory(prevChat => [...prevChat, userMessage]);
    setMessage('');
    
    // Simulate AI thinking and response
    setTimeout(() => {
      // Mock responses based on keywords
      let botResponse = '';
      const lowerCaseMessage = message.toLowerCase();
      
      if (lowerCaseMessage.includes('protein')) {
        botResponse = 'Based on your current goals and activity level, I recommend consuming 1.6-2.0g of protein per kg of body weight daily. Focus on lean sources like chicken, fish, tofu, and legumes.';
      } else if (lowerCaseMessage.includes('weight loss') || lowerCaseMessage.includes('lose weight')) {
        botResponse = 'For sustainable weight loss, aim for a calorie deficit of 500 calories per day, which should result in about 0.5kg loss per week. Combine this with strength training to preserve muscle mass.';
      } else if (lowerCaseMessage.includes('workout') || lowerCaseMessage.includes('exercise')) {
        botResponse = 'For your goals, I recommend 3-4 days of strength training and 2-3 days of moderate cardio per week. Make sure to include at least one rest day for recovery.';
      } else if (lowerCaseMessage.includes('carb') || lowerCaseMessage.includes('carbohydrate')) {
        botResponse = 'Carbohydrates are your body\'s primary energy source. For your activity level, aim for 3-5g of carbs per kg of body weight, focusing on complex carbs like whole grains, fruits, and vegetables.';
      } else if (lowerCaseMessage.includes('fat')) {
        botResponse = 'Healthy fats are essential for hormone production and nutrient absorption. Aim for 0.5-1g per kg of body weight, focusing on sources like avocados, nuts, olive oil, and fatty fish.';
      } else {
        botResponse = 'Thanks for your question! Based on your current profile and goals, I recommend focusing on consistent meal timing, adequate protein intake, and progressive overload in your workouts. Is there a specific aspect of your nutrition or fitness plan you\'d like me to elaborate on?';
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
      };
      
      setChatHistory(prevChat => [...prevChat, aiMessage]);
    }, 1000);
  };

  const renderChatItem = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userBubble : styles.botBubble
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.title}>AI Coach</Text>
      </View>

      <FlatList
        style={styles.chatList}
        data={chatHistory}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask your AI coach a question..."
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={message.trim() === ''}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={message.trim() === '' ? '#ccc' : '#4CAF50'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  chatList: {
    flex: 1,
  },
  chatContent: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    alignSelf: 'flex-end',
    marginLeft: 10,
    padding: 10,
  },
});
