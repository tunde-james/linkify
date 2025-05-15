import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import Link from '../models/link-model';

const getUserLinks = async (req: Request, res: Response) => {
  try {
    const links = await Link.find({ userId: req.userId }).sort({ order: 1 });

    res.status(200).json(links);
  } catch (error) {}
};

const createLink = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const highestOrderLink = await Link.findOne({ userId: req.userId })
      .sort({ order: -1 })
      .limit(1);

    const newOrder = highestOrderLink ? highestOrderLink.order + 1 : 0;

    const newLink = new Link({
      userId: req.userId,
      platform: req.body.platform,
      url: req.body.url,
      order: newOrder,
    });

    await newLink.save();
    res.status(201).json(newLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateLink = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const linkId = req.params.linkId;

    const link = await Link.findOne({ _id: linkId, userId: req.userId });
    if (!link) {
      return res.status(404).json({ message: 'Link not found!' });
    }

    link.platform = req.body.platform;
    link.url = req.body.url;

    await link.save();
    res.status(200).json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteLink = async (req: Request, res: Response) => {
  try {
    const linkId = req.params.linkId;

    const link = await Link.findOne({ _id: linkId, userId: req.userId });
    if (!link) {
      return res.status(404).json({ message: 'Link not found!' });
    }

    const deletedOrder = link.order;

    await link.deleteOne({ _id: linkId });

    await Link.updateMany(
      { userId: req.userId, order: { $gt: deletedOrder } },
      { $in: { order: -1 } }
    );

    res.status(200).json({ message: 'Link deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default {
  getUserLinks,
  createLink,
  updateLink,
  deleteLink,
};
