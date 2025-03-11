import express from 'express';
import { check } from 'express-validator';

import myUserController from '../controllers/user-controller';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.get('/me', verifyToken, myUserController.getUser);

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

router.put('/update-user', verifyToken, myUserController.updateUser)

export default router;
