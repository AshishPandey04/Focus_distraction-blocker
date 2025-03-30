# FOCUS: Distraction Blocker 

A comprehensive productivity tool that combines AI-powered focus tracking with app and website blocking capabilities.

## Features

- AI-powered focus tracking and productivity analysis

- Chrome extension for blocking distracting websites
- Real-time focus mode with progress tracking
- Smart contract-based reward distribution
- Customizable blocking rules and focus sessions

## Project Structure

```
distraction-blocker-ai-web3/
│── backend/             # Node.js + Express API
│   ├── models/          # Database Models
│   ├── routes/          # API Endpoints
│   ├── controllers/     # Business Logic
│   ├── blockchain/      # Smart Contracts
│   ├── ai/              # AI Focus Tracking
│── frontend/            # React.js App
│   ├── src/
│   │   ├── components/  # UI Components
│   │   ├── pages/       # App Pages
│   │   ├── hooks/       # Custom Hooks
│   │   ├── context/     # State Management
│── chrome-extension/    # Website Blocker
│── scripts/             # Automation Scripts
│── smart-contracts/     # Solidity Contracts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB/PostgreSQL
- MetaMask or similar Web3 wallet
- Chrome browser (for extension)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development servers:
   ```bash
   # Start backend
   cd backend
   npm run dev
   
   # Start frontend
   cd frontend
   npm start
   ```

## Development

- Backend: Node.js + Express
- Frontend: React.js
- Blockchain: Solidity + Web3.js
- AI: TensorFlow.js
- Database: MongoDB/PostgreSQL

## License

MIT 
