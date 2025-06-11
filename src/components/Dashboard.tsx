import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Coins, 
  Target, 
  Calendar, 
  Trophy, 
  TrendingUp,
  Code,
  Database,
  Layers,
  GitBranch,
  Settings,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle,
  Play,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { GridBackground } from './GridBackground';
import { ProblemSolver } from './ProblemSolver';
import { StreakCalendar } from './StreakCalendar';
import YearCal from './YearCal';
import { DateTime } from 'luxon';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();
  const { userStats, availableProblems, getStreakCalendar } = useUserData();
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'calendar' | 'analytics'>('overview');

  const categories = [
    { key: 'algorithms', name: 'Algorithms', icon: Code, color: '#8b5cf6' },
    { key: 'dataStructures', name: 'Data Structures', icon: Database, color: '#f59e0b' },
    { key: 'systemDesign', name: 'System Design', icon: Layers, color: '#ef4444' },
    { key: 'databases', name: 'Databases', icon: GitBranch, color: '#10b981' }
  ];
 


  const last7Days = Array.from({ length: 7 }, (_, i) => {
  const date = DateTime.now()
    .setZone('Asia/Kolkata')
    .minus({ days: 6 - i });

  const dateString = date.toISODate(); // Format: YYYY-MM-DD
  const day = date.toFormat('ccc'); // Short day name like Mon, Tue

  const activity = userStats.dailyActivities.find(a => a.date === dateString);

  return {
    day,
    problems: activity?.problemsSolved || 0,
    date: dateString
  };
});


  const categoryData = categories.map(cat => ({
    name: cat.name,
    value: userStats.problemsByCategory[cat.key as keyof typeof userStats.problemsByCategory],
    color: cat.color
  }));

  const difficultyData = [
    { name: 'Easy', value: userStats.problemsByDifficulty.easy, color: '#10b981' },
    { name: 'Medium', value: userStats.problemsByDifficulty.medium, color: '#f59e0b' },
    { name: 'Hard', value: userStats.problemsByDifficulty.hard, color: '#ef4444' }
  ];

  const unsolvedProblems = availableProblems.filter(
    problem => !userStats.solvedProblems.find(solved => solved.id === problem.id)
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'problems':
        return <ProblemSolver problems={unsolvedProblems} />;
      case 'calendar':
        return <StreakCalendar />;
      case 'analytics':
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
                .map((problem) => (
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
              (acc, day) => acc + day.timeSpent,
              0
            )}
            m
          </div>
          <div className="text-sm text-gray-400">Total Time</div>
        </div>
      </div>
    </div>
  );

      default:
        return (
          <>
            {/* Header Stats */}
            <div className="space-y-8">


  {/* Stats Cards */}
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    {/* Card 1 */}
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">{userStats.currentStreak}</div>
          <div className="text-gray-400">Current Streak</div>
        </div>
        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
          <Flame className="w-6 h-6 text-orange-500" />
        </div>
      </div>
    </div>

    {/* Card 2 */}
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">{userStats.maxStreak}</div>
          <div className="text-gray-400">Max Streak</div>
        </div>
        <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
      </div>
    </div>

    {/* Card 3 */}
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">{userStats.coins}</div>
          <div className="text-gray-400">Coins</div>
        </div>
        <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
          <Coins className="w-6 h-6 text-yellow-500" />
        </div>
      </div>
    </div>

    {/* Card 4 */}
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">{userStats.totalProblems}</div>
          <div className="text-gray-400">Total Problems</div>
        </div>
        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <Target className="w-6 h-6 text-purple-500" />
        </div>
      </div>
    </div>
  </motion.div>

  {/* Charts Section */}
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
        {categories.map((cat) => (
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

  {/* Quick Actions */}
  <motion.div
    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.8 }}
  >
    <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Solve Problems */}
      <motion.button
        onClick={() => setActiveTab('problems')}
        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-center transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="w-8 h-8 mx-auto mb-2 text-purple-500" />
        <div className="font-semibold">Solve Problems</div>
        <div className="text-sm text-gray-400">{unsolvedProblems.length} available</div>
      </motion.button>

      {/* View Calendar */}
      <motion.button
        onClick={() => setActiveTab('calendar')}
        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-center transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Calendar className="w-8 h-8 mx-auto mb-2 text-green-500" />
        <div className="font-semibold">View Calendar</div>
        <div className="text-sm text-gray-400">Track consistency</div>
      </motion.button>

      {/* Analytics */}
      <motion.button
        onClick={() => setActiveTab('analytics')}
        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-center transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
        <div className="font-semibold">Analytics</div>
        <div className="text-sm text-gray-400">Detailed stats</div>
      </motion.button>

      {/* Store */}
      <motion.button
        onClick={() => onNavigate('store')}
        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-center transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
        <div className="font-semibold">Store</div>
        <div className="text-sm text-gray-400">Spend coins</div>
      </motion.button>
    </div>
  </motion.div>

  {/* Year Calendar */}
  <motion.div
    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mt-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 1 }}
  >
    <YearCal />
  </motion.div>

</div>
          </>
        );
    }
  };

  return (
 <div className="min-h-screen bg-black text-white relative">
      <GridBackground />

      <div className="items-center pl-4 pt-4 space-x-2 sm:hidden flex">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold ">CodeStreak</span>
          </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden absolute top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <motion.div
  className={`fixed lg:static top-0 right-0 z-40 h-full lg:h-auto w-64 bg-white/5 backdrop-blur-sm border-l border-white/10 p-6 transform transition-transform duration-300 ${
    sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
  }`}
  initial={false}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
          {/* Branding */}
          <div className=" items-center space-x-2 mb-8 sm:flex hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold ">CodeStreak</span>
          </div>

          {/* Navigation */}
          <div className="space-y-2 mb-8 mt-12 sm:mt-2">
            {[
              { key: "overview", label: "Overview", icon: <Target className="w-5 h-5" /> },
              { key: "problems", label: "Problems", icon: <Code className="w-5 h-5" /> },
              { key: "calendar", label: "Calendar", icon: <Calendar className="w-5 h-5" /> },
              { key: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === key
                    ? "bg-purple-600/20 text-purple-300"
                    : "hover:bg-white/10"
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}

            {/* Store */}
            <button
              onClick={() => {
                onNavigate("store");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Store</span>
            </button>

            {/* Settings */}
            {/* <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button> */}
          </div>

          {/* User Info & Logout */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=8b5cf6&color=fff`
                }
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-semibold">
                  {user?.displayName || user?.email?.split("@")[0]}
                </div>
                <div className="text-sm text-gray-400">
                  {userStats.totalProblems} problems solved
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* Overlay when sidebar open on mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8 mt-2 sm:mt-20 lg:mt-0">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};