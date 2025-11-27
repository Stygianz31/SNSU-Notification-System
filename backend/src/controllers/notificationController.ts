import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.findAll({
      order: [['timestamp', 'DESC']]
    });

    res.json(notifications);
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Error fetching notifications', details: error.message });
  }
};

export const getNotificationById = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error: any) {
    console.error('Get notification by ID error:', error);
    res.status(500).json({ error: 'Error fetching notification', details: error.message });
  }
};

export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, type } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({ error: 'Title, content, and type are required' });
    }

    const existingNotification = await Notification.findOne({ where: { title } });
    if (existingNotification) {
      return res.status(400).json({ error: 'A notification with this title already exists' });
    }

    const notificationData: any = { title, content, type };

    if (req.file) {
      const originalPath = req.file.path;
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const imageName = `${uniqueName}${path.extname(req.file.originalname)}`;
      const thumbnailName = `thumb_${imageName}`;

      const imagePath = path.join(path.dirname(originalPath), imageName);
      const thumbnailPath = path.join(path.dirname(originalPath), '..', 'thumbnails', thumbnailName);

      const thumbnailDir = path.dirname(thumbnailPath);
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      await sharp(originalPath)
        .jpeg({ quality: 85 })
        .toFile(imagePath);

      await sharp(originalPath)
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toFile(thumbnailPath);

      try {
        await fsPromises.unlink(originalPath);
      } catch (unlinkError: any) {
        console.warn('Warning: Could not delete temporary file:', unlinkError.message);
      }

      notificationData.imagePath = `notifications/${imageName}`;
      notificationData.thumbnailPath = `thumbnails/${thumbnailName}`;
    }

    const notification = await Notification.create(notificationData);

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error: any) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: error.message || 'Error creating notification' });
  }
};

export const updateNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const { title, content, type } = req.body;

    if (title) notification.title = title;
    if (content) notification.content = content;
    if (type) notification.type = type;

    if (req.file) {
      if (notification.imagePath) {
        const oldImagePath = path.join(process.env.UPLOAD_PATH || './uploads', notification.imagePath);
        if (fs.existsSync(oldImagePath)) {
          try {
            await fsPromises.unlink(oldImagePath);
          } catch (error: any) {
            console.warn('Warning: Could not delete old image:', error.message);
          }
        }
      }
      if (notification.thumbnailPath) {
        const oldThumbnailPath = path.join(process.env.UPLOAD_PATH || './uploads', notification.thumbnailPath);
        if (fs.existsSync(oldThumbnailPath)) {
          try {
            await fsPromises.unlink(oldThumbnailPath);
          } catch (error: any) {
            console.warn('Warning: Could not delete old thumbnail:', error.message);
          }
        }
      }

      const originalPath = req.file.path;
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const imageName = `${uniqueName}${path.extname(req.file.originalname)}`;
      const thumbnailName = `thumb_${imageName}`;

      const imagePath = path.join(path.dirname(originalPath), imageName);
      const thumbnailPath = path.join(path.dirname(originalPath), '..', 'thumbnails', thumbnailName);

      const thumbnailDir = path.dirname(thumbnailPath);
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      await sharp(originalPath)
        .jpeg({ quality: 85 })
        .toFile(imagePath);

      await sharp(originalPath)
        .resize(300, 300, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toFile(thumbnailPath);

      try {
        await fsPromises.unlink(originalPath);
      } catch (unlinkError: any) {
        console.warn('Warning: Could not delete temporary file:', unlinkError.message);
      }

      notification.imagePath = `notifications/${imageName}`;
      notification.thumbnailPath = `thumbnails/${thumbnailName}`;
    }

    await notification.save();

    res.json({
      message: 'Notification updated successfully',
      notification
    });
  } catch (error: any) {
    console.error('Update notification error:', error);
    res.status(500).json({ error: 'Error updating notification', details: error.message });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.imagePath) {
      const imagePath = path.join(process.env.UPLOAD_PATH || './uploads', notification.imagePath);
      if (fs.existsSync(imagePath)) {
        try {
          await fsPromises.unlink(imagePath);
        } catch (error: any) {
          console.warn('Warning: Could not delete image:', error.message);
        }
      }
    }

    if (notification.thumbnailPath) {
      const thumbnailPath = path.join(process.env.UPLOAD_PATH || './uploads', notification.thumbnailPath);
      if (fs.existsSync(thumbnailPath)) {
        try {
          await fsPromises.unlink(thumbnailPath);
        } catch (error: any) {
          console.warn('Warning: Could not delete thumbnail:', error.message);
        }
      }
    }

    await notification.destroy();

    res.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Error deleting notification', details: error.message });
  }
};
