const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      heartbeatFrequencyMS: 2000, // Check connection every 2s
      retryWrites: true,
      retryReads: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected - waiting for reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected successfully');
    });

    mongoose.connection.on('connecting', () => {
      console.log('🔄 MongoDB connecting...');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

module.exports = connectDB;