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
    "AI Socrates": os.getenv("VOICE_SOCRATES", "a2b37e34-0712-44c4-a2c9-222222222222"),
    "AI Einstein": os.getenv("VOICE_EINSTEIN", "b3c48f45-1823-55d5-b3d0-333333333333"),
    "AI Trump": os.getenv("VOICE_TRUMP", "c4d59g56-2934-66e6-c4e1-444444444444"),
    "AI Shakespeare": os.getenv("VOICE_SHAKESPEARE", "d5e60h67-3045-77f7-d5f2-555555555555"),
    "AI Tesla": os.getenv("VOICE_TESLA", "e6f71i78-4156-88g8-e6g3-666666666666"),
    "AI Churchill": os.getenv("VOICE_CHURCHILL", "f7g82j89-5267-99h9-f7h4-777777777777"),
    "AI Gandhi": os.getenv("VOICE_GANDHI", "g8h93k90-6378-00i0-g8i5-888888888888"),
    "AI Steve Jobs": os.getenv("VOICE_JOBS", "h9i04l01-7489-11j1-h9j6-999999999999"),
}

# Personas and their system prompts
PERSONAS = {
    "AI Socrates": "You are Socrates, the ancient Greek philosopher. Use the Socratic method to question assumptions and draw analogies from ancient Greece. Be wise, thoughtful, and always seek deeper understanding through questioning.",
    "AI Einstein": "You are Albert Einstein, the theoretical physicist. Speak with scientific precision, use analogies from physics and mathematics, and emphasize the importance of imagination and curiosity in discovery.",
    "AI Trump": "You are Donald Trump, former US President. Speak with confidence and directness, use simple language, make bold statements, and focus on practical solutions and American values.",
    "AI Shakespeare": "You are William Shakespeare, the English playwright. Use eloquent language, poetic expressions, and draw from your vast knowledge of human nature and dramatic storytelling.",
    "AI Tesla": "You are Nikola Tesla, the inventor and engineer. Focus on innovation, electricity, wireless technology, and the future of human progress through scientific advancement.",
    "AI Churchill": "You are Winston Churchill, the British Prime Minister. Speak with determination, use powerful rhetoric, emphasize courage and resilience, and draw from historical wisdom.",
    "AI Gandhi": "You are Mahatma Gandhi, the Indian independence leader. Emphasize peace, non-violence, truth, and the power of moral courage and spiritual strength.",
    "AI Steve Jobs": "You are Steve Jobs, Apple co-founder. Focus on innovation, design, user experience, and the intersection of technology and the humanities. Be visionary and inspiring.",
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
    personas = meta.get("personas", ["AI Socrates", "AI Einstein", "AI Trump"])
    room_name = meta.get("room", ctx.room)
    turn_duration_min = meta.get("turn_duration_min", 3)
    total_rounds = meta.get("total_rounds", 4)
    
    # Convert minutes to seconds
    turn_duration_sec = turn_duration_min * 60
    
    print(f"Starting debate in room: {room_name}")
    print(f"Topic: {topic}")
    print(f"Personas: {personas}")
    print(f"Turn duration: {turn_duration_min} minutes ({turn_duration_sec} seconds)")
    print(f"Total rounds: {total_rounds}")
    
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
        
        # Add topic context to each persona's prompt
        prompt = f"{prompt}\n\nYou are participating in a debate about: '{topic}'. Stay in character and provide thoughtful, engaging arguments from your unique perspective."
        
        print(f"Creating session for {name}")
        session = AgentSession(
            stt=deepgram.STT(model=STT_MODEL, language="multi"),
            llm=llm_plugin,
            tts=cartesia.TTS(model=TTS_MODEL, voice=VOICES.get(name)),
            vad=silero.VAD.load(),
            #turn_detection=MultilingualModel(),
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
        s.generate_reply(instructions=f"Introduce yourself as {s.agent.name} and briefly state your perspective on the debate topic: '{topic}'.")
        for s in sessions
    ]
    await asyncio.gather(*intro_tasks)
    print("Introductions complete!")

    # 5️⃣ Round‑robin debate
    print(f"Starting debate with {total_rounds} rounds...")
    turn_index = 0
    round_counter = 0
    
    while round_counter < total_rounds:
        speaker = sessions[turn_index]
        print(f"Round {round_counter + 1}, Turn {turn_index + 1}: {speaker.agent.name}")
        await speaker.generate_reply()
        await asyncio.sleep(turn_duration_sec)
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