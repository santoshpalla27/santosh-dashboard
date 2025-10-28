import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FestivalCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [viewMode, setViewMode] = useState('combined'); // combined, tasks, festivals

  // Indian and Telugu Festivals for 2024-2025
  const festivals = {
    // January
    '2024-01-14': { name: 'Makar Sankranti', type: 'major', color: 'from-orange-500 to-red-500', icon: '🪁' },
    '2024-01-15': { name: 'Kanuma', type: 'regional', color: 'from-green-500 to-emerald-500', icon: '🐄' },
    '2024-01-26': { name: 'Republic Day', type: 'national', color: 'from-orange-500 to-green-500', icon: '🇮🇳' },
    
    // February
    '2024-02-14': { name: 'Maha Shivaratri', type: 'major', color: 'from-blue-500 to-indigo-500', icon: '🔱' },
    
    // March
    '2024-03-08': { name: 'Holi', type: 'major', color: 'from-pink-500 to-purple-500', icon: '🎨' },
    '2024-03-25': { name: 'Ugadi (Telugu New Year)', type: 'regional', color: 'from-yellow-500 to-orange-500', icon: '🌺' },
    
    // April
    '2024-04-11': { name: 'Eid ul-Fitr', type: 'major', color: 'from-green-500 to-teal-500', icon: '🌙' },
    '2024-04-17': { name: 'Ram Navami', type: 'major', color: 'from-orange-500 to-red-500', icon: '🏹' },
    '2024-04-21': { name: 'Mahavir Jayanti', type: 'major', color: 'from-yellow-500 to-orange-500', icon: '🙏' },
    
    // May
    '2024-05-23': { name: 'Buddha Purnima', type: 'major', color: 'from-blue-500 to-cyan-500', icon: '☸️' },
    
    // June
    '2024-06-17': { name: 'Eid ul-Adha', type: 'major', color: 'from-green-500 to-emerald-500', icon: '🕌' },
    
    // July
    '2024-07-17': { name: 'Muharram', type: 'major', color: 'from-gray-600 to-gray-800', icon: '🌙' },
    
    // August
    '2024-08-15': { name: 'Independence Day', type: 'national', color: 'from-orange-500 to-green-500', icon: '🇮🇳' },
    '2024-08-19': { name: 'Bonalu Festival', type: 'regional', color: 'from-yellow-500 to-red-500', icon: '🎊' },
    '2024-08-26': { name: 'Raksha Bandhan', type: 'major', color: 'from-pink-500 to-red-500', icon: '🧵' },
    '2024-08-26': { name: 'Krishna Janmashtami', type: 'major', color: 'from-blue-500 to-purple-500', icon: '🦚' },
    
    // September
    '2024-09-07': { name: 'Ganesh Chaturthi', type: 'major', color: 'from-orange-500 to-red-500', icon: '🐘' },
    '2024-09-16': { name: 'Milad un-Nabi', type: 'major', color: 'from-green-500 to-teal-500', icon: '🌙' },
    
    // October
    '2024-10-02': { name: 'Gandhi Jayanti', type: 'national', color: 'from-orange-500 to-green-500', icon: '🇮🇳' },
    '2024-10-03': { name: 'Bathukamma (Start)', type: 'regional', color: 'from-pink-500 to-purple-500', icon: '🌸' },
    '2024-10-11': { name: 'Bathukamma (Final Day)', type: 'regional', color: 'from-pink-500 to-purple-500', icon: '🌺' },
    '2024-10-12': { name: 'Dussehra/Vijayadashami', type: 'major', color: 'from-red-500 to-orange-500', icon: '🏹' },
    '2024-10-20': { name: 'Karva Chauth', type: 'regional', color: 'from-red-500 to-pink-500', icon: '🌕' },
    
    // November
    '2024-11-01': { name: 'Diwali', type: 'major', color: 'from-yellow-500 to-orange-500', icon: '🪔' },
    '2024-11-02': { name: 'Govardhan Puja', type: 'major', color: 'from-orange-500 to-red-500', icon: '🐄' },
    '2024-11-03': { name: 'Bhai Dooj', type: 'regional', color: 'from-pink-500 to-red-500', icon: '👫' },
    '2024-11-15': { name: 'Guru Nanak Jayanti', type: 'major', color: 'from-yellow-500 to-orange-500', icon: '🙏' },
    
    // December
    '2024-12-25': { name: 'Christmas', type: 'national', color: 'from-red-500 to-green-500', icon: '🎄' },
    
    // 2025 Festivals
    '2025-01-14': { name: 'Makar Sankranti', type: 'major', color: 'from-orange-500 to-red-500', icon: '🪁' },
    '2025-01-15': { name: 'Kanuma', type: 'regional', color: 'from-green-500 to-emerald-500', icon: '🐄' },
    '2025-01-26': { name: 'Republic Day', type: 'national', color: 'from-orange-500 to-green-500', icon: '🇮🇳' },
  };

  // Hyderabad specific events
  const hyderabadEvents = {
    '2024-09-17': { name: 'Hyderabad Liberation Day', type: 'local', color: 'from-blue-500 to-indigo-500', icon: '🏛️' },
    '2024-02-20': { name: 'Charminar Festival', type: 'local', color: 'from-yellow-500 to-orange-500', icon: '🕌' },
    '2024-12-01': { name: 'Hyderabad Food Festival', type: 'local', color: 'from-red-500 to-orange-500', icon: '🍽️' },
  };

  // Merge all events
  const allEvents = { ...festivals, ...hyderabadEvents };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      const data = await response.json();
      if (data.success) {
        const allTasks = Object.values(data.data).flat();
        setTasks(allTasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const getTasksForDate = (day) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getFestivalForDate = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${year}-${month}-${dayStr}`;
    return allEvents[dateKey];
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().getDate());
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'major': return 'National Festival';
      case 'regional': return 'Regional Festival';
      case 'national': return 'National Holiday';
      case 'local': return 'Hyderabad Event';
      default: return 'Event';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-3xl">📅</span>
            Festival Calendar
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Indian festivals, Telugu celebrations & Hyderabad events
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
          >
            Today
          </motion.button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl inline-flex">
        {[
          { id: 'combined', label: 'All', icon: '📊' },
          { id: 'festivals', label: 'Festivals', icon: '🎊' },
          { id: 'tasks', label: 'Tasks', icon: '✅' },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === mode.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>{mode.icon}</span>
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Month Navigation */}
            <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevMonth}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {monthNames[currentDate.getMonth()]}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {currentDate.getFullYear()}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextMonth}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {/* Day Names */}
                {dayNames.map(day => (
                  <div key={day} className="text-center py-2">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {day}
                    </span>
                  </div>
                ))}

                {/* Empty cells */}
                {[...Array(startingDayOfWeek)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dayTasks = getTasksForDate(day);
                  const festival = getFestivalForDate(day);
                  const today = isToday(day);
                  const selected = selectedDate === day;
                  const hovered = hoveredDay === day;

                  const showTask = viewMode === 'combined' || viewMode === 'tasks';
                  const showFestival = viewMode === 'combined' || viewMode === 'festivals';

                  return (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(day)}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`aspect-square p-1 sm:p-2 rounded-xl transition-all relative group ${
                        today 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg ring-2 ring-blue-300' 
                          : selected
                          ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                          : festival
                          ? `bg-gradient-to-br ${festival.color} bg-opacity-10 hover:bg-opacity-20`
                          : hovered
                          ? 'bg-gray-100 dark:bg-gray-700'
                          : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`text-sm font-semibold ${
                        today ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                        {day}
                      </div>
                      
                      {/* Festival Icon */}
                      {festival && showFestival && (
                        <div className="absolute top-0 right-0 text-sm sm:text-base">
                          {festival.icon}
                        </div>
                      )}

                      {/* Task Indicators */}
                      {showTask && dayTasks.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                          {dayTasks.slice(0, 3).map((task, idx) => (
                            <div
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full ${
                                task.priority === 'high' ? 'bg-red-500' :
                                task.priority === 'medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{dayTasks.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Hover tooltip */}
                      {hovered && (festival || (showTask && dayTasks.length > 0)) && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          {festival && <div>{festival.name}</div>}
                          {showTask && dayTasks.length > 0 && <div>{dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}</div>}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Major Festivals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Regional Festivals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">National Days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Hyderabad Events</span>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-6">
            <AnimatePresence mode="wait">
              {selectedDate ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {monthNames[currentDate.getMonth()]} {selectedDate}
                    </h3>
                    {isToday(selectedDate) && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {/* Festival Info */}
                    {getFestivalForDate(selectedDate) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-xl bg-gradient-to-br ${getFestivalForDate(selectedDate).color} text-white shadow-lg mb-4`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{getFestivalForDate(selectedDate).icon}</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">
                              {getFestivalForDate(selectedDate).name}
                            </h4>
                            <p className="text-xs opacity-90">
                              {getEventTypeLabel(getFestivalForDate(selectedDate).type)}
                            </p>
                          </div>
                        </div>
                        {getFestivalForDate(selectedDate).type === 'regional' && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <p className="text-xs opacity-90">
                              🏛️ Special celebrations in Telangana & Hyderabad
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Tasks */}
                    {getTasksForDate(selectedDate).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Tasks ({getTasksForDate(selectedDate).length})
                        </h4>
                        {getTasksForDate(selectedDate).map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="mb-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white flex-1 pr-2">
                                {task.title}
                              </h5>
                              <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {task.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Empty State */}
                    {!getFestivalForDate(selectedDate) && getTasksForDate(selectedDate).length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-500 dark:text-gray-400 mb-2 font-semibold">
                          No events or tasks
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Nothing scheduled for this date
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🎊</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a Date
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click on any date to view events and tasks
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Upcoming Festivals */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🎉</span> Upcoming Festivals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(allEvents)
            .filter(([dateKey]) => new Date(dateKey) >= new Date())
            .slice(0, 8)
            .map(([dateKey, event], index) => {
              const eventDate = new Date(dateKey);
              return (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-4 rounded-xl bg-gradient-to-br ${event.color} text-white shadow-md hover:shadow-lg transition-all cursor-pointer`}
                >
                  <div className="text-3xl mb-2">{event.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{event.name}</h4>
                  <p className="text-xs opacity-90">
                    {eventDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    {getEventTypeLabel(event.type)}
                  </p>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Festival Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="text-4xl mb-3">🪔</div>
          <h4 className="font-bold text-lg mb-1">Indian Festivals</h4>
          <p className="text-sm opacity-90">
            All major Hindu, Muslim, Sikh, Buddhist & national festivals
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="text-4xl mb-3">🌺</div>
          <h4 className="font-bold text-lg mb-1">Telugu Festivals</h4>
          <p className="text-sm opacity-90">
            Ugadi, Bonalu, Bathukamma & regional celebrations
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="text-4xl mb-3">🏛️</div>
          <h4 className="font-bold text-lg mb-1">Hyderabad Events</h4>
          <p className="text-sm opacity-90">
            Local celebrations, cultural events & city festivals
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FestivalCalendar;