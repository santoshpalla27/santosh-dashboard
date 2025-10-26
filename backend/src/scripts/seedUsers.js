require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await connectDB();

    // Delete ALL existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared all existing users');

    // Create only your user
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

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding users: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;