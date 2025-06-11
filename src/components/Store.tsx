
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Zap, Gift, Star, Coins } from 'lucide-react';
import { useUserData } from '../contexts/UserDataContext';

interface StoreProps {
  onBack: () => void;
}

export const Store: React.FC<StoreProps> = ({ onBack }) => {
  const { userStats, spendCoins } = useUserData();

  const storeItems = [
    {
      id: 1,
      name: 'Streak Freeze',
      description: 'Protect your streak for one day',
      price: 100,
      icon: Zap,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Double XP',
      description: 'Double coins for 24 hours',
      price: 200,
      icon: Crown,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 3,
      name: 'Theme Pack',
      description: 'Unlock premium themes',
      price: 500,
      icon: Star,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      name: 'Bonus Chest',
      description: 'Random rewards and coins',
      price: 300,
      icon: Gift,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const handlePurchase = (item: typeof storeItems[0]) => {
    if (spendCoins(item.price)) {
      alert(`Successfully purchased ${item.name}!`);
    } else {
      alert('Not enough coins!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-white/10 rounded-full px-5 py-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-sm sm:text-base">{userStats.coins} Coins</span>
          </div>
        </div>

        {/* Store Title */}
        <motion.div 
          className="text-center mb-10 sm:mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Reward Store</h1>
          <p className="text-gray-400 text-base sm:text-lg">Spend your earned coins on powerful upgrades</p>
        </motion.div>

        {/* Store Items */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {storeItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-400 mb-4 text-sm">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{item.price}</span>
                </div>
                
                <motion.button
                  onClick={() => handlePurchase(item)}
                  disabled={userStats.coins < item.price}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                    userStats.coins >= item.price 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={userStats.coins >= item.price ? { scale: 1.05 } : {}}
                  whileTap={userStats.coins >= item.price ? { scale: 0.95 } : {}}
                >
                  {userStats.coins >= item.price ? 'Buy' : 'Locked'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon */}
        <motion.div 
          className="mt-14 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">More Items Coming Soon!</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              We're constantly adding new rewards and power-ups to help you on your coding journey.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
