# 🎮 PokédexChampion

A modern, full-stack Pokémon Moves Management application (Pokédex Mini) built with React + Vite, Node.js + Express, and MongoDB.

![Dark Mode](https://img.shields.io/badge/Theme-Dark%20Mode-1a1a2e)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248)

## ✨ Features

### Core Features
- **Dashboard** — Overview with total Pokémon, moves, types, and strongest move
- **Pokémon Management** — Full CRUD with images, stats, abilities, and roles
- **Moves Management** — Full CRUD with type, category, power, accuracy, PP, effects
- **Type Chart** — Interactive 18×18 type effectiveness table
- **Team Builder** — Build teams of 6 Pokémon with 4 moves each + coverage analysis
- **Authentication** — JWT-based register/login with user and admin roles

### UI/UX
- 🌙 Dark mode with glassmorphism design
- 🎨 Color-coded Pokémon type badges
- 📊 Animated stat bars
- 🔍 Search, filter, and sort functionality
- 📱 Fully responsive (desktop + mobile)
- ⚡ Loading states, empty states, toast notifications
- 🛡️ Protected admin routes

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose 7 |
| Auth | JWT (httpOnly cookies) |

## 📦 Prerequisites

- **Node.js** 18+ 
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd PokedexChampion
```

### 2. Setup environment variables

```bash
# Copy the example env file to server directory
cp .env.example server/.env
```

Edit `server/.env` with your MongoDB connection string:

```env
MONGO_URI=mongodb://localhost:27017/pokedex_champion
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Install dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Seed the database

```bash
cd server
npm run seed
```

This creates:
- 🔐 **Admin account**: admin@pokedex.com / admin123
- 👤 **User account**: trainer@pokedex.com / trainer123
- 🐉 17 Dragon-type moves (Dragon Claw, Draco Meteor, etc.)
- 🎮 9 Pokémon (Dragonite, Garchomp, Rayquaza, etc.)

### 5. Start the application

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
PokedexChampion/
├── client/                       # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Sidebar, Layout
│   │   │   └── ui/               # TypeBadge, StatBar, Modal, etc.
│   │   ├── pages/                # All route pages
│   │   ├── services/             # API service layer (axios)
│   │   ├── stores/               # Zustand stores
│   │   ├── utils/                # Type data, constants
│   │   ├── App.jsx               # Main app with routing
│   │   └── main.jsx              # Entry point
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                       # Backend (Node + Express)
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Route handlers
│   ├── middleware/                # Auth, admin, error handler
│   ├── models/                   # Mongoose models
│   ├── routes/                   # Express routes
│   ├── seeds/seed.js             # Database seeder
│   ├── utils/typeChart.js        # Type effectiveness data
│   └── server.js                 # Server entry point
│
├── .env.example
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | — |
| POST | `/api/auth/login` | Login | — |
| GET | `/api/auth/me` | Get current user | ✅ |

### Pokémon
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/pokemon` | List all (with filters) | — |
| GET | `/api/pokemon/:id` | Get by ID | — |
| POST | `/api/pokemon` | Create new | Admin |
| PUT | `/api/pokemon/:id` | Update | Admin |
| DELETE | `/api/pokemon/:id` | Delete | Admin |

### Moves
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/moves` | List all (with filters) | — |
| GET | `/api/moves/:id` | Get by ID | — |
| POST | `/api/moves` | Create new | Admin |
| PUT | `/api/moves/:id` | Update | Admin |
| DELETE | `/api/moves/:id` | Delete | Admin |

### Teams
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/teams` | Get user's teams | ✅ |
| GET | `/api/teams/:id` | Get team by ID | ✅ |
| POST | `/api/teams` | Create team | ✅ |
| PUT | `/api/teams/:id` | Update team | ✅ |
| DELETE | `/api/teams/:id` | Delete team | ✅ |

### Utility
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/types` | Type effectiveness chart |
| GET | `/api/stats` | Dashboard statistics |

## 🎨 Design

- **Color Scheme**: Dark mode with `#0a0a0f` background, `#1a1a2e` cards
- **Accent**: Indigo (`#6366f1`) primary + Pokémon type colors
- **Typography**: Inter font
- **Effects**: Glassmorphism, backdrop blur, smooth animations
- **Cards**: Rounded corners (2xl), subtle borders, hover effects

## 📝 License

MIT License — feel free to use this project for learning or personal use.
# PokeChampion
