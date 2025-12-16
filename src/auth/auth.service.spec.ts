import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IUserRepository } from '../repositories/interfaces/user.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let repository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: REPOSITORY_TOKENS.USER,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get(REPOSITORY_TOKENS.USER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const userDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const createdUser = { ...userDto, password: hashedPassword };

      repository.create.mockResolvedValue(createdUser);

      const result = await service.register(userDto);

      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        fullName: 'Test User',
        email,
        phoneNumber: '+1234567890',
        password: hashedPassword,
      };

      repository.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser(email, password);

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result?.email).toBe(email);
    });

    it('should return null if user not found', async () => {
      repository.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const email = 'test@example.com';
      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      const user = {
        fullName: 'Test User',
        email,
        phoneNumber: '+1234567890',
        password: hashedPassword,
      };

      repository.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser(email, 'wrongpassword');

      expect(result).toBeNull();
    });
  });
});
