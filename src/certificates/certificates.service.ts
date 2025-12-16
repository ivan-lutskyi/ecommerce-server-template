import { Injectable, Inject } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Certificate } from './schemas/certificate.schema';
import { ICertificateRepository } from '../repositories/interfaces/certificate.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';

@Injectable()
export class CertificatesService {
  constructor(
    @Inject(REPOSITORY_TOKENS.CERTIFICATE)
    private certificateRepository: ICertificateRepository,
  ) {}

  async create(createCertificateDto: CreateCertificateDto): Promise<Certificate> {
    return this.certificateRepository.create(createCertificateDto);
  }

  async findAll(): Promise<Certificate[]> {
    return this.certificateRepository.findAll();
  }

  async findOne(code: string): Promise<Certificate | null> {
    return this.certificateRepository.findByCode(code);
  }

  async remove(code: string): Promise<boolean> {
    return this.certificateRepository.delete(code);
  }
}
