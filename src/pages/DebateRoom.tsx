
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Users, Timer } from "lucide-react";
import { AIAvatar } from "@/components/AIAvatar";
import { MessageBubble } from "@/components/MessageBubble";
import { DebateTimer } from "@/components/DebateTimer";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAI: boolean;
  avatar?: string;
}

const DebateRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const debateConfig = location.state;

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState("GPT-4");
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [currentTurn, setCurrentTurn] = useState(1);
  const [isConnected, setIsConnected] = useState(false);

  // AI participants configuration
  const aiParticipants = [
    { name: "GPT-4", avatar: "gpt", color: "blue" },
    { name: "Claude", avatar: "ai2", color: "purple" },
    { name: "Gemini", avatar: "ai3", color: "green" },
    { name: "You", avatar: "user", color: "cyan" }
  ];

  useEffect(() => {
    if (!debateConfig) {
      navigate("/");
      return;
    }

    // TODO: Initialize WebSocket connection to backend
    initializeDebateSession();
    
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      sender: "System",
      content: `Welcome to the debate on "${debateConfig.topic}". The debate will begin shortly.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: true,
      avatar: "system"
    };
    setMessages([welcomeMessage]);
  }, [debateConfig, navigate]);

  const initializeDebateSession = async () => {
    try {
      // TODO: Replace with actual API call to initialize debate session
      console.log('Initializing debate session with:', debateConfig);
      
      // TODO: Establish WebSocket connection
      // const ws = new WebSocket('ws://your-backend-url/debate');
      // ws.onmessage = handleIncomingMessage;
      // ws.onopen = () => setIsConnected(true);
      
      setIsConnected(true);
      toast({
        title: "Connected to Debate",
        description: "You are now connected to the debate room."
      });
    } catch (error) {
      console.error('Failed to initialize debate session:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to the debate room.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: false
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentInput("");

    // TODO: Send message to backend via WebSocket
    try {
      console.log('Sending message to backend:', newMessage);
      // ws.send(JSON.stringify(newMessage));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!debateConfig) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Mobile-First Layout */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-gray-700/50 p-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          
          <div className="flex-1 text-center px-4">
            <h1 className="text-lg sm:text-xl font-bold text-blue-300 truncate">
              {debateConfig.topic}
            </h1>
            <div className="flex items-center justify-center mt-1 text-sm text-gray-400">
              <Users className="w-3 h-3 mr-1" />
              <span>{debateConfig.debaters} debaters</span>
              <span className="mx-2">•</span>
              <Timer className="w-3 h-3 mr-1" />
              <span>{debateConfig.turnDuration}min turns</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-400 hidden sm:inline">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Main Content - Desktop Layout */}
        <div className="flex-1 hidden lg:flex">
          {/* Left Sidebar - Participants */}
          <div className="w-64 p-4 space-y-4 bg-gray-800/30">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Participants
                </h3>
                <div className="space-y-3">
                  {aiParticipants.slice(0, debateConfig.debaters).map((participant) => (
                    <AIAvatar
                      key={participant.name}
                      name={participant.name}
                      avatar={participant.avatar}
                      color={participant.color}
                      isActive={currentSpeaker === participant.name}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Chat Area */}
          <div className="flex-1 flex flex-col p-4">
            <Card className="flex-1 bg-gray-800/50 backdrop-blur-sm border-gray-700 flex flex-col">
              <CardContent className="flex-1 flex flex-col p-4">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="Enter your argument..."
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 flex-1"
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!currentInput.trim() || !isConnected}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Timer & Stats */}
          <div className="w-64 p-4 space-y-4">
            <DebateTimer 
              timeLeft={timeLeft}
              currentSpeaker={currentSpeaker}
              totalTurns={debateConfig.numberOfTurns}
              currentTurn={currentTurn}
            />
            
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4">Live Poll</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">For</span>
                      <span className="text-blue-400">65%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[65%] transition-all duration-500"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Against</span>
                      <span className="text-purple-400">35%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[35%] transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex-1 flex flex-col lg:hidden">
          {/* Participants Bar - Mobile */}
          <div className="p-3 bg-gray-800/30 border-b border-gray-700">
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {aiParticipants.slice(0, debateConfig.debaters).map((participant) => (
                <div key={participant.name} className="flex-shrink-0">
                  <AIAvatar
                    name={participant.name}
                    avatar={participant.avatar}
                    color={participant.color}
                    isActive={currentSpeaker === participant.name}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area - Mobile */}
          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Enter your argument..."
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 flex-1"
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!currentInput.trim() || !isConnected}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
