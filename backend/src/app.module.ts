import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from './admins/admins.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { LibrarysModule } from './librarys/librarys.module';
import { SheetsModule } from './sheets/sheets.module';
import { BookingsModule } from './bookings/bookings.module';
import { LibraryPriceModule } from './library_price/library_price.module';
import { LibraryFeatureModule } from './library-feature/library-feature.module';
import { UsersModule } from './users/users.module';
import { FeedbackModule } from './feedback/feedback.module';
import { DashboardModule } from './dashboard/dashboard.module';


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
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    AdminsModule,
    LibrarysModule,
    SheetsModule,
    BookingsModule,
    LibraryPriceModule,
    LibraryFeatureModule,
    UsersModule,
    FeedbackModule,
    DashboardModule,

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
