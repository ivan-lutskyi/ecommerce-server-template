import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PromosService } from './promos.service';
import { PromosController } from './promos.controller';
import { PromoItem, PromoItemSchema } from './schemas/promo-item.schema';
import { MockPromoRepository } from '../repositories/mocks/mock-promo.repository';
import { MongoPromoRepository } from '../repositories/mongo/mongo-promo.repository';
import { REPOSITORY_TOKENS, shouldUseMocks } from '../repositories/repository.providers';

@Module({
  controllers: [PromosController],
  providers: [
    PromosService,
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [MongoPromoRepository]
      : []),
    {
      provide: REPOSITORY_TOKENS.PROMO,
      useFactory: (
        configService: ConfigService,
        mongoRepo?: MongoPromoRepository,
      ) => {
        if (shouldUseMocks(configService) || !mongoRepo) {
          return new MockPromoRepository();
        }
        return mongoRepo;
      },
      inject: [
        ConfigService,
        ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
          ? [MongoPromoRepository]
          : []),
      ],
    },
  ],
  imports: [
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [
          MongooseModule.forFeature([
            { name: PromoItem.name, schema: PromoItemSchema },
          ]),
        ]
      : []),
    ConfigModule,
  ],
})
export class PromosModule {}
