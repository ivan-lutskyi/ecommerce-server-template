import { Test, TestingModule } from '@nestjs/testing';
import { SupportController } from './support.controller';
import { SupportRequestDto } from './dto/supportReq.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

// Mock the sendSupportEmail function
jest.mock('../utils/sendEmail', () => ({
  sendSupportEmail: jest.fn(),
}));

import { sendSupportEmail } from '../utils/sendEmail';

describe('SupportController', () => {
  let controller: SupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportController],
    }).compile();

    controller = module.get<SupportController>(SupportController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendSupportRequest', () => {
    const validRequest: SupportRequestDto = {
      email: 'test@example.com',
      fullname: 'John Doe',
      message: 'This is a test support request',
    };

    it('should send support email with valid data', () => {
      controller.sendSupportRequest(validRequest);

      expect(sendSupportEmail).toHaveBeenCalledWith(
        validRequest.email,
        validRequest.fullname,
        validRequest.message,
      );
    });

    it('should throw HttpException if email is missing', () => {
      const invalidRequest = { ...validRequest, email: '' };

      expect(() => controller.sendSupportRequest(invalidRequest)).toThrow(
        HttpException,
      );
    });

    it('should throw HttpException if fullname is missing', () => {
      const invalidRequest = { ...validRequest, fullname: '' };

      expect(() => controller.sendSupportRequest(invalidRequest)).toThrow(
        HttpException,
      );
    });

    it('should throw HttpException if message is missing', () => {
      const invalidRequest = { ...validRequest, message: '' };

      expect(() => controller.sendSupportRequest(invalidRequest)).toThrow(
        HttpException,
      );
    });
  });
});
