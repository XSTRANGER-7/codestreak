import React from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Target,
  Calendar,
  BarChart3,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { dashboardData } from '../utils/dashboardUtils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onNavigate: (page: string) => void;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  user: any;
  userStats: any;
  logout: () => void;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Target,
  Code,
  Calendar,
  BarChart3,
  ShoppingBag
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onNavigate,
  setSidebarOpen,
  sidebarOpen,
  user,
  userStats,
  logout
}) => {
  return (
    <motion.div
      className={`fixed lg:static top-0 right-0 z-40 h-full lg:h-auto w-64 bg-white/5 backdrop-blur-sm border-l border-white/10 p-6 transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      }`}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Branding */}
      <div className="items-center space-x-2 mb-8 sm:flex hidden">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
          <Code className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold">CodeStreak</span>
      </div>

      {/* Navigation */}
      <div className="space-y-2 mb-8 mt-12 sm:mt-2">
        {dashboardData.navigationItems.map(({ key, label, icon }) => {
          const IconComponent = iconMap[icon];
          return (
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
              <IconComponent className="w-5 h-5" />
              <span>{label}</span>
            </button>
          );
        })}

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
  );
};
