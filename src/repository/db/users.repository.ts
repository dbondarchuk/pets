import { User, UserListModel, UserUpdateModel } from '@/types/user';
import { ID } from '@/types/with-id';
import { IUsersRepository } from '../types';
import { getUsersDb } from './db';

export class UsersRepository implements IUsersRepository {
  public async getUsers(): Promise<UserListModel[]> {
    const db = await getUsersDb();
    const userRecords = await db.findAll();
    return userRecords
      .map((userRecord) => userRecord.toJSON() as UserListModel)
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email
      }));
  }

  public async getUser(email: string): Promise<User | null> {
    const db = await getUsersDb();
    const userRecord = await db.findOne({ where: { email } });
    if (!userRecord) {
      return null;
    }
    return userRecord.toJSON() as User;
  }

  public async createUser(createModel: UserUpdateModel): Promise<User> {
    const db = await getUsersDb();
    const userRecord = await db.create(createModel);
    return userRecord.toJSON() as User;
  }

  public async getUsersIds(): Promise<ID[]> {
    const db = await getUsersDb();
    const userRecords = await db.findAll();
    return userRecords.map((userRecord) => userRecord.id);
  }
}
