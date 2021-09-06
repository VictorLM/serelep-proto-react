export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export type UserProps = {
  user: User | undefined;
}
