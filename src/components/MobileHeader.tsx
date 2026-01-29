import React from 'react';
import { Menu, X, Code } from 'lucide-react';

interface MobileHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen
}) => {
  return (
    <>
      {/* Mobile Branding */}
      <div className="items-center pl-4 pt-4 space-x-2 sm:hidden flex">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
          <Code className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold">CodeStreak</span>
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
    </>
  );
};
