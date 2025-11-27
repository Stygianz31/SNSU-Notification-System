import sequelize from '../database/config';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const resetUserPassword = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get command line argument for username
    const username = process.argv[2];
    const newPassword = process.argv[3] || 'password123';

    if (!username) {
      console.log('❌ Usage: npx ts-node src/scripts/resetPassword.ts <username> [password]');
      console.log('   Example: npx ts-node src/scripts/resetPassword.ts student student123\n');
      process.exit(1);
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log(`❌ User '${username}' not found!\n`);
      
      // List available users
      const allUsers = await User.findAll({ attributes: ['username', 'role'] });
      console.log('Available users:');
      allUsers.forEach(u => console.log(`  - ${u.username} (${u.role})`));
      console.log();
      
      process.exit(1);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password directly in database
    await User.update(
      { password: hashedPassword },
      { where: { username }, individualHooks: false }
    );

    console.log('==========================================');
    console.log('✅ PASSWORD RESET SUCCESSFUL!');
    console.log('==========================================');
    console.log(`Username: ${username}`);
    console.log(`New Password: ${newPassword}`);
    console.log(`Role: ${user.role}`);
    console.log('==========================================\n');
    console.log('You can now login with these credentials!\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetUserPassword();
