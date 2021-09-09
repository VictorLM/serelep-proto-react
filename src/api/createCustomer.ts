import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { CreateCustomer } from '../types/customer.type';

export async function createCustomer(
  customer: CreateCustomer,
): Promise<boolean> {
  try {
    await api.post('/customers', customer, {
      withCredentials: true,
    });
    return true;
  } catch (err: unknown) {
    catchBlock(err);
    return false;
  }
}
