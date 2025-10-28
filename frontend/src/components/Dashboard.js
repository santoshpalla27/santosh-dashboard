import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KanbanBoard from './KanbanBoard';
import TodoList from './TodoList';
import CalendarView from './CalendarView';
import Statistics from './Statistics';

const Dashboard = ({ taskCreated, setTaskCreated }) => {
  const [activeTab, setActiveTab] = useState('kanban');
  const [showNotification, setShowNotification] = useState(false);

  const tabs = [
    { id: 'kanban', label: 'Kanban Board', icon: '📊', shortLabel: 'Kanban' },
    { id: 'calendar', label: 'Calendar', icon: '📅', shortLabel: 'Calendar' },
    { id: 'statistics', label: 'Statistics', icon: '📈', shortLabel: 'Stats' },
    { id: 'todo', label: 'To-Do List', icon: '✅', shortLabel: 'Todo' },
  ];

  const handleConvertToTask = (task) => {
    setActiveTab('kanban');
    setTaskCreated(task);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-16 sm:top-20 right-3 sm:right-6 z-50 max-w-[calc(100vw-1.5rem)] sm:max-w-md"
            >
              <div className="bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium text-sm sm:text-base">
                  Todo converted successfully!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex space-x-1 p-2 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[100px] px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'kanban' && (
            <KanbanBoard 
              taskCreated={taskCreated} 
              setTaskCreated={setTaskCreated}
            />
          )}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'statistics' && <Statistics />}
          {activeTab === 'todo' && (
            <TodoList onConvertToTask={handleConvertToTask} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;