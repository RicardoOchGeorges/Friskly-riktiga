import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Dimensions } from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getChatbotResponseStream, ChatMessage as ApiChatMessage } from '../../lib/openai-api';

const { width } = Dimensions.get('window');
const bubbleMaxWidth = width * 0.8;

// Define types for chat messages
interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function Coach() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', sender: 'bot', text: 'Hello! I\'m your Friskly AI Coach. How can I help you with your nutrition and fitness goals today?' },
  ]);

  // State to track when the AI is thinking
  const [isThinking, setIsThinking] = useState(false);

  // Convert chat history to the format expected by the OpenAI API
  const getApiChatHistory = (): ApiChatMessage[] => {
    return chatHistory
      .filter(msg => msg.id !== '1') // Skip the initial greeting
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
  };

  // Send message to OpenAI API with streaming response
  const sendMessage = async () => {
    if (message.trim() === '') return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
    };
    
    setChatHistory(prevChat => [...prevChat, userMessage]);
    setMessage('');
    
    // Create a placeholder message for the AI response that will be updated as tokens arrive
    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: ChatMessage = {
      id: aiMessageId,
      sender: 'bot',
      text: '',
    };
    
    setChatHistory(prevChat => [...prevChat, initialAiMessage]);
    
    try {
      // Get conversation history for context
      const apiChatHistory = getApiChatHistory();
      
      // Get streaming response from OpenAI
      await getChatbotResponseStream(
        message, 
        apiChatHistory,
        {
          // Update the message with each new token
          onToken: (token) => {
            setChatHistory(prevChat => {
              const updatedChat = [...prevChat];
              const aiMessageIndex = updatedChat.findIndex(msg => msg.id === aiMessageId);
              
              if (aiMessageIndex !== -1) {
                updatedChat[aiMessageIndex] = {
                  ...updatedChat[aiMessageIndex],
                  text: updatedChat[aiMessageIndex].text + token
                };
              }
              
              return updatedChat;
            });
          },
          // When complete, ensure we have the full message
          onComplete: (fullResponse) => {
            // This is optional since we've been building the response token by token
            setChatHistory(prevChat => {
              const updatedChat = [...prevChat];
              const aiMessageIndex = updatedChat.findIndex(msg => msg.id === aiMessageId);
              
              if (aiMessageIndex !== -1) {
                updatedChat[aiMessageIndex] = {
                  ...updatedChat[aiMessageIndex],
                  text: fullResponse
                };
              }
              
              return updatedChat;
            });
          },
          onError: (error) => {
            console.error('Error in streaming response:', error);
            setChatHistory(prevChat => {
              const updatedChat = [...prevChat];
              const aiMessageIndex = updatedChat.findIndex(msg => msg.id === aiMessageId);
              
              if (aiMessageIndex !== -1) {
                updatedChat[aiMessageIndex] = {
                  ...updatedChat[aiMessageIndex],
                  text: 'Sorry, I had trouble connecting. Please try again in a moment.'
                };
              }
              
              return updatedChat;
            });
          }
        }
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Update the placeholder message with an error
      setChatHistory(prevChat => {
        const updatedChat = [...prevChat];
        const aiMessageIndex = updatedChat.findIndex(msg => msg.id === aiMessageId);
        
        if (aiMessageIndex !== -1) {
          updatedChat[aiMessageIndex] = {
            ...updatedChat[aiMessageIndex],
            text: 'Sorry, I had trouble connecting. Please try again in a moment.'
          };
        }
        
        return updatedChat;
      });
    }
  };

  // Enhanced render for chat messages with avatar and timestamp
  const renderChatItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageRow, isUser ? styles.userMessageRow : {}]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/images/coach-avatar.jpg')} 
              style={styles.avatar}
            />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble
        ]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : {}]}>{item.text}</Text>
        </View>
      </View>
    );
  };
  
  // Quick suggestion prompts for the user
  const suggestionPrompts = [
    "Create a meal plan",
    "Track my calories",
    "Workout suggestions",
    "Nutrition advice"
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <LinearGradient
        colors={['#4CAF50', '#8BC34A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>AI Coach</Text>
          <Text style={styles.subtitle}>Your personal nutrition and fitness assistant</Text>
        </View>
      </LinearGradient>

      <View style={styles.mainContent}>
        <FlatList
          style={styles.chatList}
          data={chatHistory}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContent}
          ref={ref => {
            // Auto-scroll to the bottom when new messages arrive
            if (ref && chatHistory.length > 0) {
              ref.scrollToEnd({ animated: true });
            }
          }}
        />
        
        {/* Quick Suggestion Prompts */}
        {chatHistory.length <= 2 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>What would you like help with?</Text>
            <View style={styles.promptsContainer}>
              {suggestionPrompts.map((prompt, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.promptButton}
                  onPress={() => {
                    setMessage(prompt);
                    // Optional: Auto-send the prompt
                    // setMessage(prompt);
                    // setTimeout(() => sendMessage(), 100);
                  }}
                >
                  <Text style={styles.promptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Ask your AI coach a question..."
            multiline
            placeholderTextColor="#999"
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Core container styles
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 10,
    overflow: 'hidden',
  },
  
  // Header styles
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Chat list styles
  chatList: {
    flex: 1,
  },
  chatContent: {
    padding: 15,
    paddingBottom: 30,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 8,
    backgroundColor: '#EBF5EB',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  messageBubble: {
    maxWidth: bubbleMaxWidth,
    padding: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#E8F5E9',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  userMessageText: {
    color: '#1B5E20',
  },
  
  // Suggestion prompts styles
  suggestionsContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  promptsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  promptButton: {
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DCEDC8',
  },
  promptText: {
    color: '#33691E',
    fontSize: 14,
  },
  
  // Input styles
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 15,
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
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    alignSelf: 'flex-end',
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Thinking animation
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    position: 'absolute',
    bottom: 80,
    left: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  thinkingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
});
