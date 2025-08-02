import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Main from "../layout/Main";
import PlayersView from "../pages/PlayersView";
import SelectYourTeamView from "../pages/SelectYourTeamView";
import TeamView from "../pages/TeamView";
import BudgetView from "../pages/BudgetView";
import Leaderboard from "../pages/LeaderBord";
import SpiriterChatbot from "../pages/SpiriterChatbort";
import Admin from "../layout/Admin";
import AdminPlayersView from "../pages/admin-pages/AdminPlayerView";
import PlayerStatsView from "../pages/admin-pages/PlayerStatsView";
import CricketTournamentDashboard from "../pages/admin-pages/CricketTournamentDashboard";
import { RoleManagement } from "../pages/admin-pages/RoleManagement";
import Login from "../componants/auth/Login";
import Register from "../componants/auth/Register";
import WelcomePage from "../pages/Welcomepage";




const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/players-view",
          element: <PlayersView />,
        },
        {
          path: "/select-your-team-view",
          element: <SelectYourTeamView />,
        },
        {
          path: "/team-view",
          element: <TeamView />,
        },
        {
          path: "/budget-view",
          element: <BudgetView />,
        },
        {
          path: "/leaderboard",
          element: <Leaderboard />,
        },
        {
          path: "/spiriter-ai",
          element: <SpiriterChatbot />,
        }

      ]
    },
    
    {
      path: "/welcome",
      element: <WelcomePage />,
    },

    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },


    //Admin
    {
      path: "/admin",
      element: <Admin />,
      children: [
        {
          path: "players",
          element: <AdminPlayersView />,
        },
        {
          path: "player-stats-view",
          element: <PlayerStatsView />,
        },
        {
          path: "cricket-tournament-dashboard",
          element: <CricketTournamentDashboard />,
        },
        {
          path: "role-management",
          element: <RoleManagement />,
        },


      ]
    } 


]);

export default router;