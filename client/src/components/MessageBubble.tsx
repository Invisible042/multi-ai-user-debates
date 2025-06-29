
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAI: boolean;
  avatar?: string;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const getSenderColor = () => {
    if (message.sender === "GPT-3") return "text-blue-400";
    if (message.sender === "AI-2") return "text-purple-400";
    if (message.sender === "alex_j") return "text-gray-400";
    return "text-green-400";
  };

  const getMessageBg = () => {
    if (message.isAI) return "bg-gray-700/50";
    return "bg-blue-600/20";
  };

  return (
    <div className={cn(
      "p-4 rounded-lg",
      getMessageBg()
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn("font-semibold", getSenderColor())}>
          {message.sender}
        </span>
        <span className="text-gray-400 text-sm">{message.timestamp}</span>
      </div>
      <p className="text-white leading-relaxed">{message.content}</p>
    </div>
  );
};
