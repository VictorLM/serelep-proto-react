import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { CreateCustomer } from '../types/customer.type';

export async function updateCustomer(
  id: string,
  updatedCustomer: CreateCustomer,
): Promise<boolean> {
  try {
    await api.patch(`/customers/${id}`, updatedCustomer, {
      withCredentials: true,
    });
    return true;
  } catch (err: unknown) {
    catchBlock(err);
    return false;
  }
}
