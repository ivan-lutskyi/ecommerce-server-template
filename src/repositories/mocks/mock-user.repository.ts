import { Injectable } from '@nestjs/common';
import { IUserRepository, User } from '../interfaces/user.repository.interface';
import * as bcrypt from 'bcrypt';

/**
 * Mock repository for Users with in-memory data storage.
 */
@Injectable()
export class MockUserRepository implements IUserRepository {
  private users: User[] = [
    {
      fullName: 'Admin User',
      email: 'admin@example.com',
      phoneNumber: '+1234567890',
      password: bcrypt.hashSync('password123', 10), // Pre-hashed for demo
    },
  ];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async create(user: User): Promise<User> {
    // Hash password if not already hashed
    const hashedPassword = user.password.startsWith('$2')
      ? user.password
      : await bcrypt.hash(user.password, 10);

    const newUser = {
      ...user,
      password: hashedPassword,
    };
    this.users.push(newUser);
    return newUser;
  }
}

