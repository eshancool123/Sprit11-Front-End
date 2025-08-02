import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TeamView = () => {
  const [team, setTeam] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch team data from the server
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:6001/none');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Assuming data structure has players array and possibly totalPoints
        const players = data.players || [];
        setTeam(players);
        setTotalPoints(data.totalPoints || calculateTotalPoints(players));
        setShowPoints(players.length === 11);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  // Calculate total points if not provided by API
  const calculateTotalPoints = (players) => {
    return players.reduce((total, player) => total + (player.Points || 0), 0);
  };

  const handleRemovePlayer = (player) => {
    setPlayerToRemove(player);
    setIsDialogOpen(true);
  };

  const confirmRemovePlayer = async () => {
    if (!playerToRemove) return;
    
    try {
      // Send request to remove player
      const response = await fetch('http://localhost:6001/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName: "SS", // Assuming team name is fixed
          playerIds: team.filter(p => p._id !== playerToRemove._id).map(p => p._id)
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Update local state
      const updatedTeam = team.filter(p => p._id !== playerToRemove._id);
      setTeam(updatedTeam);
      setTotalPoints(calculateTotalPoints(updatedTeam));
      setShowPoints(updatedTeam.length === 11);
      
    } catch (err) {
      console.error("Error removing player:", err);
      alert("Failed to remove player: " + err.message);
    } finally {
      // Close dialog
      setIsDialogOpen(false);
      setPlayerToRemove(null);
    }
  };

  // Group players by their roles
  const playersByCategory = team.reduce((acc, player) => {
    const category = player.Category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(player);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="p-4">Loading team data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-800">Error loading team</h3>
          <p className="text-sm text-red-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold">My Team</h2>
          <span className={`px-2 py-1 rounded-full text-sm ${team.length === 11 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {team.length}/11 players selected
          </span>
        </div>
        <div className="p-4">
          {showPoints && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-800">Total Team Points: {totalPoints}</h3>
              <p className="text-sm text-green-600">Your team is complete! Check the leaderboard to see your ranking.</p>
            </div>
          )}

          {team.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">You haven't selected any players yet.</p>
              <Link to="/select-team" className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                Select Players
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(playersByCategory).map(([category, categoryPlayers]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-md font-medium">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPlayers.map((player) => (
                      <div key={player._id} className="border rounded-lg overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold">{player.Name}</h4>
                              <p className="text-sm text-gray-500">{player.University}</p>
                              <p className="text-sm mt-1">Value: Rs. {Math.round(player.Value_In_Rupee).toLocaleString()}</p>
                            </div>
                            <button 
                              className="text-red-500 hover:text-red-700 text-sm"
                              onClick={() => handleRemovePlayer(player)}
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              Points: {player.Points} | Category: {player.Category}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Remove Player</h3>
            <p className="mb-6">
              Are you sure you want to remove {playerToRemove?.Name} from your team?
              Their value (Rs. {Math.round(playerToRemove?.Value_In_Rupee)?.toLocaleString()}) will be returned to your budget.
            </p>
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                onClick={confirmRemovePlayer}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;