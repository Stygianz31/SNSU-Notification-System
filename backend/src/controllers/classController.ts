import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Class from '../models/Class';
import User from '../models/User';

export const getClasses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let classes;
    
    if (user.role === 'admin') {
      // Admin can see all classes
      classes = await Class.findAll({
        include: [
          { model: User, as: 'teacher', attributes: ['id', 'username', 'email', 'department'] }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else if (user.role === 'teacher') {
      // Teachers see only their classes
      classes = await Class.findAll({
        where: { teacherId: userId },
        include: [
          { model: User, as: 'teacher', attributes: ['id', 'username', 'email', 'department'] }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else {
      // Students see all active classes
      classes = await Class.findAll({
        where: { isActive: true },
        include: [
          { model: User, as: 'teacher', attributes: ['id', 'username', 'email', 'department'] }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Error fetching classes' });
  }
};

export const getClassById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const classItem = await Class.findByPk(id, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'username', 'email', 'department', 'profilePicture'] }
      ]
    });

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(classItem);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Error fetching class' });
  }
};

export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);

    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      return res.status(403).json({ error: 'Only admins and teachers can create classes' });
    }

    const { className, subject, description, schedule, room, semester, academicYear } = req.body;

    if (!className || !subject || !schedule || !semester || !academicYear) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If teacher creates class, they are automatically the teacher
    // If admin creates class, they must specify teacherId
    let teacherId = user.role === 'teacher' ? userId : req.body.teacherId;

    if (!teacherId) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }

    const newClass = await Class.create({
      className,
      subject,
      description,
      teacherId: teacherId!,
      schedule,
      room,
      semester,
      academicYear,
      isActive: true
    });

    const fullClass = await Class.findByPk(newClass.id, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'username', 'email', 'department'] }
      ]
    });

    res.status(201).json({
      message: 'Class created successfully',
      data: fullClass
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Error creating class' });
  }
};

export const updateClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const user = await User.findByPk(userId);

    const classItem = await Class.findByPk(id);

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Only admin or the teacher of the class can update it
    if (user?.role !== 'admin' && classItem.teacherId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this class' });
    }

    const { className, subject, description, schedule, room, semester, academicYear, isActive } = req.body;

    if (className) classItem.className = className;
    if (subject) classItem.subject = subject;
    if (description !== undefined) classItem.description = description;
    if (schedule) classItem.schedule = schedule;
    if (room !== undefined) classItem.room = room;
    if (semester) classItem.semester = semester;
    if (academicYear) classItem.academicYear = academicYear;
    if (isActive !== undefined) classItem.isActive = isActive;

    await classItem.save();

    const updatedClass = await Class.findByPk(id, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'username', 'email', 'department'] }
      ]
    });

    res.json({
      message: 'Class updated successfully',
      data: updatedClass
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Error updating class' });
  }
};

export const deleteClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const user = await User.findByPk(userId);

    const classItem = await Class.findByPk(id);

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Only admin can delete classes
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete classes' });
    }

    await classItem.destroy();

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Error deleting class' });
  }
};
