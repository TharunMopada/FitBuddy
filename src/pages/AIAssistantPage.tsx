import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Navbar from '../components/Navbar';
import { 
  Bot, 
  Send, 
  User,
  Lightbulb,
  Dumbbell,
  Apple,
  Target,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { workouts, goals } = useData();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${user?.name}! I'm your AI fitness assistant. I can help you with workout suggestions, nutrition advice, and goal tracking. What would you like to know?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { icon: Dumbbell, text: "Suggest a workout for today", category: "workout" },
    { icon: Apple, text: "What should I eat for lunch?", category: "nutrition" },
    { icon: Target, text: "Help me adjust my goals", category: "goals" },
    { icon: Lightbulb, text: "Give me motivation tips", category: "motivation" }
  ];

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Workout suggestions
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
      const lastWorkout = workouts[workouts.length - 1];
      const suggestions = [
        "Based on your recent activity, I'd recommend a full-body strength training session focusing on compound movements like squats, deadlifts, and bench press.",
        "How about trying a 30-minute HIIT workout? It's great for burning calories and improving cardiovascular health.",
        "Since you've been consistent with your training, consider a recovery-focused yoga session today to help with flexibility and muscle recovery.",
        "A good upper body workout with push-ups, pull-ups, and shoulder presses would complement your recent lower body sessions well."
      ];
      
      let response = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      if (lastWorkout) {
        response += ` I noticed your last workout was ${lastWorkout.name} on ${lastWorkout.date}. `;
        if (lastWorkout.category === 'Cardio') {
          response += "Maybe it's time for some strength training to balance your routine?";
        } else if (lastWorkout.category === 'Strength') {
          response += "Consider adding some cardio or mobility work for recovery.";
        }
      }
      
      return response;
    }
    
    // Nutrition advice
    if (lowerMessage.includes('eat') || lowerMessage.includes('food') || lowerMessage.includes('nutrition') || lowerMessage.includes('meal')) {
      const nutritionAdvice = [
        "For lunch, I'd suggest a balanced meal with lean protein (chicken, fish, or tofu), complex carbs (quinoa, brown rice), and plenty of vegetables. Don't forget healthy fats like avocado or nuts!",
        "Post-workout nutrition is crucial! Try a protein-rich meal within 30 minutes of exercising. A protein smoothie with banana and berries is perfect.",
        "Stay hydrated! Aim for at least 8 glasses of water daily, more if you're actively training. Add lemon or cucumber for variety.",
        "For sustainable energy, focus on whole foods: oats for breakfast, lean proteins, colorful vegetables, and moderate amounts of healthy fats."
      ];
      
      let response = nutritionAdvice[Math.floor(Math.random() * nutritionAdvice.length)];
      
      if (user?.goal === 'lose_weight') {
        response += " Since your goal is weight loss, focus on creating a moderate calorie deficit while maintaining adequate protein intake.";
      } else if (user?.goal === 'build_muscle') {
        response += " For muscle building, ensure you're eating enough protein (0.8-1g per lb of body weight) and don't be afraid of healthy carbs post-workout.";
      }
      
      return response;
    }
    
    // Goal-related advice
    if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      const currentGoal = goals[0];
      if (currentGoal) {
        return `I see you're working towards ${currentGoal.type.replace('_', ' ')}. You're currently at ${currentGoal.current} with a target of ${currentGoal.target}. Keep up the great work! Consistency is key - small daily actions lead to big results over time.`;
      } else {
        return "Setting clear, specific goals is crucial for success! I'd recommend starting with SMART goals - Specific, Measurable, Achievable, Relevant, and Time-bound. What aspect of your fitness would you like to focus on first?";
      }
    }
    
    // Motivation
    if (lowerMessage.includes('motivat') || lowerMessage.includes('encourage') || lowerMessage.includes('help')) {
      const motivationalMessages = [
        "Remember, every expert was once a beginner. You're making progress with every workout, even when it doesn't feel like it!",
        "Consistency beats perfection every time. It's better to do a 20-minute workout regularly than a 2-hour workout once a week.",
        "Your body can stand almost anything. It's your mind you have to convince. You've got this!",
        "Progress isn't always visible on the scale. You're building strength, endurance, and healthy habits that will last a lifetime.",
        "The hardest part is showing up. Once you start, momentum will carry you forward. Celebrate every small victory!"
      ];
      return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    }
    
    // Default response
    const defaultResponses = [
      "That's an interesting question! I can help you with workout suggestions, nutrition advice, goal setting, and motivation. What specific area would you like to explore?",
      "I'm here to support your fitness journey! Whether you need workout ideas, nutrition tips, or just some encouragement, I'm ready to help.",
      "Great question! As your AI fitness assistant, I can provide personalized advice based on your goals and current progress. What would you like to focus on today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Fitness Assistant</h1>
          </div>
          <p className="text-gray-600">Get personalized workout suggestions, nutrition advice, and motivation</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`p-2 rounded-lg ${
                  message.isUser 
                    ? 'bg-blue-100' 
                    : 'bg-gradient-to-r from-purple-100 to-blue-100'
                }`}>
                  {message.isUser ? (
                    <User className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Bot className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-2 rounded-lg">
                  <Bot className="h-5 w-5 text-purple-600" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3">Quick suggestions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(prompt.text)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{prompt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about fitness, nutrition, or goals..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                  disabled={isTyping}
                />
                <Sparkles className="h-5 w-5 text-purple-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
              </div>
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Dumbbell className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Workout Suggestions</h3>
            <p className="text-sm text-gray-600">Get personalized exercise recommendations based on your goals and history.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Apple className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nutrition Advice</h3>
            <p className="text-sm text-gray-600">Receive meal suggestions and nutrition tips tailored to your fitness objectives.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Goal Guidance</h3>
            <p className="text-sm text-gray-600">Get help setting realistic goals and strategies to achieve them.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPage;