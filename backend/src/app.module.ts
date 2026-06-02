import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';

import { BookingsModule } from './bookings/bookings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LibraryPriceModule } from './library_price/library_price.module';
import { LibraryFeatureModule } from './library_feature/library_feature.module';
import { LibrarysModule } from './librarys/librarys.module';
import { SheetsModule } from './sheets/sheets.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    UsersModule,

    AdminsModule,


    BookingsModule,

    DashboardModule,

    LibraryPriceModule,

    LibraryFeatureModule,

    LibrarysModule,

    SheetsModule,

    FeedbackModule,
  ],



  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('admins/signup', 'admins/login')
      .forRoutes('*');
  }
}
