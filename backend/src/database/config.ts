import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbType = process.env.DB_TYPE || 'sqlite';

let sequelize: Sequelize;

if (dbType === 'postgres') {
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'school_notification',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    define: {
      timestamps: true
    },
    // Enable foreign keys for SQLite
    dialectOptions: {
      busyTimeout: 3000
    }
  });
}

export default sequelize;
