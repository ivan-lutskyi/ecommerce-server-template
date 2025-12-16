import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';
import { ICertificateRepository } from '../repositories/interfaces/certificate.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';
import { Certificate } from './schemas/certificate.schema';
import { CreateCertificateDto } from './dto/create-certificate.dto';

describe('CertificatesService', () => {
  let service: CertificatesService;
  let repository: jest.Mocked<ICertificateRepository>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesService,
        {
          provide: REPOSITORY_TOKENS.CERTIFICATE,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CertificatesService>(CertificatesService);
    repository = module.get(REPOSITORY_TOKENS.CERTIFICATE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all certificates', async () => {
      const certificates = [mockCertificate];
      repository.findAll.mockResolvedValue(certificates);

      const result = await service.findAll();

      expect(result).toEqual(certificates);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return certificate by code', async () => {
      repository.findByCode.mockResolvedValue(mockCertificate);

      const result = await service.findOne('CERT-001');

      expect(result).toEqual(mockCertificate);
      expect(repository.findByCode).toHaveBeenCalledWith('CERT-001');
    });

    it('should return null if certificate not found', async () => {
      repository.findByCode.mockResolvedValue(null);

      const result = await service.findOne('INVALID');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const createCertificateDto: CreateCertificateDto = {
      code: 'CERT-002',
      createdAt: new Date().toISOString(),
      owner: 'Jane Smith',
      amount: 1000,
    };

    it('should create a certificate', async () => {
      const createdCertificate = { ...createCertificateDto } as Certificate;
      repository.create.mockResolvedValue(createdCertificate);

      const result = await service.create(createCertificateDto);

      expect(result).toEqual(createdCertificate);
      expect(repository.create).toHaveBeenCalledWith(createCertificateDto);
    });
  });

  describe('remove', () => {
    it('should delete a certificate', async () => {
      repository.delete.mockResolvedValue(true);

      const result = await service.remove('CERT-001');

      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith('CERT-001');
    });

    it('should return false if certificate not found', async () => {
      repository.delete.mockResolvedValue(false);

      const result = await service.remove('INVALID');

      expect(result).toBe(false);
    });
  });
});
