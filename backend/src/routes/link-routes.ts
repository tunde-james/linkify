import express from 'express';
import { check } from 'express-validator';
import verifyToken from '../middleware/auth';

import linkContollers from '../controllers/link-contollers';

const router = express.Router();

router.use(verifyToken);

router.get('/', linkContollers.getUserLinks);

router.post(
  '/',
  [
    check('platform').notEmpty().withMessage('Platform is required'),
    check('url')
      .notEmpty()
      .withMessage('URL is required')
      .isURL()
      .withMessage('Invalid URL format'),
  ],
  linkContollers.createLink
);

router.put(
  '/:linkId',
  [
    check('platform').notEmpty().withMessage('Platform is required'),
    check('url')
      .notEmpty()
      .withMessage('URL is required')
      .isURL()
      .withMessage('Invalid URL format'),
  ],
  linkContollers.updateLink
);

router.delete('/:linkId', linkContollers.deleteLink);

export default router;
