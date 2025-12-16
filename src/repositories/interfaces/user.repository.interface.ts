export interface User {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
}

