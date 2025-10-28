import React from 'react';
import { motion } from 'framer-motion';

const ModernLogo = ({ variant = 'gradient', onClick }) => {
  const LogoVariants = {
    // Gradient Rotating Icon
    gradient: (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer flex items-center gap-3"
        onClick={onClick}
      >
        <div className="relative w-10 h-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl shadow-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl blur-md -z-10"
          />
        </div>
        <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline-block">
          Dashboard
        </span>
      </motion.div>
    ),

    // Stacked Squares
    stacked: (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer flex items-center gap-3"
        onClick={onClick}
      >
        <div className="relative w-10 h-10">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${
                  i === 0 ? '#3B82F6, #6366F1' :
                  i === 1 ? '#6366F1, #8B5CF6' :
                  '#8B5CF6, #A855F7'
                })`,
                borderRadius: '0.75rem',
                opacity: 0.7 - i * 0.2,
              }}
            />
          ))}
        </div>
        <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:inline-block">
          Dashboard
        </span>
      </motion.div>
    ),

    // Pulse Circle
    pulse: (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer flex items-center gap-3"
        onClick={onClick}
      >
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 2, 2],
                opacity: [0.5, 0, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.4,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 border-2 border-blue-500 rounded-full"
            />
          ))}
        </div>
        <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:inline-block">
          Dashboard
        </span>
      </motion.div>
    ),

    // Geometric Modern
    geometric: (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer flex items-center gap-3"
        onClick={onClick}
      >
        <div className="relative w-10 h-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <motion.path
              d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z"
              fill="url(#logoGradient)"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ originX: '50px', originY: '50px' }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="15"
              fill="white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ originX: '50px', originY: '50px' }}
            />
          </svg>
        </div>
        <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:inline-block">
          Dashboard
        </span>
      </motion.div>
    ),

    // Minimal Line Art
    minimal: (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer flex items-center gap-3"
        onClick={onClick}
      >
        <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </motion.div>
        </div>
        <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:inline-block">
          Dashboard
        </span>
      </motion.div>
    ),
  };

  return LogoVariants[variant] || LogoVariants.gradient;
};

export default ModernLogo;