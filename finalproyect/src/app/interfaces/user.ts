export interface UsersInterface {
    _id: string;
    user: string;
    name: string;
    email: string;
    bio: string;
    picture: string;
    roles: string[];
    favorites: string [];
    createdAt: string;
    updatedAt: string;
    __v: number;
    deleted: boolean;
    blocked: boolean;
    valuations: number[];
  }