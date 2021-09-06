import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { User } from '../types/user.type';

export async function getUser(): Promise<User | undefined> {
  try {
    const { data } = await api.get('/users/get-user', { withCredentials: true });

    const userData: User = {
      id: get(data, '_id', null),
      name: get(data, 'name', null),
      email: get(data, 'email', null),
      createdAt: new Date(get(data, 'createdAt', null)),
    };

    return userData;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}
