import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from './schemas/user.schema';
import { MockUserRepository } from '../repositories/mocks/mock-user.repository';
import { MongoUserRepository } from '../repositories/mongo/mongo-user.repository';
import { REPOSITORY_TOKENS, shouldUseMocks } from '../repositories/repository.providers';

@Module({
  imports: [
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])]
      : []),
    ConfigModule,
  ],
  providers: [
    AuthService,
    ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
      ? [MongoUserRepository]
      : []),
    {
      provide: REPOSITORY_TOKENS.USER,
      useFactory: (
        configService: ConfigService,
        mongoRepo?: MongoUserRepository,
      ) => {
        if (shouldUseMocks(configService) || !mongoRepo) {
          return new MockUserRepository();
        }
        return mongoRepo;
      },
      inject: [
        ConfigService,
        ...(process.env.MONGO_URI && process.env.USE_MOCK_REPOSITORIES !== 'true'
          ? [MongoUserRepository]
          : []),
      ],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
