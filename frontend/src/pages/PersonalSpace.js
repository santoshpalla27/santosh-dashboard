import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PersonalSpace = () => {
  const [activeSection, setActiveSection] = useState('notes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data states
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [journal, setJournal] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [resources, setResources] = useState([]);

  // Modal states
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Edit states
  const [editingItem, setEditingItem] = useState(null);

  const sections = [
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'bookmarks', label: 'Bookmarks', icon: '🔖' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'journal', label: 'Journal', icon: '📔' },
    { id: 'ideas', label: 'Ideas', icon: '💡' },
    { id: 'resources', label: 'Resources', icon: '📚' },
  ];

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/api/personal-space/${activeSection}`);
      if (response.data.success) {
        switch (activeSection) {
          case 'notes': setNotes(response.data.data); break;
          case 'bookmarks': setBookmarks(response.data.data); break;
          case 'goals': setGoals(response.data.data); break;
          case 'journal': setJournal(response.data.data); break;
          case 'ideas': setIdeas(response.data.data); break;
          case 'resources': setResources(response.data.data); break;
          default: break;
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await axios.delete(`${API_URL}/api/personal-space/${activeSection}/${id}`);
      if (response.data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    switch (activeSection) {
      case 'notes': setShowNoteModal(true); break;
      case 'bookmarks': setShowBookmarkModal(true); break;
      case 'goals': setShowGoalModal(true); break;
      case 'journal': setShowJournalModal(true); break;
      case 'ideas': setShowIdeaModal(true); break;
      case 'resources': setShowResourceModal(true); break;
      default: break;
    }
  };

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
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* Notes Section */}
              {activeSection === 'notes' && (
                <NotesSection
                  notes={notes}
                  loading={loading}
                  onAdd={() => {
                    setEditingItem(null);
                    setShowNoteModal(true);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {/* Bookmarks Section */}
              {activeSection === 'bookmarks' && (
                <BookmarksSection
                  bookmarks={bookmarks}
                  loading={loading}
                  onAdd={() => {
                    setEditingItem(null);
                    setShowBookmarkModal(true);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {/* Goals Section */}
              {activeSection === 'goals' && (
                <GoalsSection
                  goals={goals}
                  loading={loading}
                  onAdd={() => {
                    setEditingItem(null);
                    setShowGoalModal(true);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRefresh={fetchData}
                />
              )}

              {/* Journal Section */}
              {activeSection === 'journal' && (
                <JournalSection
                  entries={journal}
                  loading={loading}
                  onAdd={() => {
                    setEditingItem(null);
                    setShowJournalModal(true);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {/* Ideas Section */}
              {activeSection === 'ideas' && (
                <IdeasSection
                  ideas={ideas}
                  loading={loading}
                  onAdd={() => {
                    setEditingItem(null);
                    setShowIdeaModal(true);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {/* Resources Section */}
              {activeSection === 'resources' && (
                <ResourcesSection
                  resources={resources}
                  loading={loading}
                  onAdd={() => {
                    setEditingItem(null);
                    setShowResourceModal(true);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modals */}
        <NoteModal
          isOpen={showNoteModal}
          onClose={() => {
            setShowNoteModal(false);
            setEditingItem(null);
          }}
          onSuccess={fetchData}
          editingItem={editingItem}
        />

        <BookmarkModal
          isOpen={showBookmarkModal}
          onClose={() => {
            setShowBookmarkModal(false);
            setEditingItem(null);
          }}
          onSuccess={fetchData}
          editingItem={editingItem}
        />

        <GoalModal
          isOpen={showGoalModal}
          onClose={() => {
            setShowGoalModal(false);
            setEditingItem(null);
          }}
          onSuccess={fetchData}
          editingItem={editingItem}
        />

        <JournalModal
          isOpen={showJournalModal}
          onClose={() => {
            setShowJournalModal(false);
            setEditingItem(null);
          }}
          onSuccess={fetchData}
          editingItem={editingItem}
        />

        <IdeaModal
          isOpen={showIdeaModal}
          onClose={() => {
            setShowIdeaModal(false);
            setEditingItem(null);
          }}
          onSuccess={fetchData}
          editingItem={editingItem}
        />

        <ResourceModal
          isOpen={showResourceModal}
          onClose={() => {
            setShowResourceModal(false);
            setEditingItem(null);
          }}
          onSuccess={fetchData}
          editingItem={editingItem}
        />
      </div>
    </div>
  );
};

// ============= NOTES SECTION =============
const NotesSection = ({ notes, loading, onAdd, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📝</span> Quick Notes
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
        >
          + New Note
        </motion.button>
      </div>

      {notes.length === 0 ? (
        <EmptyState icon="📝" title="No notes yet" description="Create your first note to get started" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note, index) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-gradient-to-br ${
                note.color === 'yellow' ? 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20' :
                note.color === 'blue' ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' :
                note.color === 'green' ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' :
                note.color === 'pink' ? 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20' :
                'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20'
              } p-4 rounded-xl border-2 ${
                note.color === 'yellow' ? 'border-yellow-200 dark:border-yellow-800' :
                note.color === 'blue' ? 'border-blue-200 dark:border-blue-800' :
                note.color === 'green' ? 'border-green-200 dark:border-green-800' :
                note.color === 'pink' ? 'border-pink-200 dark:border-pink-800' :
                'border-yellow-200 dark:border-yellow-800'
              } cursor-pointer shadow-md hover:shadow-lg transition-shadow`}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {note.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                {note.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(note)}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(note._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============= BOOKMARKS SECTION =============
const BookmarksSection = ({ bookmarks, loading, onAdd, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🔖</span> Saved Bookmarks
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
        >
          + Add Bookmark
        </motion.button>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState icon="🔗" title="No bookmarks yet" description="Save your first bookmark to get started" />
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark, index) => (
            <motion.div
              key={bookmark._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, x: 5 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                  🌐
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {bookmark.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                    {bookmark.url}
                  </p>
                  {bookmark.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {bookmark.description}
                    </p>
                  )}
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {bookmark.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(bookmark)}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(bookmark._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============= GOALS SECTION =============
const GoalsSection = ({ goals, loading, onAdd, onEdit, onDelete, onRefresh }) => {
  const handleProgressUpdate = async (goalId, newProgress) => {
    try {
      await axios.put(`${API_URL}/api/personal-space/goals/${goalId}`, {
        progress: newProgress,
      });
      onRefresh();
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const colorMap = {
    green: 'from-green-400 to-green-500',
    blue: 'from-blue-400 to-blue-500',
    purple: 'from-purple-400 to-purple-500',
    orange: 'from-orange-400 to-orange-500',
    pink: 'from-pink-400 to-pink-500',
    indigo: 'from-indigo-400 to-indigo-500',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🎯</span> My Goals
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {goals.length} goal{goals.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
        >
          + New Goal
        </motion.button>
      </div>

      {goals.length === 0 ? (
        <EmptyState icon="🎯" title="No goals yet" description="Create your first goal to get started" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal, index) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {goal.title}
                  </h4>
                  {goal.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {goal.description}
                    </p>
                  )}
                  {goal.deadline && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(goal)}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(goal._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${colorMap[goal.color] || 'from-green-400 to-green-500'} rounded-full relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                </motion.div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {goal.progress}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => handleProgressUpdate(goal._id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============= JOURNAL SECTION =============
const JournalSection = ({ entries, loading, onAdd, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  const getMoodEmoji = (mood) => {
    const moods = {
      happy: '😊',
      sad: '😢',
      neutral: '😐',
      excited: '🤩',
      anxious: '😰',
    };
    return moods[mood] || '📝';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📔</span> Personal Journal
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
        >
          + New Entry
        </motion.button>
      </div>

      {entries.length === 0 ? (
        <EmptyState icon="📔" title="No journal entries yet" description="Write your first journal entry to get started" />
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -3 }}
              className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-5 rounded-xl border-2 border-pink-200 dark:border-pink-800 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                {entry.mood && (
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                )}
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(entry)}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(entry._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                {entry.title}
              </h5>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {entry.content}
              </p>
              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-md text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============= IDEAS SECTION =============
const IdeasSection = ({ ideas, loading, onAdd, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'in-progress': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      archived: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[status] || colors.new;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>💡</span> Brilliant Ideas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {ideas.length} idea{ideas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
        >
          + Capture Idea
        </motion.button>
      </div>

      {ideas.length === 0 ? (
        <EmptyState icon="💡" title="No ideas yet" description="Capture your first idea to get started" />
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {ideas.map((idea, index) => (
            <motion.div
              key={idea._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, rotate: Math.random() > 0.5 ? 2 : -2 }}
              className="break-inside-avoid bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 p-4 rounded-xl border-2 border-yellow-300 dark:border-yellow-700 cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {idea.title}
                    </h4>
                    {idea.category && (
                      <span className="text-xs bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                        {idea.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {idea.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-md text-xs ${getStatusColor(idea.status)}`}>
                      {idea.status.replace('-', ' ')}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEdit(idea)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => onDelete(idea._id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============= RESOURCES SECTION =============
const ResourcesSection = ({ resources, loading, onAdd, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  const getResourceIcon = (type) => {
    const icons = {
      Video: '🎬',
      Article: '📄',
      Book: '📖',
      Course: '🎓',
      Podcast: '🎧',
      Tool: '🛠️',
      Tutorial: '📺',
      Documentation: '📋',
    };
    return icons[type] || '📚';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📚</span> Learning Resources
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {resources.length} resource{resources.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium"
        >
          + Add Resource
        </motion.button>
      </div>

      {resources.length === 0 ? (
        <EmptyState icon="📚" title="No resources yet" description="Add your first resource to get started" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {resources.map((resource, index) => (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-full h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg mb-3 flex items-center justify-center text-5xl">
                {getResourceIcon(resource.type)}
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {resource.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {resource.type}
              </p>
              {resource.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {resource.description}
                </p>
              )}
              {resource.url && (
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mb-2 block"
                >
                  Visit resource
                </a>
              )}
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => onEdit(resource)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => onDelete(resource._id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============= UTILITY COMPONENTS =============
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    <span className="ml-3">Loading...</span>
  </div>
);

const EmptyState = ({ icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

// ============= MODALS =============
const NoteModal = ({ isOpen, onClose, onSuccess, editingItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: 'yellow',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        content: editingItem.content || '',
        color: editingItem.color || 'yellow',
      });
    } else {
      setFormData({ title: '', content: '', color: 'yellow' });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        await axios.put(`${API_URL}/api/personal-space/notes/${editingItem._id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/personal-space/notes`, formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving note:', err);
      alert('Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Note' : 'New Note'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Theme
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, color: 'yellow' })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.color === 'yellow'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: formData.color === 'yellow' ? '#FEF3C7' : 'transparent' }}
                  >
                    Yellow
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, color: 'blue' })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.color === 'blue'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: formData.color === 'blue' ? '#DBEAFE' : 'transparent' }}
                  >
                    Blue
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, color: 'green' })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.color === 'green'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: formData.color === 'green' ? '#D1FAE5' : 'transparent' }}
                  >
                    Green
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, color: 'pink' })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.color === 'pink'
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: formData.color === 'pink' ? '#FCE7F3' : 'transparent' }}
                  >
                    Pink
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============= BOOKMARK MODAL =============
const BookmarkModal = ({ isOpen, onClose, onSuccess, editingItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        url: editingItem.url || '',
        description: editingItem.description || '',
        tags: editingItem.tags?.join(', ') || '',
      });
    } else {
      setFormData({ title: '', url: '', description: '', tags: '' });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (editingItem) {
        await axios.put(`${API_URL}/api/personal-space/bookmarks/${editingItem._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/personal-space/bookmarks`, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving bookmark:', err);
      alert('Failed to save bookmark');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Bookmark' : 'New Bookmark'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="development, tutorial, javascript"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============= GOAL MODAL =============
const GoalModal = ({ isOpen, onClose, onSuccess, editingItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    progress: 0,
    deadline: '',
    color: 'blue',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        description: editingItem.description || '',
        progress: editingItem.progress || 0,
        deadline: editingItem.deadline ? new Date(editingItem.deadline).toISOString().split('T')[0] : '',
        color: editingItem.color || 'blue',
      });
    } else {
      setFormData({ title: '', description: '', progress: 0, deadline: '', color: 'blue' });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : null,
      };

      if (editingItem) {
        await axios.put(`${API_URL}/api/personal-space/goals/${editingItem._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/personal-space/goals`, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving goal:', err);
      alert('Failed to save goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const colors = [
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Purple', value: 'purple' },
    { name: 'Orange', value: 'orange' },
    { name: 'Pink', value: 'pink' },
    { name: 'Indigo', value: 'indigo' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Goal' : 'New Goal'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Progress: {formData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============= JOURNAL MODAL =============
const JournalModal = ({ isOpen, onClose, onSuccess, editingItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    mood: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        content: editingItem.content || '',
        date: editingItem.date ? new Date(editingItem.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        mood: editingItem.mood || '',
        tags: editingItem.tags?.join(', ') || '',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        mood: '',
        tags: '',
      });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        date: new Date(formData.date),
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (editingItem) {
        await axios.put(`${API_URL}/api/personal-space/journal/${editingItem._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/personal-space/journal`, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving journal entry:', err);
      alert('Failed to save journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const moods = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'excited', emoji: '🤩', label: 'Excited' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Journal Entry' : 'New Journal Entry'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Today's reflection..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="8"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Write about your day, thoughts, and feelings..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mood
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: mood.value })}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        formData.mood === mood.value
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  placeholder="gratitude, reflection, goals"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============= IDEA MODAL =============
const IdeaModal = ({ isOpen, onClose, onSuccess, editingItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'new',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        description: editingItem.description || '',
        category: editingItem.category || '',
        status: editingItem.status || 'new',
      });
    } else {
      setFormData({ title: '', description: '', category: '', status: 'new' });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        await axios.put(`${API_URL}/api/personal-space/ideas/${editingItem._id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/personal-space/ideas`, formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving idea:', err);
      alert('Failed to save idea');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Idea' : 'New Idea'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your brilliant idea..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your idea in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Business, App, Product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============= RESOURCE MODAL =============
const ResourceModal = ({ isOpen, onClose, onSuccess, editingItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Article',
    url: '',
    description: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        type: editingItem.type || 'Article',
        url: editingItem.url || '',
        description: editingItem.description || '',
        tags: editingItem.tags?.join(', ') || '',
      });
    } else {
      setFormData({ title: '', type: 'Article', url: '', description: '', tags: '' });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (editingItem) {
        await axios.put(`${API_URL}/api/personal-space/resources/${editingItem._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/personal-space/resources`, payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving resource:', err);
      alert('Failed to save resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const resourceTypes = [
    'Video',
    'Article',
    'Book',
    'Course',
    'Podcast',
    'Tool',
    'Tutorial',
    'Documentation',
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Resource' : 'New Resource'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="javascript, react, tutorial"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PersonalSpace;