import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const Index = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [turnDuration, setTurnDuration] = useState([3]);
  const [numberOfTurns, setNumberOfTurns] = useState([4]);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);

  // Famous AI personas to choose from
  const aiPersonas = [
    { id: "socrates", name: "Socrates", description: "Ancient Greek philosopher", avatar: "gpt", color: "blue" },
    { id: "einstein", name: "Einstein", description: "Theoretical physicist", avatar: "ai2", color: "purple" },
    { id: "trump", name: "Trump", description: "Former US President", avatar: "ai3", color: "green" },
    { id: "shakespeare", name: "Shakespeare", description: "English playwright", avatar: "gpt", color: "blue" },
    { id: "tesla", name: "Tesla", description: "Inventor and engineer", avatar: "ai2", color: "purple" },
    { id: "churchill", name: "Churchill", description: "British Prime Minister", avatar: "ai3", color: "green" },
    { id: "gandhi", name: "Gandhi", description: "Indian independence leader", avatar: "gpt", color: "blue" },
    { id: "jobs", name: "Steve Jobs", description: "Apple co-founder", avatar: "ai2", color: "purple" }
  ];

  const handlePersonaToggle = (personaId: string) => {
    setSelectedPersonas(prev => {
      if (prev.includes(personaId)) {
        // If already selected, remove it
        return prev.filter(id => id !== personaId);
      } else {
        // If not selected and we haven't reached the limit, add it
        if (prev.length < 3) {
          return [...prev, personaId];
        }
        // If we've reached the limit, don't add more
        return prev;
      }
    });
  };

  const handleJoinDebate = async () => {
    if (topic.trim() && selectedPersonas.length > 0) {
      // TODO: Replace with actual API call to create debate session
      const selectedPersonaData = selectedPersonas.map(id => 
        aiPersonas.find(persona => persona.id === id)
      ).filter(Boolean);

      console.log('Creating debate with settings:', {
        topic,
        turnDuration: turnDuration[0],
        numberOfTurns: numberOfTurns[0],
        selectedPersonas: selectedPersonaData
      });
      
      // For now, just navigate to debate room with state
      navigate("/debate", {
        state: {
          topic,
          turnDuration: turnDuration[0],
          numberOfTurns: numberOfTurns[0],
          selectedPersonas: selectedPersonaData
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
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

            {/* AI Personas Selection */}
            <div className="space-y-4">
              <Label className="text-white text-lg font-medium">
                Select AI Personas ({selectedPersonas.length}/3 selected)
              </Label>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {aiPersonas.map((persona) => {
                  const isSelected = selectedPersonas.includes(persona.id);
                  const isDisabled = !isSelected && selectedPersonas.length >= 3;
                  
                  return (
                    <div
                      key={persona.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                        isDisabled 
                          ? 'bg-gray-800/30 border-gray-700 opacity-50 cursor-not-allowed' 
                          : isSelected
                            ? 'bg-blue-600/20 border-blue-500 cursor-pointer'
                            : 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 cursor-pointer'
                      }`}
                      onClick={() => !isDisabled && handlePersonaToggle(persona.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        className="border-gray-400"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{persona.name}</div>
                        <div className="text-gray-400 text-sm">{persona.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedPersonas.length >= 3 && (
                <p className="text-yellow-400 text-sm">
                  Maximum 3 AI personas can be selected. Deselect one to choose another.
                </p>
              )}
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
            </div>

            {/* Join Button */}
            <Button 
              onClick={handleJoinDebate}
              disabled={!topic.trim() || selectedPersonas.length === 0}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Join Debate
              {selectedPersonas.length > 0 && (
                <span className="ml-2 text-sm">
                  with {selectedPersonas.length} AI{selectedPersonas.length > 1 ? 's' : ''}
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Create engaging debates with AI personalities
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
