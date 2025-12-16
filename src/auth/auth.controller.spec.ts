import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IUserRepository } from '../repositories/interfaces/user.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockService = {
      register: jest.fn(),
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
        {
          provide: REPOSITORY_TOKENS.USER,
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const createdUser = { ...userDto, password: hashedPassword };

      service.register.mockResolvedValue(createdUser);

      const result = await controller.register(userDto);

      expect(result).toEqual(createdUser);
      expect(service.register).toHaveBeenCalledWith(userDto);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        fullName: 'Test User',
        email: loginDto.email,
        phoneNumber: '+1234567890',
      };

      service.validateUser.mockResolvedValue(user);

      const result = await controller.login(loginDto);

      expect(result).toEqual(user);
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });
  });
});
