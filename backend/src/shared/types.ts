import { Document } from 'mongoose';

export interface IUserProfile {
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  profile: IUserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreateInput {
  email: string;
  password: string;
  profile?: Partial<IUserProfile>;
}

export interface IUserProfileInput {
  firstName: string;
  lastName: string;
  imageFile?: Express.Multer.File;
}
