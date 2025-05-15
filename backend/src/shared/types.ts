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

export interface ILink extends Document {
  _id: string;
  userId: string;
  platform: string;
  url: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILinkInput {
  platform: string;
  url: string;
}

export interface ILinkUpdateInput extends ILinkInput {
  _id: string;
}

export interface ILinkOrderInput {
  linkIds: string[];
}
