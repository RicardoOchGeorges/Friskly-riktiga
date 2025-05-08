import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
// In a production app, you should store this in environment variables
const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Required for client-side usage
});

// Define the system message that sets the tone and expertise of the chatbot
const systemMessage = `
You are a friendly, supportive health and fitness coach in the Friskly app.
Your role is to provide expert advice on nutrition, fitness, and healthy lifestyle choices.
Always be encouraging, positive, and respectful in your responses.
Focus only on health and fitness topics, and avoid giving medical advice.
If asked about topics outside your expertise, gently redirect the conversation back to health and fitness.
Use a conversational, supportive tone that makes users feel comfortable and motivated.
Provide specific, actionable advice when possible.
`;

// Interface for chat messages
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Type for streaming response handler
export type StreamingResponseHandler = {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: any) => void;
};

// Function to get a streaming response from the chatbot
export async function getChatbotResponseStream(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  handler: StreamingResponseHandler
): Promise<void> {
  try {
    // Prepare the messages array with the system message and conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: systemMessage },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    // Use non-streaming API by default since streaming is causing errors
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const response = completion.choices[0]?.message?.content || 
      'Sorry, I couldn\'t generate a response. Please try again.';
    
    // Simulate streaming by breaking the response into chunks
    const simulateStreaming = (text: string) => {
      // Split the text into words and punctuation
      const chunks = text.match(/\S+\s*|[.,!?;:]\s*/g) || [];
      
      // Send chunks with small delays to simulate typing
      let i = 0;
      const sendChunk = () => {
        if (i < chunks.length) {
          handler.onToken(chunks[i]);
          i++;
          setTimeout(sendChunk, 30); // 30ms delay between chunks
        } else {
          // All chunks sent
          handler.onComplete(text);
        }
      };
      
      // Start sending chunks
      sendChunk();
    };
    
    // Start simulated streaming
    simulateStreaming(response);
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    handler.onError(error);
  }
}

// Function to get a response from the chatbot (non-streaming, for backward compatibility)
export async function getChatbotResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Prepare the messages array with the system message and conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: systemMessage },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7, // Controls randomness: lower is more deterministic
      max_tokens: 500, // Limit response length
    });

    // Extract and return the response
    return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response. Please try again.';
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    return 'Sorry, there was an error communicating with the AI assistant. Please try again later.';
  }
}

// Function to get nutritional advice for specific foods
export async function getFoodAdvice(foodItems: string[]): Promise<string> {
  if (!foodItems || foodItems.length === 0) {
    return 'I need to know what foods you\'re asking about to provide advice.';
  }

  const foodList = foodItems.join(', ');
  const prompt = `Provide brief, helpful nutritional advice about these foods: ${foodList}. 
  Include key nutrients, benefits, and how they fit into a balanced diet. Keep it concise and positive.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate nutritional advice. Please try again.';
  } catch (error) {
    console.error('Error getting food advice:', error);
    return 'Sorry, there was an error generating nutritional advice. Please try again later.';
  }
}

// Function to get a workout suggestion based on user preferences
export async function getWorkoutSuggestion(
  fitnessLevel: string,
  goals: string,
  timeAvailable: string,
  equipment: string
): Promise<string> {
  const prompt = `
    Create a personalized workout plan with the following parameters:
    - Fitness level: ${fitnessLevel}
    - Goals: ${goals}
    - Time available: ${timeAvailable}
    - Equipment available: ${equipment}
    
    Provide a structured, easy-to-follow workout with specific exercises, sets, and reps.
    Include warm-up and cool-down suggestions. Keep it motivating and positive.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a workout plan. Please try again.';
  } catch (error) {
    console.error('Error getting workout suggestion:', error);
    return 'Sorry, there was an error generating a workout plan. Please try again later.';
  }
}

// Function to get meal plan suggestions based on user preferences
export async function getMealPlanSuggestion(
  dietaryPreferences: string,
  calorieTarget: string,
  allergies: string = 'None',
  goals: string
): Promise<string> {
  const prompt = `
    Create a one-day meal plan with the following parameters:
    - Dietary preferences: ${dietaryPreferences}
    - Calorie target: ${calorieTarget}
    - Allergies/restrictions: ${allergies}
    - Nutrition goals: ${goals}
    
    Include breakfast, lunch, dinner, and 1-2 snacks. Provide approximate macros for each meal.
    Keep suggestions practical, tasty, and aligned with the user's goals.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a meal plan. Please try again.';
  } catch (error) {
    console.error('Error getting meal plan suggestion:', error);
    return 'Sorry, there was an error generating a meal plan. Please try again later.';
  }
}
