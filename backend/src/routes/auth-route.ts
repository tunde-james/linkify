import express from 'express';
import { check } from 'express-validator';

import authController from '../controllers/auth-controller';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password with 8 0r more characters required').isLength({
      min: 8,
    }),
  ],
  authController.loginUser
);

router.get('/validate-token', verifyToken, authController.validateToken);

router.post('/logout', authController.logoutUser);

export default router;
