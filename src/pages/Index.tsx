
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [turnDuration, setTurnDuration] = useState([3]);
  const [numberOfTurns, setNumberOfTurns] = useState([4]);
  const [debaters, setDebaters] = useState("4");

  const handleJoinDebate = async () => {
    if (topic.trim()) {
      // TODO: Replace with actual API call to create debate session
      console.log('Creating debate with settings:', {
        topic,
        turnDuration: turnDuration[0],
        numberOfTurns: numberOfTurns[0],
        debaters: parseInt(debaters)
      });
      
      // For now, just navigate to debate room with state
      navigate("/debate", {
        state: {
          topic,
          turnDuration: turnDuration[0],
          numberOfTurns: numberOfTurns[0],
          debaters: parseInt(debaters)
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">AI Debate Arena</h1>
          <p className="text-gray-300 text-lg">Where minds meet and ideas clash</p>
        </div>

        {/* Main Settings Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white text-2xl">Create Debate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-white text-lg font-medium">
                Debate Topic
              </Label>
              <Input
                id="topic"
                placeholder="Enter your debate topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 h-12 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Settings Section */}
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold">Debate Settings</h3>
              
              {/* Turn Duration */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-medium">Turn Duration</Label>
                  <span className="text-blue-400 font-semibold">{turnDuration[0]} min</span>
                </div>
                <Slider
                  value={turnDuration}
                  onValueChange={setTurnDuration}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>1 min</span>
                  <span>10 min</span>
                </div>
              </div>

              {/* Number of Turns */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-white font-medium">Number of Turns</Label>
                  <span className="text-blue-400 font-semibold">{numberOfTurns[0]}</span>
                </div>
                <Slider
                  value={numberOfTurns}
                  onValueChange={setNumberOfTurns}
                  max={10}
                  min={2}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>2 turns</span>
                  <span>10 turns</span>
                </div>
              </div>

              {/* Number of Debaters */}
              <div className="space-y-3">
                <Label className="text-white font-medium">AI Debaters</Label>
                <Select value={debaters} onValueChange={setDebaters}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white h-12">
                    <SelectValue placeholder="Select number of AI debaters" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="2" className="text-white hover:bg-gray-700">2 AI Debaters</SelectItem>
                    <SelectItem value="3" className="text-white hover:bg-gray-700">3 AI Debaters</SelectItem>
                    <SelectItem value="4" className="text-white hover:bg-gray-700">4 AI Debaters</SelectItem>
                    <SelectItem value="5" className="text-white hover:bg-gray-700">5 AI Debaters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Join Button */}
            <Button 
              onClick={handleJoinDebate}
              disabled={!topic.trim()}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Join Debate
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Create engaging debates with AI participants
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
