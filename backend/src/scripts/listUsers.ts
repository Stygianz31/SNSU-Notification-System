import sequelize from '../database/config';
import User from '../models/User';

const listAllUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'phone', 'createdAt'],
      order: [['id', 'ASC']]
    });

    console.log('==========================================');
    console.log('📋 ALL USERS IN DATABASE');
    console.log('==========================================\n');

    if (users.length === 0) {
      console.log('❌ No users found in database!\n');
    } else {
      console.log(`Total Users: ${users.length}\n`);

      users.forEach((user) => {
        console.log('------------------------------------------');
        console.log(`ID:       ${user.id}`);
        console.log(`Username: ${user.username}`);
        console.log(`Email:    ${user.email}`);
        console.log(`Role:     ${user.role}`);
        console.log(`Phone:    ${user.phone}`);
        console.log(`Created:  ${user.createdAt}`);
        console.log('------------------------------------------\n');
      });
    }

    console.log('==========================================\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

listAllUsers();
