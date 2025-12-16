import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  HttpException,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get(':code')
  async findOne(@Param('code') code: string) {
    // throw new NotFoundException('certificates are now unavailable');

    try {
      const res = await this.certificatesService.findOne(code);

      if (res) {
        return res;
      }

      throw new NotFoundException('Incorrect certificate');
    } catch (error) {
      throw new NotFoundException('Incorrect certificate');
    }
  }

  @Post()
  async createCertificate(@Body() certificate: CreateCertificateDto) {
    await this.certificatesService.remove('123123');

    try {
      return await this.certificatesService.create(
        certificate as CreateCertificateDto,
      );
    } catch (error) {
      const { message, status } = JSON.parse(error.message);

      throw new HttpException(message, status);
    }
  }
}
