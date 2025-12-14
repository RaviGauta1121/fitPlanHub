const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');
const Plan = require('./src/models/Plan');
const Subscription = require('./src/models/Subscription');
const Review = require('./src/models/Review');
const WorkoutLog = require('./src/models/WorkoutLog');
const Notification = require('./src/models/Notification');

// Sample data
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    password: 'password123',
    role: 'user'
  }
];

const trainers = [
  {
    name: 'Alex Fitness',
    email: 'alex@trainer.com',
    password: 'trainer123',
    role: 'trainer',
    certifications: 'NASM-CPT, Nutrition Specialist'
  },
  {
    name: 'Jessica Strong',
    email: 'jessica@trainer.com',
    password: 'trainer123',
    role: 'trainer',
    certifications: 'ACE-CPT, Yoga Instructor'
  },
  {
    name: 'Marcus Power',
    email: 'marcus@trainer.com',
    password: 'trainer123',
    role: 'trainer',
    certifications: 'ISSA-CFT, Strength Coach'
  },
  {
    name: 'Linda Wellness',
    email: 'linda@trainer.com',
    password: 'trainer123',
    role: 'trainer',
    certifications: 'ACSM-CPT, Wellness Coach'
  }
];

const plans = [
  {
    title: 'Beginner Full Body Workout',
    description: 'Perfect for those starting their fitness journey. This 4-week program focuses on building a solid foundation with compound movements and proper form.',
    price: 29.99,
    duration: 30,
    category: 'strength',
    difficulty: 'beginner',
    tags: ['Full Body', 'Beginner Friendly', 'Foundation']
  },
  {
    title: 'Advanced HIIT Program',
    description: 'High-Intensity Interval Training designed for experienced athletes. Burn fat and build cardiovascular endurance with this challenging 6-week program.',
    price: 49.99,
    duration: 45,
    category: 'cardio',
    difficulty: 'advanced',
    tags: ['HIIT', 'Fat Loss', 'Cardio']
  },
  {
    title: 'Yoga & Flexibility Master',
    description: 'Improve flexibility, balance, and mental clarity with this comprehensive yoga program. Includes daily routines for all levels.',
    price: 34.99,
    duration: 60,
    category: 'flexibility',
    difficulty: 'intermediate',
    tags: ['Yoga', 'Flexibility', 'Mindfulness']
  },
  {
    title: 'Weight Loss Transformation',
    description: 'Complete 12-week transformation program combining strength training, cardio, and nutrition guidance to help you lose weight sustainably.',
    price: 89.99,
    duration: 90,
    category: 'weight_loss',
    difficulty: 'intermediate',
    tags: ['Weight Loss', 'Transformation', 'Nutrition']
  },
  {
    title: 'Powerlifting Fundamentals',
    description: 'Master the big three lifts: squat, bench press, and deadlift. This program focuses on building raw strength and proper powerlifting technique.',
    price: 59.99,
    duration: 60,
    category: 'strength',
    difficulty: 'advanced',
    tags: ['Powerlifting', 'Strength', 'Big Three']
  },
  {
    title: 'Home Workout Essentials',
    description: 'No gym? No problem! This program requires minimal equipment and can be done entirely at home. Perfect for busy professionals.',
    price: 24.99,
    duration: 30,
    category: 'general',
    difficulty: 'beginner',
    tags: ['Home Workout', 'No Equipment', 'Convenient']
  },
  {
    title: 'Marathon Training Plan',
    description: '16-week comprehensive marathon training program designed to get you from 5K to 42K safely and effectively.',
    price: 79.99,
    duration: 120,
    category: 'endurance',
    difficulty: 'advanced',
    tags: ['Marathon', 'Running', 'Endurance']
  },
  {
    title: 'Core Strength Builder',
    description: 'Develop a rock-solid core with this targeted 6-week program. Improve posture, reduce back pain, and enhance athletic performance.',
    price: 39.99,
    duration: 45,
    category: 'strength',
    difficulty: 'intermediate',
    tags: ['Core', 'Abs', 'Functional Strength']
  },
  {
    title: 'Muscle Gain Mass Builder',
    description: 'Build serious muscle mass with this comprehensive 12-week hypertrophy program. Includes progressive overload and nutrition guidance.',
    price: 69.99,
    duration: 90,
    category: 'muscle_gain',
    difficulty: 'intermediate',
    tags: ['Muscle Gain', 'Hypertrophy', 'Mass Building']
  },
  {
    title: 'Cardio Kickboxing',
    description: 'High-energy kickboxing program that combines martial arts techniques with cardiovascular training. Burn calories and learn self-defense!',
    price: 44.99,
    duration: 45,
    category: 'cardio',
    difficulty: 'intermediate',
    tags: ['Kickboxing', 'Cardio', 'Martial Arts']
  }
];

const reviewTexts = [
  { rating: 5, comment: 'Amazing program! Saw results within 2 weeks. Highly recommended!' },
  { rating: 5, comment: 'Best investment I made for my fitness. The trainer is very knowledgeable.' },
  { rating: 4, comment: 'Great plan overall. Would love more variety in exercises but very effective.' },
  { rating: 5, comment: 'Exceeded my expectations. Lost 15 pounds and feel stronger than ever!' },
  { rating: 4, comment: 'Well structured program. Instructions are clear and easy to follow.' },
  { rating: 5, comment: 'Life-changing! This program helped me build confidence and strength.' },
  { rating: 4, comment: 'Solid program for the price. Definitely worth trying.' },
  { rating: 5, comment: 'The best fitness program I have ever tried. Results speak for themselves!' }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitplanhub');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Plan.deleteMany({});
    await Subscription.deleteMany({});
    await Review.deleteMany({});
    await WorkoutLog.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        following: []
      });
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.email}`);
    }

    // Create trainers
    console.log('👨‍🏫 Creating trainers...');
    const createdTrainers = [];
    for (const trainerData of trainers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(trainerData.password, salt);
      const trainer = await User.create({
        ...trainerData,
        password: hashedPassword,
        following: []
      });
      createdTrainers.push(trainer);
      console.log(`   ✓ Created trainer: ${trainer.email}`);
    }

    // Make users follow trainers
    console.log('🔗 Setting up following relationships...');
    for (const user of createdUsers) {
      const randomTrainers = createdTrainers
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);
      user.following = randomTrainers.map(t => t._id);
      await user.save();
      console.log(`   ✓ ${user.name} is now following ${randomTrainers.length} trainers`);
    }

    // Create plans
    console.log('📋 Creating fitness plans...');
    const createdPlans = [];
    for (let i = 0; i < plans.length; i++) {
      const planData = plans[i];
      const trainer = createdTrainers[i % createdTrainers.length];
      const plan = await Plan.create({
        ...planData,
        trainer: trainer._id
      });
      createdPlans.push(plan);
      console.log(`   ✓ Created plan: ${plan.title} by ${trainer.name}`);
    }

    // Create subscriptions
    console.log('⭐ Creating subscriptions...');
    const createdSubscriptions = [];
    for (const user of createdUsers) {
      const numSubscriptions = Math.floor(Math.random() * 3) + 1;
      const userPlans = createdPlans
        .sort(() => 0.5 - Math.random())
        .slice(0, numSubscriptions);

      for (const plan of userPlans) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 15));
        
        const subscription = await Subscription.create({
          user: user._id,
          plan: plan._id,
          startDate: startDate,
          endDate: new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000),
          amount: plan.price
        });
        createdSubscriptions.push(subscription);
        console.log(`   ✓ ${user.name} subscribed to ${plan.title}`);
      }
    }

    // Create reviews
    console.log('⭐ Creating reviews...');
    for (const subscription of createdSubscriptions) {
      if (Math.random() > 0.3) {
        const reviewData = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
        await Review.create({
          user: subscription.user,
          plan: subscription.plan,
          rating: reviewData.rating,
          comment: reviewData.comment
        });
        console.log(`   ✓ Created review for plan`);
      }
    }

    // Create workout logs
    console.log('🏋️ Creating workout logs...');
    for (const subscription of createdSubscriptions) {
      const numLogs = Math.floor(Math.random() * 5) + 3;
      
      for (let i = 0; i < numLogs; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 20));
        
        const exerciseList = [
          { exerciseName: 'Squats', setsCompleted: 3, repsCompleted: 12, weight: 135 },
          { exerciseName: 'Bench Press', setsCompleted: 4, repsCompleted: 10, weight: 185 },
          { exerciseName: 'Deadlifts', setsCompleted: 3, repsCompleted: 8, weight: 225 },
          { exerciseName: 'Pull-ups', setsCompleted: 3, repsCompleted: 10, weight: 0 },
          { exerciseName: 'Shoulder Press', setsCompleted: 3, repsCompleted: 12, weight: 95 }
        ];

        const randomExercises = exerciseList
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 2);

        const moods = ['excellent', 'good', 'average', 'tired', 'exhausted'];
        
        await WorkoutLog.create({
          user: subscription.user,
          plan: subscription.plan,
          date: date,
          exercises: randomExercises,
          duration: Math.floor(Math.random() * 60) + 30,
          caloriesBurned: Math.floor(Math.random() * 400) + 200,
          mood: moods[Math.floor(Math.random() * moods.length)],
          notes: 'Great workout session! Feeling stronger every day.'
        });
      }
    }

    const totalLogs = await WorkoutLog.countDocuments();
    console.log(`   ✓ Created ${totalLogs} workout logs`);

    // Create notifications
    console.log('🔔 Creating notifications...');
    const notificationTypes = [
      {
        type: 'subscription',
        title: 'Welcome to FitPlanHub! 🎉',
        message: 'Your subscription has been activated successfully. Start your fitness journey today!',
        link: '/dashboard/user'
      },
      {
        type: 'achievement',
        title: 'First Workout Complete! 💪',
        message: 'Congratulations! You completed your first workout. Keep up the great work!',
        link: '/achievements'
      },
      {
        type: 'reminder',
        title: 'Time for Your Workout! ⏰',
        message: "Don't forget to complete today's workout. Your fitness goals are waiting!",
        link: '/plans'
      },
      {
        type: 'new_plan',
        title: 'New Plan Available! 🆕',
        message: 'Your trainer just published a new fitness plan. Check it out now!',
        link: '/plans'
      }
    ];

    for (const user of createdUsers) {
      const numNotifications = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numNotifications; i++) {
        const notif = notificationTypes[i % notificationTypes.length];
        await Notification.create({
          user: user._id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          link: notif.link,
          isRead: Math.random() > 0.4
        });
      }
    }
    console.log('   ✓ Created notifications for all users');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   👨‍🏫 Trainers: ${createdTrainers.length}`);
    console.log(`   📋 Plans: ${createdPlans.length}`);
    console.log(`   ⭐ Subscriptions: ${createdSubscriptions.length}`);
    console.log(`   💬 Reviews: ${await Review.countDocuments()}`);
    console.log(`   🏋️ Workout Logs: ${await WorkoutLog.countDocuments()}`);
    console.log(`   🔔 Notifications: ${await Notification.countDocuments()}`);

    console.log('\n🔑 Login Credentials:');
    console.log('\n   Users:');
    users.forEach(u => console.log(`   📧 ${u.email} / 🔒 password123`));
    console.log('\n   Trainers:');
    trainers.forEach(t => console.log(`   📧 ${t.email} / 🔒 trainer123`));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    console.log('🚀 You can now start using the application!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
