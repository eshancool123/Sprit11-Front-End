import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PlayerStatsView = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:6001/players');
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const data = await response.json();
        setPlayers(data);
        setFilteredPlayers(data);
        if (data.length > 0) {
          setSelectedPlayer(data[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter(player => player.Category === filter);
      setFilteredPlayers(filtered);
      
      // If the currently selected player doesn't match the filter, select the first matching player
      if (filtered.length > 0 && selectedPlayer && selectedPlayer.Category !== filter) {
        setSelectedPlayer(filtered[0]);
      }
    }
  }, [filter, players, selectedPlayer]);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading player data...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Player Selection Sidebar (30%) */}
      <div className="w-1/4 bg-white shadow-md overflow-y-auto flex flex-col">
        <div className="p-4 bg-blue-600 text-white">
          <h2 className="text-xl font-bold">Players</h2>
        </div>
        
        {/* Filter Buttons */}
        <div className="p-3 bg-gray-50 border-b">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('All')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'Batsman' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('Batsman')}
            >
              Batsman
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'Bowler' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('Bowler')}
            >
              Bowler
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'All-Rounder' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('All-Rounder')}
            >
              All-Rounder
            </button>
          </div>
        </div>
        
        {/* Player List */}
        <div className="divide-y divide-gray-200 flex-grow overflow-auto">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <div 
                key={player._id} 
                className={`p-4 cursor-pointer hover:bg-blue-50 ${selectedPlayer && selectedPlayer._id === player._id ? 'bg-blue-100' : ''}`}
                onClick={() => handlePlayerSelect(player)}
              >
                <div className="font-medium">{player.Name}</div>
                <div className="text-sm text-gray-500">{player.Category} | {player.University}</div>
                <div className="text-xs text-gray-400 mt-1">Value: ₹{parseFloat(player.Value_In_Rupee).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No players found in this category</div>
          )}
        </div>
      </div>
      
      {/* Player Statistics View (70%) */}
      <div className="w-3/4 overflow-y-auto p-6">
        {selectedPlayer ? (
          <PlayerStats player={selectedPlayer} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a player to view statistics</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PlayerStats = ({ player }) => {
  // Prepare data for charts
  const battingData = [
    { name: 'Total Runs', value: player.Total_Runs },
    { name: 'Balls Faced', value: player.Balls_Faced },
    { name: 'Strike Rate', value: parseFloat(player.Batting_Strike_Rate).toFixed(2) },
  ];
  
  const bowlingData = [
    { name: 'Wickets', value: player.Wickets },
    { name: 'Overs', value: player.Overs_Bowled },
    { name: 'Economy', value: parseFloat(player.Economy_Rate).toFixed(2) },
  ];

  const valueData = [
    { name: 'Points', value: parseFloat(player.Points).toFixed(2) },
    { name: 'Value (K₹)', value: parseFloat(player.Value_In_Rupee / 1000).toFixed(2) },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold">{player.Name}</h2>
        <p className="text-blue-100">{player.Category} | {player.University}</p>
        <div className="mt-2 bg-blue-700 inline-block px-3 py-1 rounded-full text-sm">Team: {player.Team_Name || 'Not Assigned'}</div>
      </div>
      
      <div className="p-6">
        {/* Value Card */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Player Value</p>
              <p className="font-bold text-blue-800 text-2xl">Rs.{parseFloat(player.Value_In_Rupee).toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Points</p>
              <p className="font-bold text-blue-800 text-2xl">{parseFloat(player.Points).toFixed(2)}</p>
            </div>
            <div className="h-32 md:h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={valueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b border-blue-100 pb-2">
              Batting Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Runs</p>
                <p className="font-medium">{player.Total_Runs}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Innings Played</p>
                <p className="font-medium">{player.Innings_Played}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Batting Average</p>
                <p className="font-medium">{parseFloat(player.Batting_Average).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Strike Rate</p>
                <p className="font-medium">{parseFloat(player.Batting_Strike_Rate).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Balls Faced</p>
                <p className="font-medium">{player.Balls_Faced}</p>
              </div>
            </div>
            
            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={battingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b border-blue-100 pb-2">
              Bowling Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Wickets</p>
                <p className="font-medium">{player.Wickets}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Overs Bowled</p>
                <p className="font-medium">{player.Overs_Bowled}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Runs Conceded</p>
                <p className="font-medium">{player.Runs_Conceded}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Economy Rate</p>
                <p className="font-medium">{parseFloat(player.Economy_Rate).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bowling Strike Rate</p>
                <p className="font-medium">{parseFloat(player.Balling_Strike_Rate).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bowlingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsView;