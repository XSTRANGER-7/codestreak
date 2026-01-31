import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Code2, 
  FileText, 
  Terminal,
  Lightbulb,
  ChevronDown
} from 'lucide-react';
import { problemDetails } from '../data/problemDetails';
import { useUserData } from '../contexts/UserDataContext';

type Language = 'cpp' | 'java' | 'python';

const languageOptions = [
  { value: 'cpp' as Language, label: 'C++', extension: 'cpp' },
  { value: 'java' as Language, label: 'Java', extension: 'java' },
  { value: 'python' as Language, label: 'Python', extension: 'py' }
];

export const ProblemPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { solveProblem } = useUserData();
  
  const problem = problemId ? problemDetails[problemId] : null;
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [code, setCode] = useState<string>(problem?.starterCode.python || '');
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState<string>('');

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#238636] hover:bg-[#2ea043] px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setCode(problem.starterCode[lang]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Running test cases...\n');
    
    setTimeout(() => {
      setOutput(
        `Running test cases...\n\n` +
        `Test Case 1: ✅ Passed\n` +
        `  Input: ${problem.examples[0].input}\n` +
        `  Expected: ${problem.examples[0].output}\n` +
        `  Output: ${problem.examples[0].output}\n\n` +
        `Test Case 2: ✅ Passed\n` +
        `  Input: ${problem.examples[1]?.input || 'N/A'}\n` +
        `  Expected: ${problem.examples[1]?.output || 'N/A'}\n` +
        `  Output: ${problem.examples[1]?.output || 'N/A'}\n\n` +
        `✅ All test cases passed!`
      );
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput('Submitting your solution...\n');
    
    setTimeout(() => {
      const timeSpent = Math.floor(Math.random() * 30) + 10;
      solveProblem(problem.id, timeSpent);
      
      setOutput(
        `Submitting your solution...\n\n` +
        `✅ Accepted!\n\n` +
        `Runtime: ${Math.floor(Math.random() * 100) + 20}ms\n` +
        `Memory: ${(Math.random() * 10 + 10).toFixed(1)}MB\n\n` +
        `Your solution beats ${Math.floor(Math.random() * 30) + 60}% of submissions!\n\n` +
        `+${problem.difficulty === 'Easy' ? 10 : problem.difficulty === 'Medium' ? 20 : 30} coins earned! 🎉`
      );
      setIsSubmitting(false);
    }, 2500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <div className="border-b border-[#30363d] bg-[#161b22] sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-[#30363d]" />
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <span className={`text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 capitalize">{problem.category}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-[#30363d] overflow-y-auto bg-[#0d1117]">
          <div className="p-6">
            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-[#30363d]">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 px-2 font-semibold transition-colors relative ${
                  activeTab === 'description' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Description
                {activeTab === 'description' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#58a6ff]"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('solution')}
                className={`pb-3 px-2 font-semibold transition-colors relative ${
                  activeTab === 'solution' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Lightbulb className="w-4 h-4 inline mr-2" />
                Solution
                {activeTab === 'solution' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#58a6ff]"
                  />
                )}
              </button>
            </div>

            {activeTab === 'description' ? (
              <div className="space-y-6">
                {/* Problem Description */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Problem Statement</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {problem.description}
                  </p>
                </div>

                {/* Examples */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Examples</h2>
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="mb-4 bg-[#161b22] rounded-lg p-4 border border-[#30363d]">
                      <p className="font-semibold text-[#58a6ff] mb-2">Example {idx + 1}:</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-400">Input:</span> <code className="text-[#79c0ff]">{example.input}</code></p>
                        <p><span className="text-gray-400">Output:</span> <code className="text-[#a5d6ff]">{example.output}</code></p>
                        {example.explanation && (
                          <p><span className="text-gray-400">Explanation:</span> {example.explanation}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Constraints</h2>
                  <ul className="space-y-2">
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx} className="text-gray-300 flex items-start">
                        <span className="text-[#58a6ff] mr-2">•</span>
                        <code className="text-sm">{constraint}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#1f2937] border border-[#374151] rounded-lg p-4">
                  <p className="text-[#fbbf24]">
                    💡 Try solving the problem yourself first before viewing the solution!
                  </p>
                </div>
                <div className="bg-[#161b22] rounded-lg p-4 border border-[#30363d]">
                  <h3 className="font-semibold mb-2">Approach:</h3>
                  <p className="text-gray-300">
                    Use a hash map to store the complement of each number as you iterate through the array.
                    This allows O(1) lookup time for finding the matching pair.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col bg-[#0d1117]">
          {/* Editor Header */}
          <div className="border-b border-[#30363d] bg-[#161b22] p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className="w-5 h-5 text-[#58a6ff]" />
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value as Language)}
                  className="appearance-none bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#58a6ff] cursor-pointer hover:border-[#58a6ff] transition-colors"
                >
                  {languageOptions.map(lang => (
                    <option key={lang.value} value={lang.value} className="bg-gray-800">
                      {lang.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center space-x-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run</span>
                  </>
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-[#238636] hover:bg-[#2ea043] px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>

          {/* Output Panel */}
          {output && (
            <div className="border-t border-[#30363d] bg-[#161b22] p-4 max-h-64 overflow-y-auto">
              <div className="flex items-center space-x-2 mb-3">
                <Terminal className="w-4 h-4 text-[#58a6ff]" />
                <span className="font-semibold text-sm">Output</span>
              </div>
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
