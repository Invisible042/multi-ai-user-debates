#!/usr/bin/env python3
"""
Simple script to run the LiveKit debate agent
This can be called from the main FastAPI server when a room is created
"""

import os
import sys
import subprocess
from pathlib import Path

def run_debate_agent():
    """Run the debate agent with current environment variables"""
    try:
        # Get the directory of this script
        script_dir = Path(__file__).parent
        
        # Run the debate agent
        result = subprocess.run([
            sys.executable, "debate_agent.py"
        ], cwd=script_dir, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("Debate agent completed successfully")
            return True
        else:
            print(f"Debate agent failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"Error running debate agent: {e}")
        return False

if __name__ == "__main__":
    run_debate_agent() 