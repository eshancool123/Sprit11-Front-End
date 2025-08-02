import React, { useState, useEffect } from 'react';

const SelectYourTeamView = () => {
  // Team budget and player data
  const [budget] = useState(1000000);
  const [remainingBudget, setRemainingBudget] = useState(1000000);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const maxTeamSize = 11;

  // Updated handleClick function with the new endpoint
  const handleClick = async () => {
    if (selectedPlayers.length === 0) {
      alert("Please select at least one player for your team!");
      return;
    }

    try {
      setIsSaving(true);
      // Extract player IDs from the selected players
      const playerIds = selectedPlayers.map(player => player._id);
      
      // Updated API endpoint and method
      const response = await fetch('http://localhost:6001/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName: "SS",
          playerIds: playerIds
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      alert("Team saved successfully!");
      // You could redirect or update UI state here
    } catch (err) {
      console.error("Error saving team:", err);
      alert("Error saving team: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Updated fetch players endpoint
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:6001/none');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPlayers(data.players || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Get unique categories for filtering
  const categories = players.length > 0 
    ? ['All', ...new Set(players.map(player => player.Category))]
    : ['All'];

  // Update remaining budget when team changes
  useEffect(() => {
    const totalCost = selectedPlayers.reduce((sum, player) => sum + player.Value_In_Rupee, 0);
    setRemainingBudget(budget - totalCost);
  }, [selectedPlayers, budget]);

  // Add player to team
  const addPlayerToTeam = (player) => {
    // Check if player is already in team
    if (selectedPlayers.some(p => p._id === player._id)) {
      alert("This player is already in your team!");
      return;
    }
    
    // Check if adding player exceeds budget
    if (remainingBudget < player.Value_In_Rupee) {
      alert("Adding this player would exceed your budget!");
      return;
    }
    
    // Check if team is already full
    if (selectedPlayers.length >= maxTeamSize) {
      alert(`Your team can only have ${maxTeamSize} players!`);
      return;
    }
    
    setSelectedPlayers([...selectedPlayers, player]);
  };
  
  // Remove player from team
  const removePlayerFromTeam = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter(player => player._id !== playerId));
  };

  // Filter players by category and search term
  const filteredPlayers = players.filter(player => {
    const matchesFilter = activeFilter === 'All' || player.Category === activeFilter;
    const matchesSearch = player.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          player.University.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Budget status indicator color
  const getBudgetStatusColor = () => {
    const budgetPercentage = (remainingBudget / budget) * 100;
    if (budgetPercentage > 50) return 'text-green-600';
    if (budgetPercentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center items-center">
      <p className="text-xl">Loading available players...</p>
    </div>
  );

  if (error) return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center items-center">
      <p className="text-xl text-red-600">Error: {error}</p>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Player selection */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-4">
            <h1 className="text-2xl font-bold mb-4">Select Your Cricket Team</h1>
            
            {/* Budget indicator */}
            <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
              <div>
                <h2 className="font-semibold">Team Budget</h2>
                <p className={`text-lg font-bold ${getBudgetStatusColor()}`}>
                  Rs.{remainingBudget.toLocaleString()} / Rs. {budget.toLocaleString()} remaining
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Team Size</p>
                <p className="text-lg font-bold">
                  {selectedPlayers.length} / {maxTeamSize} players
                </p>
              </div>
            </div>
            
            {/* Search and filters */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search players or universities..."
                className="w-full p-2 border border-gray-300 rounded mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeFilter === category 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    onClick={() => setActiveFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Player grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlayers.map(player => {
                const isSelected = selectedPlayers.some(p => p._id === player._id);
                
                return (
                  <div 
                    key={player._id}
                    className={`border rounded-lg p-3 ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <img 
                        src={player.Img || "/api/placeholder/80/80"} 
                        alt={player.Name} 
                        className="w-16 h-16 rounded-full mr-3 object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{player.Name}</h3>
                        <p className="text-sm text-gray-600">{player.Category}</p>
                        <p className="text-sm text-gray-600">{player.University}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">Rs.{Math.round(player.Value_In_Rupee).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Points: {player.Points.toFixed(1)}</p>
                        <button
                          className={`mt-1 px-3 py-1 rounded text-sm ${
                            isSelected 
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : remainingBudget < player.Value_In_Rupee
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          onClick={() => isSelected ? removePlayerFromTeam(player._id) : addPlayerToTeam(player)}
                          disabled={!isSelected && remainingBudget < player.Value_In_Rupee}
                        >
                          {isSelected ? 'Remove' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredPlayers.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No players match your criteria.
                </div>
              )}
            </div>
          </div>
          
          {/* Right column - Selected team */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Your Cricket Team</h2>
            
            {selectedPlayers.length > 0 ? (
              <div className="space-y-3">
                {selectedPlayers.map(player => (
                  <div key={player._id} className="flex items-center border-b border-gray-200 pb-3">
                    <img 
                      src={player.Img || "/api/placeholder/80/80"} 
                      alt={player.Name} 
                      className="w-12 h-12 rounded-full mr-3 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{player.Name}</h3>
                      <p className="text-sm text-gray-600">{player.Category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">Rs.{Math.round(player.Value_In_Rupee).toLocaleString()}</p>
                      <button
                        className="text-red-600 text-sm hover:text-red-800"
                        onClick={() => removePlayerFromTeam(player._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between font-semibold">
                    <span>Total Cost:</span>
                    <span>Rs. {(budget - remainingBudget).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Remaining Budget:</span>
                    <span className={getBudgetStatusColor()}>Rs.{remainingBudget.toLocaleString()}</span>
                  </div>
                </div>
                
                <button 
                  className={`w-full mt-6 font-medium py-2 rounded-lg ${
                    isSaving 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  onClick={handleClick}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Team'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <p className="text-center">Your team is empty. Add players from the selection panel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectYourTeamView;