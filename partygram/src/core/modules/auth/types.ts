export type UserMetaData = {
  first_name: string;
  last_name: string;
  username: string;
  agreeToTerms: boolean;
  avatar?: string | null;
};

export type User = {
  id: string;
  email: string;
} & UserMetaData;

export type CreateUserBody = {
  email: string;
  password: string;
} & UserMetaData;

export type UpdateUserBody = Partial<
  {
    email: string;
    password?: string;
    id: string;
  } & UserMetaData
>;
