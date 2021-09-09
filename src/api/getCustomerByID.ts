import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { Customer } from '../types/customer.type';

export async function getCustomerByID(id: string): Promise<Customer | undefined> {
  try {
    const { data } = await api.get(`/customers/${id}`, {
      withCredentials: true,
    });

    const customer: Customer = {
      id: get(data, '_id', ''),
      name: get(data, 'name', ''),
      email: get(data, 'email', ''),
      contact: get(data, 'contact', ''),
      doc: get(data, 'doc', ''),
      notes: get(data, 'notes', null),
      createdAt: new Date(get(data, 'createdAt', Date.now())),
    };

    return customer;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}
