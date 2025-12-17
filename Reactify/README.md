# Reactify - Interactive Polling Platform

![Reactify Logo](https://img.shields.io/badge/Reactify-Interactive%20Polling-blue)

A real-time interactive polling and feedback platform inspired by Reactify with AI-powered content generation.

## 🌟 Features

- **Real-time Polling**: Create and run interactive polls with instant results
- **AI-Powered Generation**: Automatically generate poll questions from YouTube videos, PDFs, DOCX, and PPTX files
- **Multiple Poll Types**: Single choice, multiple choice, open text, and rating polls
- **Live Feedback**: Collect public and private feedback from participants
- **Animated Charts**: Beautiful,real-time result visualizations
- **Easy Join**: Participants join sessions with simple 6-digit codes
- **WebSocket Communication**: Instant updates using Socket.IO
- **Modern UI**: Clean, Reactify-inspired design

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   cd /Users/bankimkamila/Reactify
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY if using AI features
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

### Manual Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

#### MongoDB

Ensure MongoDB is running locally on port 27017, or update the connection string in `.env`.

## 📚 Tech Stack

### Backend
- Node.js + JavaScript (ES Modules)
- Express.js
- Socket.IO
- MongoDB + Mongoose
- OpenAI API for AI features
- JWT authentication
- Zod validation

### Frontend
- React 18 + JavaScript (JSX)
- Vite
- Tailwind CSS
- Zustand (state management)
- Socket.IO Client
- Recharts (data visualization)
- Framer Motion (animations)
- Axios

## 🎯 Usage

### Creating a Session (Host)

1. Navigate to http://localhost/host
2. Enter a session title
3. Click "Create Session"
4. Share the 6-digit session code with participants
5. Add polls manually or upload content for AI generation

### Joining a Session (Participant)

1. Navigate to http://localhost/join
2. Enter the session code
3. Enter your name
4. Vote on polls and submit feedback

### AI Poll Generation

1. Create a session
2. Upload a YouTube link, PDF, DOCX, PPTX, or TXT file
3. Wait for AI to process and generate questions
4. Review, edit, and approve generated polls

## 📁 Project Structure

```
Reactify/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic & AI
│   │   ├── events/          # Socket.IO handlers
│   │   ├── middleware/      # Auth & error handling
│   │   └── index.ts         # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── stores/          # Zustand stores
│   │   ├── hooks/           # Custom hooks
│   │   ├── api/             # API client
│   │   └── types/           # TypeScript types
│   └── package.json
└── docker-compose.yml
```

## 🔌 API Endpoints

### Sessions
- `POST /api/session` - Create new session
- `GET /api/session/:id` - Get session details
- `POST /api/session/join/:sessionCode` - Join session

### Polls
- `POST /api/poll/session/:sessionId` - Create poll
- `GET /api/poll/:pollId/results` - Get poll results
- `POST /api/poll/:pollId/feedback` - Submit feedback
- `GET /api/poll/session/:sessionId/feedback` - Get all feedback

### AI Content Processing
- `POST /api/upload/content` - Upload content for AI processing
- `GET /api/upload/job/:jobId` - Get AI job status

## 🔁 Socket.IO Events

### Client → Server
- `join-session` - Join a session room
- `submit-answer` - Submit poll response
- `submit-feedback` - Submit feedback
- `navigate-poll` - Change current poll (host)
- `end-session` - End session (host)

### Server → Client
- `session-state` - Current session state
- `poll-updated` - Real-time poll results update
- `poll-changed` - Poll navigation update
- `participant-joined` - New participant joined
- `feedback-new` - New feedback submitted
- `ai-progress-update` - AI processing progress
- `session-ended` - Session ended by host

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with hot reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server on port 5173
```

### Building for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reactify
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=50
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by [Reactify](https://www.reactify.com/)
- Built with modern web technologies and best practices
