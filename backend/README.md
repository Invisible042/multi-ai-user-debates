# Multi-AI Debate System

A real-time debate system featuring up to 3 AI agents with distinct personalities, built with LiveKit Agents >= 1.0.x.

## Features

- **Multi-Agent Debates**: Up to 3 AI agents with different personas
- **Real-time Voice**: Speech-to-text, text-to-speech, and voice activity detection
- **OpenRouter Support**: Optional integration with OpenRouter for alternative LLM models
- **Configurable Personas**: Easy to customize agent personalities and debate topics
- **Round-robin Format**: Structured debate with timed turns
- **Automatic Agent Management**: Agents start automatically when rooms are created

## Architecture

- **`main.py`**: FastAPI server for room management, token generation, and agent process management
- **`debate_agent.py`**: LiveKit agent that handles the multi-agent debate logic
- **`start.py`**: Convenient startup script for the entire system
- **Environment-based configuration**: All settings configurable via environment variables

## Setup

### 1. Environment Variables

Create a `.env` file in the backend directory:

     ```env
# LiveKit Configuration
     LIVEKIT_URL=wss://your-livekit-host:443
     LIVEKIT_API_KEY=your_api_key
     LIVEKIT_API_SECRET=your_api_secret

# AI Models
STT_MODEL=nova-3                    # Deepgram model
LLM_MODEL=gpt-4o-mini              # OpenAI model
TTS_MODEL=sonic-2                  # Cartesia model

# OpenRouter (Optional)
OPENROUTER_API_KEY=your_openrouter_key
USE_OPENROUTER=false

# Voice IDs for each persona
VOICE_MODERATOR=ce8c8e4a-0e11-4d4e-a2c9-111111111111
VOICE_SOCRATES=a2b37e34-0712-44c4-a2c9-222222222222
VOICE_OPTIMIST=d9e46f70-abc1-475a-9adc-333333333333

# Debate Settings
TURN_DURATION_SEC=20
TOTAL_ROUNDS=4
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the System

#### Option A: Using the startup script (Recommended)
```bash
python start.py
```

#### Option B: Manual startup
   ```bash
# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The debate agents will start automatically when you join a room via the API.

## Usage

### API Endpoints

#### POST /join
Join a debate room and get connection credentials. This will automatically start the debate agent.

**Request Body:**
```json
{
  "room": "debate-room-1",
  "user": "participant-name",
  "topic": "The Future of AI in Education",
  "personas": ["Moderator", "AI Socrates", "AI Optimist"]
}
```

**Response:**
```json
{
  "url": "wss://your-livekit-host:443",
  "token": "livekit_token_here"
}
```

#### GET /rooms
List all active rooms and their details.

#### DELETE /rooms/{room}
Delete a room and stop its associated agent.

#### GET /
Health check endpoint.

### Available Personas

1. **Moderator**: Neutral facilitator who introduces topics and manages the debate
2. **AI Socrates**: Uses Socratic method to question assumptions and draw analogies
3. **AI Optimist**: Techno-optimist who highlights AI's positive potential

### OpenRouter Integration

To use OpenRouter instead of OpenAI:

1. Set `USE_OPENROUTER=true` in your `.env`
2. Add your OpenRouter API key
3. The system will automatically use the Mistral model via OpenRouter

## How It Works

1. **Room Creation**: When a client calls `/join`, the FastAPI server creates a new room entry
2. **Agent Launch**: The server automatically starts a `debate_agent.py` process for the room
3. **Metadata Injection**: Room metadata (topic, personas) is passed to the agent via environment variables
4. **Multi-Agent Setup**: The agent creates up to 3 AI personas with distinct voices and personalities
5. **Debate Flow**: Agents introduce themselves, then engage in a structured round-robin debate
6. **Automatic Cleanup**: When the debate ends, the agent process terminates automatically

## Customization

### Adding New Personas

1. Add the persona to the `PERSONAS` dictionary in `debate_agent.py`
2. Add a corresponding voice ID to the `VOICES` dictionary
3. Update your frontend to include the new persona in the selection

### Modifying Debate Format

Adjust the debate pacing by modifying:
- `TURN_DURATION_SEC`: How long each agent speaks
- `TOTAL_ROUNDS`: Number of complete rounds

### Changing AI Models

The system supports:
- OpenAI models (default)
- OpenRouter models (Mistral, Claude, etc.)
- Custom model configurations via the LLM plugin

## Troubleshooting

### Common Issues

1. **Agent not starting**: Check that all environment variables are set correctly
2. **Voice issues**: Verify that the voice IDs in the `VOICES` dictionary are valid
3. **LLM errors**: Ensure your API keys are correct and have sufficient credits
4. **Room connection issues**: Verify your LiveKit server configuration

### Debug Mode

The debate agent includes detailed logging. Check the console output for:
- Room connection status
- Agent creation progress
- Debate flow information
- Error messages

## Development

### File Structure
```
backend/
├── main.py              # FastAPI server
├── debate_agent.py      # LiveKit agent
├── start.py             # Startup script
├── requirements.txt     # Dependencies
├── README.md           # This file
└── .env                # Environment variables
```

### Testing

1. Start the server: `python start.py`
2. Use the API documentation at `http://localhost:8000/docs`
3. Test room creation and agent startup
4. Monitor the console for agent logs 