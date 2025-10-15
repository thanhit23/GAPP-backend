import path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { BullModule } from '@nestjs/bull';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { SharedModule } from './shared/shared.module.ts';
import { AuthModule } from './modules/auth/auth.module.ts';
import { PostModule } from './modules/post/post.module.ts';
import { UserModule } from './modules/user/user.module.ts';
import { FollowModule } from './modules/follows/follow.module.ts';
import { NewsFeedModule } from './modules/news-feed/news-feed.module.ts';
import { ApiConfigService } from './shared/services/api-config.service.ts';
import { LikeModule } from './modules/like/like.module.ts';
import { RedisModule } from './modules/redis/redis.module.ts';
import { CommentModule } from './modules/comment/comment.module.ts';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module.ts';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    LikeModule,
    FollowModule,
    CommentModule,
    NewsFeedModule,
    RedisModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ApiConfigService) => ({
        redis: configService.redisConfig,
      }),
      inject: [ApiConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(import.meta.dirname, 'i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    HealthCheckerModule,
  ],
  providers: [],
})
export class AppModule {}
