require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Route imports
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const todoRoutes = require('./routes/todos');
const personalSpaceRoutes = require('./routes/personalSpace');

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(logger);
}

// Track if initialization has been attempted
let isInitialized = false;

// Initialize app (seed users if needed) - with retry logic
const initializeApp = async (retryCount = 0, maxRetries = 5) => {
  try {
    const User = require('./models/User');
    
    // Test if we can query the database
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('🌱 No users found. Creating your admin user...');
      const seedUsers = require('./scripts/seedUsers');
      await seedUsers();
      console.log('✅ User initialization complete');
    } else {
      console.log(`✅ Found ${userCount} existing user(s)`);
      // Show user emails
      const users = await User.find().select('email username role isActive');
      users.forEach(u => {
        const status = u.isActive ? '✅' : '❌';
        console.log(`   ${status} ${u.email} (${u.role})`);
      });
    }
    
    isInitialized = true;
  } catch (error) {
    console.error(`❌ Failed to initialize app (attempt ${retryCount + 1}/${maxRetries}):`, error.message);
    
    if (retryCount < maxRetries - 1) {
      const delay = 2000; // 2 seconds
      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return initializeApp(retryCount + 1, maxRetries);
    } else {
      console.error('❌ Max retries reached. Application will continue without user initialization.');
      console.error('💡 You can manually seed users by running: npm run seed-users');
    }
  }
};

// Handle MongoDB connection events
const mongoose = require('mongoose');

// On initial connection
mongoose.connection.once('open', () => {
  console.log('📡 MongoDB connection established (initial)');
  initializeApp();
});

// On reconnection after disconnect
mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
  if (!isInitialized) {
    console.log('🔄 Running initialization after reconnection...');
    initializeApp();
  } else {
    console.log('✅ Initialization already completed, skipping...');
  }
});

// On disconnection
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

// On connection error
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Santosh Dashboard API',
    version: process.env.API_VERSION || '1.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks',
      todos: '/api/todos',
    },
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      initialized: isInitialized,
    },
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/personal-space', personalSpaceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
