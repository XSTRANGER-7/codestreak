import React from 'react';
import { motion } from 'framer-motion';
import YearCal from './YearCal';
import { StatsCards } from './StatsCards';
import { ChartsSection } from './ChartsSection';
import { QuickActions } from './QuickActions';

interface OverviewProps {
  userStats: any;
  last7Days: any[];
  categoryData: any[];
  unsolvedProblemsCount: number;
  setActiveTab: (tab: any) => void;
  onNavigate: (page: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  userStats,
  last7Days,
  categoryData,
  unsolvedProblemsCount,
  setActiveTab,
  onNavigate
}) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards userStats={userStats} />

      {/* Charts Section */}
      <ChartsSection
        last7Days={last7Days}
        categoryData={categoryData}
        userStats={userStats}
      />

      {/* Quick Actions */}
      <QuickActions
        setActiveTab={setActiveTab}
        onNavigate={onNavigate}
        unsolvedProblemsCount={unsolvedProblemsCount}
      />

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
  );
};
