
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";

interface DebateTimerProps {
  timeLeft: number;
  currentSpeaker: string;
  totalTurns: number;
  currentTurn: number;
}

export const DebateTimer = ({ timeLeft, currentSpeaker, totalTurns, currentTurn }: DebateTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Timer className="w-4 h-4 mr-2 text-blue-400" />
          <span className="text-gray-300">Timer</span>
        </div>
        <div className="text-4xl font-bold text-white mb-4">
          {formatTime(timeLeft)}
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-gray-400 text-sm">Turns</p>
            <p className="text-white text-xl font-semibold">{currentSpeaker}</p>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 180) * 100}%` }}
            ></div>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm">Round</p>
            <p className="text-white text-lg">{currentTurn} / {totalTurns}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
