import { ApiJob } from './job.type';

export type BaseBill = {
  notes?: string[] | [];
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
  notes: string[] | [];
  payed: string | null;
  dueDate: string | null;
  value: number;
  job: ApiJob;
  name: string;
  type: string;
  subType: string;
  createdAt: string;
}
