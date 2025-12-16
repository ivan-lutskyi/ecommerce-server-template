import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  OrderUA,
  OrderUASchema,
  OrderWW,
  OrderWWSchema,
} from './schemas/order.schema';
import { MockOrderRepository } from '../repositories/mocks/mock-order.repository';
import { MongoOrderRepository } from '../repositories/mongo/mongo-order.repository';
import { MockShopItemV2Repository } from '../repositories/mocks/mock-shop-item-v2.repository';
import { MongoShopItemV2Repository } from '../repositories/mongo/mongo-shop-item-v2.repository';
import { REPOSITORY_TOKENS, shouldUseMocks } from '../repositories/repository.providers';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    // Provide MongoDB repositories only if MongoDB is configured
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [MongoOrderRepository, MongoShopItemV2Repository]
      : []),
    // Provide Order repository
    {
      provide: REPOSITORY_TOKENS.ORDER,
      useFactory: (
        configService: ConfigService,
        mongoRepo?: MongoOrderRepository,
      ) => {
        if (shouldUseMocks(configService) || !mongoRepo) {
          return new MockOrderRepository();
        }
        return mongoRepo;
      },
      inject: [
        ConfigService,
        ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
          ? [MongoOrderRepository]
          : []),
      ],
    },
    // Provide ShopItemV2 repository (for inventory validation)
    {
      provide: REPOSITORY_TOKENS.SHOP_ITEM_V2,
      useFactory: (
        configService: ConfigService,
        mongoRepo?: MongoShopItemV2Repository,
      ) => {
        if (shouldUseMocks(configService) || !mongoRepo) {
          return new MockShopItemV2Repository();
        }
        return mongoRepo;
      },
      inject: [
        ConfigService,
        ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
          ? [MongoShopItemV2Repository]
          : []),
      ],
    },
  ],
  imports: [
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [
          MongooseModule.forFeature([
            { name: OrderUA.name, schema: OrderUASchema },
            { name: OrderWW.name, schema: OrderWWSchema },
          ]),
        ]
      : []),
    ConfigModule,
  ],
})
export class OrderModule {}
