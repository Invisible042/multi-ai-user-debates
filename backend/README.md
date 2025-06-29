# Multi-AI Debate Backend

A FastAPI backend for the Multi-AI Debate system that integrates with the existing React frontend and LiveKit Agents.

## Features

- **Frontend Integration**: Works seamlessly with the existing React frontend
- **Persona Mapping**: Maps frontend persona IDs to backend AI personas
- **Configuration Passing**: Properly passes debate settings from frontend to agents
- **LiveKit Integration**: Generates tokens and manages room creation
- **Multiple AI Personas**: Supports 8 different AI personalities

## Architecture

- **`main.py`**: FastAPI server for room management and token generation
- **`debate_agent.py`**: LiveKit agent that handles the multi-agent debate logic
- **`run_agent.py`**: Utility script for running the debate agent
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

# Voice IDs for each persona (optional - will use defaults if not set)
VOICE_SOCRATES=a2b37e34-0712-44c4-a2c9-222222222222
VOICE_EINSTEIN=b3c48f45-1823-55d5-b3d0-333333333333
VOICE_TRUMP=c4d59g56-2934-66e6-c4e1-444444444444
VOICE_SHAKESPEARE=d5e60h67-3045-77f7-d5f2-555555555555
VOICE_TESLA=e6f71i78-4156-88g8-e6g3-666666666666
VOICE_CHURCHILL=f7g82j89-5267-99h9-f7h4-777777777777
VOICE_GANDHI=g8h93k90-6378-00i0-g8i5-888888888888
VOICE_JOBS=h9i04l01-7489-11j1-h9j6-999999999999
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Backend

#### Using the monorepo (Recommended)
```bash
# From the root directory
npm run dev:backend
```

#### Manual startup
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### POST /join
Join a debate room and get connection credentials. This will automatically start the debate agent.

**Request Body:**
```json
{
  "room": "debate-room-1",
  "user": "participant-name",
  "topic": "The Future of AI in Education",
  "personas": ["socrates", "einstein", "trump"],
  "turnDuration": 3,
  "numberOfTurns": 4
}
```

**Response:**
```json
{
  "url": "wss://your-livekit-host:443",
  "token": "livekit_token_here"
}
```

### GET /rooms
List all active rooms and their details.

### DELETE /rooms/{room}
Delete a room.

### GET /
Health check endpoint.

## Available Personas

The backend supports 8 AI personas that map to the frontend selections:

| Frontend ID | Backend Name | Description |
|-------------|--------------|-------------|
| `socrates` | AI Socrates | Ancient Greek philosopher using Socratic method |
| `einstein` | AI Einstein | Theoretical physicist with scientific precision |
| `trump` | AI Trump | Former US President with direct, confident style |
| `shakespeare` | AI Shakespeare | English playwright with eloquent language |
| `tesla` | AI Tesla | Inventor and engineer focused on innovation |
| `churchill` | AI Churchill | British Prime Minister with powerful rhetoric |
| `gandhi` | AI Gandhi | Indian independence leader emphasizing peace |
| `jobs` | AI Steve Jobs | Apple co-founder with visionary perspective |

## How It Works

1. **Frontend Request**: Client calls `/join` with topic, personas, and settings
2. **Persona Mapping**: Backend maps frontend IDs to backend persona names
3. **Room Creation**: Creates room entry and sets environment variables
4. **Agent Launch**: Starts `debate_agent.py` process asynchronously
5. **Token Generation**: Returns LiveKit connection credentials
6. **Debate Execution**: Agent creates AI personas and runs the debate

## Integration with Frontend

The backend is designed to work seamlessly with the existing React frontend:

- **Persona Selection**: Maps frontend persona IDs to backend names
- **Configuration**: Passes turn duration and number of turns to agents
- **Room Management**: Handles room creation and cleanup
- **Token Generation**: Provides LiveKit connection credentials

## Development

### File Structure
```
backend/
├── main.py              # FastAPI server
├── debate_agent.py      # LiveKit agent
├── run_agent.py         # Utility script
├── requirements.txt     # Dependencies
├── README.md           # This file
└── .env                # Environment variables
```

### Testing

1. Start the backend: `npm run dev:backend`
2. Use the API documentation at `http://localhost:8000/docs`
3. Test room creation and agent startup
4. Monitor the console for agent logs

## Troubleshooting

### Common Issues

1. **Agent not starting**: Check that all environment variables are set correctly
2. **Persona mapping errors**: Verify that frontend persona IDs match the mapping in `main.py`
3. **LiveKit connection issues**: Ensure your LiveKit server configuration is correct
4. **Voice issues**: Verify that the voice IDs in the `VOICES` dictionary are valid

### Debug Mode

The debate agent includes detailed logging. Check the console output for:
- Room connection status
- Agent creation progress
- Debate flow information
- Error messages 