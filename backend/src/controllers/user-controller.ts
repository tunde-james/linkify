import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';

import User from '../models/user-model';

const getCurrentUser = async (req: Request, res: Response) => {
  const currentUser = req.userId;

  try {
    const user = await User.findById(currentUser).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.status(400).json({ message: 'User already exist.' });
    }

    user = new User({
      email: req.body.email,
      password: req.body.password,
      profile: {
        firstName: null,
        lastName: null,
        imageUrl: null,
      },
    });

    await user.save();

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000, // 1-day
    });

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.profile.firstName = req.body.firstName;
    user.profile.lastName = req.body.lastName;

    // if (req.file) {
    //   const imageUrl = await uploadImage(req.file as Express.Multer.File);
    //   user.profile.imageUrl = imageUrl;
    // }

    await user.save();

    const updatedUser = await User.findById(req.userId).select('-password');
    res
      .status(200)
      .json({ user: updateUser, message: 'Profile updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default {
  getCurrentUser,
  createUser,
  updateUser,
};

// const uploadImage = async (file: Express.Multer.File) => {
//   const image = file;
//   const base64Image = Buffer.from(image.buffer).toString('base64');
//   const dataURI = `data:${image.mimetype};base64,${base64Image}`;

//   const uploadResponse = await cloudinary.v2.uploader.upload(dataURI, {
//     folder: 'devlinks',
//   });
//   return uploadResponse.url;
// };
