import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';

export async function logout(): Promise<boolean> {
  try {
    // TODO - Não funciona. Não faço idéia
    await api.post('/auth/logout', { withCredentials: true });
    return true;
  } catch (err: unknown) {
    catchBlock(err);
    return false;
  }
}
