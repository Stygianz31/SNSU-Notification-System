import { Router } from 'express';
import {
  getMessages,
  getConversations,
  sendMessage,
  markAsRead,
  deleteMessageForMe,
  deleteMessageForEveryone
} from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/conversations', authenticate, getConversations);
router.get('/', authenticate, getMessages);
router.get('/:userId', authenticate, getMessages);
router.post('/', authenticate, sendMessage);
router.put('/:messageId/read', authenticate, markAsRead);
router.delete('/:messageId/delete-for-me', authenticate, deleteMessageForMe);
router.delete('/:messageId/delete-for-everyone', authenticate, deleteMessageForEveryone);

export default router;
