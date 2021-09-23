import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { Job } from '../types/job.type';
import { ApiPayment, Payment, UpdatePayment } from '../types/payment.type';

type GetPaymentsProps = {
  search?: string;
  orderBy?: string;
  payed?: string | null;
  overdue?: string | null;
}

export async function getPayments(
  getPaymentsProps: GetPaymentsProps,
): Promise<Payment[] | undefined> {
  try {
    const { data } = await api.get('/payments', {
      withCredentials: true,
      params: {
        search: getPaymentsProps.search || null,
        orderBy: getPaymentsProps.orderBy || null,
        payed: getPaymentsProps.payed || null,
        overdue: getPaymentsProps.overdue || null,
      },
    });

    const payments: Payment[] = [];

    data?.forEach((payment: ApiPayment) => {
      payments.push({
        id: get(payment, '_id', ''),
        notes: get(payment, 'notes', null),
        payed: payment.payed ? new Date(payment.payed) : null,
        dueDate: new Date(get(payment, 'dueDate', Date.now())),
        value: get(payment, 'value', 0),
        job: get(payment, 'job.name', ''),
        createdAt: new Date(get(payment, 'createdAt', Date.now())),
      });
    });

    return payments;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}

export async function getPaymentByID(id: string): Promise<Payment | undefined> {
  try {
    const { data } = await api.get(`/payments/${id}`, {
      withCredentials: true,
    });

    const job: Job = {
      id: get(data, 'job._id', ''),
      name: get(data, 'job.name', ''),
      types: get(data, 'job.types', []),
      status: get(data, 'job.status', ''),
      customer: get(data, 'job.customer', ''),
      description: get(data, 'job.description', ''),
      notes: [],
      price: 0,
      createdAt: new Date(get(data, 'job.createdAt', Date.now())),
    };

    const payment: Payment = {
      id: get(data, '_id', ''),
      notes: get(data, 'notes', null),
      payed: data.payed ? new Date(data.payed) : null,
      dueDate: new Date(get(data, 'dueDate', Date.now())),
      value: get(data, 'value', 0),
      job,
      createdAt: new Date(get(data, 'createdAt', Date.now())),
    };

    return payment;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}

export async function updatePayment(
  id: string,
  updatedPayment: UpdatePayment,
): Promise<boolean> {
  try {
    await api.patch(`/payments/${id}`, updatedPayment, {
      withCredentials: true,
    });
    return true;
  } catch (err: unknown) {
    catchBlock(err);
    return false;
  }
}

export async function deletePayment(
  id: string,
): Promise<void> {
  try {
    await api.delete(`/payments/${id}`, {
      withCredentials: true,
    });
  } catch (err: unknown) {
    catchBlock(err);
  }
}
