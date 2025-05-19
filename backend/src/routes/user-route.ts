import express from 'express';
import { check } from 'express-validator';

import myUserController from '../controllers/user-controller';
import verifyToken from '../middleware/auth';
import { upload } from '../middleware/image-upload-middleware';

const router = express.Router();

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

router.delete(
  '/profile/image',
  verifyToken,
  myUserController.deleteProfileImage
);

export default router;
