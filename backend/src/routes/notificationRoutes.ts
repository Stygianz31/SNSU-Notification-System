import { Router } from 'express';
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} from '../controllers/notificationController';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', authenticate, getNotifications);
router.get('/:id', authenticate, getNotificationById);
router.post('/', authenticate, authorize('admin'), upload.single('image'), createNotification);
router.put('/:id', authenticate, authorize('admin'), upload.single('image'), updateNotification);
router.delete('/:id', authenticate, authorize('admin'), deleteNotification);

export default router;
