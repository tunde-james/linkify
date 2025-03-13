import express from 'express';
import { check } from 'express-validator';
import multer from 'multer';

import myUserController from '../controllers/user-controller';
import verifyToken from '../middleware/auth';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

router.get('/me', verifyToken, myUserController.getCurrentUser);

router.post(
  '/register',
  [
    check('email', 'Email is required').isEmail(),
    check(
      'password',
      'Password with 8 or more characters is required'
    ).isLength({ min: 8 }),
  ],
  myUserController.createUser
);

router.put(
  '/profile',
  verifyToken,
  upload.single('imageFile'),
  [
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last  name is required'),
  ],
  myUserController.updateUser
);

export default router;
