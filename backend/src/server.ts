import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import sequelize from './database/config';
import { initializeChatHandlers } from './socket/chatHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import notificationRoutes from './routes/notificationRoutes';
import messageRoutes from './routes/messageRoutes';
import classRoutes from './routes/classRoutes';
import User from './models/User';
import Message from './models/Message';
import Notification from './models/Notification';
import Class from './models/Class';

// Setup associations with cascade delete
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Class, { foreignKey: 'teacherId', as: 'classes', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8100',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.use(compression());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8100',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/classes', classRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '..', 'public');
  app.use(express.static(publicPath));
  
  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(publicPath, 'index.html'));
    }
  });
}

initializeChatHandlers(io);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Use sync() without alter for production stability
    // Only create tables if they don't exist, don't alter existing ones
    await sequelize.sync();
    console.log('Database synchronized successfully.');
    
    // Add deletedFor column to messages table if it doesn't exist
    try {
      await sequelize.query(`
        ALTER TABLE messages ADD COLUMN deletedFor TEXT DEFAULT NULL;
      `);
      console.log('Added deletedFor column to messages table.');
    } catch (error: any) {
      // Column might already exist, ignore error
      if (!error.message.includes('duplicate column name')) {
        console.log('deletedFor column already exists or error:', error.message);
      }
    }

    // Create default admin account only if it doesn't exist
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@snsu.edu.ph',
        phone: '+639123456789',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Default admin user created successfully.');
    }

    return true;
  } catch (error) {
    console.error('Unable to initialize database:', error);
    return false;
  }
};

const PORT = process.env.PORT || 5000;

initializeDatabase().then((success) => {
  if (success) {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: ${process.env.DB_TYPE || 'sqlite'}`);
    });
  } else {
    console.error('Failed to initialize database. Server not started.');
    process.exit(1);
  }
});

export { app, httpServer, io };
