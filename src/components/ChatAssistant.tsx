import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Trash2, Sparkles, MessageCircle } from 'lucide-react';
import { geminiService } from '@/lib/gemini';
import { storage, type ChatMessage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load chat history
    const history = storage.getChats();
    setChatHistory(history);
    
    // Convert chat history to messages format
    const convertedMessages: Message[] = [];
    history.forEach((chat, index) => {
      convertedMessages.push({
        id: `user-${index}`,
        content: chat.message,
        role: 'user',
        timestamp: new Date(chat.timestamp)
      });
      convertedMessages.push({
        id: `assistant-${index}`,
        content: chat.response,
        role: 'assistant',
        timestamp: new Date(chat.timestamp)
      });
    });
    setMessages(convertedMessages);

    // Add welcome message if no history
    if (history.length === 0) {
      setMessages([{
        id: 'welcome',
        content: "Hello! I'm your AI business assistant for Karigar.AI. I can help you with:\n\n• Product optimization tips\n• Pricing strategies\n• Marketing advice\n• Platform recommendations\n• Customer service guidance\n\nWhat would you like to discuss about your artisan business today?",
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get context for AI
      const products = storage.getProducts();
      const previousMessages = messages.slice(-6).map(m => `${m.role}: ${m.content}`);
      
      const response = await geminiService.chatAssistant(
        userMessage.content,
        { products, previousMessages }
      );

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save to storage
      storage.saveChatMessage(userMessage.content, response);
      setChatHistory(storage.getChats());

      toast({
        title: "Response received",
        description: "AI assistant has provided helpful advice",
      });
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: error instanceof Error ? error.message : "Sorry, I'm having trouble responding right now. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Response failed",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    storage.clearChats();
    setMessages([{
      id: 'welcome-new',
      content: "Chat cleared! How can I help you with your artisan business today?",
      role: 'assistant',
      timestamp: new Date()
    }]);
    setChatHistory([]);
    toast({
      title: "Chat cleared",
      description: "Conversation history has been cleared",
    });
  };

  const suggestedQuestions = [
    "How can I price my handmade products competitively?",
    "What are the best platforms to sell artisan crafts?",
    "How do I write better product descriptions?",
    "Tips for taking better product photos?",
    "How to handle customer complaints professionally?",
    "Marketing strategies for local artisans?"
  ];

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI Business Assistant</h2>
          <p className="text-muted-foreground">Get personalized advice for your artisan business</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {chatHistory.length} conversations
          </Badge>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <Card className="artisan-card lg:col-span-3">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-primary" />
              Chat with Karigar AI Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gradient-primary'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      {/* Message Content */}
                      <div className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}>
                        <div className="text-sm">
                          {formatMessage(message.content)}
                        </div>
                        <div className={`text-xs mt-1 opacity-70 ${
                          message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="border-t border-border/50 p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your artisan business..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Questions */}
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              Quick Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full text-left h-auto p-2 justify-start text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setInputMessage(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chat Statistics */}
      {chatHistory.length > 0 && (
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle className="text-lg">Conversation Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{chatHistory.length}</div>
                <div className="text-sm text-muted-foreground">Total Conversations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {chatHistory.length > 0 ? Math.round(chatHistory.reduce((acc, chat) => acc + chat.response.length, 0) / chatHistory.length) : 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg Response Length</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {chatHistory.length > 0 ? new Date(chatHistory[chatHistory.length - 1].timestamp).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Last Chat</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};