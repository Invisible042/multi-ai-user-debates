import os, asyncio, uuid, json
from datetime import datetime, timedelta
from typing import Dict

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import jwt
import time

# ----------------------------------------------------------------------------
# ENV ‑ set these in Replit "Secrets" or a local .env file
# ----------------------------------------------------------------------------
LIVEKIT_URL   = os.getenv("LIVEKIT_URL", "wss://your-livekit-host:443")
API_KEY       = os.getenv("LIVEKIT_API_KEY", "devkey")
API_SECRET    = os.getenv("LIVEKIT_API_SECRET", "secret")

# Registry of active rooms
rooms: Dict[str, dict] = {}

# ----------------------------------------------------------------------------
# FastAPI boilerplate ‑ the front‑end fetches /join to receive URL + token
# ----------------------------------------------------------------------------
app = FastAPI(title="Multi-AI Debate Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def dev_token(room: str, identity: str) -> str:
    api_key = API_KEY
    api_secret = API_SECRET
    now = int(time.time())
    ttl = int(timedelta(hours=2).total_seconds())
    payload = {
        "iss": api_key,
        "sub": identity,
        "nbf": now,
        "exp": now + ttl,
        "video": {
            "room": room,
            "can_publish": True,
            "can_subscribe": True,
        }
    }
    token = jwt.encode(payload, api_secret, algorithm="HS256")
    return token


async def start_debate_agent_async(room: str, topic: str, personas: list[str], turn_duration: int, total_rounds: int):
    """Start the debate agent asynchronously"""
    try:
        # Set environment variables for the agent
        os.environ["ROOM_METADATA"] = json.dumps({
            "topic": topic,
            "personas": personas,
            "room": room,
            "turn_duration_min": turn_duration,
            "total_rounds": total_rounds
        })
        
        # Launch agent in background (non-blocking)
        import subprocess
        import sys
        from pathlib import Path
        
        script_dir = Path(__file__).parent
        subprocess.Popen([
            sys.executable, "debate_agent.py"
        ], cwd=script_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        print(f"Started debate agent for room {room}")
        
    except Exception as e:
        print(f"Failed to start debate agent for room {room}: {e}")


@app.post("/join")
async def join(request: Request):
    try:
        data = await request.json()
        room = data.get("room", "main")
        user = data.get("user")
        topic = data.get("topic", "AI Debate")
        personas = data.get("personas", [])  # ["socrates", "einstein", "trump"]
        turn_duration = data.get("turnDuration", 3)  # minutes
        number_of_turns = data.get("numberOfTurns", 4)
        
        # Map frontend persona IDs to backend persona names
        persona_mapping = {
            "socrates": "AI Socrates",
            "einstein": "AI Einstein", 
            "trump": "AI Trump",
            "shakespeare": "AI Shakespeare",
            "tesla": "AI Tesla",
            "churchill": "AI Churchill",
            "gandhi": "AI Gandhi",
            "jobs": "AI Steve Jobs"
        }
        
        mapped_personas = [persona_mapping.get(p, p) for p in personas]
        
        # Store room metadata for the agent to access
        if room not in rooms:
            rooms[room] = {
                "topic": topic,
                "personas": mapped_personas,
                "turn_duration_min": turn_duration,
                "total_rounds": number_of_turns,
                "created_at": datetime.utcnow().isoformat()
            }
            
            # Start the debate agent asynchronously
            asyncio.create_task(start_debate_agent_async(
                room, topic, mapped_personas, turn_duration, number_of_turns
            ))
        
        identity = user or f"human-{uuid.uuid4().hex[:6]}"
        return {"url": LIVEKIT_URL, "token": dev_token(room, identity)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to join room: {str(e)}")


@app.get("/rooms")
async def list_rooms():
    """List all active rooms"""
    return {
        "rooms": list(rooms.keys()),
        "room_details": rooms
    }


@app.delete("/rooms/{room}")
async def delete_room(room: str):
    """Delete a room"""
    if room in rooms:
        del rooms[room]
        return {"message": f"Room {room} deleted"}
    else:
        raise HTTPException(status_code=404, detail="Room not found")


@app.get("/")
async def root():
    return {"status": "ok", "time": datetime.utcnow().isoformat()} 