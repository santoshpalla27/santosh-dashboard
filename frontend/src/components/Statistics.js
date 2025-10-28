import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Statistics = () => {
  const [stats, setStats] = useState({
    total: 0,
    byStatus: { backlog: 0, inProgress: 0, inReview: 0, done: 0 },
    byPriority: { high: 0, medium: 0, low: 0 },
    completionRate: 0,
    tasksThisWeek: 0,
    tasksThisMonth: 0,
    averageTasksPerDay: 0,
    mostProductiveDay: '',
  });
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/tasks`);
      const data = await response.json();
      
      if (data.success) {
        const allTasks = Object.entries(data.data).reduce((acc, [status, tasks]) => {
          return [...acc, ...tasks.map(t => ({ ...t, status }))];
        }, []);

        const total = allTasks.length;
        const byStatus = {
          backlog: data.data.backlog?.length || 0,
          inProgress: data.data.inProgress?.length || 0,
          inReview: data.data.inReview?.length || 0,
          done: data.data.done?.length || 0,
        };

        const byPriority = allTasks.reduce((acc, task) => {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
          return acc;
        }, { high: 0, medium: 0, low: 0 });

        const completionRate = total > 0 ? ((byStatus.done / total) * 100).toFixed(1) : 0;

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const tasksThisWeek = allTasks.filter(t => 
          new Date(t.createdAt) >= weekAgo
        ).length;

        const tasksThisMonth = allTasks.filter(t => 
          new Date(t.createdAt) >= monthAgo
        ).length;

        const averageTasksPerDay = (tasksThisMonth / 30).toFixed(1);

        // Find most productive day
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const tasksByDay = allTasks.reduce((acc, task) => {
          const day = new Date(task.createdAt).getDay();
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});
        const mostProductiveDayIndex = Object.keys(tasksByDay).reduce((a, b) => 
          tasksByDay[a] > tasksByDay[b] ? a : b
        , 0);
        const mostProductiveDay = dayNames[mostProductiveDayIndex] || 'N/A';

        setStats({
          total,
          byStatus,
          byPriority,
          completionRate,
          tasksThisWeek,
          tasksThisMonth,
          averageTasksPerDay,
          mostProductiveDay,
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, gradient, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm opacity-90 mb-1">{title}</p>
            <p className="text-4xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs opacity-80 mt-2">{subtitle}</p>
            )}
          </div>
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="text-5xl opacity-20"
          >
            {icon}
          </motion.div>
        </div>
      </div>
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
    </motion.div>
  );

  const ProgressBar = ({ label, value, total, color, delay }) => {
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="mb-4"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {label}
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {value} <span className="text-gray-500 dark:text-gray-400 font-normal">({percentage}%)</span>
          </span>
        </div>
        <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
            className={`h-full ${color} rounded-full relative overflow-hidden`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const CircularProgress = ({ percentage, label, color, size = 120 }) => {
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="transform -rotate-90" width={size} height={size}>
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {percentage}%
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Statistics & Insights
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track your productivity and progress
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchStats}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </motion.button>
          </div>

          {/* View Selector */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl inline-flex">
            {['overview', 'detailed'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedView === view
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedView === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Main Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Total Tasks"
                  value={stats.total}
                  subtitle="All tasks created"
                  icon="📋"
                  gradient="from-blue-500 to-blue-600"
                  delay={0}
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionRate}%`}
                  subtitle={`${stats.byStatus.done} of ${stats.total} completed`}
                  icon="✅"
                  gradient="from-green-500 to-green-600"
                  delay={0.1}
                />
                <StatCard
                  title="This Week"
                  value={stats.tasksThisWeek}
                  subtitle="Tasks created"
                  icon="📅"
                  gradient="from-purple-500 to-purple-600"
                  delay={0.2}
                />
                <StatCard
                  title="This Month"
                  value={stats.tasksThisMonth}
                  subtitle={`Avg ${stats.averageTasksPerDay}/day`}
                  icon="🗓️"
                  gradient="from-orange-500 to-orange-600"
                  delay={0.3}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Status Breakdown */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Status Distribution
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <ProgressBar
                      label="Backlog"
                      value={stats.byStatus.backlog}
                      total={stats.total}
                      color="bg-gradient-to-r from-gray-400 to-gray-500"
                      delay={0.4}
                    />
                    <ProgressBar
                      label="In Progress"
                      value={stats.byStatus.inProgress}
                      total={stats.total}
                      color="bg-gradient-to-r from-blue-400 to-blue-500"
                      delay={0.5}
                    />
                    <ProgressBar
                      label="In Review"
                      value={stats.byStatus.inReview}
                      total={stats.total}
                      color="bg-gradient-to-r from-yellow-400 to-yellow-500"
                      delay={0.6}
                    />
                    <ProgressBar
                      label="Done"
                      value={stats.byStatus.done}
                      total={stats.total}
                      color="bg-gradient-to-r from-green-400 to-green-500"
                      delay={0.7}
                    />
                  </div>
                </motion.div>

                {/* Priority Breakdown */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Priority Levels
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <ProgressBar
                      label="High Priority"
                      value={stats.byPriority.high}
                      total={stats.total}
                      color="bg-gradient-to-r from-red-400 to-red-500"
                      delay={0.4}
                    />
                    <ProgressBar
                      label="Medium Priority"
                      value={stats.byPriority.medium}
                      total={stats.total}
                      color="bg-gradient-to-r from-yellow-400 to-yellow-500"
                      delay={0.5}
                    />
                    <ProgressBar
                      label="Low Priority"
                      value={stats.byPriority.low}
                      total={stats.total}
                      color="bg-gradient-to-r from-green-400 to-green-500"
                      delay={0.6}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Circular Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span>🎯</span> Completion Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <CircularProgress
                    percentage={parseFloat(stats.completionRate)}
                    label="Overall Completion"
                    color="url(#gradient-green)"
                  />
                  <CircularProgress
                    percentage={stats.total > 0 ? ((stats.byStatus.inProgress / stats.total) * 100).toFixed(1) : 0}
                    label="In Progress"
                    color="url(#gradient-blue)"
                  />
                  <CircularProgress
                    percentage={stats.total > 0 ? ((stats.byStatus.backlog / stats.total) * 100).toFixed(1) : 0}
                    label="Backlog"
                    color="url(#gradient-gray)"
                  />
                </div>
                {/* SVG Gradients */}
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="gradient-gray" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6b7280" />
                      <stop offset="100%" stopColor="#4b5563" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="detailed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Detailed View */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Productivity Insights */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>💡</span> Productivity Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                          🏆
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Most Productive Day</p>
                          <p className="text-2xl font-bold">{stats.mostProductiveDay}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                          📈
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Average per Day</p>
                          <p className="text-2xl font-bold">{stats.averageTasksPerDay} tasks</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                          🎯
                        </div>
                        <div>
                          <p className="text-sm opacity-90">High Priority Tasks</p>
                          <p className="text-2xl font-bold">{stats.byPriority.high} tasks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions & Tips */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>💪</span> Performance Tips
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: '✅', text: `You have ${stats.byStatus.inProgress} tasks in progress`, color: 'text-blue-500' },
                      { icon: '⚠️', text: `${stats.byPriority.high} high priority tasks need attention`, color: 'text-red-500' },
                      { icon: '📊', text: `Created ${stats.tasksThisWeek} tasks this week`, color: 'text-purple-500' },
                      { icon: '🎯', text: `${stats.byStatus.backlog} tasks waiting in backlog`, color: 'text-yellow-500' },
                      { icon: '🚀', text: `${stats.completionRate}% completion rate - Great job!`, color: 'text-green-500' },
                    ].map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className={`text-xl ${tip.color}`}>{tip.icon}</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          {tip.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Statistics;