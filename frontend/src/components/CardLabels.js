import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CardLabels = ({ labels = [], onAdd, onRemove }) => {
  const [showPicker, setShowPicker] = useState(false);

  const predefinedLabels = [
    { name: 'Bug', color: 'bg-red-500' },
    { name: 'Feature', color: 'bg-blue-500' },
    { name: 'Enhancement', color: 'bg-green-500' },
    { name: 'Documentation', color: 'bg-yellow-500' },
    { name: 'Design', color: 'bg-purple-500' },
    { name: 'Testing', color: 'bg-pink-500' },
    { name: 'Urgent', color: 'bg-orange-500' },
    { name: 'Backend', color: 'bg-indigo-500' },
    { name: 'Frontend', color: 'bg-cyan-500' },
  ];

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {labels.map((label, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 ${label.color} text-white rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all cursor-pointer group`}
          >
            {label.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(label);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.span>
        ))}
        
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="inline-flex items-center gap-1 px-2 py-1 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg text-xs hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>

      {/* Label Picker */}
      <AnimatePresence>
        {showPicker && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowPicker(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-20"
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Select Labels
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {predefinedLabels.map((label) => (
                  <button
                    key={label.name}
                    onClick={() => {
                      onAdd(label);
                      setShowPicker(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 ${label.color} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
                  >
                    <span className="w-4 h-4 bg-white rounded"></span>
                    {label.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardLabels;