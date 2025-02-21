import express from 'express';
import { check } from 'express-validator';

import myUserController from '../controllers/user-controller';

const router = express.Router();

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

export default router;
