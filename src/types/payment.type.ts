import { ApiJob } from './job.type';

export type BasePayment = {
  notes?: string[] | [];
  payed: Date | null;
  dueDate: Date;
  value: number;
  job?: ApiJob;
}

export type Payment = BasePayment & {
  id: string;
  createdAt: Date;
}

export type ApiPayment = {
  _id: string;
  notes: string[] | [];
  payed: string | null;
  dueDate: string;
  value: number;
  job: ApiJob;
  createdAt: string;
}

export type ApiPaymentRelatedToJob = {
  _id: string;
  notes: string[] | [];
  payed: string | null;
  dueDate: string;
  value: number;
  createdAt: string;
}

export type NewPayment = {
  dueDate: string;
  value: number;
}
