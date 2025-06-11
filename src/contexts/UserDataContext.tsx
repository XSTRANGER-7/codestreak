import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { DateTime } from 'luxon';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solvedAt?: string;
  timeSpent?: number;
}

interface DailyActivity {
  date: string;
  problemsSolved: number;
  categories: string[];
  timeSpent: number;
}

interface UserStats {
  currentStreak: number;
  maxStreak: number;
  totalProblems: number;
  coins: number;
  lastActiveDate: string;
  problemsByCategory: {
    algorithms: number;
    dataStructures: number;
    systemDesign: number;
    databases: number;
  };
  problemsByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  dailyActivities: DailyActivity[];
  solvedProblems: Problem[];
  streakHistory: Array<{ date: string; completed: boolean; count: number }>;
}

interface UserDataContextType {
  userStats: UserStats;
  availableProblems: Problem[];
  updateStreak: () => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  solveProblem: (problemId: string, timeSpent?: number) => void;
  completeProblems: (category: keyof UserStats['problemsByCategory'], count: number) => void;
  getStreakCalendar: () => Array<{ date: string; active: boolean; count: number }>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
 
const SAMPLE_PROBLEMS: Problem[] = [
  { id: '1', title: 'Two Sum', difficulty: 'Easy', category: 'algorithms' },
  { id: '2', title: 'Add Two Numbers', difficulty: 'Medium', category: 'algorithms' },
  { id: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'algorithms' },
  { id: '4', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'algorithms' },
  { id: '5', title: 'Valid Parentheses', difficulty: 'Easy', category: 'dataStructures' },
  { id: '6', title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', category: 'dataStructures' },
  { id: '7', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', category: 'dataStructures' },
  { id: '8', title: 'Design Twitter', difficulty: 'Medium', category: 'systemDesign' },
  { id: '9', title: 'Design URL Shortener', difficulty: 'Medium', category: 'systemDesign' },
  { id: '10', title: 'SQL Query Optimization', difficulty: 'Hard', category: 'databases' },
  { id: '11', title: 'Database Indexing', difficulty: 'Medium', category: 'databases' },
  { id: '12', title: 'Merge Sort Implementation', difficulty: 'Medium', category: 'algorithms' },
  { id: '13', title: 'Graph Traversal BFS/DFS', difficulty: 'Medium', category: 'algorithms' },
  { id: '14', title: 'Dynamic Programming - Fibonacci', difficulty: 'Easy', category: 'algorithms' },
  { id: '15', title: 'Hash Table Implementation', difficulty: 'Medium', category: 'dataStructures' },
  { id: '16', title: 'Binary Search Implementation', difficulty: 'Hard', category: 'dataStructures' },
  { id: '17', title: 'BST Implementation', difficulty: 'Easy', category: 'dataStructures' },
  { id: '18', title: 'Array 3X3 Implementation', difficulty: 'Medium', category: 'dataStructures' },
];

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    maxStreak: 0,
    totalProblems: 0,
    coins: 0,
    lastActiveDate: '',
    problemsByCategory: {
      algorithms: 0,
      dataStructures: 0,
      systemDesign: 0,
      databases: 0,
    },
    problemsByDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
    dailyActivities: [],
    solvedProblems: [],
    streakHistory: []
  });

  const [availableProblems] = useState<Problem[]>(SAMPLE_PROBLEMS);

  useEffect(() => {
    if (user) {
      // Load user data from localStorage for demo
      const savedData = localStorage.getItem(`userData_${user.uid}`);
      if (savedData) {
        setUserStats(JSON.parse(savedData));
      }
    }
  }, [user]);

  const saveData = (newStats: UserStats) => {
    if (user) {
      localStorage.setItem(`userData_${user.uid}`, JSON.stringify(newStats));
      setUserStats(newStats);
    }
  };

  const updateStreak = () => {
  const today = DateTime.now().setZone('Asia/Kolkata').toISODate(); // 'YYYY-MM-DD'
  const yesterday = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 }).toISODate();

  let newCurrentStreak = userStats.currentStreak;

  if (userStats.lastActiveDate === yesterday) {
    newCurrentStreak += 1;
  } else if (userStats.lastActiveDate !== today) {
    newCurrentStreak = 1;
  }

  const newMaxStreak = Math.max(newCurrentStreak, userStats.maxStreak);

  const newStats = {
    ...userStats,
    currentStreak: newCurrentStreak,
    maxStreak: newMaxStreak,
    lastActiveDate: today,
  };

  saveData(newStats);
};

  const addCoins = (amount: number) => {
    const newStats = {
      ...userStats,
      coins: userStats.coins + amount
    };
    saveData(newStats);
  };

  const spendCoins = (amount: number): boolean => {
    if (userStats.coins >= amount) {
      const newStats = {
        ...userStats,
        coins: userStats.coins - amount
      };
      saveData(newStats);
      return true;
    }
    return false;
  };


const solveProblem = (problemId: string, timeSpent: number = 0) => {
  const problem = availableProblems.find(p => p.id === problemId);
  if (!problem || userStats.solvedProblems.find(p => p.id === problemId)) {
    return; 
  }

  const today = DateTime.now().setZone('Asia/Kolkata').toISODate(); // IST date
  const yesterday = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 }).toISODate();

  const solvedProblem = { ...problem, solvedAt: today, timeSpent };

  const coinReward = problem.difficulty === 'Easy' ? 10 : problem.difficulty === 'Medium' ? 20 : 30;

  const existingActivity = userStats.dailyActivities.find(a => a.date === today);
  const updatedActivities = existingActivity
    ? userStats.dailyActivities.map(a => 
        a.date === today 
          ? { 
              ...a, 
              problemsSolved: a.problemsSolved + 1,
              categories: [...new Set([...a.categories, problem.category])],
              timeSpent: a.timeSpent + timeSpent
            }
          : a
      )
    : [
        ...userStats.dailyActivities,
        {
          date: today,
          problemsSolved: 1,
          categories: [problem.category],
          timeSpent
        }
      ];

  const existingStreakEntry = userStats.streakHistory.find(s => s.date === today);
  const updatedStreakHistory = existingStreakEntry
    ? userStats.streakHistory.map(s =>
        s.date === today ? { ...s, count: s.count + 1 } : s
      )
    : [
        ...userStats.streakHistory,
        { date: today, completed: true, count: 1 }
      ];

  let newCurrentStreak = userStats.currentStreak;

  if (userStats.lastActiveDate === yesterday || userStats.lastActiveDate === today) {
    if (userStats.lastActiveDate !== today) {
      newCurrentStreak += 1;
    }
  } else {
    newCurrentStreak = 1;
  }

  const newStats = {
    ...userStats,
    totalProblems: userStats.totalProblems + 1,
    coins: userStats.coins + coinReward,
    currentStreak: newCurrentStreak,
    maxStreak: Math.max(newCurrentStreak, userStats.maxStreak),
    lastActiveDate: today,
    problemsByCategory: {
      ...userStats.problemsByCategory,
      [problem.category as keyof typeof userStats.problemsByCategory]: 
        userStats.problemsByCategory[problem.category as keyof typeof userStats.problemsByCategory] + 1
    },
    problemsByDifficulty: {
      ...userStats.problemsByDifficulty,
      [problem.difficulty.toLowerCase() as keyof typeof userStats.problemsByDifficulty]: 
        userStats.problemsByDifficulty[problem.difficulty.toLowerCase() as keyof typeof userStats.problemsByDifficulty] + 1
    },
    solvedProblems: [...userStats.solvedProblems, solvedProblem],
    dailyActivities: updatedActivities,
    streakHistory: updatedStreakHistory
  };

  saveData(newStats);
};


  const completeProblems = (category: keyof UserStats['problemsByCategory'], count: number) => {
  const today = DateTime.now().setZone('Asia/Kolkata').toISODate();

  const newStats = {
    ...userStats,
    totalProblems: userStats.totalProblems + count,
    problemsByCategory: {
      ...userStats.problemsByCategory,
      [category]: userStats.problemsByCategory[category] + count
    }
  };
  saveData(newStats);
  updateStreak();
  addCoins(count * 10);
};



const getStreakCalendar = () => {
  const calendar = [];
  const today = DateTime.now().setZone('Asia/Kolkata');

  for (let i = 29; i >= 0; i--) {
    const date = today.minus({ days: i });
    const dateString = date.toISODate();

    const activity = userStats.dailyActivities.find(a => a.date === dateString);
    calendar.push({
      date: dateString,
      active: !!activity,
      count: activity?.problemsSolved || 0
    });
  }

  return calendar;
};


const value = {
    userStats,
    availableProblems,
    updateStreak,
    addCoins,
    spendCoins,
    solveProblem,
    completeProblems,
    getStreakCalendar,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};