#!/usr/bin/env python3
"""
Startup script for the Multi-AI Debate System
"""

import os
import sys
import asyncio
import subprocess
import signal
import time
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import livekit
        import uvicorn
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_env_file():
    """Check if .env file exists"""
    env_file = Path(".env")
    if env_file.exists():
        print("✅ .env file found")
        return True
    else:
        print("⚠️  No .env file found. Using default values.")
        print("Create a .env file with your configuration for production use.")
        return False

def start_fastapi_server():
    """Start the FastAPI server"""
    print("🚀 Starting FastAPI server...")
    try:
        # Start uvicorn server
        process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--reload"
        ])
        return process
    except Exception as e:
        print(f"❌ Failed to start FastAPI server: {e}")
        return None

def main():
    """Main startup function"""
    print("🎭 Multi-AI Debate System Startup")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check environment
    check_env_file()
    
    # Start FastAPI server
    server_process = start_fastapi_server()
    if not server_process:
        sys.exit(1)
    
    print("✅ FastAPI server started on http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔧 The debate agent will start automatically when you join a room")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        # Keep the server running
        server_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down...")
        server_process.terminate()
        server_process.wait()
        print("✅ Server stopped")

if __name__ == "__main__":
    main() 