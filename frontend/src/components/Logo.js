import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 'default', onClick }) => {
  // Define size variants
  const sizes = {
    small: { width: 32, height: 32, text: 'text-base' },
    default: { width: 40, height: 40, text: 'text-lg' },
    large: { width: 48, height: 48, text: 'text-xl' },
  };

  const currentSize = sizes[size] || sizes.default;

  // Simplified SVG logo as fallback (no Lottie dependency needed)
  const SimpleLogo = () => (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer"
      onClick={onClick}
      style={{ width: currentSize.width, height: currentSize.height }}
    >
      {/* Animated gradient circle */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0"
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl shadow-lg flex items-center justify-center">
          {/* Icon */}
          <svg
            className="w-3/5 h-3/5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      </motion.div>

      {/* Pulsing glow effect */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl blur-md -z-10"
      />
    </motion.div>
  );

  return (
    <div className="flex items-center gap-3">
      <SimpleLogo />
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline-block ${currentSize.text}`}
      >
        Dashboard
      </motion.span>
    </div>
  );
};

export default Logo;