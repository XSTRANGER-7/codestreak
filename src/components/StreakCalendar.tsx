
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import { useUserData } from '../contexts/UserDataContext';

export const StreakCalendar: React.FC = () => {
  const { userStats, getStreakCalendar } = useUserData();
  const calendarData = getStreakCalendar();

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-white/5 border-white/10';
    if (count === 1) return 'bg-purple-500/20 border-purple-500/30';
    if (count === 2) return 'bg-purple-500/40 border-purple-500/50';
    if (count >= 3) return 'bg-purple-500/60 border-purple-500/70';
    return 'bg-white/5 border-white/10';
  };

  const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDay();
  };

  // Group data into weeks
  const weeks: Array<Array<typeof calendarData[0]>> = [];
  let currentWeek: Array<typeof calendarData[0]> = [];

  calendarData.forEach((day, index) => {
    if (index === 0) {
      const dayOfWeek = getDayOfWeek(day.date);
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({ date: '', active: false, count: 0 });
      }
    }

    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', active: false, count: 0 });
    }
    weeks.push(currentWeek);
  }

  const totalActiveDays = calendarData.filter(day => day.active).length;
  const averageProblemsPerDay = totalActiveDays > 0
    ? (calendarData.reduce((sum, day) => sum + day.count, 0) / totalActiveDays).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-purple-500" />
          Consistency Calendar
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Current Streak" value={userStats.currentStreak} color="text-orange-500" />
        <StatCard title="Best Streak" value={userStats.maxStreak} color="text-yellow-500" />
        <StatCard title="Active Days" value={totalActiveDays} color="text-green-500" />
        <StatCard title="Avg Problems/Day" value={averageProblemsPerDay} color="text-purple-500" />
      </div>

      {/* Calendar & Recent Activity */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 w-full lg:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4">Last 30 Days</h3>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
            {[0, 1, 2, 3].map((count) => (
              <div key={count} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-sm border ${getIntensityClass(count)}`}></div>
                <span>{count === 0 ? 'No activity' : count === 3 ? '3+ problems' : `${count} problem${count > 1 ? 's' : ''}`}</span>
              </div>
            ))}
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs text-center text-gray-400">{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`aspect-square rounded-sm border transition-all duration-200 hover:scale-110 ${day.date ? getIntensityClass(day.count) : 'bg-transparent border-transparent'}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                    title={day.date ? `${day.date}: ${day.count} problems solved` : ''}
                  >
                    {day.date && day.count > 0 && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{day.count}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          {/* Month labels */}
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            {calendarData.length > 0 && (
              <>
                <span>{getMonthName(calendarData[0].date)}</span>
                <span>{getMonthName(calendarData[calendarData.length - 1].date)}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 w-full lg:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
            Recent Activity
          </h3>

          <div className="space-y-3">
            {userStats.dailyActivities.length > 0 ? (
              userStats.dailyActivities.slice(-7).reverse().map((activity, index) => (
                <motion.div
                  key={activity.date}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getIntensityClass(activity.problemsSolved).split(' ')[0]}`} />
                    <div>
                      <div className="font-medium text-sm">{activity.date}</div>
                      <div className="text-xs text-gray-400">
                        {activity.categories.join(', ')} • {activity.timeSpent}m
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{activity.problemsSolved}</div>
                    <div className="text-xs text-gray-400">problems</div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No activity yet. Start solving problems to see your progress!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; color: string }> = ({ title, value, color }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-gray-400">{title}</div>
  </div>
);
