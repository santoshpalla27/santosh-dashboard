import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PersonalSpace = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('notes');

  const sections = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'bookmarks', label: 'Bookmarks', icon: '🔖' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'journal', label: 'Journal', icon: '📔' },
    { id: 'ideas', label: 'Ideas', icon: '💡' },
    { id: 'resources', label: 'Resources', icon: '📚' },
  ];

  if (!isOpen) return null;

  const [isSelecting, setIsSelecting] = useState(false);

  const handleBackdropClick = (e) => {
    // Only close if not in the middle of a text selection
    if (!isSelecting && !window.getSelection().toString().trim()) {
      onClose();
    }
  };

  const handleMouseDown = () => {
    // Track when user starts interacting with the dialog content
    setIsSelecting(true);
  };

  const handleMouseUp = () => {
    // Use setTimeout to allow selection to be completed before checking
    setTimeout(() => {
      setIsSelecting(!window.getSelection().toString().trim() ? false : true);
    }, 0);
  };

  const handleMouseMove = () => {
    // If we're in selection and there's text selected, continue tracking
    if (window.getSelection().toString().trim()) {
      setIsSelecting(true);
    }
  };

  // Also check for selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!window.getSelection().toString().trim()) {
        setIsSelecting(false);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">✨</span>
                  Personal Space
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  Your private workspace for notes, ideas, and more
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 sm:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium text-sm">{section.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
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
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>📝</span> Quick Notes
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                        >
                          + New Note
                        </motion.button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 cursor-pointer"
                          >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              Note Title {i}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                              This is a placeholder for your notes. You can add detailed content here...
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                2 days ago
                              </span>
                              <div className="flex gap-2">
                                <button className="text-blue-500 hover:text-blue-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button className="text-red-500 hover:text-red-600">
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
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>🔖</span> Saved Bookmarks
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                        >
                          + Add Bookmark
                        </motion.button>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.01, x: 5 }}
                            className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                                🌐
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  Bookmark Title {i}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
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
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>🎯</span> My Goals
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                        >
                          + New Goal
                        </motion.button>
                      </div>
                      <div className="space-y-4">
                        {[
                          { title: 'Complete Project X', progress: 75, color: 'from-green-400 to-green-500' },
                          { title: 'Learn React Advanced', progress: 45, color: 'from-blue-400 to-blue-500' },
                          { title: 'Improve Productivity', progress: 60, color: 'from-purple-400 to-purple-500' },
                          { title: 'Build Portfolio', progress: 30, color: 'from-orange-400 to-orange-500' },
                        ].map((goal, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {goal.title}
                              </h4>
                              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                {goal.progress}%
                              </span>
                            </div>
                            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r ${goal.color} rounded-full`}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Journal Section */}
                  {activeSection === 'journal' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>📔</span> Personal Journal
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                        >
                          + New Entry
                        </motion.button>
                      </div>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.01 }}
                            className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-5 rounded-xl border-2 border-pink-200 dark:border-pink-800"
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
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ideas Section */}
                  {activeSection === 'ideas' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>💡</span> Brilliant Ideas
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                        >
                          + Capture Idea
                        </motion.button>
                      </div>
                      <div className="columns-1 md:columns-2 gap-4 space-y-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="break-inside-avoid bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 p-4 rounded-xl border-2 border-yellow-300 dark:border-yellow-700 cursor-pointer"
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
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>📚</span> Learning Resources
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
                        >
                          + Add Resource
                        </motion.button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['Video', 'Article', 'Book', 'Course', 'Podcast', 'Tool'].map((type, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer"
                          >
                            <div className="w-full h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg mb-3 flex items-center justify-center text-4xl">
                              {type === 'Video' && '🎬'}
                              {type === 'Article' && '📄'}
                              {type === 'Book' && '📖'}
                              {type === 'Course' && '🎓'}
                              {type === 'Podcast' && '🎧'}
                              {type === 'Tool' && '🛠️'}
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {type} Resource {i + 1}
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PersonalSpace;