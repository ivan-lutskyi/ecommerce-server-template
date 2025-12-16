import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICertificateRepository } from '../interfaces/certificate.repository.interface';
import {
  Certificate,
  CertificateDocument,
} from '../../certificates/schemas/certificate.schema';
import { CreateCertificateDto } from '../../certificates/dto/create-certificate.dto';

/**
 * Real MongoDB repository for Certificates.
 */
@Injectable()
export class MongoCertificateRepository implements ICertificateRepository {
  constructor(
    @InjectModel(Certificate.name)
    private certificatesModel: Model<CertificateDocument>,
  ) {}

  async findAll(): Promise<Certificate[]> {
    return this.certificatesModel.find().exec();
  }

  async findByCode(code: string): Promise<Certificate | null> {
    return this.certificatesModel.findOne({ code }).exec();
  }

  async create(certificateDto: CreateCertificateDto): Promise<Certificate> {
    const newCertificate = new this.certificatesModel(certificateDto);
    return newCertificate.save();
  }

  async delete(code: string): Promise<boolean> {
    const result = await this.certificatesModel.findOneAndDelete({ code }).exec();
    return !!result;
  }
}

