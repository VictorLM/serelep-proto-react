import { get, sumBy } from 'lodash';
import { api } from '../config/axios';
import { catchBlock } from '../error-handler/catchBlock';
import { ApiBill, Bill } from '../types/bill.type';
import { Customer } from '../types/customer.type';
import { ApiJob, FullJob, Job } from '../types/job.type';
import { ApiPayment, Payment } from '../types/payment.type';

type GetJobsProps = {
  search?: string;
  orderBy?: string;
  status?: string;
}

export async function getJobs(
  getJobsProps: GetJobsProps,
): Promise<Job[] | undefined> {
  try {
    const { data } = await api.get('/jobs', {
      withCredentials: true,
      params: {
        search: getJobsProps.search || null,
        orderBy: getJobsProps.orderBy || null,
        status: getJobsProps.status !== 'ALL' ? getJobsProps.status : null,
      },
    });

    const jobs: Job[] = [];

    data?.forEach((job: ApiJob) => {
      jobs.push({
        id: get(job, '_id', ''),
        name: get(job, 'name', ''),
        types: get(job, 'types', []),
        status: get(job, 'status', ''),
        customer: get(job, 'customer.name', ''),
        price: sumBy(job.payments, 'value'),
        description: get(job, 'description', ''),
        notes: get(job, 'notes', []),
        createdAt: new Date(get(job, 'createdAt', Date.now())),
      });
    });

    return jobs;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}

export async function getJobByID(id: string): Promise<FullJob | undefined> {
  try {
    const { data } = await api.get(`/jobs/${id}`, {
      withCredentials: true,
    });

    const customer: Customer = {
      id: get(data, 'job.customer._id', ''),
      name: get(data, 'job.customer.name', ''),
      email: get(data, 'job.customer.email', ''),
      contact: get(data, 'job.customer.contact', ''),
      doc: get(data, 'job.customer.doc', ''),
      notes: get(data, 'job.customer.notes', null),
      createdAt: new Date(get(data, 'job.customer.createdAt', Date.now())),
    };

    const payments: Payment[] = [];

    data?.job.payments.forEach((payment: ApiPayment) => {
      payments.push({
        id: get(payment, '_id', ''),
        notes: get(payment, 'notes', []),
        payed: payment.payed ? new Date(payment.payed) : null,
        dueDate: new Date(get(payment, 'dueDate', Date.now())),
        value: get(payment, 'value', 0),
        createdAt: new Date(get(payment, 'createdAt', Date.now())),
      });
    });

    const bills: Bill[] = [];

    data?.bills.forEach((bill: ApiBill) => {
      bills.push({
        id: get(bill, '_id', ''),
        notes: get(bill, 'notes', []),
        payed: bill.payed ? new Date(bill.payed) : null,
        dueDate: bill.dueDate ? new Date(bill.dueDate) : null,
        value: get(bill, 'value', 0),
        name: get(bill, 'name', ''),
        type: get(bill, 'type', ''),
        subtype: get(bill, 'subtype', ''),
        createdAt: new Date(get(bill, 'createdAt', Date.now())),
      });
    });

    const job: FullJob = {
      id: get(data, 'job._id', ''),
      name: get(data, 'job.name', ''),
      types: get(data, 'job.types', []),
      status: get(data, 'job.status', ''),
      customer,
      payments,
      bills,
      description: get(data, 'job.description', ''),
      notes: get(data, 'job.notes', []),
      createdAt: new Date(get(data, 'job.createdAt', Date.now())),
    };

    return job;
  } catch (err: unknown) {
    catchBlock(err);
    return undefined;
  }
}

// export async function createCustomer(
//   customer: BaseCustomer,
// ): Promise<boolean> {
//   try {
//     await api.post('/customers', customer, {
//       withCredentials: true,
//     });
//     return true;
//   } catch (err: unknown) {
//     catchBlock(err);
//     return false;
//   }
// }

// export async function updateCustomer(
//   id: string,
//   updatedCustomer: BaseCustomer,
// ): Promise<boolean> {
//   try {
//     await api.patch(`/customers/${id}`, updatedCustomer, {
//       withCredentials: true,
//     });
//     return true;
//   } catch (err: unknown) {
//     catchBlock(err);
//     return false;
//   }
// }

export async function deleteJob(
  id: string,
): Promise<void> {
  try {
    await api.delete(`/jobs/${id}`, {
      withCredentials: true,
    });
  } catch (err: unknown) {
    catchBlock(err);
  }
}
