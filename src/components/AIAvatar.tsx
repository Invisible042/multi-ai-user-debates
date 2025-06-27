
import { cn } from "@/lib/utils";

interface AIAvatarProps {
  name: string;
  avatar: string;
  color: string;
  isActive?: boolean;
}

export const AIAvatar = ({ name, avatar, color, isActive = false }: AIAvatarProps) => {
  const getAvatarContent = () => {
    if (avatar === "gpt") {
      return (
        <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-400 rounded-full relative">
            <div className="absolute top-1 left-1 w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      );
    }
    
    if (avatar === "ai2") {
      return (
        <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center">
          <div className="w-6 h-6 bg-purple-400 rounded-full relative">
            <div className="absolute top-1 left-1 w-2 h-2 bg-purple-600 rounded-full"></div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full"></div>
          </div>
        </div>
      );
    }
    
    if (avatar === "human") {
      return (
        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
          <span className="text-white font-semibold">AJ</span>
        </div>
      );
    }
    
    return (
      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
        <span className="text-white font-semibold">U</span>
      </div>
    );
  };

  const getBorderColor = () => {
    switch (color) {
      case "blue": return "border-blue-500";
      case "purple": return "border-purple-500";
      case "gray": return "border-gray-500";
      case "green": return "border-green-500";
      default: return "border-gray-500";
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={cn(
        "relative rounded-full border-2 transition-all duration-300",
        getBorderColor(),
        isActive ? "shadow-lg shadow-current scale-110" : "opacity-70"
      )}>
        {getAvatarContent()}
        {isActive && (
          <div className={cn(
            "absolute inset-0 rounded-full border-2 animate-pulse",
            getBorderColor()
          )}></div>
        )}
      </div>
      <div>
        <p className={cn(
          "font-medium",
          isActive ? "text-white" : "text-gray-400"
        )}>
          {name}
        </p>
        {isActive && (
          <p className="text-xs text-blue-400">Speaking...</p>
        )}
      </div>
    </div>
  );
};
