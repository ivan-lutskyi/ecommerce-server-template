import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SupportModule } from './support/support.module';
import { PromosModule } from './promos/promos.module';
import { CertificatesModule } from './certificates/certificates.module';
import { AuthModule } from './auth/auth.module';
import { ShopItemsV2Module } from './shop-items-v2/shop-items-v2.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MediaModule } from './media/media.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/*'],
    }),
    // MongoDB connection is optional - defaults to mock repositories if MONGO_URI is not provided
    ...(process.env.MONGO_URI
      ? [MongooseModule.forRoot(process.env.MONGO_URI)]
      : []),
    OrderModule,
    SupportModule,
    PromosModule,
    CertificatesModule,
    AuthModule,
    ShopItemsV2Module,
    CloudinaryModule,
    MediaModule,
  ],
})
export class AppModule {}
