import { get } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import {
  ApiBill, Bill, FullBill, NewBill, UpdateBill,
} from '../types/bill.type';
import { Job } from '../types/job.type';

type GetBillsProps = {
  search?: string;
  orderBy?: string;
  type?: string;
  subType?: string;
  payed?: string | null;
  overdue?: string | null;
}

export async function getBills(
  getBillsProps: GetBillsProps,
): Promise<Bill[] | undefined> {
  try {
    const { data } = await api.get('/bills', {
      withCredentials: true,
      params: {
        search: getBillsProps.search || null,
        orderBy: getBillsProps.orderBy || null,
        type: getBillsProps.type || null,
        subType: getBillsProps.subType || null,
        payed: getBillsProps.payed || null,
        overdue: getBillsProps.overdue || null,
      },
    });

    const bills: Bill[] = [];

    data?.forEach((bill: ApiBill) => {
      bills.push({
        id: get(bill, '_id', ''),
        name: get(bill, 'name', ''),
        type: get(bill, 'type', ''),
        subType: get(bill, 'subType', ''),
        notes: get(bill, 'notes', null),
        payed: bill.payed ? new Date(bill.payed) : null,
        dueDate: bill.dueDate ? new Date(bill.dueDate) : null,
        value: get(bill, 'value', 0),
        job: get(bill, 'job.name', ''),
        createdAt: new Date(get(bill, 'createdAt', Date.now())),
      });
    });

    return bills;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}

export async function getBillByID(id: string): Promise<FullBill | undefined> {
  try {
    const { data } = await api.get(`/bills/${id}`, {
      withCredentials: true,
    });

    const bill: FullBill = {
      id: get(data, '_id', ''),
      name: get(data, 'name', ''),
      type: get(data, 'type', ''),
      subType: get(data, 'subType', ''),
      notes: get(data, 'notes', null),
      payed: data.payed ? new Date(data.payed) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      value: get(data, 'value', 0),
      createdAt: new Date(get(data, 'createdAt', Date.now())),
    };

    if (data.job) {
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
      bill.job = job;
    }

    return bill;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}

export async function createBill(
  bill: NewBill,
): Promise<boolean> {
  try {
    await api.post('/bills', bill, {
      withCredentials: true,
    });
    return true;
  } catch (err: unknown) {
    catchBlock(err);
    return false;
  }
}

export async function updateBill(
  id: string,
  updatedBill: UpdateBill,
): Promise<boolean> {
  try {
    await api.patch(`/bills/${id}`, updatedBill, {
      withCredentials: true,
    });
    return true;
  } catch (err: unknown) {
    catchBlock(err);
    return false;
  }
}

export async function deleteBill(
  id: string,
): Promise<void> {
  try {
    await api.delete(`/bills/${id}`, {
      withCredentials: true,
    });
  } catch (err: unknown) {
    catchBlock(err);
  }
}
