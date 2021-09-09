import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';

export async function deleteCustomer(
  id: string,
): Promise<void> {
  try {
    await api.delete(`/customers/${id}`, {
      withCredentials: true,
    });
  } catch (err: unknown) {
    catchBlock(err);
  }
}
