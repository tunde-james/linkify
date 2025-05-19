import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import User from '../models/user-model';
import { uploadToCloudinary } from '../helpers/cloudinary-helper';
import { fstat } from 'fs';

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
        imagePublicId: null,
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

// const updateUser2 = async (req: Request, res: Response) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ message: errors.array() });
//   }

//   try {
//     const id = req.params.id;

//     if (id !== req.userId) {
//       return res
//         .status(403)
//         .json({ message: 'Not authorized to update this data' });
//     }

//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     user.profile.firstName = req.body.firstName;
//     user.profile.lastName = req.body.lastName;

//     // if (req.file) {
//     //   const imageUrl = await uploadImage(req.file as Express.Multer.File);
//     //   user.profile.imageUrl = imageUrl;
//     // }

//     await user.save();

//     const updatedUser = await User.findById(req.userId).select('-password');
//     res
//       .status(200)
//       .json({ user: updatedUser, message: 'Profile updated successfully' });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };

const updateUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const existingUser = await User.findById(req.userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    existingUser.profile.firstName = firstName;
    existingUser.profile.lastName = lastName;

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.path);

        if (existingUser.profile.imagePublicId) {
          await cloudinary.uploader.destroy(existingUser.profile.imagePublicId);
        }

        existingUser.profile.imageUrl = uploadResult.url;
        existingUser.profile.imagePublicId = uploadResult.publicId;

        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    await existingUser.save();

    const updatedUser = await User.findById(req.userId).select('-password');
    res.status(200).send(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};

const deleteProfileImage = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profile.imagePublicId) {
      return res.status(400).json({ message: 'Np profile image to delete.' });
    }

    await cloudinary.uploader.destroy(user.profile.imagePublicId);

    user.profile.imageUrl = null;
    user.profile.imagePublicId = null;
    await user.save();

    res.status(200).json({ message: 'Profile image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting profile image', error);
    res.status(500).json({ message: 'Failed to delete profile image.' });
  }
};

export default {
  getCurrentUser,
  createUser,
  updateUser,
  deleteProfileImage,
};
