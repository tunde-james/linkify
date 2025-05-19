export interface IUser {
  _id: string;
  email: string;
  profile?: {
    firstName: string | null;
    lastName: string | null;
    imageUrl?: string | null;
  };
}
