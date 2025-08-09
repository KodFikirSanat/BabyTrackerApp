// src/screens/AIScreen.tsx

/**
 * @file AIScreen.tsx
 * @description This screen provides an interface for interacting with an AI model.
 *              It allows the user to ask questions and receive AI-generated advice
 *              related to baby care. The interaction history is displayed in a
 *              chat-like format.
 *
 * @format
 */

import React, {useState, useRef} from 'react';
import {
  View, Text, TextInput, StyleSheet,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import SendIcon from '../assets/icons/send.svg';

/**
 * @interface Message
 * @description Defines the structure for a single message in the chat history.
 */
interface Message {
  role: 'user' | 'model'; // 'user' for user's question, 'model' for AI's response.
  text: string;
}

/**
 * @name AIScreen
 * @description The main component for the AI interaction screen.
 * @returns {React.JSX.Element} A React Element representing the AI chat screen.
 */
const AIScreen = (): React.JSX.Element => {
  console.log('🤖✅ AIScreen: Component has mounted.');

  // --- State ---
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Refs ---
  // A ref to the ScrollView to programmatically scroll to the bottom.
  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * @function handleSend
   * @description Handles the action of sending a user's question to the AI model.
   *              It updates the chat history and simulates an AI response.
   */
  const handleSend = async () => {
    if (!inputValue.trim()) return; // Do not send empty messages.

    const userMessage: Message = { role: 'user', text: inputValue };
    console.log(`🤖➡️ AIScreen.handleSend: User sent message.`);

    // Update chat history with the user's new message.
    setChatHistory(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    // --- AI Interaction Simulation ---
    // In a real application, you would make an API call to your AI backend here.
    // For now, we simulate a delay and a canned response.
    setTimeout(() => {
      const modelResponse: Message = {
        role: 'model',
        text: `"${userMessage.text}" ile ilgili olarak, bebeğinizin gelişimi için şu an en iyi yaklaşım... (Bu bir simülasyon yanıtıdır.)`,
      };
      console.log(`🤖✅ AIScreen.handleSend: Model responded successfully.`);
      
      setChatHistory(prev => [...prev, modelResponse]);
      setLoading(false);

      // Automatically scroll to the bottom to show the new message.
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
  };

  return (
    // KeyboardAvoidingView adjusts the screen layout when the keyboard appears.
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* Scrollable area for displaying the chat history */}
      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {chatHistory.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userMessage : styles.modelMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator style={{margin: 10}} />}
      </ScrollView>
      
      {/* Input area for the user's question */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Sorunuzu buraya yazın..."
          editable={!loading} // Disable input while AI is "thinking".
        />
        <TouchableOpacity 
          style={[styles.sendButton, loading && styles.sendButtonDisabled]} 
          onPress={handleSend} 
          disabled={loading}
          accessibilityLabel="Send message"
        >
          <SendIcon width={20} height={20} stroke="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#6b9ac4',
    alignSelf: 'flex-end',
  },
  modelMessage: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6b9ac4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default AIScreen;
