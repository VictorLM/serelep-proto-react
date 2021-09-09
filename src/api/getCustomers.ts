import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { Customer } from '../types/customer.type';

type CustomerApi = {
  id: string;
  name: string;
  email: string;
  contact: string;
  doc: string;
  notes?: string;
  createdAt: string;
}

type GetCustomersProps = {
  search?: string;
  orderBy?: string;
}

export async function getCustomers(
  getCustomersProps: GetCustomersProps,
): Promise<Customer[] | undefined> {
  try {
    const { data } = await api.get('/customers', {
      withCredentials: true,
      params: {
        search: getCustomersProps.search || null,
        orderBy: getCustomersProps.orderBy || null,
      },
    });

    const customers: Customer[] = [];

    data?.forEach((customer: CustomerApi) => {
      customers.push({
        id: get(customer, '_id', ''),
        name: get(customer, 'name', ''),
        email: get(customer, 'email', ''),
        contact: get(customer, 'contact', ''),
        doc: get(customer, 'doc', ''),
        createdAt: new Date(get(customer, 'createdAt', Date.now())),
      });
    });

    return customers;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}
