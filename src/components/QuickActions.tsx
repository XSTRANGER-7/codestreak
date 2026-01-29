import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Calendar,
  BarChart3,
  ShoppingBag
} from 'lucide-react';
import { dashboardData } from '../utils/dashboardUtils';

interface QuickActionsProps {
  setActiveTab: (tab: any) => void;
  onNavigate: (page: string) => void;
  unsolvedProblemsCount: number;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Play,
  Calendar,
  BarChart3,
  ShoppingBag
};

const colorMap: { [key: string]: string } = {
  purple: 'text-purple-500',
  green: 'text-green-500',
  blue: 'text-blue-500',
  yellow: 'text-yellow-500'
};

export const QuickActions: React.FC<QuickActionsProps> = ({
  setActiveTab,
  onNavigate,
  unsolvedProblemsCount
}) => {
  const handleAction = (key: string) => {
    if (key === 'store') {
      onNavigate('store');
    } else {
      setActiveTab(key);
    }
  };

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {dashboardData.quickActions.map((action) => {
          const IconComponent = iconMap[action.icon];
          const description = action.key === 'problems'
            ? `${unsolvedProblemsCount} ${action.description}`
            : action.description;

          return (
            <motion.button
              key={action.key}
              onClick={() => handleAction(action.key)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-center transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent className={`w-8 h-8 mx-auto mb-2 ${colorMap[action.color]}`} />
              <div className="font-semibold">{action.label}</div>
              <div className="text-sm text-gray-400">{description}</div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
