const mongoose = require('mongoose');
require('dotenv').config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitplanhub');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Rename followedTrainers to following
    await db.collection('users').updateMany(
      { followedTrainers: { $exists: true } },
      { $rename: { 'followedTrainers': 'following' } }
    );

    // Add following array to users who don't have it
    await db.collection('users').updateMany(
      { following: { $exists: false } },
      { $set: { following: [] } }
    );

    console.log('✅ Migration complete!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrate();
