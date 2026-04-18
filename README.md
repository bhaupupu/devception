# Devception

A real-time multiplayer coding game for programmers — combining collaborative code editing with social deduction mechanics inspired by Among Us. Work together to fix a shared codebase, complete tasks, and root out the hidden imposter before time runs out.

---

## What is Devception?

Devception puts 4–8 players in a shared coding environment. Most players are **Good Coders** — they must collaboratively solve a complex coding problem and complete individual mini-tasks. Hidden among them are **Imposters** who try to sabotage progress through bug injection, screen blurring, and misleading hints — all while pretending to help.

When things get suspicious, any player can call an **Emergency Meeting** to discuss and vote out the imposter. The game ends when the code is complete, the imposter is voted out, or time expires.

---

## Gameplay

| Role | Goal |
|------|------|
| Good Coder | Complete the shared coding problem + mini-tasks before the timer runs out |
| Imposter | Disrupt progress and avoid detection until time expires |

**Good Coders win if:**
- The main coding problem is completed before time runs out
- The imposter is correctly identified and voted out

**Imposters win if:**
- Time runs out before the code is completed
- They avoid detection throughout the game

**Game duration:** ~15 minutes per match

---

## Features

### Matchmaking
- Select skill level (Beginner / Intermediate / Advanced) and preferred language (Python, JavaScript, C++)
- Auto-matched with players of similar skill into a lobby of 4–8

### Real-Time Shared Code Editor
- Monaco Editor (same engine as VS Code) shared across all players
- Live cursor positions, real-time sync via Socket.IO
- Complex multi-function coding problems designed for simultaneous collaboration

### Mini Task System
- Each player receives individual tasks: fix bugs, complete functions, debug snippets
- Completing tasks fills a shared progress bar visible to everyone

### Imposter Mechanics
- **Inject Bug** — silently insert broken code into the shared editor
- **Blur Screen** — temporarily obscure another player's editor
- **Send Hint** — broadcast a misleading hint to all players
- All abilities have server-enforced cooldowns

### Emergency Meeting & Voting
- Any player can call a meeting at any time
- Real-time group chat during discussion phase
- Anonymous voting to eliminate a suspect
- Ejected player's role is revealed after the vote

### In-Game Chat
- Always-on chat panel during gameplay
- Full open chat during emergency meetings

### Results & XP
- Post-game screen with role reveals, player stats, and XP breakdown
- Win/loss history tracked per user

### Profile & Shop
- User profile with game stats (wins, tasks completed, XP)
- Shop UI placeholder for future skins and cosmetics

---

## Tech Stack

### Frontend (`devception-client`)
| Technology | Purpose |
|-----------|---------|
| Next.js 14 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations and transitions |
| Monaco Editor | In-game code editor |
| Socket.IO Client | Real-time communication |
| Zustand | Client-side state management |
| NextAuth.js | Google OAuth authentication |

### Backend (`devception-server`)
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | HTTP server |
| Socket.IO | WebSocket game events |
| TypeScript | Type safety |
| MongoDB + Mongoose | Persistent data storage |
| JWT (jsonwebtoken) | Shared auth token between frontend and backend |
| Winston | Logging |
| Helmet + Rate Limiting | Security hardening |
| Zod | Request validation |

---

## Project Structure

```
codecrew/
├── devception-client/             # Next.js frontend
│   └── src/
│       ├── app/                   # Pages (App Router)
│       │   ├── login/             # Google OAuth entry
│       │   ├── lobby/             # Matchmaking + waiting room
│       │   ├── game/[roomId]/     # Main game screen
│       │   ├── results/[roomId]/  # Post-game results
│       │   ├── profile/           # User stats
│       │   └── shop/              # Cosmetics placeholder
│       ├── components/
│       │   ├── game/              # CodeEditor, TaskPanel, ImposterActions, ChatPanel...
│       │   ├── lobby/             # MatchmakingPanel, WaitingRoom, PlayerSlot
│       │   ├── meeting/           # MeetingModal, VotingCard, VoteResults
│       │   ├── results/           # WinnerBanner, PlayerStatCard
│       │   └── ui/                # Button, Avatar, Timer, ProgressBar...
│       ├── hooks/                 # useSocket, useGame, useEditor, useVoting...
│       ├── store/                 # Zustand stores (game, editor, chat, meeting, user)
│       ├── lib/                   # socket.ts, authOptions.ts, api.ts
│       └── types/                 # Shared TypeScript types
│
└── devception-server/             # Express + Socket.IO backend
    └── src/
        ├── config/                # MongoDB connection, env loader
        ├── models/                # User, Game, GameHistory (Mongoose)
        ├── routes/ + controllers/ # REST API
        ├── services/              # game, matchmaking, imposter, voting logic
        ├── socket/
        │   ├── index.ts           # Socket.IO setup + handler registration
        │   ├── handlers/          # room, editor, task, imposter, meeting, chat
        │   └── middleware/        # JWT auth on every socket handshake
        └── utils/                 # roomCodeGenerator, roleAssigner, taskGenerator
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google OAuth credentials (from [Google Cloud Console](https://console.cloud.google.com))

### 1. Clone the repo

```bash
git clone https://github.com/bhaupupu/codecrew.git
cd codecrew
```

### 2. Set up the backend

```bash
cd devception-server
npm install
```

Create `.env`:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codecrew
NEXTAUTH_SECRET=your-32-char-secret-here

CLIENT_ORIGIN=http://localhost:3000

IMPOSTER_BUG_COOLDOWN_MS=45000
IMPOSTER_BLUR_COOLDOWN_MS=60000
IMPOSTER_HINT_COOLDOWN_MS=30000

GAME_DURATION_MS=900000
MEETING_DISCUSSION_MS=60000
MEETING_VOTING_MS=30000
MAX_PLAYERS=8
MIN_PLAYERS=4
```

Start the server:

```bash
npm run dev
# Runs on http://localhost:4000
```

### 3. Set up the frontend

```bash
cd ../devception-client
npm install
```

Create `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-char-secret-here   # must match backend
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start the frontend:

```bash
npm run dev
# Runs on http://localhost:3000
```

### 4. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
4. Copy the Client ID and Secret into `.env.local`

---

## Socket.IO Event Reference

| Event | Direction | Description |
|-------|-----------|-------------|
| `room:join` | Client → Server | Join a room by code |
| `room:state` | Server → Client | Full game state sync |
| `room:player-joined` | Server → Room | New player notification |
| `room:player-ready` | Server → Room | Player readied up |
| `game:start` | Server → Room | Game begins |
| `game:role-reveal` | Server → Client | Your role (unicast only) |
| `game:phase-change` | Server → Room | Phase transition |
| `game:timer-tick` | Server → Room | Countdown update |
| `game:end` | Server → Room | Game over with result |
| `editor:change` | Client → Server | Code edit |
| `editor:update` | Server → Room | Broadcast edit to others |
| `editor:cursor-move` | Client → Server | Cursor position |
| `task:submit` | Client → Server | Submit task answer |
| `task:result` | Server → Client | Task pass/fail (unicast) |
| `task:completed` | Server → Room | Task completion broadcast |
| `imposter:inject-bug` | Client → Server | Inject bug into editor |
| `imposter:blur-screen` | Client → Server | Blur a player's screen |
| `imposter:send-hint` | Client → Server | Broadcast misleading hint |
| `meeting:call` | Client → Server | Call emergency meeting |
| `meeting:start` | Server → Room | Meeting begins |
| `meeting:vote` | Client → Server | Cast vote |
| `meeting:results` | Server → Room | Vote outcome |
| `chat:send` | Client → Server | Send chat message |
| `chat:message` | Server → Room | Broadcast chat message |

---

## REST API

```
POST   /api/auth/verify           Verify NextAuth JWT
GET    /api/users/me              Current user profile + stats
PATCH  /api/users/me              Update skill level / preferred language
POST   /api/games/create          Create a private room
GET    /api/games/:roomCode       Room state (for reconnect)
GET    /api/games/history         User's game history (paginated)
POST   /api/matchmaking/join      Enter matchmaking queue
DELETE /api/matchmaking/leave     Leave queue
GET    /api/matchmaking/status    Queue position / matched room code
```

---

## Authentication

Sign-in is handled by **NextAuth.js** using Google OAuth. On sign-in, a JWT is generated and shared with the backend — all Socket.IO connections and API requests are authenticated using this token. No passwords are stored.

---

## License

MIT
