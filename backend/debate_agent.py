# debate_agent.py
# Compatible with livekit-agents >= 1.0.x

import os, json, asyncio
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import Agent, AgentSession, RoomInputOptions
from livekit.plugins import (
    openai,
    deepgram,
    cartesia,
    silero,
    noise_cancellation,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv()

# ----------------------------------------------------------------------------
# Environment Configuration
# ----------------------------------------------------------------------------
STT_MODEL = os.getenv("STT_MODEL", "nova-3")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
TTS_MODEL = os.getenv("TTS_MODEL", "sonic-2")

# OpenRouter configuration (optional)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
USE_OPENROUTER = os.getenv("USE_OPENROUTER", "false").lower() == "true"

# Distinct voice IDs for each persona
VOICES = {
    "Moderator":   os.getenv("VOICE_MODERATOR",   "ce8c8e4a-0e11-4d4e-a2c9-111111111111"),
    "AI Socrates": os.getenv("VOICE_SOCRATES",   "a2b37e34-0712-44c4-a2c9-222222222222"),
    "AI Optimist": os.getenv("VOICE_OPTIMIST",   "d9e46f70-abc1-475a-9adc-333333333333"),
}

# Debate pacing
TURN_DURATION_SEC = int(os.getenv("TURN_DURATION_SEC", 20))
TOTAL_ROUNDS = int(os.getenv("TOTAL_ROUNDS", 4))

# Personas and their system prompts
PERSONAS = {
    "Moderator": "You are the neutral moderator of this debate. Introduce the topic, enforce respectful turn‑taking, and keep remarks concise and impartial.",
    "AI Socrates": "You are Socrates. Always question assumptions using the Socratic method, drawing analogies from ancient Greece.",
    "AI Optimist": "You are a techno‑optimist who passionately highlights the benefits and positive potential of AI in society.",
}

# ----------------------------------------------------------------------------
# Agent Classes
# ----------------------------------------------------------------------------

class PersonaAgent(Agent):
    def __init__(self, name: str, prompt: str):
        super().__init__(instructions=prompt)
        self.name = name

# ----------------------------------------------------------------------------
# Entrypoint Function
# ----------------------------------------------------------------------------

async def entrypoint(ctx: agents.JobContext):
    # 1️⃣ Metadata injected by the FastAPI backend
    meta = json.loads(os.getenv("ROOM_METADATA", "{}"))
    topic = meta.get("topic", "AI Debate")
    personas = meta.get("personas", ["Moderator", "AI Socrates", "AI Optimist"])
    room_name = meta.get("room", ctx.room)
    
    print(f"Starting debate in room: {room_name}")
    print(f"Topic: {topic}")
    print(f"Personas: {personas}")
    
    # 2️⃣ Configure LLM plugin
    if USE_OPENROUTER and OPENROUTER_API_KEY:
        llm_plugin = openai.LLM(
            model="mistralai/mistral-small-3.2-24b-instruct:free",
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY
        )
        print("Using OpenRouter LLM")
    else:
        llm_plugin = openai.LLM(model=LLM_MODEL)
        print(f"Using OpenAI LLM: {LLM_MODEL}")

    # 3️⃣ Create sessions for each persona (up to 3 agents)
    sessions = []
    for name in personas[:3]:  # Limit to 3 agents
        prompt = PERSONAS.get(name, f"You are {name}, an AI debater.")
        
        # If moderator, inject topic into prompt
        if name == "Moderator":
            prompt = f"You are the neutral moderator of this debate. The topic is: '{topic}'. Introduce the topic, enforce respectful turn‑taking, and keep remarks concise and impartial."
        
        print(f"Creating session for {name}")
        session = AgentSession(
            stt=deepgram.STT(model=STT_MODEL, language="multi"),
            llm=llm_plugin,
            tts=cartesia.TTS(model=TTS_MODEL, voice=VOICES.get(name)),
            vad=silero.VAD.load(),
            turn_detection=MultilingualModel(),
        )
        
        agent = PersonaAgent(name=name, prompt=prompt)
        await session.start(
            room=room_name,
            agent=agent,
            room_input_options=RoomInputOptions(
                noise_cancellation=noise_cancellation.BVC()
            ),
        )
        sessions.append(session)
        print(f"Session created for {name}")

    # 4️⃣ Media connected – let each AI introduce themselves
    print("Connecting to room...")
    await ctx.connect()
    print("Connected! Starting introductions...")
    
    intro_tasks = [
        s.generate_reply(instructions=f"Introduce yourself as {s.agent.name} and greet the audience in one sentence.")
        for s in sessions
    ]
    await asyncio.gather(*intro_tasks)
    print("Introductions complete!")

    # 5️⃣ Round‑robin debate
    print(f"Starting debate with {TOTAL_ROUNDS} rounds...")
    turn_index = 0
    round_counter = 0
    
    while round_counter < TOTAL_ROUNDS:
        speaker = sessions[turn_index]
        print(f"Round {round_counter + 1}, Turn {turn_index + 1}: {speaker.agent.name}")
        await speaker.generate_reply()
        await asyncio.sleep(TURN_DURATION_SEC)
        turn_index = (turn_index + 1) % len(sessions)
        if turn_index == 0:
            round_counter += 1

    # 6️⃣ Graceful shutdown
    print("Debate complete! Shutting down...")
    for s in sessions:
        await s.close()
    print("All sessions closed.")

# ----------------------------------------------------------------------------
# Main execution
# ----------------------------------------------------------------------------

if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=entrypoint)
    ) 