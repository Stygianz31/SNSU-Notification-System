import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
  uploadProfilePicture
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUserById);
router.post('/', authenticate, authorize('admin'), createUser);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

router.put('/profile/update', authenticate, upload.single('profilePicture'), updateProfile);
router.post('/profile/password', authenticate, changePassword);
router.post('/profile/picture', authenticate, upload.single('profilePicture'), uploadProfilePicture);

export default router;
