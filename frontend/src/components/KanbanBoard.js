import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import RecycleBinModal from './RecycleBinModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const columns = {
  backlog: { 
    title: 'Backlog', 
    color: 'from-gray-500 to-gray-600',
    icon: '📋',
    lightBg: 'bg-gray-50',
    darkBg: 'dark:bg-gray-900/50'
  },
  inProgress: { 
    title: 'In Progress', 
    color: 'from-blue-500 to-blue-600',
    icon: '🔄',
    lightBg: 'bg-blue-50',
    darkBg: 'dark:bg-blue-900/20'
  },
  inReview: { 
    title: 'In Review', 
    color: 'from-yellow-500 to-yellow-600',
    icon: '👀',
    lightBg: 'bg-yellow-50',
    darkBg: 'dark:bg-yellow-900/20'
  },
  done: { 
    title: 'Done', 
    color: 'from-green-500 to-green-600',
    icon: '✅',
    lightBg: 'bg-green-50',
    darkBg: 'dark:bg-green-900/20'
  },
};

const KanbanBoard = ({ taskCreated, setTaskCreated }) => {
  const [tasks, setTasks] = useState({
    backlog: [],
    inProgress: [],
    inReview: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [deletedTasksCount, setDeletedTasksCount] = useState(0);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/tasks`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Normalize task data
        const normalizedTasks = {};
        Object.keys(data.data).forEach(columnId => {
          normalizedTasks[columnId] = data.data[columnId].map(task => ({
            ...task,
            id: String(task._id),
            status: columnId, // Ensure status is set
          }));
        });
        setTasks(normalizedTasks);
      } else {
        throw new Error(data.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchDeletedCount();
  }, [fetchTasks]);

  useEffect(() => {
    if (taskCreated) {
      fetchTasks();
      setTaskCreated(null);
    }
  }, [taskCreated, setTaskCreated, fetchTasks]);

  const handleTaskDelete = useCallback((taskId) => {
    // Optimistically remove task from state
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      Object.keys(newTasks).forEach(columnId => {
        newTasks[columnId] = newTasks[columnId].filter(task => task.id !== taskId);
      });
      return newTasks;
    });
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = [...tasks[source.droppableId]];
    const destColumn = source.droppableId === destination.droppableId 
      ? sourceColumn 
      : [...tasks[destination.droppableId]];

    const [movedTask] = sourceColumn.splice(source.index, 1);
    
    if (!movedTask) return;

    destColumn.splice(destination.index, 0, movedTask);

    const newTasks = {
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    };
    
    setTasks(newTasks);

    try {
      const response = await fetch(`${API_URL}/api/tasks/${draggableId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: destination.droppableId,
          order: destination.index,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update task');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      fetchTasks();
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const fetchDeletedCount = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/recyclebin`);
      const data = await response.json();
      if (data.success) {
        setDeletedTasksCount(data.count);
      }
    } catch (err) {
      console.error('Error fetching deleted tasks count:', err);
    }
  };

  const handleTaskRestored = () => {
    fetchTasks();
    fetchDeletedCount();
  };

  const handleUpdateTask = (updatedTask) => {
    fetchTasks(); // Refresh tasks after update
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading tasks...</p>
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
            onClick={fetchTasks}
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
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Project Board
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
            Drag and drop • Hover to delete
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRecycleBinOpen(true)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base relative"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="hidden sm:inline">Recycle Bin</span>
            <span className="sm:hidden">Recycle</span>
            {deletedTasksCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {deletedTasksCount > 9 ? '9+' : deletedTasksCount}
              </span>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              fetchTasks();
              fetchDeletedCount();
            }}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Mobile: Single Column View */}
        <div className="block lg:hidden space-y-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId}>
              {/* Column Header - Planka Style */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`bg-gradient-to-r ${column.color} text-white rounded-xl p-4 mb-3 shadow-sm flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{column.icon}</span>
                  <h3 className="font-semibold text-base">{column.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white bg-opacity-30 px-2.5 py-1 rounded-full text-sm font-bold">
                    {tasks[columnId]?.length || 0}
                  </span>
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-xl p-3 transition-all duration-200 min-h-[200px] ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-400'
                        : `${column.lightBg} ${column.darkBg}`
                    }`}
                  >
                    {tasks[columnId]?.map((task, index) => (
                      <TaskCard 
                        key={task.id}
                        task={{
                          ...task,
                          date: task.createdAt 
                            ? new Date(task.createdAt).toLocaleDateString()
                            : new Date().toLocaleDateString()
                        }} 
                        index={index}
                        onDelete={handleTaskDelete}
                        onView={handleViewTask}
                      />
                    ))}
                    {provided.placeholder}

                    {(!tasks[columnId] || tasks[columnId].length === 0) && (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-600 text-sm">
                        <svg
                          className="w-10 h-10 mb-2 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p>Drop tasks here</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>

        {/* Desktop: Grid View */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="flex flex-col h-full">
              {/* Column Header - Planka Style */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`bg-gradient-to-r ${column.color} text-white rounded-xl p-4 mb-4 shadow-sm flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{column.icon}</span>
                  <h3 className="font-semibold text-lg">{column.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white bg-opacity-30 px-2.5 py-1 rounded-full text-sm font-bold">
                    {tasks[columnId]?.length || 0}
                  </span>
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-xl p-3 transition-all duration-200 min-h-[500px] ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-400 ring-opacity-50'
                        : `${column.lightBg} ${column.darkBg}`
                    }`}
                  >
                    {tasks[columnId]?.map((task, index) => (
                      <TaskCard 
                        key={task.id}
                        task={{
                          ...task,
                          date: task.createdAt 
                            ? new Date(task.createdAt).toLocaleDateString()
                            : new Date().toLocaleDateString()
                        }} 
                        index={index}
                        onDelete={handleTaskDelete}
                        onView={handleViewTask}
                      />
                    ))}
                    {provided.placeholder}

                    {(!tasks[columnId] || tasks[columnId].length === 0) && (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-600 text-sm">
                        <svg
                          className="w-10 h-10 mb-2 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p>Drop tasks here</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
      />
      {/* Recycle Bin Modal */}
      <RecycleBinModal
        isOpen={isRecycleBinOpen}
        onClose={() => setIsRecycleBinOpen(false)}
        onTaskRestored={handleTaskRestored}
      />
    </motion.div>
  );
};

export default KanbanBoard;