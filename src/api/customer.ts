import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { Customer, BaseCustomer, CustomerApi } from '../types/customer.type';

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

export async function createCustomer(
  customer: BaseCustomer,
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

export async function updateCustomer(
  id: string,
  updatedCustomer: BaseCustomer,
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
