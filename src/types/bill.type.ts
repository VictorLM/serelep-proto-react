import { ApiJob, Job } from './job.type';

export type BaseBill = {
  notes?: string | null;
  payed: Date | null;
  dueDate: Date | null;
  value: number;
  job?: string;
  name: string;
  type: string;
  subType: string;
}

export type Bill = BaseBill & {
  id: string;
  createdAt: Date;
}

export type ApiBill = {
  _id: string;
  notes: string | null;
  payed: string | null;
  dueDate: string | null;
  value: number;
  job: ApiJob | null;
  name: string;
  type: string;
  subType: string;
  createdAt: string;
}

export type FullBill = {
  id: string;
  notes?: string | null;
  payed: Date | null;
  dueDate: Date | null;
  value: number;
  job?: Job | null;
  name: string;
  type: string;
  subType: string;
  createdAt: Date;
}

export type NewBill = {
  notes?: string | null;
  dueDate?: string;
  value: number;
  job?: string;
  name: string;
  type: string;
  subType: string;
}

export type UpdateBill = NewBill & {
  payed?: string;
}
