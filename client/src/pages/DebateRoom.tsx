import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Users, Timer } from "lucide-react";
import { AIAvatar } from "@/components/AIAvatar";
import { MessageBubble } from "@/components/MessageBubble";
import { useToast } from "@/hooks/use-toast";
import { connectToLiveKitRoom, publishMicrophoneAudio } from "@/lib/livekit";
import { Room } from "livekit-client";

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
  const [currentSpeaker, setCurrentSpeaker] = useState("GPT-3");
  const [timeLeft, setTimeLeft] = useState(161); // 02:41 as shown in image
  const [currentTurn, setCurrentTurn] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [nextArgumentTime, setNextArgumentTime] = useState(44); // 0:44 as shown
  const [room, setRoom] = useState<Room | null>(null);
  const [activeSpeakerIds, setActiveSpeakerIds] = useState<string[]>([]);
  const [isLiveKitConnected, setIsLiveKitConnected] = useState(false);

  // AI participants from the config
  const selectedParticipants = debateConfig?.selectedPersonas || [
    { name: "GPT-3", avatar: "gpt", color: "blue" },
    { name: "AI-2", avatar: "ai2", color: "purple" }
  ];

  useEffect(() => {
    if (!debateConfig) {
      navigate("/");
      return;
    }
    // Connect to LiveKit and publish audio on mount
    const connectLiveKit = async () => {
      try {
        if (debateConfig.livekit) {
          const livekitRoom = await connectToLiveKitRoom(debateConfig.livekit);
          setRoom(livekitRoom);
          await publishMicrophoneAudio(livekitRoom);
          setIsLiveKitConnected(true);
        }
      } catch (error) {
        console.error('Failed to connect to LiveKit:', error);
        toast({
          title: "Connection Failed",
          description: "Could not connect to the debate room.",
          variant: "destructive"
        });
      }
    };
    connectLiveKit();
    
    // Sample messages to match the image
    const sampleMessages: Message[] = [
      {
        id: "1",
        sender: "GPT-3",
        content: "Artificial intelligence has the potential to greatly benefit society by automating tasks and improving efficiency.",
        timestamp: "12:21",
        isAI: true,
        avatar: "gpt"
      },
      {
        id: "2",
        sender: "alex_j",
        content: "However, it also raises concerns about job displacement and privacy issues.",
        timestamp: "12:19",
        isAI: false
      },
      {
        id: "3",
        sender: "AI-2",
        content: "While that is true, AI can also create new job opportunities and drive innovation.",
        timestamp: "12:19",
        isAI: true,
        avatar: "ai2"
      },
      {
        id: "4",
        sender: "AI-13",
        content: "",
        timestamp: "12:18",
        isAI: true,
        avatar: "ai3"
      }
    ];
    setMessages(sampleMessages);
  }, [debateConfig, navigate]);

  // Listen for active speakers
  useEffect(() => {
    if (!room) return;
    const handleActiveSpeakersChanged = () => {
      setActiveSpeakerIds(room.activeSpeakers.map(p => p.identity));
    };
    room.on('activeSpeakersChanged', handleActiveSpeakersChanged);
    setActiveSpeakerIds(room.activeSpeakers.map(p => p.identity));
    return () => {
      room.off('activeSpeakersChanged', handleActiveSpeakersChanged);
    };
  }, [room]);

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "alex_j",
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!debateConfig || !isLiveKitConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-2xl">Connecting to debate room...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with topic */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          {debateConfig.topic || "The Impact of Artificial Intelligence on Society"}
        </h1>
      </div>

      {/* Participants Row */}
      <div className="flex justify-center items-center space-x-8 mb-8 px-4">
        {selectedParticipants.map((participant, index) => (
          <div key={participant.name} className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full border-4 ${
              participant.color === 'blue' ? 'border-blue-500' : 
              participant.color === 'purple' ? 'border-purple-500' : 
              'border-gray-500'
            } flex items-center justify-center mb-2`}>
              <AIAvatar
                name={participant.name}
                avatar={participant.avatar}
                color={participant.color}
                isActive={room && activeSpeakerIds.includes(participant.name)}
              />
            </div>
            <span className="text-white text-lg font-medium">{participant.name}</span>
          </div>
        ))}
        <div className="text-gray-500 text-2xl">...</div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center mb-2">
            <span className="text-white font-semibold">alex_j</span>
          </div>
          <span className="text-white text-lg font-medium">alex_j</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center mb-2">
            <span className="text-white font-semibold">alex_j</span>
          </div>
          <span className="text-white text-lg font-medium">alex_j</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 px-8 gap-8">
        {/* Left - Chat Messages */}
        <div className="flex-1">
          <div className="space-y-6 mb-8">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium text-lg ${
                    message.sender === 'GPT-3' ? 'text-white' :
                    message.sender === 'AI-2' ? 'text-purple-400' :
                    'text-blue-400'
                  }`}>
                    {message.sender}
                  </span>
                  <span className="text-gray-400">{message.timestamp}</span>
                </div>
                {message.content && (
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {message.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Timer and Stats */}
        <div className="w-64 space-y-6">
          {/* Timer */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Timer className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-gray-400">Timer</span>
              </div>
              <div className="text-6xl font-bold text-white mb-4">
                {formatTime(timeLeft)}
              </div>
            </CardContent>
          </Card>

          {/* Current Turn */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 mb-2">Turns</div>
              <div className="text-2xl font-bold text-white">{currentSpeaker}</div>
            </CardContent>
          </Card>

          {/* Poll */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 mb-4">Poll</div>
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-4 h-12 bg-gray-600 rounded"></div>
                  <div className="w-4 h-16 bg-gray-500 rounded"></div>
                  <div className="w-4 h-20 bg-gray-400 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">Next argument</span>
          <span className="text-gray-400">{formatTime(nextArgumentTime)}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
        </div>
      </div>

      {/* Back Button - Fixed Position */}
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 text-white hover:bg-gray-700/50 p-2"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    </div>
  );
};

export default DebateRoom;
