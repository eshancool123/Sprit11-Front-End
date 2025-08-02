import React, { useState, useEffect } from 'react';

const PlayersTable = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    Name: '',
    University: '',
    Category: '',
    Total_Runs: 0,
    Balls_Faced: 0,
    Innings_Played: 0,
    Wickets: 0,
    Overs_Bowled: 0,
    Runs_Conceded: 0,
    Team_Name: 'None',
    Batting_Strike_Rate: 0,
    Batting_Average: 0,
    Bowling_Strike_Rate: 0, // Corrected spelling from "Balling_Strike_Rate"
    Economy_Rate: 0,
    Points: 0,
    Value_In_Rupee: 0
  });

  // Fetch players data from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:6001/players');
        if (!response.ok) {
          throw new Error('Failed to fetch players data');
        }
        const data = await response.json();
        setPlayers(data);
        setFilteredPlayers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Filter players based on search and filters
  useEffect(() => {
    let result = [...players];
    
    if (searchTerm) {
      result = result.filter(player => 
        player.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory) {
      result = result.filter(player => player.Category === filterCategory);
    }
    
    if (filterTeam) {
      result = result.filter(player => player.Team_Name === filterTeam);
    }
    
    setFilteredPlayers(result);
  }, [searchTerm, filterCategory, filterTeam, players]);

  // Get unique values for filters
  const categories = [...new Set(players.map(player => player.Category))].filter(Boolean);
  const teams = [...new Set(players.map(player => player.Team_Name))].filter(Boolean);

  // Add new player
  const handleAddPlayer = async () => {
    try {
      // Basic validation
      if (!newPlayer.Name || !newPlayer.Category) {
        alert('Player name and category are required');
        return;
      }

      const response = await fetch('http://localhost:6001/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add player');
      }
      
      const addedPlayer = await response.json();
      setPlayers([...players, addedPlayer]);
      
      // Reset form
      resetPlayerForm();
      setIsAddingPlayer(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Reset player form
  const resetPlayerForm = () => {
    setNewPlayer({
      Name: '',
      University: '',
      Category: '',
      Total_Runs: 0,
      Balls_Faced: 0,
      Innings_Played: 0,
      Wickets: 0,
      Overs_Bowled: 0,
      Runs_Conceded: 0,
      Team_Name: 'None',
      Batting_Strike_Rate: 0,
      Batting_Average: 0,
      Bowling_Strike_Rate: 0, // Corrected spelling
      Economy_Rate: 0,
      Points: 0,
      Value_In_Rupee: 0
    });
  };

  // Update existing player
  const handleUpdatePlayer = async () => {
    try {
      // Basic validation
      if (!newPlayer.Name || !newPlayer.Category) {
        alert('Player name and category are required');
        return;
      }

      const response = await fetch(`http://localhost:6001/players/${editingPlayerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update player');
      }
      
      const updatedPlayer = await response.json();
      
      setPlayers(players.map(player => 
        player._id === editingPlayerId ? updatedPlayer : player
      ));
      
      setEditingPlayerId(null);
      resetPlayerForm();
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit player
  const handleEditPlayer = (player) => {
    setEditingPlayerId(player._id);
    // Map the backend field name to the frontend field name if needed
    const playerForEdit = {
      ...player,
      Bowling_Strike_Rate: player.Bowling_Strike_Rate || player.Balling_Strike_Rate || 0
    };
    setNewPlayer(playerForEdit);
    setIsAddingPlayer(false); // Ensure we're in edit mode, not add mode
  };

  // Delete player
  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        const response = await fetch(`http://localhost:6001/players/${playerId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete player');
        }
        
        setPlayers(players.filter(player => player._id !== playerId));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Calculate derived stats
  const calculateStats = (e, field, value) => {
    const updatedPlayer = { ...newPlayer };
    updatedPlayer[field] = value;
    
    // Auto-calculate strike rates, averages, etc. when relevant fields change
    if (['Total_Runs', 'Balls_Faced', 'Innings_Played', 'Wickets', 'Overs_Bowled', 'Runs_Conceded'].includes(field)) {
      // Batting Strike Rate = (Total Runs / Balls Faced) * 100
      if (updatedPlayer.Balls_Faced > 0) {
        updatedPlayer.Batting_Strike_Rate = (updatedPlayer.Total_Runs / updatedPlayer.Balls_Faced) * 100;
      } else {
        updatedPlayer.Batting_Strike_Rate = 0;
      }
      
      // Batting Average = Total Runs / Innings Played
      if (updatedPlayer.Innings_Played > 0) {
        updatedPlayer.Batting_Average = updatedPlayer.Total_Runs / updatedPlayer.Innings_Played;
      } else {
        updatedPlayer.Batting_Average = 0;
      }
      
      // Bowling Strike Rate = (Overs Bowled * 6) / Wickets
      if (updatedPlayer.Wickets > 0) {
        updatedPlayer.Bowling_Strike_Rate = (updatedPlayer.Overs_Bowled * 6) / updatedPlayer.Wickets;
      } else {
        updatedPlayer.Bowling_Strike_Rate = 0;
      }
      
      // Economy Rate = Runs Conceded / Overs Bowled
      if (updatedPlayer.Overs_Bowled > 0) {
        updatedPlayer.Economy_Rate = updatedPlayer.Runs_Conceded / updatedPlayer.Overs_Bowled;
      } else {
        updatedPlayer.Economy_Rate = 0;
      }
      
      // Points calculation (simplified example)
      updatedPlayer.Points = (updatedPlayer.Batting_Average + (updatedPlayer.Wickets * 2)) / 2;
      
      // Value calculation (simplified example)
      updatedPlayer.Value_In_Rupee = updatedPlayer.Points * 2867;
    }
    
    setNewPlayer(updatedPlayer);
  };

  // Handle input change
  const handleInputChange = (e, field) => {
    const value = e.target.type === 'number' ? 
      (e.target.step === '0.1' ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0) : 
      e.target.value;
    
    if (['Total_Runs', 'Balls_Faced', 'Innings_Played', 'Wickets', 'Overs_Bowled', 'Runs_Conceded'].includes(field)) {
      calculateStats(e, field, value);
    } else {
      setNewPlayer({...newPlayer, [field]: value});
    }
  };

  if (loading) return <div className="text-center p-8">Loading players data...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Sprint11 Players Management</h1>
      
      {/* Filters and Search */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search players..." 
              className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-48">
            <select 
              className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="w-48">
            <select 
              className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            onClick={() => {
              resetPlayerForm();
              setIsAddingPlayer(true);
              setEditingPlayerId(null);
            }}
          >
            Add Player
          </button>
        </div>
      </div>
      
      {/* Add/Edit Player Form */}
      {(isAddingPlayer || editingPlayerId) && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">{editingPlayerId ? 'Edit Player' : 'Add New Player'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.Name}
                onChange={(e) => handleInputChange(e, 'Name')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">University</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.University}
                onChange={(e) => handleInputChange(e, 'University')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category <span className="text-red-500">*</span></label>
              <select 
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.Category}
                onChange={(e) => handleInputChange(e, 'Category')}
                required
              >
                <option value="">Select Category</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket-Keeper">Wicket-Keeper</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.Team_Name}
                onChange={(e) => handleInputChange(e, 'Team_Name')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Runs</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.Total_Runs}
                onChange={(e) => handleInputChange(e, 'Total_Runs')}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Balls Faced</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.Balls_Faced}
                onChange={(e) => handleInputChange(e, 'Balls_Faced')}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Innings Played</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.Innings_Played}
                onChange={(e) => handleInputChange(e, 'Innings_Played')}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Wickets</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.Wickets}
                onChange={(e) => handleInputChange(e, 'Wickets')}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Overs Bowled</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.Overs_Bowled}
                onChange={(e) => handleInputChange(e, 'Overs_Bowled')}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Runs Conceded</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-blue-300 rounded"
                value={newPlayer.Runs_Conceded}
                onChange={(e) => handleInputChange(e, 'Runs_Conceded')}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Batting Strike Rate</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full px-3 py-2 border border-blue-300 rounded bg-gray-100"
                value={newPlayer.Batting_Strike_Rate.toFixed(2)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Batting Average</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full px-3 py-2 border border-blue-300 rounded bg-gray-100"
                value={newPlayer.Batting_Average.toFixed(2)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bowling Strike Rate</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full px-3 py-2 border border-blue-300 rounded bg-gray-100"
                value={newPlayer.Bowling_Strike_Rate.toFixed(2)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Economy Rate</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full px-3 py-2 border border-blue-300 rounded bg-gray-100"
                value={newPlayer.Economy_Rate.toFixed(2)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Points</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full px-3 py-2 border border-blue-300 rounded bg-gray-100"
                value={newPlayer.Points.toFixed(2)}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Value (Rs)</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full px-3 py-2 border border-blue-300 rounded bg-gray-100"
                value={newPlayer.Value_In_Rupee.toFixed(2)}
                readOnly
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button 
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
              onClick={() => {
                setIsAddingPlayer(false);
                setEditingPlayerId(null);
                resetPlayerForm();
              }}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
              onClick={editingPlayerId ? handleUpdatePlayer : handleAddPlayer}
            >
              {editingPlayerId ? 'Update Player' : 'Add Player'}
            </button>
          </div>
        </div>
      )}
      
      {/* Players Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Team</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Uni</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Innings</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Runs</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Bat SR</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Bat Avg</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Wickets</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Econ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Points</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Value (Rs)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-100">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map(player => (
                <tr key={player._id} className="hover:bg-blue-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-900">{player.Name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-500">{player.Category}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{player.Team_Name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{player.University}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{player.Innings_Played}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{player.Total_Runs}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {typeof player.Batting_Strike_Rate === 'number' ? player.Batting_Strike_Rate.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {typeof player.Batting_Average === 'number' ? player.Batting_Average.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{player.Wickets}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {typeof player.Economy_Rate === 'number' ? player.Economy_Rate.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                    {typeof player.Points === 'number' ? player.Points.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                    Rs. {typeof player.Value_In_Rupee === 'number' ? player.Value_In_Rupee.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditPlayer(player)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(player._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="text-center py-4 text-gray-500">No players found matching the criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayersTable;