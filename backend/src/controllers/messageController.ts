import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import User from '../models/User';
import { Op } from 'sequelize';

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    // If no userId in params, get all messages (broadcast/general chat)
    const whereClause = userId ? {
      [Op.or]: [
        { senderId: currentUserId, recipientId: userId },
        { senderId: userId, recipientId: currentUserId }
      ]
    } : {};

    const messages = await Message.findAll({
      where: whereClause as any,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'role', 'profilePicture', 'onlineStatus'] },
        { model: User, as: 'recipient', attributes: ['id', 'username', 'role', 'profilePicture', 'onlineStatus'] }
      ],
      order: [['timestamp', 'ASC']]
    });

    // Filter out messages deleted by current user
    const visibleMessages = messages.filter((msg: any) => {
      if (!msg.deletedFor) return true;
      const deletedForUsers = msg.deletedFor.split(',').map((id: string) => parseInt(id));
      return !deletedForUsers.includes(currentUserId!);
    });

    // Format for frontend
    const formattedMessages = visibleMessages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      senderUsername: msg.sender?.username || 'Unknown',
      senderRole: msg.sender?.role || 'user',
      senderProfilePicture: msg.sender?.profilePicture || null,
      createdAt: msg.timestamp
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.userId;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId },
          { recipientId: currentUserId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'role', 'profilePicture', 'onlineStatus'] },
        { model: User, as: 'recipient', attributes: ['id', 'username', 'role', 'profilePicture', 'onlineStatus'] }
      ],
      order: [['timestamp', 'DESC']]
    });

    const conversationMap = new Map();
    
    messages.forEach(message => {
      const otherUserId = message.senderId === currentUserId ? message.recipientId : message.senderId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, message);
      }
    });

    const conversations = Array.from(conversationMap.values());

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { content, recipientId, isBroadcast } = req.body;
    const senderId = req.userId;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (!isBroadcast && !recipientId) {
      return res.status(400).json({ error: 'Recipient ID is required for direct messages' });
    }

    const message = await Message.create({
      content,
      senderId: senderId!,
      recipientId: isBroadcast ? null : recipientId,
      isBroadcast: isBroadcast || false
    });

    const fullMessage = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'role', 'profilePicture', 'onlineStatus'] },
        { model: User, as: 'recipient', attributes: ['id', 'username', 'role', 'profilePicture', 'onlineStatus'] }
      ]
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: fullMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.recipientId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to mark this message as read' });
    }

    message.readStatus = true;
    message.readTimestamp = new Date();
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking message as read' });
  }
};

export const deleteMessageForMe = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId!;

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Add user ID to deletedFor list
    let deletedForUsers: number[] = [];
    if (message.deletedFor) {
      deletedForUsers = message.deletedFor.split(',').map(id => parseInt(id));
    }

    if (!deletedForUsers.includes(userId)) {
      deletedForUsers.push(userId);
      message.deletedFor = deletedForUsers.join(',');
      await message.save();
    }

    res.json({ message: 'Message deleted for you' });
  } catch (error) {
    console.error('Delete message for me error:', error);
    res.status(500).json({ error: 'Error deleting message' });
  }
};

export const deleteMessageForEveryone = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId!;

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Get user to check if admin
    const user = await User.findByPk(userId);

    // Only sender or admin can delete for everyone
    if (message.senderId !== userId && user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only the sender or admin can delete this message for everyone' });
    }

    // Actually delete the message
    await message.destroy();

    res.json({ message: 'Message deleted for everyone' });
  } catch (error) {
    console.error('Delete message for everyone error:', error);
    res.status(500).json({ error: 'Error deleting message' });
  }
};
