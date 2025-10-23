import { ID } from './with-id';

export type User = {
  id: ID;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export type UserUpdateModel = Omit<User, 'id'>;

export type UserListModel = {
  id: ID;
  name: string;
  email: string;
};
