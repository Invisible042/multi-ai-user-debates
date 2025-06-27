
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [turnDuration, setTurnDuration] = useState(3);
  const [numberOfTurns, setNumberOfTurns] = useState(4);
  const [debaters, setDebaters] = useState(4);

  const handleJoinDebate = () => {
    if (topic.trim()) {
      navigate("/debate", {
        state: {
          topic,
          turnDuration,
          numberOfTurns,
          debaters
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Debate Arena</h1>
          <p className="text-gray-300">Where minds meet and ideas clash</p>
        </div>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-white text-lg">Topic</Label>
              <Input
                id="topic"
                placeholder="Enter debate topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 h-12 text-lg"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-white text-xl font-semibold">Debate Options</h3>
              
              <div className="flex justify-between items-center">
                <Label className="text-white">Turn Duration</Label>
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 min-w-[120px] text-center">
                  <span className="text-white text-lg">{turnDuration} min</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Label className="text-white">Number of Turns</Label>
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 min-w-[120px] text-center">
                  <span className="text-white text-lg">{numberOfTurns}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Label className="text-white">Debaters</Label>
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 min-w-[120px] text-center">
                  <span className="text-white text-lg">{debaters}</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleJoinDebate}
              disabled={!topic.trim()}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Join Debate
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
