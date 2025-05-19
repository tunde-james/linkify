import mongoose from 'mongoose';
import * as argon2 from 'argon2';

import { IUser, IUserProfile } from '../shared/types';

const userProfileSchema = new mongoose.Schema<IUserProfile>({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  imageUrl: { type: String, default: null },
  imagePublicId: { type: String, default: null },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      type: userProfileSchema,
      default: () => ({
        firstName: null,
        lastName: null,
        imageUrl: null,
        imagePublicId: null,
      }),
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (this: IUser, next) {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password);
  }
  next();
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
