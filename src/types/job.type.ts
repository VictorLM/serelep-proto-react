import { Bill } from './bill.type';
import { Customer, CustomerApi } from './customer.type';
import { ApiPaymentRelatedToJob, Payment } from './payment.type';

export type BaseJob = {
  name: string;
  types: string[] | never[];
  status: string;
  customer: string;
  price: number;
  description: string | null;
  notes: string[] | never[];
}

export type Job = BaseJob & {
  id: string;
  createdAt: Date;
}

export type FullJob = {
  id: string;
  name: string;
  types: string[] | never[];
  status: string;
  customer: Customer;
  payments: Payment[];
  bills: Bill[],
  description: string | null;
  notes: string[] | never[];
  createdAt: Date;
}

export type ApiJob = {
  _id: string;
  name: string;
  types: string[] | never[];
  status: string;
  customer: CustomerApi;
  payments: ApiPaymentRelatedToJob[];
  description: string | null;
  notes: string[] | never[];
  createdAt: string;
}

export enum JobTypes {
  VISUAL_IDENTITY = 'VISUAL_IDENTITY',
  BRAND_DESIGN = 'BRAND_DESIGN',
  PACKAGING_DESIGN = 'PACKAGING_DESIGN',
  NAMING = 'NAMING',
  OTHERS = 'OTHERS',
}

export enum JobStatus {
  OPEN = 'OPEN',
  DONE = 'DONE',
}
