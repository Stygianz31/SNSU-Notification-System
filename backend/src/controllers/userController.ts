import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Message from '../models/Message';
import { Op } from 'sequelize';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.findAll({
      order: [['username', 'ASC']]
    });

    const teachers = users.filter(u => u.role === 'teacher');
    const students = users.filter(u => u.role === 'student');
    const admins = users.filter(u => u.role === 'admin' && u.id !== req.userId);

    res.json({ teachers, students, admins });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Error fetching users', details: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toJSON());
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Error fetching user', details: error.message });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, phone, password, role, department, course, yearLevel } = req.body;

    if (!username || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const userData: any = { username, email, phone, password, role };

    if (role === 'teacher' && department) {
      userData.department = department;
    } else if (role === 'student') {
      userData.course = course;
      userData.yearLevel = yearLevel;
    }

    const user = await User.create(userData);

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error creating user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, email, phone, role, department, course, yearLevel } = req.body;

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      user.email = email;
    }

    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (department) user.department = department;
    if (course) user.course = course;
    if (yearLevel) user.yearLevel = yearLevel;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Error updating user', details: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.username === 'admin') {
      return res.status(403).json({ error: 'Cannot delete default admin account' });
    }

    // Delete related messages first to avoid foreign key constraint errors
    try {
      await Message.destroy({
        where: {
          [Op.or]: [
            { senderId: user.id },
            { recipientId: user.id }
          ]
        }
      });
    } catch (msgError: any) {
      console.warn('Warning: Could not delete user messages:', msgError.message);
      // Continue with user deletion even if message deletion fails
    }

    // Delete profile picture if exists
    if (user.profilePicture) {
      const imagePath = path.join(process.env.UPLOAD_PATH || './uploads', user.profilePicture);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (fileError: any) {
        console.warn('Warning: Could not delete profile picture:', fileError.message);
      }
    }

    // Delete the user
    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Error deleting user', details: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    console.log('=== UPDATE PROFILE REQUEST ===');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, email, phone, department, course, yearLevel, bio } = req.body;

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      user.email = email;
    }

    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (course) user.course = course;
    if (yearLevel) user.yearLevel = parseInt(yearLevel);
    if (bio !== undefined) user.bio = bio;

    // Handle profile picture upload
    if (req.file) {
      const profilePicturePath = `uploads/profiles/${req.file.filename}`;
      user.profilePicture = profilePicturePath;
      console.log('✅ Profile picture updated:', profilePicturePath);
    } else {
      console.log('⚠️ No file in request');
    }

    console.log('User before save:', {
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture
    });

    await user.save();
    
    console.log('User after save:', {
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture
    });

    const updatedUserData = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
      onlineStatus: user.onlineStatus,
      department: user.department,
      course: user.course,
      yearLevel: user.yearLevel,
      bio: user.bio
    };

    console.log('Sending updated user data:', updatedUserData);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUserData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Error changing password', details: error.message });
  }
};

export const uploadProfilePicture = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.profilePicture) {
      const oldPath = path.join(process.env.UPLOAD_PATH || './uploads', user.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const processedFileName = `processed-${req.file.filename}`;
    const processedPath = path.join(path.dirname(req.file.path), processedFileName);

    await sharp(req.file.path)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toFile(processedPath);

    fs.unlinkSync(req.file.path);

    user.profilePicture = `profiles/${processedFileName}`;
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading profile picture' });
  }
};
