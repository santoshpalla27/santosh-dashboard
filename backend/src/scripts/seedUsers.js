require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB Connected');
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      throw error;
    }
  }
};

const seedUsers = async () => {
  try {
    // Connect only if not already connected
    await connectDB();

    // Check if users exist
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log(`⚠️  ${userCount} user(s) already exist. Skipping seed...`);
      if (require.main === module) {
        process.exit(0);
      }
      return;
    }

    // Delete ALL existing users (just to be safe)
    await User.deleteMany({});
    console.log('🗑️  Cleared all existing users');

    // Create your admin user
    console.log('Creating your admin user...');
    const user = new User({
      email: 'santoshpalla27@gmail.com',
      password: 'santoshdashboard',
      username: 'santoshpalla',
      firstName: 'Santosh',
      lastName: 'Palla',
      role: 'admin',
      isActive: true,
    });
    
    await user.save();
    console.log('✅ User created successfully');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Your Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: santoshpalla27@gmail.com');
    console.log('Password: santoshdashboard');
    console.log('Role: Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Only exit if run directly from command line
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`❌ Error seeding users: ${error.message}`);
    console.error(error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;
