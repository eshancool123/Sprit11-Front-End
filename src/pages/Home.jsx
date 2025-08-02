import React, { useState, useEffect } from "react";
import {
  User,
  DollarSign,
  Users,
  Award,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to set test data in localStorage (for development/testing only)
  const setTestData = () => {
    const testUserData = {
      Email: "e@e2.com",
      Role: "User",
      Spend_money: 0,
      Team_Name: "er",
      UserName: "er",
      id: "67cd6eb097d2c51d51017c75",
      players: [],
      totalpoints: 0
    };
    
    // Check if localStorage already has user data
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(testUserData));
      console.log("Test user data has been saved to localStorage");
    }
  };

  // Call setTestData on component mount (for development/testing only)
  useEffect(() => {
    setTestData();
  }, []);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
          throw new Error("User not found in localStorage");
        }
        
        const user = JSON.parse(storedUser);
        const userId = user.id; // Using the id field from localStorage
        
        console.log("Retrieved user from localStorage:", user);
        console.log("Using user ID for API call:", userId);
        
        try {
          // Use the userId in the API call
          const response = await fetch(
            `http://localhost:6001/teams/${userId}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch team data: ${response.status}`);
          }

          const data = await response.json();

          // Transform API data to match the component's expected format
          const transformedData = {
            username: data.team.Email.split("@")[0], // Extract username from email
            teamName: data.team.Team_Name,
            budget: {
              initial: 9000000, // Assuming this is a constant value
              spent: data.team.Spend_money,
              remaining: 9000000 - data.team.Spend_money, // Calculate remaining budget
            },
            team: {
              selected: data.team.players.length,
              total: 11, // Assuming 11 is the total needed
              players: data.team.players.map((player) => ({
                id: player._id,
                name: player.Name,
                university: player.University,
                value: player.Value_In_Rupee,
                category: player.Category,
                points: player.Points,
              })),
            },
            totalpoints: data.team.totalpoints,
          };

          setUserData(transformedData);
        } catch (apiError) {
          console.error("API Error:", apiError);
          throw apiError;
        }
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err.message);
        
        // For testing/development: Use mock data if API call fails
        if (process.env.NODE_ENV === 'development') {
          console.log("Using mock data for development");
          const mockData = {
            username: user.Email.split("@")[0],
            teamName: user.Team_Name,
            budget: {
              initial: 9000000,
              spent: user.Spend_money || 0,
              remaining: 9000000 - (user.Spend_money || 0),
            },
            team: {
              selected: user.players ? user.players.length : 0,
              total: 11,
              players: user.players || [],
            },
            totalpoints: user.totalpoints || 0,
          };
          setUserData(mockData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  // Function to view localStorage data (for debugging)
  const viewLocalStorageData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      console.log("Current localStorage user data:", JSON.parse(userData));
      alert("User data found in localStorage! Check console for details.");
    } else {
      alert("No user data found in localStorage!");
    }
  };

  const navigate = useNavigate();
  
  // Navigation handler
  const navigateTo = (path) => {
    navigate(path);
  };
  
  // Log out handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    alert("User logged out successfully!");
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Try Again
            </button>
            <button
              onClick={viewLocalStorageData}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg w-full"
            >
              View localStorage Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  // Calculate team completion percentage
  const completionPercentage =
    (userData.team.selected / userData.team.total) * 100;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with localStorage debug button and logout */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Fantasy League Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={viewLocalStorageData}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <span>Check localStorage</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600"
            >
              <LogOut size={18} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Team Overview */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Team Overview
                </h2>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                  onClick={() => navigateTo("/team-view")}
                >
                  View Full Team
                </button>
              </div>

              {/* Team Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    Team Completion
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {userData.team.selected}/{userData.team.total} Players
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Points Display */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">
                    Total Team Points
                  </span>
                  <span className="text-lg font-bold text-blue-800">
                    {userData.totalpoints?.toFixed(2) || "0.00"} pts
                  </span>
                </div>
              </div>

              {/* Current Team List */}
              <div className="overflow-hidden">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Current Squad
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Player
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          University
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userData.team.players && userData.team.players.length > 0 ? (
                        userData.team.players.map((player) => (
                          <tr key={player.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                              {player.name}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {player.university}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {player.category}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-center">
                              {player.points?.toFixed(2) || "0.00"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">
                              Rs.{Math.round(player.value)?.toLocaleString() || "0"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">
                            No players selected yet
                          </td>
                        </tr>
                      )}
                      {userData.team.selected < userData.team.total && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-3 text-center text-sm"
                          >
                            <button
                              className="text-blue-600 hover:text-blue-800 font-medium"
                              onClick={() =>
                                navigateTo("/select-your-team-view")
                              }
                            >
                              + Add more players to complete your team
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Quick Tips
              </h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500 font-bold">•</span>
                  Complete your team of 11 players to see your total points on
                  the leaderboard.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500 font-bold">•</span>
                  Check player statistics in the Players tab before making your
                  selection.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500 font-bold">•</span>
                  Use Spiriter chatbot for personalized team suggestions and
                  player insights.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500 font-bold">•</span>
                  Monitor your budget carefully - you can't exceed your
                  allocation of Rs.9,000,000.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Budget & Navigation */}
          <div className="col-span-1">
            {/* Budget Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Budget Overview
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      Initial Budget
                    </span>
                    <span className="font-medium">
                      Rs.{userData.budget.initial.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Spent</span>
                    <span className="font-medium text-red-600">
                      Rs.{Math.round(userData.budget.spent).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t">
                    <span className="text-sm font-semibold text-gray-800">
                      Remaining
                    </span>
                    <span className="font-bold text-green-600">
                      Rs.{Math.round(userData.budget.remaining).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm"
                  onClick={() => navigateTo("/budget-view")}
                >
                  View Detailed Budget
                </button>
              </div>
            </div>

            {/* Team Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Team Info
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Team Name</span>
                  <span className="font-medium text-gray-800">
                    {userData.teamName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Manager</span>
                  <span className="font-medium text-gray-800">
                    {userData.username}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Shortcuts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Quick Navigation
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 p-4 rounded-lg"
                  onClick={() => navigateTo("/players-view")}
                >
                  <User size={24} />
                  <span className="mt-2 text-sm font-medium">Players</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 p-4 rounded-lg"
                  onClick={() => navigateTo("/select-your-team-view")}
                >
                  <Users size={24} />
                  <span className="mt-2 text-sm font-medium">Select Team</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-600 p-4 rounded-lg"
                  onClick={() => navigateTo("/budget-view")}
                >
                  <DollarSign size={24} />
                  <span className="mt-2 text-sm font-medium">Budget</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 text-yellow-600 p-4 rounded-lg"
                  onClick={() => navigateTo("/leaderboard")}
                >
                  <Award size={24} />
                  <span className="mt-2 text-sm font-medium">Leaderboard</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-4 rounded-lg col-span-2"
                  onClick={() => navigateTo("/spiriter-ai")}
                >
                  <MessageCircle size={24} />
                  <span className="mt-2 text-sm font-medium">Ask Spiriter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;