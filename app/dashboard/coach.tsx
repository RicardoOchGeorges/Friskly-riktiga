import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getChatbotResponseStream, ChatMessage as ApiChatMessage } from '../../lib/openai-api';

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
        ref={ref => {
          // Auto-scroll to the bottom when new messages arrive
          if (ref && chatHistory.length > 0) {
            ref.scrollToEnd({ animated: true });
          }
        }}
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
