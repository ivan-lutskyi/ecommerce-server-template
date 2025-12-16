import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository, User } from '../repositories/interfaces/user.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER)
    private userRepository: IUserRepository,
  ) {}

  async register(userDto: User): Promise<User> {
    return this.userRepository.create(userDto);
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}
