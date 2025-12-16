import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { Certificate } from './schemas/certificate.schema';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { NotFoundException, HttpException } from '@nestjs/common';
import { ICertificateRepository } from '../repositories/interfaces/certificate.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';

describe('CertificatesController', () => {
  let controller: CertificatesController;
  let service: jest.Mocked<CertificatesService>;

  const mockCertificate: Certificate = {
    code: 'CERT-001',
    createdAt: new Date().toISOString(),
    owner: 'John Doe',
    amount: 500,
  } as Certificate;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findByCode: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    const mockService = {
      findOne: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificatesController],
      providers: [
        {
          provide: CertificatesService,
          useValue: mockService,
        },
        {
          provide: REPOSITORY_TOKENS.CERTIFICATE,
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<CertificatesController>(CertificatesController);
    service = module.get(CertificatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return certificate by code', async () => {
      service.findOne.mockResolvedValue(mockCertificate);

      const result = await controller.findOne('CERT-001');

      expect(result).toEqual(mockCertificate);
      expect(service.findOne).toHaveBeenCalledWith('CERT-001');
    });

    it('should throw NotFoundException if certificate not found', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(controller.findOne('INVALID')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createCertificate', () => {
    const createCertificateDto: CreateCertificateDto = {
      code: 'CERT-002',
      createdAt: new Date().toISOString(),
      owner: 'Jane Smith',
      amount: 1000,
    };

    it('should create a certificate', async () => {
      const createdCertificate = { ...createCertificateDto } as Certificate;
      service.remove.mockResolvedValue(true);
      service.create.mockResolvedValue(createdCertificate);

      const result = await controller.createCertificate(createCertificateDto);

      expect(result).toEqual(createdCertificate);
      expect(service.create).toHaveBeenCalledWith(createCertificateDto);
    });

    it('should throw HttpException on error', async () => {
      service.remove.mockResolvedValue(true);
      service.create.mockRejectedValue(
        new Error(JSON.stringify({ message: 'Duplicate code', status: 400 })),
      );

      await expect(controller.createCertificate(createCertificateDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
