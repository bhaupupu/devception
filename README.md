# 🚀 Devception

> **The Social Deception Game Built for Developers.**  
> Collaborate on code in real-time, solve programming tasks, and hunt down the Impostor before your codebase gets destroyed!

---

## 🎮 About Devception

**Devception** is an online multiplayer social deception coding game inspired by *Among Us*. 

Players are split into two teams:
* **💻 Developers:** Must work together in a real-time collaborative code editor to complete assigned coding tasks, fix bugs, and achieve 100% completion before time runs out.
* **🕵️ Impostors:** Must covertly sabotage the code, inject subtle bugs, blur teammates' editors, send fake hints, and eliminate developers without getting caught.

When suspicious activity is detected, players can call **Emergency Meetings** to discuss, accuse, and vote off suspected Impostors!

---

## ✨ Key Features

* **⚡ Real-Time Collaborative Editor:** Powered by **Monaco Editor** and **Yjs CRDTs**, allowing seamless multi-cursor real-time code editing and live synchronization.
* **😈 Impostor Sabotage System:** Impostors can trigger special cooldown abilities:
  * Injected Syntax/Logic Bugs
  * Screen / Editor Blurs
  * Fake AI Hints & Distractions
* **🚨 Emergency Meetings & Voting:** Real-time text chat, discussion phases, and secret/public voting system to eliminate suspects.
* **🏠 Customizable Lobbies & Game Settings:** Host private or public rooms with custom game duration, player limits (4–8 players), meeting timers, and sabotage cooldowns.
* **🔒 Authentication & Profiles:** Secure authentication powered by NextAuth.js, JWT, and MongoDB user profiles.

---

## 🛠️ Tech Stack

### **Frontend (`devception-client`)**
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **UI & Styling:** Tailwind CSS, Framer Motion, Radix UI, Lucide Icons
* **Code Editor:** Monaco Editor (`@monaco-editor/react`)
* **Real-time & CRDTs:** Socket.io Client, Yjs (`yjs`, `y-monaco`, `y-protocols`)
* **State Management:** Zustand
* **Authentication:** NextAuth.js

### **Backend (`devception-server`)**
* **Runtime:** Node.js (>= 22.0.0)
* **Framework:** Express 5
* **Language:** TypeScript
* **WebSockets:** Socket.io (with `@socket.io/redis-adapter` for scaling)
* **Database:** MongoDB (Mongoose)
* **Cache & Pub/Sub:** Redis (ioredis)
* **Validation & Security:** Zod, Helmet, Express Rate Limit, JWT, CORS, Winston Logger

---

## 📂 Project Structure

```text
devception/
├── devception-client/     # Next.js 14 Frontend Application
│   ├── src/
│   │   ├── app/           # App Router pages (lobby, game, results, auth)
│   │   ├── components/    # Reusable UI, Game, & Meeting components
│   │   ├── hooks/         # Custom React hooks (Socket, Yjs, Game state)
│   │   ├── lib/           # Utility functions & API clients
│   │   └── store/         # Zustand state stores
│   ├── public/            # Static assets
│   └── package.json
│
├── devception-server/     # Express & Socket.io Backend Server
│   ├── src/
│   │   ├── config/        # Environment & database configs
│   │   ├── controllers/   # REST API controllers
│   │   ├── models/        # Mongoose database models
│   │   ├── socket/        # Real-time WebSocket handlers (room, game, editor, chat, meeting, imposter)
│   │   ├── services/      # Business logic & room managers
│   │   └── index.ts       # Application entry point
│   ├── Dockerfile
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* **Node.js** >= 22.0.0
* **npm**, **yarn**, or **pnpm**
* **MongoDB** (Local instance or MongoDB Atlas)
* **Redis** (Local instance or Redis Cloud)

---

### 1. Backend Setup (`devception-server`)

1. Navigate to the server directory:
   ```bash
   cd devception-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   PORT=4000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/devception
   NEXTAUTH_SECRET=your-secret-key-here
   CLIENT_ORIGIN=http://localhost:3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:4000`.

---

### 2. Frontend Setup (`devception-client`)

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd devception-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env.local` file:
   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:4000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

---

## 📜 Available Scripts

### `devception-client`
* `npm run dev` — Starts the Next.js development server.
* `npm run build` — Builds the application for production.
* `npm run start` — Starts the production server.
* `npm run lint` — Runs ESLint checks.

### `devception-server`
* `npm run dev` — Starts the Express + Socket.io server with hot reload via `tsx`.
* `npm run build` — Compiles TypeScript to JavaScript (`dist/`).
* `npm run start` — Runs the compiled production server (`node dist/index.js`).

---

## 🐳 Docker & Deployment

### Server Docker Deployment
The backend includes a production-ready `Dockerfile`:
```bash
cd devception-server
docker build -t devception-server .
docker run -p 4000:4000 --env-file .env devception-server
```

The repository also includes configuration files for cloud platforms:
* **Render:** `devception-server/render.yaml`
* **Railway:** `devception-server/railway.json`
* **Vercel:** Optimized for deploying `devception-client`

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
