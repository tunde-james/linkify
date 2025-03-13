import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserProfile } from '../shared/types';

const userProfileSchema = new mongoose.Schema<IUserProfile>({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  imageUrl: { type: String, default: null },
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
      }),
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (this: IUser, next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
