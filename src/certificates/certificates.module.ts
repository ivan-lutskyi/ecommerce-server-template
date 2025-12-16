import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { Certificate, CertificateSchema } from './schemas/certificate.schema';
import { MockCertificateRepository } from '../repositories/mocks/mock-certificate.repository';
import { MongoCertificateRepository } from '../repositories/mongo/mongo-certificate.repository';
import { REPOSITORY_TOKENS, shouldUseMocks } from '../repositories/repository.providers';

@Module({
  controllers: [CertificatesController],
  providers: [
    CertificatesService,
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [MongoCertificateRepository]
      : []),
    {
      provide: REPOSITORY_TOKENS.CERTIFICATE,
      useFactory: (
        configService: ConfigService,
        mongoRepo?: MongoCertificateRepository,
      ) => {
        if (shouldUseMocks(configService) || !mongoRepo) {
          return new MockCertificateRepository();
        }
        return mongoRepo;
      },
      inject: [
        ConfigService,
        ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
          ? [MongoCertificateRepository]
          : []),
      ],
    },
  ],
  imports: [
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [
          MongooseModule.forFeature([
            { name: Certificate.name, schema: CertificateSchema },
          ]),
        ]
      : []),
    ConfigModule,
  ],
})
export class CertificatesModule {}
