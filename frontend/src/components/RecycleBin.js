import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const RecycleBin = () => {
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchDeletedTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/tasks/recyclebin`);
      const data = await response.json();

      if (data.success) {
        setDeletedTasks(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch deleted tasks');
      }
    } catch (err) {
      console.error('Error fetching deleted tasks:', err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedTasks();
  }, []);

  const handleRestore = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}/restore`, {
        method: 'PUT',
      });

      const data = await response.json();

      if (data.success) {
        setDeletedTasks(deletedTasks.filter(task => task.id !== taskId));
      } else {
        throw new Error(data.error || 'Failed to restore task');
      }
    } catch (err) {
      console.error('Error restoring task:', err);
      alert('Failed to restore task. Please try again.');
    }
  };

  const handlePermanentDelete = async (taskId) => {
    if (!window.confirm('This will permanently delete the task. This action cannot be undone. Continue?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}/permanent`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setDeletedTasks(deletedTasks.filter(task => task.id !== taskId));
      } else {
        throw new Error(data.error || 'Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      const response = await fetch(`${API_URL}/api/tasks/recyclebin/clear`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setDeletedTasks([]);
        setShowClearConfirm(false);
      } else {
        throw new Error(data.error || 'Failed to clear recycle bin');
      }
    } catch (err) {
      console.error('Error clearing recycle bin:', err);
      alert('Failed to clear recycle bin. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTimeSinceDeleted = (deletedAt) => {
    const now = new Date();
    const deleted = new Date(deletedAt);
    const diffMs = now - deleted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading recycle bin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center px-4">
          <div className="text-red-500 mb-4 text-3xl sm:text-4xl">❌</div>
          <p className="text-red-500 mb-4 font-semibold text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchDeletedTasks}
            className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-3 sm:p-4 lg:p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Recycle Bin
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {deletedTasks.length} deleted task{deletedTasks.length !== 1 ? 's' : ''}
            </p>
          </div>

          {deletedTasks.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </motion.button>
          )}
        </div>

        {/* Clear Confirmation Dialog */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Clear Recycle Bin?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      This will permanently delete all {deletedTasks.length} task{deletedTasks.length !== 1 ? 's' : ''} from the recycle bin. This action cannot be undone.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      disabled={isClearing}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearAll}
                      disabled={isClearing}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isClearing ? 'Clearing...' : 'Clear All'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        {deletedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Recycle Bin is Empty
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Deleted tasks will appear here
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deletedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex-1 line-clamp-2">
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {task.description}
                </p>

                {/* Tags */}
                <div className="flex items-center flex-wrap gap-1 mb-3">
                  {task.tags?.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {task.tags?.length > 2 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{task.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Deleted Info */}
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Deleted {getTimeSinceDeleted(task.deletedAt)}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRestore(task.id)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restore
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePermanentDelete(task.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    title="Delete permanently"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecycleBin;