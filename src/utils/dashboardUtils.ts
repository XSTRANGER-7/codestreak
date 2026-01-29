import { DateTime } from 'luxon';
import dashboardData from '../data/dashboard.json';

export interface DailyActivity {
  date: string;
  problemsSolved: number;
  timeSpent: number;
}

export interface Last7DaysData {
  day: string;
  problems: number;
  date: string;
}

/**
 * Get the last 7 days of activity data
 */
export const getLast7Days = (dailyActivities: DailyActivity[]): Last7DaysData[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = DateTime.now()
      .setZone('Asia/Kolkata')
      .minus({ days: 6 - i });

    const dateString = date.toISODate(); // Format: YYYY-MM-DD
    const day = date.toFormat('ccc'); // Short day name like Mon, Tue

    const activity = dailyActivities.find(a => a.date === dateString);

    return {
      day,
      problems: activity?.problemsSolved || 0,
      date: dateString || ''
    };
  });
};

/**
 * Get category data for charts
 */
export const getCategoryData = (problemsByCategory: any) => {
  return dashboardData.categories.map(cat => ({
    name: cat.name,
    value: problemsByCategory[cat.key as keyof typeof problemsByCategory],
    color: cat.color
  }));
};

/**
 * Get difficulty data for charts
 */
export const getDifficultyData = (problemsByDifficulty: any) => {
  return [
    { name: 'Easy', value: problemsByDifficulty.easy, color: '#10b981' },
    { name: 'Medium', value: problemsByDifficulty.medium, color: '#f59e0b' },
    { name: 'Hard', value: problemsByDifficulty.hard, color: '#ef4444' }
  ];
};

/**
 * Get icon color classes
 */
export const getIconColorClass = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    orange: 'bg-orange-500/20 text-orange-500',
    yellow: 'bg-yellow-500/20 text-yellow-500',
    purple: 'bg-purple-500/20 text-purple-500',
    green: 'bg-green-500/20 text-green-500',
    blue: 'bg-blue-500/20 text-blue-500',
    red: 'bg-red-500/20 text-red-500'
  };
  return colorMap[color] || 'bg-gray-500/20 text-gray-500';
};

export { dashboardData };
