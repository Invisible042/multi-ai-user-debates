
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Timer, Users, ArrowLeft } from "lucide-react";
import { AIAvatar } from "@/components/AIAvatar";
import { MessageBubble } from "@/components/MessageBubble";
import { DebateTimer } from "@/components/DebateTimer";

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
  const debateConfig = location.state;

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState("GPT-3");
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds

  useEffect(() => {
    if (!debateConfig) {
      navigate("/");
      return;
    }

    // Initialize with a sample message
    const initialMessage: Message = {
      id: "1",
      sender: "GPT-3",
      content: "Artificial intelligence has the potential to greatly benefit society by automating tasks and improving efficiency.",
      timestamp: "12:21",
      isAI: true,
      avatar: "gpt"
    };
    setMessages([initialMessage]);
  }, [debateConfig, navigate]);

  const aiParticipants = [
    { name: "GPT-3", avatar: "gpt", color: "blue" },
    { name: "AI-2", avatar: "ai2", color: "purple" },
    { name: "alex_j", avatar: "human", color: "gray" },
    { name: "You", avatar: "user", color: "green" }
  ];

  const handleSendMessage = () => {
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
  };

  if (!debateConfig) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Header */}
        <div className="lg:col-span-4 flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-gray-800/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
          </Button>
          <h1 className="text-2xl font-bold text-center text-blue-300 flex-1">
            {debateConfig.topic}
          </h1>
        </div>

        {/* Left Sidebar - AI Participants */}
        <div className="space-y-4">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Participants
              </h3>
              <div className="space-y-3">
                {aiParticipants.map((participant) => (
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

        {/* Main Chat Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 h-[600px] flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
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
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Timer & Stats */}
        <div className="space-y-4">
          <DebateTimer 
            timeLeft={timeLeft}
            currentSpeaker={currentSpeaker}
            totalTurns={debateConfig.numberOfTurns}
            currentTurn={1}
          />
          
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4">Poll</h3>
              <div className="space-y-2">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4"></div>
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-1/2"></div>
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-1/4"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
