import { Router } from 'express';
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} from '../controllers/classController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getClasses);
router.get('/:id', authenticate, getClassById);
router.post('/', authenticate, createClass);
router.put('/:id', authenticate, updateClass);
router.delete('/:id', authenticate, deleteClass);

export default router;
