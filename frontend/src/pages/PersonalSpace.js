import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PersonalSpace = () => {
  const [activeSection, setActiveSection] = useState('notes');

  const sections = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'bookmarks', label: 'Bookmarks', icon: '🔖' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'journal', label: 'Journal', icon: '📔' },
    { id: 'ideas', label: 'Ideas', icon: '💡' },
    { id: 'resources', label: 'Resources', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 sm:p-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">✨</span>
              Personal Space
            </h1>
            <p className="text-purple-100 text-sm sm:text-base mt-2">
              Your private workspace for notes, ideas, goals, and more
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 bg-white dark:bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 lg:min-h-screen sticky top-16 z-10">
            <div className="p-4">
              <nav className="space-y-1 lg:space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium text-sm sm:text-base">{section.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Notes Section */}
                {activeSection === 'notes' && (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>📝</span> Quick Notes
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Capture your thoughts and ideas
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                      >
                        + New Note
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Note Title {i}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                            This is a placeholder for your notes. You can add detailed content here...
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              2 days ago
                            </span>
                            <div className="flex gap-2">
                              <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="text-red-500 hover:text-red-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bookmarks Section */}
                {activeSection === 'bookmarks' && (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>🔖</span> Saved Bookmarks
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Your collection of useful links and resources
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                      >
                        + Add Bookmark
                      </motion.button>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.01, x: 5 }}
                          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-md hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                              🌐
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Bookmark Title {i}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                                https://example.com/article-{i}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-xs">
                                  Development
                                </span>
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md text-xs">
                                  Tutorial
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Goals Section */}
                {activeSection === 'goals' && (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>🎯</span> My Goals
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Set and track your personal goals
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                      >
                        + New Goal
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: 'Complete Project X', progress: 75, color: 'from-green-400 to-green-500', deadline: '2 weeks left' },
                        { title: 'Learn React Advanced', progress: 45, color: 'from-blue-400 to-blue-500', deadline: '1 month left' },
                        { title: 'Improve Productivity', progress: 60, color: 'from-purple-400 to-purple-500', deadline: 'Ongoing' },
                        { title: 'Build Portfolio', progress: 30, color: 'from-orange-400 to-orange-500', deadline: '3 weeks left' },
                        { title: 'Master TypeScript', progress: 20, color: 'from-pink-400 to-pink-500', deadline: '2 months left' },
                        { title: 'Contribute to Open Source', progress: 55, color: 'from-indigo-400 to-indigo-500', deadline: 'Ongoing' },
                      ].map((goal, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {goal.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {goal.deadline}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                              {goal.progress}%
                            </span>
                          </div>
                          <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress}%` }}
                              transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                              className={`h-full bg-gradient-to-r ${goal.color} rounded-full relative overflow-hidden`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Journal Section */}
                {activeSection === 'journal' && (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>📔</span> Personal Journal
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Document your journey and thoughts
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                      >
                        + New Entry
                      </motion.button>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.01, y: -3 }}
                          className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-5 rounded-xl border-2 border-pink-200 dark:border-pink-800 shadow-md hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {new Date(Date.now() - i * 86400000).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </h4>
                            <span className="text-2xl">📝</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            This is a placeholder for your journal entry. Write about your day, thoughts, 
                            and feelings here. Keep track of your personal journey and growth...
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                              Read more →
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ideas Section */}
                {activeSection === 'ideas' && (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>💡</span> Brilliant Ideas
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Capture and develop your creative thoughts
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                      >
                        + Capture Idea
                      </motion.button>
                    </div>
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.05, rotate: Math.random() > 0.5 ? 2 : -2 }}
                          className="break-inside-avoid bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 p-4 rounded-xl border-2 border-yellow-300 dark:border-yellow-700 cursor-pointer shadow-md hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">💡</span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Idea {i}
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                This is a placeholder for your brilliant idea. Capture and develop your thoughts here...
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources Section */}
                {activeSection === 'resources' && (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>📚</span> Learning Resources
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Curate your learning materials and tools
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                      >
                        + Add Resource
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {['Video', 'Article', 'Book', 'Course', 'Podcast', 'Tool', 'Tutorial', 'Documentation'].map((type, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-md hover:shadow-lg transition-all"
                        >
                          <div className="w-full h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg mb-3 flex items-center justify-center text-5xl">
                            {type === 'Video' && '🎬'}
                            {type === 'Article' && '📄'}
                            {type === 'Book' && '📖'}
                            {type === 'Course' && '🎓'}
                            {type === 'Podcast' && '🎧'}
                            {type === 'Tool' && '🛠️'}
                            {type === 'Tutorial' && '📺'}
                            {type === 'Documentation' && '📋'}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {type} Resource
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Learn something new today
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSpace;