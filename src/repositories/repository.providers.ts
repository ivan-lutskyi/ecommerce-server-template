import { Provider, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Mock repositories
import { MockShopItemV2Repository } from './mocks/mock-shop-item-v2.repository';
import { MockOrderRepository } from './mocks/mock-order.repository';
import { MockUserRepository } from './mocks/mock-user.repository';
import { MockPromoRepository } from './mocks/mock-promo.repository';
import { MockCertificateRepository } from './mocks/mock-certificate.repository';

// MongoDB repositories
import { MongoShopItemV2Repository } from './mongo/mongo-shop-item-v2.repository';
import { MongoOrderRepository } from './mongo/mongo-order.repository';
import { MongoUserRepository } from './mongo/mongo-user.repository';
import { MongoPromoRepository } from './mongo/mongo-promo.repository';
import { MongoCertificateRepository } from './mongo/mongo-certificate.repository';

// Interfaces
import { IShopItemV2Repository } from './interfaces/shop-item-v2.repository.interface';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { IUserRepository } from './interfaces/user.repository.interface';
import { IPromoRepository } from './interfaces/promo.repository.interface';
import { ICertificateRepository } from './interfaces/certificate.repository.interface';

/**
 * Determines whether to use mock repositories based on environment configuration.
 * Uses mocks if:
 * - USE_MOCK_REPOSITORIES is set to 'true'
 * - OR MONGO_URI is not provided
 */
export function shouldUseMocks(configService: ConfigService): boolean {
  const useMocks = configService.get<string>('USE_MOCK_REPOSITORIES');
  const mongoUri = configService.get<string>('MONGO_URI');
  
  if (useMocks === 'true') return true;
  if (!mongoUri) return true;
  
  return false;
}

// Export repository tokens for injection
export const REPOSITORY_TOKENS = {
  SHOP_ITEM_V2: 'SHOP_ITEM_V2_REPOSITORY' as const,
  ORDER: 'ORDER_REPOSITORY' as const,
  USER: 'USER_REPOSITORY' as const,
  PROMO: 'PROMO_REPOSITORY' as const,
  CERTIFICATE: 'CERTIFICATE_REPOSITORY' as const,
};

