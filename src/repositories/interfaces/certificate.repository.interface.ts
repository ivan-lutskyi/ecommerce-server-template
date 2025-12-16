import { CreateCertificateDto } from '../../certificates/dto/create-certificate.dto';
import { Certificate } from '../../certificates/schemas/certificate.schema';

export interface ICertificateRepository {
  findAll(): Promise<Certificate[]>;
  findByCode(code: string): Promise<Certificate | null>;
  create(certificateDto: CreateCertificateDto): Promise<Certificate>;
  delete(code: string): Promise<boolean>;
}

