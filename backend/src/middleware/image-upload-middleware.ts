import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, 'linkify/');
  },
  filename: function (req: Request, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const checkFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extName && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});
