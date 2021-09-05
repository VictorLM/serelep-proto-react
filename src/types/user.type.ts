export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type UserProps = {
  user: User | undefined;
}
