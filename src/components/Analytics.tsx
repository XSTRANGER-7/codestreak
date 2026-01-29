import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface AnalyticsProps {
  difficultyData: any[];
  userStats: any;
}

export const Analytics: React.FC<AnalyticsProps> = ({ difficultyData, userStats }) => {
  return (
    <div className="space-y-8 px-4 md:px-8 py-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Problems by Difficulty */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
            Problems by Difficulty
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={difficultyData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {userStats.solvedProblems.length > 0 ? (
              userStats.solvedProblems
                .slice(-5)
                .reverse()
                .map((problem: any) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm sm:text-base">{problem.title}</div>
                      <div className="text-sm text-gray-400">
                        {problem.category} • {problem.difficulty}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 whitespace-nowrap">
                      {problem.solvedAt}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No problems solved yet. Start solving to see your activity!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500">
            {userStats.problemsByDifficulty.easy}
          </div>
          <div className="text-sm text-gray-400">Easy Problems</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">
            {userStats.problemsByDifficulty.medium}
          </div>
          <div className="text-sm text-gray-400">Medium Problems</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-500">
            {userStats.problemsByDifficulty.hard}
          </div>
          <div className="text-sm text-gray-400">Hard Problems</div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-500">
            {userStats.dailyActivities.reduce(
              (acc: number, day: any) => acc + day.timeSpent,
              0
            )}
            m
          </div>
          <div className="text-sm text-gray-400">Total Time</div>
        </div>
      </div>
    </div>
  );
};
