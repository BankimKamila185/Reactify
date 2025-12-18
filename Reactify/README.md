# Reactify - Anonymous Live Polling & Feedback System

![Reactify Logo](https://img.shields.io/badge/Reactify-Live%20Polling-blue?style=for-the-badge&logo=react)

**Reactify** (formerly PollStream) is a real-time, anonymous polling system designed to provide instant feedback for presenters and event hosts. Built on the MERN stack, it allows thousands of users to submit votes instantly, with results visualized live on a public screen.

## 📖 Context & Solution
Presenters often struggle with existing polling tools due to high latency, complex setups, and lack of smooth real-time visualization. **Reactify** solves this by providing:

-   **Instant Feedback**: Low-latency vote broadcasting.
-   **Anonymous Participation**: No registration required for voters.
-   **Dynamic Visualization**: Animated charts that update in real-time.
-   **Scalability**: Built to handle high-volume traffic using WebSockets.

## 🌟 Key Features

### Frontend (React.js)
-   **Dual Views**:
    -   **Voter Interface**: Mobile-optimized, simple view for submitting votes.
    -   **Results Screen**: Dynamic, large-screen optimized view for displaying live charts.
-   **Real-Time Visualizations**: Animated bar and pie charts (using Recharts & Framer Motion) that update instantly.
-   **Intuitive UI/UX**: Clean design tokens, glassmorphism effects, and responsive layout.
-   **AI-Powered Generation**: Automatically generate polls from YouTube videos, PDFs, DOCX, and PPTX files.

### Backend (Node.js/Express)
-   **Socket.IO Integration**: Manages high-volume, ephemeral vote submissions and broadcasts authoritative results.
-   **RESTful API**: Robust endpoints for session management, poll creation, and content processing.
-   **Secure Authentication**: JWT-based authentication for hosts; anonymous access for voters.
-   **Database**: MongoDB storage for flexible poll documents and session metadata.

## 🛠️ Tech Stack

### Frontend
-   **Core**: React 18, Vite
-   **Styling**: Tailwind CSS, PostCSS
-   **State Management**: Zustand
-   **Real-time**: Socket.IO Client
-   **Visualization**: Recharts, React Wordcloud
-   **Animations**: Framer Motion
-   **Utilities**: Axios, Lucide React (Icons), QRCode

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB + Mongoose
-   **Real-time**: Socket.IO
-   **AI Integration**: OpenAI API, Youtube Transcript
-   **File Processing**: Multer, Mammoth (.docx), PDF Parse, PPTX Parser
-   **Auth**: JWT, Firebase Admin
-   **Validation**: Zod

## 🚀 Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB (Running locally or cloud instance)
-   Firebase Project (for advanced features/deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/reactify.git
cd reactify
```

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env` file in `backend/` and add:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/reactify
    JWT_SECRET=your_super_secret_key
    OPENAI_API_KEY=your_openai_api_key
    CLIENT_URL=http://localhost:5173
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env` file in `frontend/` and add:
    ```env
    VITE_API_URL=http://localhost:3000
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

### Using Docker (Optional)
If you prefer using Docker, ensure you have Docker and Docker Compose installed:
```bash
docker-compose up -d --build
```

## 🎯 Usage

### 👨‍🏫 Host (Create Polls)
1.  Go to `http://localhost:5173/login` (or `/signup`).
2.  Create a new **Session**.
3.  Add polls manually or use the **"Start with AI"** feature to generate questions from content.
4.  Click **"Present"** to enter the Live Results view.
5.  Share the **Join Code** or QR Code with the audience.

### 👥 Audience (Vote)
1.  Go to `http://localhost:5173/join`.
2.  Enter the **6-digit Join Code**.
3.  Wait for the host to activate a poll.
4.  Submit votes and feedback instantly!

## 🔌 API Endpoints (Snapshot)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new host |
| **POST** | `/api/session` | Create a new polling session |
| **GET** | `/api/session/:code` | Get session details by code |
| **POST** | `/api/poll` | Create a new poll |
| **POST** | `/api/upload/content` | Upload file for AI generation |

## 📁 Project Structure

```
Reactify/
├── backend/ # Node.js/Express Server
│   ├── src/
│   │   ├── controllers/ # Logic for API endpoints
│   │   ├── models/      # Mongoose Schemas
│   │   ├── routes/      # API Routes
│   │   ├── services/    # AI & Business Logic
│   │   └── index.js     # Entry point
├── frontend/ # React + Vite Client
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main Route Views
│   │   ├── hooks/       # Custom React Hooks
│   │   └── api/         # Axios instance
└── docker-compose.yml   # Container orchestration
```

## 📄 License
This project is licensed under the MIT License.
