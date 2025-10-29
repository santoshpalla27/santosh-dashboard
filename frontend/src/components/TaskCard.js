import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import ConfirmDialog from './ConfirmDialog';
import CardQuickMenu from './CardQuickMenu';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TaskCard = ({ task, index, onDelete, onView }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    };
    return colors[priority] || colors.medium;
  };

  const getDeleteWarning = () => {
    switch (task.status) {
      case 'done':
        return {
          type: 'info',
          title: 'Delete Completed Task?',
          message: 'This task is marked as done. Are you sure you want to delete it?',
        };
      case 'inProgress':
        return {
          type: 'warning',
          title: 'Delete In-Progress Task?',
          message: '⚠️ Warning: This task is currently in progress. Deleting it may affect ongoing work. Are you sure?',
        };
      case 'inReview':
        return {
          type: 'warning',
          title: 'Delete Task Under Review?',
          message: '⚠️ Warning: This task is under review. Deleting it may affect the review process. Are you sure?',
        };
      case 'backlog':
      default:
        return {
          type: 'danger',
          title: 'Delete Task?',
          message: 'Are you sure you want to delete this task? This action cannot be undone.',
        };
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        if (onDelete) {
          onDelete(task.id);
        }
        setShowDeleteDialog(false);
      } else {
        throw new Error(data.error || 'Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const taskId = task.id;
  const warningData = getDeleteWarning();

  const comments = task.comments || [];
  const attachments = task.attachments || [];

  return (
    <>
      <Draggable draggableId={taskId} index={index}>
        {(provided, snapshot) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={(e) => {
              // Don't trigger if clicking buttons or quick actions
              if (!e.target.closest('button') && !e.target.closest('.quick-actions')) {
                onView && onView(task);
              }
            }}
            onMouseEnter={() => setShowQuickActions(true)}
            onMouseLeave={() => setShowQuickActions(false)}
            className={`group relative bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 ${
              snapshot.isDragging 
                ? 'shadow-2xl ring-2 ring-blue-400 rotate-3 scale-105' 
                : 'hover:shadow-lg'
            }`}
          >
            {/* Cover Image (if exists) */}
            {task.coverImage && (
              <div className="relative h-32 overflow-hidden">
                <img
                  src={task.coverImage}
                  alt="Card cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Priority badge on cover */}
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold text-white ${getPriorityColor(task.priority)} shadow-lg`}>
                  {task.priority}
                </span>
              </div>
            )}

            {/* Card Color Background (if no cover image) */}
            {!task.coverImage && task.cardColor && (
              <div className={`${task.cardColor} h-2`}></div>
            )}

            {/* Priority Indicator Bar (only if no cover) */}
            {!task.coverImage && (
              <div className={`absolute top-0 left-0 w-1 h-full ${getPriorityColor(task.priority)} rounded-l-xl`} />
            )}

            <div className="p-4">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                {/* Drag Handle Icon */}
                <div 
                  {...provided.dragHandleProps}
                  className="flex-shrink-0 p-1.5 opacity-0 group-hover:opacity-100 mr-2 cursor-grab hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-opacity"
                  title="Drag to reorder"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>

                {/* Title & Priority */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {task.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                {/* Quick Actions */}
                <div className={`quick-actions flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${showQuickActions ? 'opacity-100' : ''}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView && onView(task);
                    }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="View details"
                  >
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <CardQuickMenu
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={() => {
                      setShowDeleteDialog(true);
                    }}
                  />
                </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {task.description}
              </p>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {task.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                  {task.tags.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
                      +{task.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Checklist Progress (if exists) */}
              {task.checklist && task.checklist.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(task.checklist.filter(item => item.completed).length / task.checklist.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Members avatars */}
              {task.members && task.members.length > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  {task.members.slice(0, 3).map((member, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800 -ml-2 first:ml-0"
                      title={member}
                    >
                      {member[0].toUpperCase()}
                    </div>
                  ))}
                  {task.members.length > 3 && (
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs font-bold ring-2 ring-white dark:ring-gray-800 -ml-2">
                      +{task.members.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Footer Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                {/* Task ID */}
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  #{taskId.slice(-6)}
                </div>

                {/* Date */}
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {task.date}
                </div>

                {/* Assignee Avatar */}
                {task.assignee && (
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {task.assignee[0].toUpperCase()}
                    </div>
                    <span className="truncate max-w-[40px]">{task.assignee}</span>
                  </div>
                )}
              </div>

              {/* Due Date Badge (if exists) */}
              {task.dueDate && (
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  new Date(task.dueDate) < new Date() 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}

              {/* Bottom row with icons */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                {/* Comments count */}
                {comments.length > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{comments.length}</span>
                  </div>
                )}

                {/* Attachments count */}
                {attachments.length > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>{attachments.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hover Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        )}
      </Draggable>
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title={warningData.title}
        message={warningData.message}
        type={warningData.type}
        isLoading={isDeleting}
      />
    </>
  );
};

export default TaskCard;