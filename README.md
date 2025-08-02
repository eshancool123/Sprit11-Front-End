# Spirit - Full Stack Application

A modern web application with Node.js/Express backend and React frontend.

## Project Overview

This project consists of two main components:

- **Backend (`spirit-server`)**: A Node.js/Express server using MongoDB for data storage and Google's Generative AI integration
- **Frontend (`sprit-user`)**: A React application built with Vite, utilizing React Router for navigation and Tailwind CSS for styling

## Tech Stack

### Backend (`spirit-server`)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Generative AI
- **Development**: Nodemon for hot-reloading

### Frontend (`sprit-user`)

- **Framework**: React 
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React (icons)
- **Data Visualization**: Recharts

## Database Schema

The application uses MongoDB with Mongoose ODM and consists of two main models:

### Team Model

The Team model represents a cricket team in the fantasy league system:

```javascript
const teamSchema = new mongoose.Schema({
    Team_Name: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    totalpoints: { type: Number, default: 0 },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Spend_money: { type: Number, default: 0 },
});
```

- `Team_Name`: Required string representing the team's name
- `players`: Array of references to Player documents, establishing a one-to-many relationship
- `totalpoints`: Number tracking the team's accumulated points (default: 0)
- `Email`: Required string for user authentication and communication
- `Password`: Required string for user authentication (should be hashed in production)
- `Spend_money`: Number tracking how much virtual currency the team has spent (default: 0)

### Player Model

The Player model represents individual cricket players with detailed statistics:

```javascript
const playerSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    University: { type: String, required: true },
    Wickets: { type: Number, default: 0 },
    Category: { type: String, enum: ['Batsman', 'Bowler', 'All-rounder'], required: true },
    Total_Runs: { type: Number, default: 0 },
    Balls_Faced: { type: Number, default: 0 },
    Innings_Played: { type: Number, default: 0 },
    Overs_Bowled: { type: Number, default: 0 },
    Runs_Conceded: { type: Number, default: 0 },
    Team_Name: { type: String, default: "None" },
    Batting_Strike_Rate: { type: Number, default: 0 },
    Batting_Average: { type: Number, default: 0 },
    Balling_Strike_Rate: { type: Number, default: 0 },
    Economy_Rate: { type: Number, default: 0 },
    Points: { type: Number, default: 0 },
    Value_In_Rupee: { type: Number, default: 0 },
});
```

Player attributes include:
- **Basic Information**:
  - `Name`: Required string for the player's name
  - `University`: Required string indicating the player's university
  - `Category`: Required string limited to 'Batsman', 'Bowler', or 'All-rounder'
  - `Team_Name`: String indicating which team the player belongs to (default: "None")

- **Batting Statistics**:
  - `Total_Runs`: Number of runs scored (default: 0)
  - `Balls_Faced`: Number of balls faced while batting (default: 0)
  - `Batting_Strike_Rate`: Batting strike rate calculation (default: 0)
  - `Batting_Average`: Batting average calculation (default: 0)

- **Bowling Statistics**:
  - `Wickets`: Number of wickets taken (default: 0)
  - `Overs_Bowled`: Number of overs bowled (default: 0)
  - `Runs_Conceded`: Number of runs conceded while bowling (default: 0)
  - `Balling_Strike_Rate`: Bowling strike rate calculation (default: 0)
  - `Economy_Rate`: Economy rate calculation (default: 0)

- **Game Statistics**:
  - `Innings_Played`: Number of innings played (default: 0)
  - `Points`: Fantasy points earned by the player (default: 0)
  - `Value_In_Rupee`: Player's value in the fantasy league (default: 0)

### Relationships

- Teams have a one-to-many relationship with Players through the `players` array in the Team schema.
- Players are associated with a team through the `Team_Name` field, which matches the `Team_Name` field in the Team schema.

## Dependencies Explained

### Backend Dependencies

- **@google/generative-ai (^0.24.0)**: Google's Generative AI client library for Node.js that provides access to Google's AI models for generating text, images, and other content.
- **cors (^2.8.5)**: Middleware that enables Cross-Origin Resource Sharing, allowing the frontend to make API requests to the backend when they're hosted on different domains.
- **dotenv (^16.4.7)**: Loads environment variables from a `.env` file into `process.env`, making it easy to manage configuration settings.
- **express (^4.21.2)**: Fast, unopinionated, minimalist web framework for Node.js that handles HTTP requests, routing, and middleware.
- **mongoose (^8.12.1)**: MongoDB object modeling tool designed to work in an asynchronous environment, providing a schema-based solution to model application data.
- **nodemon (^3.1.9)** (dev dependency): Utility that monitors for any changes in your source and automatically restarts your server.

### Frontend Dependencies

- **react & react-dom**: Core React libraries for building user interfaces.
- **react-router & react-router-dom (^7.3.0)**: Declarative routing for React applications.
- **recharts (^2.15.1)**: A composable charting library built on React components.
- **lucide-react (^0.479.0)**: A collection of simply beautiful open source icons.
- **tailwindcss (^3.4.17)**: A utility-first CSS framework for rapidly building custom designs.
- **vite (^6.2.0)**: Next generation frontend tooling that provides fast development and optimized builds.

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- MongoDB instance (local or cloud)
- Google Generative AI API key

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [repository-directory]
   ```

2. Set up the backend:
   ```bash
   cd spirit-server
   npm install
   ```

3. Create a `.env` file in the `spirit-server` directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. Set up the frontend:
   ```bash
   cd ../sprit-user
   npm install
   ```

### Installing Dependencies Manually (if needed)

If you need to install dependencies manually:

#### Backend Dependencies

```bash
cd spirit-server
npm install @google/generative-ai@0.24.0 cors@2.8.5 dotenv@16.4.7 express@4.21.2 mongoose@8.12.1
npm install --save-dev nodemon@3.1.9
```

#### Frontend Dependencies

```bash
cd sprit-user
npm install lucide-react@0.479.0 react-router@7.3.0 react-router-dom@7.3.0 recharts@2.15.1
npm install --save-dev @vitejs/plugin-react autoprefixer postcss tailwindcss vite
```

### Running the Application

#### Backend

```bash
cd spirit-server
npm start
```

The server will start with hot-reloading enabled via Nodemon, and will be available at `http://localhost:5000` (or the port you specified in the `.env` file).

#### Frontend

```bash
cd sprit-user
npm run dev
```

The development server will start and the application will be available at `http://localhost:5173`.

## Building for Production

### Frontend

```bash
cd sprit-user
npm run build
```

The built files will be in the `dist` directory and can be served by any static file server.

### Backend

For the backend, you may want to use a process manager like PM2:

```bash
npm install -g pm2
cd spirit-server
pm2 start ./src/index.mjs
```