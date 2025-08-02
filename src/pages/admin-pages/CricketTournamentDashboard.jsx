import React, { useState, useEffect } from 'react';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Users, Database } from 'lucide-react';

const PlayersDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'Points', direction: 'desc' });

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:6001/players');
        if (!response.ok) {
          throw new Error('Failed to fetch player data');
        }
        const data = await response.json();
        setPlayers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const sortedPlayers = React.useMemo(() => {
    let sortableItems = [...players];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [players, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredPlayers = activeTab === 'all' 
    ? sortedPlayers 
    : sortedPlayers.filter(player => player.Category === activeTab);

  const getTopBatsman = () => {
    return players
      .filter(player => player.Category === 'Batsman')
      .sort((a, b) => b.Total_Runs - a.Total_Runs)[0];
  };

  const getTopBowler = () => {
    return players
      .filter(player => player.Category === 'Bowler')
      .sort((a, b) => b.Wickets - a.Wickets)[0];
  };

  const getPlayerPerformanceData = (player) => {
    if (!player) return [];
    return [
      { name: 'Runs', value: player.Total_Runs },
      { name: 'SR', value: player.Batting_Strike_Rate },
      { name: 'Avg', value: player.Batting_Average },
      { name: 'Wickets', value: player.Wickets * 10 } // Multiply wickets to make it visible on the chart
    ];
  };

  const topBatsman = getTopBatsman();
  const topBowler = getTopBowler();

  const categoryStats = React.useMemo(() => {
    const stats = {
      totalBatsmen: 0,
      totalBowlers: 0,
      totalAllRounders: 0,
      totalPlayers: players.length
    };

    players.forEach(player => {
      if (player.Category === 'Batsman') stats.totalBatsmen++;
      else if (player.Category === 'Bowler') stats.totalBowlers++;
      else if (player.Category === 'All-Rounder') stats.totalAllRounders++;
    });

    return stats;
  }, [players]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-blue-600 text-xl">Loading player data...</div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 p-4 rounded-lg">
      <p className="text-red-700">Error: {error}</p>
      <p>Please check that your server is running at http://localhost:6001</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Spirit11 - Players Dashboard</h1>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-500">Total Players</p>
              <p className="text-2xl font-bold">{categoryStats.totalPlayers}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-500">Batsmen</p>
              <p className="text-2xl font-bold">{categoryStats.totalBatsmen}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-500">Bowlers</p>
              <p className="text-2xl font-bold">{categoryStats.totalBowlers}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-500">All-Rounders</p>
              <p className="text-2xl font-bold">{categoryStats.totalAllRounders}</p>
            </div>
          </div>
        </div>
        
        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Top Batsman */}
          {topBatsman && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Trophy className="text-yellow-500 mr-2" size={24} />
                <h2 className="text-xl font-bold">Top Batsman</h2>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-blue-800">
                    {topBatsman.Name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{topBatsman.Name}</h3>
                  <p className="text-gray-500">{topBatsman.University}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-blue-500">Runs</p>
                  <p className="text-xl font-bold">{topBatsman.Total_Runs}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-blue-500">Average</p>
                  <p className="text-xl font-bold">{topBatsman.Batting_Average.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-blue-500">Strike Rate</p>
                  <p className="text-xl font-bold">{topBatsman.Batting_Strike_Rate.toFixed(2)}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getPlayerPerformanceData(topBatsman)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {/* Top Bowler */}
          {topBowler && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Target className="text-red-500 mr-2" size={24} />
                <h2 className="text-xl font-bold">Top Bowler</h2>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-red-800">
                    {topBowler.Name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{topBowler.Name}</h3>
                  <p className="text-gray-500">{topBowler.University}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-red-500">Wickets</p>
                  <p className="text-xl font-bold">{topBowler.Wickets}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-red-500">Economy</p>
                  <p className="text-xl font-bold">{topBowler.Economy_Rate.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-red-500">SR</p>
                  <p className="text-xl font-bold">{topBowler.Balling_Strike_Rate.toFixed(2)}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getPlayerPerformanceData(topBowler)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        {/* Players List */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="text-blue-500 mr-2" size={24} />
              <h2 className="text-xl font-bold">Players List</h2>
            </div>
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'Batsman' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('Batsman')}
              >
                Batsmen
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'Bowler' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('Bowler')}
              >
                Bowlers
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">University</th>
                  <th className="py-2 px-4 text-center cursor-pointer" onClick={() => requestSort('Category')}>Category</th>
                  <th className="py-2 px-4 text-center cursor-pointer" onClick={() => requestSort('Total_Runs')}>Runs</th>
                  <th className="py-2 px-4 text-center cursor-pointer" onClick={() => requestSort('Wickets')}>Wickets</th>
                  <th className="py-2 px-4 text-center cursor-pointer" onClick={() => requestSort('Batting_Average')}>Bat Avg</th>
                  <th className="py-2 px-4 text-center cursor-pointer" onClick={() => requestSort('Batting_Strike_Rate')}>Bat SR</th>
                  <th className="py-2 px-4 text-center cursor-pointer" onClick={() => requestSort('Economy_Rate')}>Economy</th>
                  <th className="py-2 px-4 text-center cursor-pointer" onClick={() => requestSort('Points')}>Points</th>
                  <th className="py-2 px-4 text-center">Team</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, index) => (
                  <tr key={player._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 font-medium">{player.Name}</td>
                    <td className="py-2 px-4">{player.University}</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        player.Category === 'Batsman' ? 'bg-blue-100 text-blue-800' : 
                        player.Category === 'Bowler' ? 'bg-red-100 text-red-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {player.Category}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">{player.Total_Runs}</td>
                    <td className="py-2 px-4 text-center">{player.Wickets}</td>
                    <td className="py-2 px-4 text-center">{player.Batting_Average.toFixed(2)}</td>
                    <td className="py-2 px-4 text-center">{player.Batting_Strike_Rate.toFixed(2)}</td>
                    <td className="py-2 px-4 text-center">{player.Economy_Rate.toFixed(2)}</td>
                    <td className="py-2 px-4 text-center font-bold">{player.Points.toFixed(2)}</td>
                    <td className="py-2 px-4 text-center">
                      {player.Team_Name === 'None' ? 
                        <span className="text-gray-400">Unsigned</span> : 
                        <span className="font-medium">{player.Team_Name}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Player Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Database className="text-purple-500 mr-2" size={24} />
            <h2 className="text-xl font-bold">Player Statistics Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg">
              <p className="text-blue-500 text-sm">Avg. Batting SR</p>
              <p className="text-2xl font-bold text-blue-700">
                {(players.reduce((acc, player) => acc + player.Batting_Strike_Rate, 0) / players.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-red-50 p-4 rounded-lg">
              <p className="text-red-500 text-sm">Avg. Economy Rate</p>
              <p className="text-2xl font-bold text-red-700">
                {(players.reduce((acc, player) => acc + player.Economy_Rate, 0) / players.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg">
              <p className="text-green-500 text-sm">Total Runs Scored</p>
              <p className="text-2xl font-bold text-green-700">
                {players.reduce((acc, player) => acc + player.Total_Runs, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 rounded-lg">
              <p className="text-purple-500 text-sm">Total Wickets Taken</p>
              <p className="text-2xl font-bold text-purple-700">
                {players.reduce((acc, player) => acc + player.Wickets, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersDashboard;