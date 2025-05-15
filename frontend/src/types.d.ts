export interface IUser {
  email: string;
  profile?: {
    firstName: string | null;
    lastName: string| null;
    imageUrl?: string | null
  }
}