import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Coins,
  Target,
  Trophy
} from 'lucide-react';
import { dashboardData } from '../utils/dashboardUtils';

interface StatsCardsProps {
  userStats: any;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Flame,
  Coins,
  Target,
  Trophy
};

export const StatsCards: React.FC<StatsCardsProps> = ({ userStats }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {dashboardData.statsCards.map((card) => {
        const IconComponent = iconMap[card.icon];
        const value = userStats[card.key];

        return (
          <div
            key={card.key}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-gray-400">{card.label}</div>
              </div>
              <div className={`w-12 h-12 bg-${card.color}-500/20 rounded-xl flex items-center justify-center`}>
                <IconComponent className={`w-6 h-6 text-${card.color}-500`} />
              </div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};
