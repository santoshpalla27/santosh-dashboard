import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Statistics = () => {
  const [stats, setStats] = useState({
    total: 0,
    byStatus: { backlog: 0, inProgress: 0, inReview: 0, done: 0 },
    byPriority: { high: 0, medium: 0, low: 0 },
    completionRate: 0,
    tasksThisWeek: 0,
    tasksThisMonth: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
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

        setStats({
          total,
          byStatus,
          byPriority,
          completionRate,
          tasksThisWeek,
          tasksThisMonth,
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📊 Statistics & Insights
        </h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />

          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            color="bg-gradient-to-br from-green-500 to-green-600"
            subtitle={`${stats.byStatus.done} of ${stats.total} completed`}
          />

          <StatCard
            title="This Week"
            value={stats.tasksThisWeek}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            subtitle="Tasks created"
          />

          <StatCard
            title="This Month"
            value={stats.tasksThisMonth}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            subtitle="Tasks created"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              By Status
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byStatus).map(([status, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total * 100).toFixed(1) : 0;
                const colors = {
                  backlog: 'bg-gray-500',
                  inProgress: 'bg-blue-500',
                  inReview: 'bg-yellow-500',
                  done: 'bg-green-500',
                };
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {status === 'inProgress' ? 'In Progress' : status === 'inReview' ? 'In Review' : status}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className={`${colors[status]} h-2 rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              By Priority
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byPriority).map(([priority, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total * 100).toFixed(1) : 0;
                const colors = {
                  high: 'bg-red-500',
                  medium: 'bg-yellow-500',
                  low: 'bg-green-500',
                };
                return (
                  <div key={priority}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {priority}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className={`${colors[priority]} h-2 rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Productivity Tips */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>💡</span> Productivity Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>You have {stats.byStatus.inProgress} tasks in progress</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-500">!</span>
              <span>{stats.byPriority.high} high priority tasks need attention</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">📈</span>
              <span>Created {stats.tasksThisWeek} tasks this week</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500">🎯</span>
              <span>{stats.byStatus.backlog} tasks waiting in backlog</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;