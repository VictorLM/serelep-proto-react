export type CreateCustomer = {
  name: string;
  email: string;
  contact: string;
  doc: string;
  notes?: string;
}

export type Customer = CreateCustomer & {
  id: string;
  createdAt: Date;
}
