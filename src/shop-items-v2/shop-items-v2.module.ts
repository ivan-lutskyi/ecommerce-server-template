import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShopItemsV2Service } from './shop-items-v2.service';
import { ShopItemsV2Controller } from './shop-items-v2.controller';
import { ShopItemV2, ShopItemV2Schema } from './schemas/shop-item-v2.schema';
import { MediaModule } from '../media/media.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MockShopItemV2Repository } from '../repositories/mocks/mock-shop-item-v2.repository';
import { MongoShopItemV2Repository } from '../repositories/mongo/mongo-shop-item-v2.repository';
import { REPOSITORY_TOKENS, shouldUseMocks } from '../repositories/repository.providers';

@Module({
  imports: [
    // Conditionally import MongooseModule only if MongoDB is configured
    // This prevents errors when running with mock repositories
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [
          MongooseModule.forFeature([
            { name: ShopItemV2.name, schema: ShopItemV2Schema },
          ]),
        ]
      : []),
    ConfigModule,
    MediaModule,
    CloudinaryModule,
  ],
  providers: [
    ShopItemsV2Service,
    // Provide MongoDB repository only if MongoDB is configured
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [MongoShopItemV2Repository]
      : []),
    // Provide repository token - factory chooses mock or MongoDB based on config
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
  controllers: [ShopItemsV2Controller],
})
export class ShopItemsV2Module {}
