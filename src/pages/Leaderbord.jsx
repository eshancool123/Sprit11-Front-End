import React, { useState, useEffect } from 'react';

// Demo data for leaderboard
const DEMO_LEADERBOARD_DATA = {
  rankings: [
    { id: 1, username: "cricket_master", rank: 1, points: 2450, teamValue: 8950000 },
    { id: 2, username: "bowl_wizard", rank: 2, points: 2380, teamValue: 8850000 },
    { id: 3, username: "bat_king", rank: 3, points: 2310, teamValue: 8750000 },
    { id: 4, username: "all_rounder", rank: 4, points: 2270, teamValue: 8900000 },
    { id: 5, username: "spiritx_2025", rank: 5, points: 2180, teamValue: 8650000 },
    { id: 6, username: "cricket_fan", rank: 6, points: 2120, teamValue: 8600000 },
    { id: 7, username: "team_builder", rank: 7, points: 2080, teamValue: 8700000 },
    { id: 8, username: "fantasy_guru", rank: 8, points: 2050, teamValue: 8400000 },
    { id: 9, username: "cricketer123", rank: 9, points: 1980, teamValue: 8300000 },
    { id: 10, username: "pitch_perfect", rank: 10, points: 1950, teamValue: 8250000 },
    { id: 11, username: "spin_master", rank: 11, points: 1920, teamValue: 8200000 },
    { id: 12, username: "cricket_analyst", rank: 12, points: 1880, teamValue: 8150000 },
    { id: 13, username: "captain_cool", rank: 13, points: 1850, teamValue: 8100000 },
    { id: 14, username: "fast_bowler", rank: 14, points: 1810, teamValue: 8050000 },
    { id: 15, username: "cricket_lover", rank: 15, points: 1780, teamValue: 8000000 }
  ],
  currentUser: { id: 5, username: "spiritx_2025", rank: 5, points: 2180, teamValue: 8650000 }
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('global');
  
  useEffect(() => {
    // Use demo data instead of fetch
    setLeaderboard(DEMO_LEADERBOARD_DATA.rankings);
    setCurrentUser(DEMO_LEADERBOARD_DATA.currentUser);
    setLoading(false);
  }, []);
  
  // Get top 10 users
  const topUsers = leaderboard.slice(0, 10);
  
  // Find users with similar ranking to current user
  const getSimilarRankings = () => {
    if (!currentUser) return [];
    
    const currentUserIndex = leaderboard.findIndex(user => user.id === currentUser.id);
    if (currentUserIndex === -1) return [];
    
    const startIndex = Math.max(0, currentUserIndex - 3);
    const endIndex = Math.min(leaderboard.length, currentUserIndex + 4);
    
    return leaderboard.slice(startIndex, endIndex);
  };
  
  const similarRankings = getSimilarRankings();
  
  // Function to get medal emoji based on rank
  const getMedal = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };
  
  // Function to determine if the given user is the current user
  const isCurrentUser = (userId) => {
    return currentUser && currentUser.id === userId;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-center">Spirit11 Leaderboard</h2>
          <p className="text-sm text-gray-500 text-center">
            Compete with other cricket fans for the top spot
          </p>
          
          <div className="flex mt-4 border rounded-md overflow-hidden">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'global' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveTab('global')}
            >
              Global Ranking
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'near-you' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveTab('near-you')}
            >
              Near Your Rank
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading leaderboard...</p>
            </div>
          ) : (
            <>
              {activeTab === 'global' && (
                <LeaderboardTable 
                  users={topUsers} 
                  isCurrentUser={isCurrentUser}
                  getMedal={getMedal}
                  showNote={true}
                />
              )}
              
              {activeTab === 'near-you' && (
                currentUser ? (
                  <LeaderboardTable 
                    users={similarRankings} 
                    isCurrentUser={isCurrentUser}
                    getMedal={getMedal}
                    showNote={false}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Log in to see your ranking</p>
                  </div>
                )
              )}
            </>
          )}
          
          {currentUser && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-md font-medium mb-2">Your Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Rank</p>
                  <p className="text-xl font-bold">{currentUser.rank}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Points</p>
                  <p className="text-xl font-bold">{currentUser.points}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Team Value</p>
                  <p className="text-xl font-bold">Rs. {currentUser.teamValue?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Separate component for the leaderboard table
const LeaderboardTable = ({ users, isCurrentUser, getMedal, showNote }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr 
                  key={user.id}
                  className={isCurrentUser(user.id) ? "bg-blue-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getMedal(user.rank) && (
                      <span className="mr-1">{getMedal(user.rank)}</span>
                    )}
                    {user.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span>{user.username}</span>
                      {isCurrentUser(user.id) && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {user.points}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {showNote && users.length > 0 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Showing top {users.length} players. Use the "Near Your Rank" tab to see rankings around you.
        </p>
      )}
    </>
  );
};

export default Leaderboard;