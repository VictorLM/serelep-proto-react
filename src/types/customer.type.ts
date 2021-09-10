export type CustomerApi = {
  id: string;
  name: string;
  email: string;
  contact: string;
  doc: string;
  notes?: string;
  createdAt: string;
}

export type BaseCustomer = {
  name: string;
  email: string;
  contact: string;
  doc: string;
  notes?: string;
}

export type Customer = BaseCustomer & {
  id: string;
  createdAt: Date;
}
