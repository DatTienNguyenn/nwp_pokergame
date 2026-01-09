# Poker Game - Next.js Application

## Project Structure

```
pokergame/
├── app/
│   ├── components/           # All UI components
│   │   ├── card/            # Card components
│   │   ├── player/          # Player components
│   │   ├── slider/          # Slider components
│   │   └── Navigation.jsx   # Global navigation
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── data/                # Mock data
│   │   ├── mockUsers.js     # User credentials
│   │   └── mockTables.js    # Table and stats data
│   ├── game/                # Poker game page
│   │   ├── page.jsx         # Main game component
│   │   ├── App.css          # Game styles
│   │   ├── Poker.css        # Poker-specific styles
│   │   ├── Spinner.js       # Loading spinner
│   │   └── WinScreen.js     # Win screen component
│   ├── home/                # Home dashboard
│   │   └── page.jsx         # User dashboard
│   ├── login/               # Login page
│   │   └── page.jsx         # Login form
│   ├── tables/              # Table browser
│   │   └── page.jsx         # Table list
│   ├── utils/               # Utility functions
│   │   ├── ai.js            # AI logic
│   │   ├── bet.js           # Betting logic
│   │   ├── cards.js         # Card utilities
│   │   ├── players.js       # Player utilities
│   │   └── ui.js            # UI helpers
│   ├── layout.tsx           # Root layout
│   └── page.jsx             # Root page (redirects)
├── public/                  # Static assets
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies

```

## Mock Login Credentials

You can log in with these test accounts:

| Username | Password    | Chips   | Level | Description        |
| -------- | ----------- | ------- | ----- | ------------------ |
| player1  | password123 | 10,000  | 5     | Regular player     |
| pokerpro | poker2024   | 25,000  | 12    | Experienced player |
| admin    | admin       | 100,000 | 20    | Admin account      |
| beginner | beginner123 | 1,000   | 1     | New player         |

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Log in with any of the credentials above

## Features

- **Authentication**: Login system with session persistence
- **Home Dashboard**: View your stats, recent games, and quick actions
- **Table Browser**: Browse and join poker tables with filtering
- **Poker Game**: Full-featured poker game with AI opponents
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- Next.js 16.1.1
- React 19.2.3
- Tailwind CSS 4
- LocalStorage for session management
