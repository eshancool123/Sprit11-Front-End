import React, { useState, useEffect } from 'react';

const PlayersView = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:6001/players');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPlayers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching players:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPlayers = players.filter(player => 
    player.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.Category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.University.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.Team_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center">
        <p className="text-xl font-semibold">Loading players data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center">
        <p className="text-xl font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">Cricket Players Directory</h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search players by name, category, university, or team..."
            className="w-full p-3 border border-gray-300 rounded shadow-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 h-full">
            <h2 className="text-xl font-semibold mb-4">All Players ({filteredPlayers.length})</h2>
            <div className="overflow-y-auto max-h-96">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(player => (
                  <div 
                    key={player._id}
                    className={`p-3 mb-2 rounded cursor-pointer transition-colors ${
                      selectedPlayer && selectedPlayer._id === player._id 
                        ? 'bg-blue-100 border-l-4 border-blue-500' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handlePlayerSelect(player)}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full mr-3 bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                        {player.Name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{player.Name}</h3>
                        <p className="text-sm text-gray-600">{player.Category} • {player.Team_Name !== "None" ? player.Team_Name : "No Team"}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No players match your search.</p>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {selectedPlayer ? (
              <div>
                <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-4xl font-bold mb-4 md:mb-0 md:mr-6">
                    {selectedPlayer.Name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPlayer.Name}</h2>
                    <p className="text-lg text-blue-700 font-medium">{selectedPlayer.Category}</p>
                    <p className="text-gray-700">{selectedPlayer.University}</p>
                    <p className="text-gray-700">Team: {selectedPlayer.Team_Name !== "None" ? selectedPlayer.Team_Name : "No Team"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">Batting Stats</h3>
                    <p><span className="text-gray-600">Total Runs:</span> {selectedPlayer.Total_Runs}</p>
                    <p><span className="text-gray-600">Balls Faced:</span> {selectedPlayer.Balls_Faced}</p>
                    <p><span className="text-gray-600">Innings Played:</span> {selectedPlayer.Innings_Played}</p>
                    <p><span className="text-gray-600">Batting Average:</span> {selectedPlayer.Batting_Average.toFixed(2)}</p>
                    <p><span className="text-gray-600">Strike Rate:</span> {selectedPlayer.Batting_Strike_Rate.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">Bowling Stats</h3>
                    <p><span className="text-gray-600">Wickets:</span> {selectedPlayer.Wickets}</p>
                    <p><span className="text-gray-600">Overs Bowled:</span> {selectedPlayer.Overs_Bowled}</p>
                    <p><span className="text-gray-600">Runs Conceded:</span> {selectedPlayer.Runs_Conceded}</p>
                    <p><span className="text-gray-600">Economy Rate:</span> {selectedPlayer.Economy_Rate.toFixed(2)}</p>
                    <p><span className="text-gray-600">Bowling Strike Rate:</span> {selectedPlayer.Balling_Strike_Rate.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-semibold mb-2 text-blue-800">Value Stats</h3>
                    <p><span className="text-gray-600">Value (₹):</span> {selectedPlayer.Value_In_Rupee.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-semibold mb-2 text-blue-800">Additional Info</h3>
                    <p><span className="text-gray-600">Added on:</span> {new Date(selectedPlayer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg">Select a player to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersView;