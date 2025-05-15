import mongoose from 'mongoose';

import { ILink } from '../shared/types';

const linkSchema = new mongoose.Schema<ILink>(
  {
    userId: { type: String, required: true },
    platform: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

linkSchema.index({ userId: 1, order: 1 });

const Link = mongoose.model<ILink>('Link', linkSchema);
export default Link;
