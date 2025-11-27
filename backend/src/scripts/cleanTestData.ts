import { User, Notification, Message } from '../models';
import bcrypt from 'bcrypt';

async function cleanTestData() {
  try {
    console.log('🧹 Starting database cleanup...\n');

    // Keep only the default admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    // Delete all users except admin
    console.log('👥 Cleaning users...');
    await User.destroy({
      where: {
        username: {
          [require('sequelize').Op.ne]: 'admin'
        }
      }
    });
    console.log('✅ Users cleaned\n');

    // Ensure admin user exists with correct data
    console.log('🔧 Ensuring admin user...');
    const [admin] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        email: 'admin@snsu.edu.ph',
        password: adminPassword,
        role: 'admin',
        phone: '+639123456789'
      }
    });
    console.log('✅ Admin user ready\n');

    // Delete all notifications
    console.log('🔔 Cleaning notifications...');
    const notificationCount = await Notification.destroy({ where: {}, truncate: true });
    console.log(`✅ Deleted ${notificationCount} notifications\n`);

    // Delete all messages
    console.log('💬 Cleaning messages...');
    const messageCount = await Message.destroy({ where: {}, truncate: true });
    console.log(`✅ Deleted ${messageCount} messages\n`);

    console.log('========================================');
    console.log('✅ DATABASE CLEANUP COMPLETE!');
    console.log('========================================');
    console.log('\n📊 Remaining data:');
    console.log('   Users: 1 (admin only)');
    console.log('   Notifications: 0');
    console.log('   Messages: 0');
    console.log('\n🔑 Admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@snsu.edu.ph');
    console.log('\n✨ Database is clean and ready!');

  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    process.exit();
  }
}

cleanTestData();
