import { Injectable } from '@nestjs/common';
import { ICertificateRepository } from '../interfaces/certificate.repository.interface';
import { Certificate } from '../../certificates/schemas/certificate.schema';
import { CreateCertificateDto } from '../../certificates/dto/create-certificate.dto';

/**
 * Mock repository for Certificates with in-memory data storage.
 */
@Injectable()
export class MockCertificateRepository implements ICertificateRepository {
  private certificates: Certificate[] = [
    {
      code: 'CERT-001',
      createdAt: new Date().toISOString(),
      owner: 'John Doe',
      amount: 500,
    } as Certificate,
    {
      code: 'CERT-002',
      createdAt: new Date().toISOString(),
      owner: 'Jane Smith',
      amount: 1000,
    } as Certificate,
  ];

  async findAll(): Promise<Certificate[]> {
    return [...this.certificates];
  }

  async findByCode(code: string): Promise<Certificate | null> {
    return this.certificates.find((cert) => cert.code === code) || null;
  }

  async create(certificateDto: CreateCertificateDto): Promise<Certificate> {
    const newCertificate = {
      ...certificateDto,
    } as Certificate;
    this.certificates.push(newCertificate);
    return newCertificate;
  }

  async delete(code: string): Promise<boolean> {
    const index = this.certificates.findIndex((cert) => cert.code === code);
    if (index === -1) return false;
    this.certificates.splice(index, 1);
    return true;
  }
}

