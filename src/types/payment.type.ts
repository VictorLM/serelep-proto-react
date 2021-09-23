import { ApiJob, Job } from './job.type';

export type BasePayment = {
  notes?: string | null;
  payed: Date | null;
  dueDate: Date;
  value: number;
  job?: Job;
}

export type Payment = BasePayment & {
  id: string;
  createdAt: Date;
}

export type ApiPayment = {
  _id: string;
  notes: string | null;
  payed: string | null;
  dueDate: string;
  value: number;
  job: ApiJob;
  createdAt: string;
}

export type ApiPaymentRelatedToJob = {
  _id: string;
  notes: string | null;
  payed: string | null;
  dueDate: string;
  value: number;
  createdAt: string;
}

export type NewPayment = {
  dueDate: string;
  value: number;
}

export type UpdatePayment = {
  notes?: string | null;
  payed?: string;
  dueDate: string;
  value: number;
}
