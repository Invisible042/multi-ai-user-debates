# Multi-AI Debate App - Bolt Hackathon

A real-time multi-AI debate application built with React, FastAPI, and LiveKit for the Bolt Hackathon.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Python >= 3.8
- LiveKit server credentials

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

   This will:
   - Install Node.js dependencies for the monorepo
   - Install frontend dependencies
   - Install Python dependencies (requires venv to be created first)

2. **Set up Python virtual environment:**
   ```bash
   npm run create:venv
   ```
   This creates a virtual environment in the `backend/venv/` folder.

3. **Set up environment variables:**

   **Backend (`backend/.env`):**
   ```env
   LIVEKIT_URL=wss://your-livekit-host:443
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   ```

   **Frontend (`client/.env`):**
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   ```

4. **Run the entire application:**
   ```bash
   npm run dev
   ```

   This will start both:
   - Backend: http://localhost:8000 (with virtual environment activated)
   - Frontend: http://localhost:5173 (or similar Vite port)

## 📁 Project Structure

```
multi-ai-user-debates/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Main pages (Index, DebateRoom)
│   │   ├── components/    # UI components
│   │   └── lib/          # Utilities (API, LiveKit)
│   └── package.json
├── backend/               # FastAPI backend
│   ├── main.py           # Main FastAPI app
│   ├── requirements.txt  # Python dependencies
│   ├── venv/             # Python virtual environment
│   └── .env             # Backend environment variables
├── package.json          # Monorepo root
└── README.md
```

## 🎯 Features

- **Dynamic AI Personas**: Select from multiple AI personalities for debates
- **Real-time Audio**: LiveKit-powered voice communication
- **Topic-based Debates**: Start debates on any topic
- **Active Speaker Detection**: Visual indicators for who's speaking

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies (Node.js + Python with venv) |
| `npm run create:venv` | Create Python virtual environment in backend/ |
| `npm run install:client` | Install only frontend dependencies |
| `npm run install:backend` | Install Python dependencies in backend/venv |
| `npm run dev` | Start both frontend and backend in development |
| `npm run dev:client` | Start only the frontend |
| `npm run dev:backend` | Start only the backend (with venv activated) |
| `npm run build` | Build the frontend for production |

## 🔧 Development

### Frontend (React + Vite)
- Located in `client/`
- Uses LiveKit client v2.13.8
- Tailwind CSS for styling

### Backend (FastAPI + LiveKit Agents)
- Located in `backend/`
- Runs in Python virtual environment (`backend/venv/`)
- Handles LiveKit token generation
- Manages AI agent orchestration
- Supports dynamic persona selection

## 🎮 How to Use

1. Open the app in your browser
2. Enter a debate topic
3. Select up to 3 AI personas
4. Click "Start Debate"
5. Allow microphone access when prompted
6. Participate in the live debate!

## 📝 Environment Variables

### Required for Backend
- `LIVEKIT_URL`: Your LiveKit server WebSocket URL
- `LIVEKIT_API_KEY`: LiveKit API key
- `LIVEKIT_API_SECRET`: LiveKit API secret

### Required for Frontend
- `VITE_BACKEND_URL`: Backend server URL (default: http://localhost:8000)

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy the client/dist folder
```

### Backend
```bash
# Activate virtual environment
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📄 License

MIT License - feel free to use for your own projects! 