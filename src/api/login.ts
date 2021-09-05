import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';

export async function login(
  email: string,
  password: string,
): Promise<boolean> {
  const body = {
    email,
    password,
  };

  try {
    await api.post('/auth/login', body, { withCredentials: true });
    return true;
  } catch (err: unknown) {
    catchBlock(err);
    return false;
  }
}
