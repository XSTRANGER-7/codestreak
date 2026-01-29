import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { GridBackground } from './GridBackground';
import { ProblemSolver } from './ProblemSolver';
import { StreakCalendar } from './StreakCalendar';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { Overview } from './Overview';
import { Analytics } from './Analytics';
import { getLast7Days, getCategoryData, getDifficultyData } from '../utils/dashboardUtils';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'calendar' | 'analytics'>('overview');

  const { user, logout } = useAuth();
  const { userStats, availableProblems } = useUserData();

  // Memoized computed data
  const last7Days = useMemo(() => getLast7Days(userStats.dailyActivities), [userStats.dailyActivities]);
  const categoryData = useMemo(() => getCategoryData(userStats.problemsByCategory), [userStats.problemsByCategory]);
  const difficultyData = useMemo(() => getDifficultyData(userStats.problemsByDifficulty), [userStats.problemsByDifficulty]);

  const unsolvedProblems = useMemo(
    () => availableProblems.filter(
      problem => !userStats.solvedProblems.find(solved => solved.id === problem.id)
    ),
    [availableProblems, userStats.solvedProblems]
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'problems':
        return <ProblemSolver problems={unsolvedProblems} />;
      case 'calendar':
        return <StreakCalendar />;
      case 'analytics':
        return <Analytics difficultyData={difficultyData} userStats={userStats} />;
      default:
        return (
          <Overview
            userStats={userStats}
            last7Days={last7Days}
            categoryData={categoryData}
            unsolvedProblemsCount={unsolvedProblems.length}
            setActiveTab={setActiveTab}
            onNavigate={onNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <GridBackground />

      <MobileHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigate={onNavigate}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          user={user}
          userStats={userStats}
          logout={logout}
        />

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