import React, { useState, useEffect } from 'react';

// Demo data for budget
const DEMO_BUDGET_DATA = {
  total: 9000000,
  remaining: 3550000,
  spent: 5450000,
  players: [
    { 
      id: 1, 
      name: "Danushka Kumara", 
      university: "University of Colombo", 
      category: "Batsman", 
      value: 850000 
    },
    { 
      id: 2, 
      name: "Jeewan Thirimanne", 
      university: "University of Moratuwa", 
      category: "Batsman", 
      value: 900000
    },
    { 
      id: 3, 
      name: "Charith Shanaka", 
      university: "University of Peradeniya", 
      category: "All-Rounder", 
      value: 1150000
    },
    { 
      id: 4, 
      name: "Pathum Dhananjaya", 
      university: "University of Colombo", 
      category: "Batsman", 
      value: 750000
    },
    { 
      id: 5, 
      name: "Suranga Bandara", 
      university: "University of Moratuwa", 
      category: "Bowler", 
      value: 950000
    },
    { 
      id: 6, 
      name: "Sammu Sandakan", 
      university: "University of Peradeniya", 
      category: "Bowler", 
      value: 800000
    },
    { 
      id: 7, 
      name: "Minod Rathnayake", 
      university: "University of Colombo", 
      category: "All-Rounder", 
      value: 1050000
    }
  ]
};

const BudgetView = () => {
  const [budget, setBudget] = useState({
    total: 9000000,
    remaining: 9000000,
    spent: 0,
    players: []
  });
  
  useEffect(() => {
    // Use demo data instead of fetch
    setBudget(DEMO_BUDGET_DATA);
  }, []);
  
  // Calculate percentage of budget spent
  const percentageSpent = (budget.spent / budget.total) * 100;
  const percentageRemaining = 100 - percentageSpent;
  
  // Function to format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };
  
  // Sort players by value (highest to lowest)
  const sortedPlayers = [...budget.players].sort((a, b) => b.value - a.value);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Budget Summary Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Budget Summary</h2>
              <p className="text-sm text-gray-500">Your team budget allocation</p>
            </div>
            <div className="p-4">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Total Budget</span>
                    <span className="text-sm font-medium">{formatCurrency(budget.total)}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-green-600">Remaining</span>
                    <span className="text-sm font-medium text-green-600">{formatCurrency(budget.remaining)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${percentageRemaining}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-blue-600">Spent</span>
                    <span className="text-sm font-medium text-blue-600">{formatCurrency(budget.spent)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${percentageSpent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Budget Allocation Card */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Budget Allocation</h2>
              <p className="text-sm text-gray-500">Spending on each player in your team</p>
            </div>
            <div className="p-4">
              {sortedPlayers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">You haven't selected any players yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedPlayers.map((player) => {
                    const playerPercentage = (player.value / budget.total) * 100;
                    
                    return (
                      <div key={player.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{player.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({player.university})</span>
                          </div>
                          <span className="font-medium">{formatCurrency(player.value)}</span>
                        </div>
                        <div className="relative pt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-500 h-2 rounded-full" 
                              style={{ width: `${playerPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{player.category}</span>
                          <span>{playerPercentage.toFixed(1)}% of total budget</span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Budget Breakdown Chart */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-4">Budget Distribution</h3>
                    <div className="h-6 w-full flex rounded-full overflow-hidden">
                      {sortedPlayers.map((player, index) => {
                        const width = (player.value / budget.total) * 100;
                        // Generate a color based on index
                        const colors = [
                          'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                          'bg-red-500', 'bg-purple-500', 'bg-pink-500',
                          'bg-indigo-500', 'bg-teal-500', 'bg-orange-500',
                          'bg-cyan-500', 'bg-lime-500'
                        ];
                        const color = colors[index % colors.length];
                        
                        return (
                          <div 
                            key={player.id} 
                            className={`${color} h-full`} 
                            style={{ width: `${width}%` }}
                            title={`${player.name}: ${formatCurrency(player.value)}`}
                          />
                        );
                      })}
                      
                      {/* Remaining budget section */}
                      {percentageRemaining > 0 && (
                        <div 
                          className="bg-gray-200 h-full" 
                          style={{ width: `${percentageRemaining}%` }}
                          title={`Remaining: ${formatCurrency(budget.remaining)}`}
                        />
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Hover over sections to see player details
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetView;