import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dashboardData } from '../utils/dashboardUtils';

interface ChartsSectionProps {
  last7Days: any[];
  categoryData: any[];
  userStats: any;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  last7Days,
  categoryData,
  userStats
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Weekly Progress Chart */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
          Weekly Progress
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={last7Days}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
            <Line
              type="monotone"
              dataKey="problems"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Problem Categories Pie */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-500" />
          Problem Categories
        </h3>
        <div className="flex justify-center mb-4">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {dashboardData.categories.map((cat) => (
            <div key={cat.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm">{cat.name}</span>
              </div>
              <span className="text-sm font-semibold">
                {userStats.problemsByCategory[cat.key as keyof typeof userStats.problemsByCategory]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
