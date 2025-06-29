import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import DebateRoom from "@/pages/DebateRoom";

function App() {
  return (
    <Router>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/debate" element={<DebateRoom />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </Router>
  );
}

export default App;
