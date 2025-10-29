import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TaskDetailModal = ({ isOpen, onClose, task, onUpdate }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task?.description || '');
  const [comments, setComments] = useState(task?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState(task?.attachments || []);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isSelecting, setIsSelecting] = useState(false);

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

  const handleBackdropClick = (e) => {
    if (isOpen && !isSelecting && !window.getSelection().toString().trim()) {
      onClose();
    }
  };

  const handleMouseDown = () => {
    setIsSelecting(true);
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      setIsSelecting(!window.getSelection().toString().trim() ? false : true);
    }, 0);
  };

  const handleMouseMove = () => {
    if (window.getSelection().toString().trim()) {
      setIsSelecting(true);
    }
  };

  const handleSaveTitle = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          title: editedTitle,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditingTitle(false);
        if (onUpdate) onUpdate(data.data);
      }
    } catch (error) {
      console.error('Error updating title:', error);
      alert('Failed to update title');
    }
  };

  const handleSaveDescription = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          description: editedDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditingDescription(false);
        if (onUpdate) onUpdate(data.data);
      }
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Failed to update description');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date().toISOString(),
        author: 'You',
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    
    setTimeout(() => {
      const newAttachments = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      }));
      setAttachments([...attachments, ...newAttachments]);
      setIsUploading(false);
    }, 1000);
  };

  const handleDeleteAttachment = (attachmentId) => {
    setAttachments(attachments.filter(a => a.id !== attachmentId));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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

  if (!isOpen || !task) return null;

  const tabs = [
    { id: 'details', label: 'Details', icon: '📄' },
    { id: 'comments', label: 'Comments', icon: '💬', badge: comments.length },
    { id: 'attachments', label: 'Attachments', icon: '📎', badge: attachments.length },
    { id: 'activity', label: 'Activity', icon: '🕐' },
  ];

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            {/* Title */}
            {isEditingTitle ? (
              <div className="flex items-center gap-3">
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
                  className="flex-1 px-3 py-2 text-xl font-bold border-2 border-blue-500 rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div onClick={() => setIsEditingTitle(true)} className="group cursor-text hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  {task.title}
                  <span className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </span>
                </h2>
              </div>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              {/* Priority Badge */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {task.priority} Priority
                </span>
              </div>

              {/* Status Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === 'backlog' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                task.status === 'inProgress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                task.status === 'inReview' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {task.status === 'inProgress' ? 'In Progress' : task.status === 'inReview' ? 'In Review' : task.status}
              </div>

              {/* Task ID */}
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                #{task.id.slice(-6)}
              </div>

              {/* Assignee */}
              {task.assignee && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {task.assignee[0].toUpperCase()}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{task.assignee}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge > 0 && (
                  <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Description Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        Description
                      </h3>
                      {!isEditingDescription && (
                        <button
                          onClick={() => {
                            setIsEditingDescription(true);
                            setEditedDescription(task.description);
                          }}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditingDescription ? (
                      <div>
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          rows="6"
                          className="w-full px-4 py-3 border-2 border-blue-500 rounded-xl focus:outline-none dark:bg-gray-700 dark:text-white resize-none"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={handleSaveDescription}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingDescription(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsEditingDescription(true)}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-text transition-colors"
                      >
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {task.description || 'Click to add description...'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Properties Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Status */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        Status
                      </label>
                      <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="backlog">📋 Backlog</option>
                        <option value="inProgress" selected={task.status === 'inProgress'}>🔄 In Progress</option>
                        <option value="inReview" selected={task.status === 'inReview'}>👀 In Review</option>
                        <option value="done" selected={task.status === 'done'}>✅ Done</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        Priority
                      </label>
                      <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="low">🟢 Low</option>
                        <option value="medium" selected={task.priority === 'medium'}>🟡 Medium</option>
                        <option value="high" selected={task.priority === 'high'}>🔴 High</option>
                      </select>
                    </div>

                    {/* Due Date */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        Due Date
                      </label>
                      <input
                        type="date"
                        defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>

                    {/* Assignee */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        Assignee
                      </label>
                      <div className="flex items-center gap-2">
                        {task.assignee ? (
                          <>
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {task.assignee[0].toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {task.assignee}
                            </span>
                          </>
                        ) : (
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700">
                            + Assign
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Labels
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {task.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          {tag}
                        </span>
                      ))}
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Label
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Comments ({comments.length})
                  </h3>
                  
                  {/* Add Comment */}
                  <div className="mb-6">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          Y
                        </div>
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                          placeholder="Write a comment..."
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Press Enter to post, Shift+Enter for new line
                          </p>
                          <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-3">💬</div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No comments yet. Be the first to comment!
                        </p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 group"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {comment.author[0]}
                            </div>
                          </div>
                          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {comment.author}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {comment.text}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Attachments Tab */}
              {activeTab === 'attachments' && (
                <motion.div
                  key="attachments"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Attachments ({attachments.length})
                    </h3>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Upload File
                      </span>
                    </label>
                  </div>

                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading files...
                    </div>
                  )}

                  {attachments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-3">📎</div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        No attachments yet
                      </p>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Click to upload or drag files
                      </label>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {attachments.map((attachment) => (
                        <motion.div
                          key={attachment.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(attachment.size)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteAttachment(attachment.id)}
                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Activity Log
                  </h3>
                  <div className="space-y-4">
                    {/* Activity Timeline */}
                    <div className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                      <div className="mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Task created
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(task.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {task.updatedAt !== task.createdAt && (
                      <div className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-700">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                        <div className="mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Task updated
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(task.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated {new Date(task.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskDetailModal;