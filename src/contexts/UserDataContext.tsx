import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { DateTime } from 'luxon';
import { supabase } from '../firebase/config';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solvedAt?: string;
  timeSpent?: number;
  coinsEarned?: number;
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
  loading: boolean;
  updateStreak: () => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  solveProblem: (problemId: string, timeSpent?: number) => Promise<void>;
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
  
  const [loading, setLoading] = useState(true);
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

  // Load from local storage first for instant display
  useEffect(() => {
    if (user) {
      const cached = localStorage.getItem(`userStats_${user.id}`);
      if (cached) {
        try {
          setUserStats(JSON.parse(cached));
        } catch (e) {
          console.error('Error parsing cached data:', e);
        }
      }
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      }

      // Load solved problems
      const { data: solvedProblems, error: solvedError } = await supabase
        .from('solved_problems')
        .select('*')
        .eq('user_id', user.id)
        .order('solved_at', { ascending: false });

      if (solvedError) {
        console.error('Error loading solved problems:', solvedError);
      }

      // Load daily activities
      const { data: activities, error: activitiesError } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('activity_date', { ascending: false })
        .limit(365);

      if (activitiesError) {
        console.error('Error loading activities:', activitiesError);
      }

      // Transform and aggregate data
      const transformedSolvedProblems: Problem[] = (solvedProblems || []).map(p => ({
        id: p.problem_id,
        title: p.title,
        difficulty: p.difficulty as 'Easy' | 'Medium' | 'Hard',
        category: p.category,
        solvedAt: DateTime.fromISO(p.solved_at).toISODate() || '',
        timeSpent: p.time_spent || 0,
        coinsEarned: p.coins_earned || 0
      }));

      const transformedActivities: DailyActivity[] = (activities || []).map(a => ({
        date: a.activity_date,
        problemsSolved: a.problems_solved || 0,
        categories: a.categories || [],
        timeSpent: a.time_spent || 0
      }));

      // Calculate stats from data
      const categoryStats = {
        algorithms: 0,
        dataStructures: 0,
        systemDesign: 0,
        databases: 0
      };

      const difficultyStats = {
        easy: 0,
        medium: 0,
        hard: 0
      };

      transformedSolvedProblems.forEach(p => {
        if (p.category in categoryStats) {
          categoryStats[p.category as keyof typeof categoryStats]++;
        }
        difficultyStats[p.difficulty.toLowerCase() as keyof typeof difficultyStats]++;
      });

      // Build streak history
      const streakHistory = transformedActivities.map(a => ({
        date: a.date,
        completed: a.problemsSolved > 0,
        count: a.problemsSolved
      }));

      const newStats: UserStats = {
        currentStreak: profile?.current_streak || 0,
        maxStreak: profile?.max_streak || 0,
        totalProblems: profile?.total_problems || transformedSolvedProblems.length,
        coins: profile?.coins || 0,
        lastActiveDate: profile?.last_active_date || '',
        problemsByCategory: categoryStats,
        problemsByDifficulty: difficultyStats,
        dailyActivities: transformedActivities,
        solvedProblems: transformedSolvedProblems,
        streakHistory
      };

      setUserStats(newStats);
      
      // Cache in localStorage
      localStorage.setItem(`userStats_${user.id}`, JSON.stringify(newStats));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserProfile = async (stats: UserStats) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          current_streak: stats.currentStreak,
          max_streak: stats.maxStreak,
          total_problems: stats.totalProblems,
          coins: stats.coins,
          last_active_date: stats.lastActiveDate,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving user profile:', error);
      }

      // Update local cache
      localStorage.setItem(`userStats_${user.id}`, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const saveDailyActivity = async (activity: DailyActivity) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_activities')
        .upsert({
          user_id: user.id,
          activity_date: activity.date,
          problems_solved: activity.problemsSolved,
          categories: activity.categories,
          time_spent: activity.timeSpent,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,activity_date'
        });

      if (error) {
        console.error('Error saving daily activity:', error);
      }
    } catch (error) {
      console.error('Error saving daily activity:', error);
    }
  };

  const saveSolvedProblem = async (problem: Problem) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('solved_problems')
        .insert({
          user_id: user.id,
          problem_id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          time_spent: problem.timeSpent || 0,
          coins_earned: problem.coinsEarned || 0,
          solved_at: new Date().toISOString()
        });

      if (error && error.code !== '23505') { // Ignore duplicate errors
        console.error('Error saving solved problem:', error);
      }
    } catch (error) {
      console.error('Error saving solved problem:', error);
    }
  };

  const updateStreak = () => {
    const today = DateTime.now().setZone('Asia/Kolkata').toISODate() || '';
    const yesterday = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 }).toISODate() || '';

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

    setUserStats(newStats);
    saveUserProfile(newStats);
  };

  const addCoins = (amount: number) => {
    const newStats = {
      ...userStats,
      coins: userStats.coins + amount
    };
    setUserStats(newStats);
    saveUserProfile(newStats);
  };

  const spendCoins = (amount: number): boolean => {
    if (userStats.coins >= amount) {
      const newStats = {
        ...userStats,
        coins: userStats.coins - amount
      };
      setUserStats(newStats);
      saveUserProfile(newStats);
      return true;
    }
    return false;
  };


  const solveProblem = async (problemId: string, timeSpent: number = 0) => {
    const problem = availableProblems.find(p => p.id === problemId);
    if (!problem || userStats.solvedProblems.find(p => p.id === problemId)) {
      return;
    }

    const today = DateTime.now().setZone('Asia/Kolkata').toISODate() || '';
    const yesterday = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 }).toISODate() || '';

    const coinReward = problem.difficulty === 'Easy' ? 10 : problem.difficulty === 'Medium' ? 20 : 30;
    
    const solvedProblem: Problem = { 
      ...problem, 
      solvedAt: today, 
      timeSpent,
      coinsEarned: coinReward
    };

    // Update daily activity
    const existingActivity = userStats.dailyActivities.find(a => a.date === today);
    const updatedActivity: DailyActivity = existingActivity
      ? {
          ...existingActivity,
          problemsSolved: existingActivity.problemsSolved + 1,
          categories: [...new Set([...existingActivity.categories, problem.category])],
          timeSpent: existingActivity.timeSpent + timeSpent
        }
      : {
          date: today,
          problemsSolved: 1,
          categories: [problem.category],
          timeSpent
        };

    const updatedActivities = existingActivity
      ? userStats.dailyActivities.map(a => a.date === today ? updatedActivity : a)
      : [...userStats.dailyActivities, updatedActivity];

    // Update streak history
    const existingStreakEntry = userStats.streakHistory.find(s => s.date === today);
    const updatedStreakHistory = existingStreakEntry
      ? userStats.streakHistory.map(s =>
          s.date === today ? { ...s, count: s.count + 1 } : s
        )
      : [...userStats.streakHistory, { date: today, completed: true, count: 1 }];

    // Calculate new streak
    let newCurrentStreak = userStats.currentStreak;
    if (userStats.lastActiveDate === yesterday || userStats.lastActiveDate === today) {
      if (userStats.lastActiveDate !== today) {
        newCurrentStreak += 1;
      }
    } else {
      newCurrentStreak = 1;
    }

    // Update stats
    const newStats: UserStats = {
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

    // Update state
    setUserStats(newStats);

    // Save to database (async - don't wait)
    saveSolvedProblem(solvedProblem);
    saveDailyActivity(updatedActivity);
    saveUserProfile(newStats);

    // Cache locally
    if (user) {
      localStorage.setItem(`userStats_${user.id}`, JSON.stringify(newStats));
    }
  };


  const completeProblems = (category: keyof UserStats['problemsByCategory'], count: number) => {
    const newStats = {
      ...userStats,
      totalProblems: userStats.totalProblems + count,
      problemsByCategory: {
        ...userStats.problemsByCategory,
        [category]: userStats.problemsByCategory[category] + count
      }
    };
    setUserStats(newStats);
    saveUserProfile(newStats);
    updateStreak();
    addCoins(count * 10);
  };

  const getStreakCalendar = () => {
    const calendar = [];
    const today = DateTime.now().setZone('Asia/Kolkata');

    for (let i = 29; i >= 0; i--) {
      const date = today.minus({ days: i });
      const dateString = date.toISODate() || '';

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
    loading,
    updateStreak,
    addCoins,
    spendCoins,
    solveProblem,
    completeProblems,
    getStreakCalendar,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};