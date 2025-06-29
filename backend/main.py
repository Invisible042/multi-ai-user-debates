import os, asyncio, uuid, json, subprocess
from datetime import datetime, timedelta
from typing import Dict

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from livekit_api import AccessToken, VideoGrant

# ----------------------------------------------------------------------------
# ENV ‑ set these in Replit "Secrets" or a local .env file
# ----------------------------------------------------------------------------
LIVEKIT_URL   = os.getenv("LIVEKIT_URL", "wss://your-livekit-host:443")
API_KEY       = os.getenv("LIVEKIT_API_KEY", "devkey")
API_SECRET    = os.getenv("LIVEKIT_API_SECRET", "secret")

# Registry of active rooms and their agent processes
rooms: Dict[str, dict] = {}
agent_processes: Dict[str, subprocess.Popen] = {}

# ----------------------------------------------------------------------------
# FastAPI boilerplate ‑ the front‑end fetches /join to receive URL + token
# ----------------------------------------------------------------------------
app = FastAPI(title="Bolt Multi‑AI Debate Demo")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def dev_token(room: str, identity: str) -> str:
    grant = VideoGrant(room=room)
    atk   = AccessToken(API_KEY, API_SECRET, identity=identity)
    atk.add_grant(grant)
    atk.ttl = int(timedelta(hours=2).total_seconds())
    return atk.to_jwt()


async def start_debate_agent(room: str, topic: str, personas: list[str]):
    """Start the debate agent process for a room"""
    try:
        # Set environment variables for the agent
        env = os.environ.copy()
        env["ROOM_METADATA"] = json.dumps({
            "topic": topic,
            "personas": personas,
            "room": room
        })
        
        # Start the agent process
        process = subprocess.Popen(
            ["python", "debate_agent.py"],
            env=env,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        
        agent_processes[room] = process
        print(f"Started debate agent for room {room} with PID {process.pid}")
        
    except Exception as e:
        print(f"Failed to start debate agent for room {room}: {e}")


@app.post("/join")
async def join(request: Request):
    try:
        data = await request.json()
        room = data.get("room", "main")
        user = data.get("user")
        topic = data.get("topic", "AI Debate")
        personas = data.get("personas", ["Moderator", "AI Socrates", "AI Optimist"])
        
        # Store room metadata and start agent if new room
        if room not in rooms:
            rooms[room] = {
                "topic": topic,
                "personas": personas,
                "created_at": datetime.utcnow().isoformat()
            }
            
            # Start the debate agent for this room
            await start_debate_agent(room, topic, personas)
        
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
    """Delete a room and stop its agent"""
    if room in rooms:
        # Stop the agent process
        if room in agent_processes:
            process = agent_processes[room]
            process.terminate()
            del agent_processes[room]
        
        # Remove room from registry
        del rooms[room]
        return {"message": f"Room {room} deleted"}
    else:
        raise HTTPException(status_code=404, detail="Room not found")


@app.get("/")
async def root():
    return {"status": "ok", "time": datetime.utcnow().isoformat()} 