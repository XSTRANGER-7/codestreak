
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Code, Database, Layers, GitBranch } from 'lucide-react';
import { useUserData } from '../contexts/UserDataContext';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solvedAt?: string;
  timeSpent?: number;
}

interface ProblemSolverProps {
  problems: Problem[];
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({ problems }) => {
  const navigate = useNavigate();
  const { userStats } = useUserData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = [
    { key: 'all', name: 'All Categories', icon: Code },
    { key: 'algorithms', name: 'Algorithms', icon: Code },
    { key: 'dataStructures', name: 'Data Structures', icon: Database },
    { key: 'systemDesign', name: 'System Design', icon: Layers },
    { key: 'databases', name: 'Databases', icon: GitBranch }
  ];

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const filteredProblems = problems.filter(problem => {
    const categoryMatch = selectedCategory === 'all' || problem.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    const notSolved = !userStats.solvedProblems.find(p => p.id === problem.id);
    return categoryMatch && difficultyMatch && notSolved;
  });

  const handleSolveProblem = (problemId: string) => {
    navigate(`/problem/${problemId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.key === category);
    return categoryData?.icon || Code;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Solve Problems</h2>
        <div className="text-sm text-gray-400">
          {filteredProblems.length} problems available
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map(category => (
              <option key={category.key} value={category.key} className="bg-gray-800">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty} className="bg-gray-800">
                {difficulty === 'all' ? 'All Difficulties' : difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem, index) => {
          const CategoryIcon = getCategoryIcon(problem.category);

          return (
            <motion.div
              key={problem.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => handleSolveProblem(problem.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CategoryIcon className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-400 capitalize">{problem.category}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4 line-clamp-2">{problem.title}</h3>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSolveProblem(problem.id);
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-purple-600 hover:bg-purple-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                <span>Solve Problem</span>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">All problems solved!</h3>
          <p className="text-gray-400">
            {selectedCategory !== 'all' || selectedDifficulty !== 'all' 
              ? 'Try changing your filters to see more problems.'
              : 'Great job! You\'ve completed all available problems.'}
          </p>
        </div>
      )}
    </div>
  );
};
