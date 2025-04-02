import Redis from 'ioredis';
import { Module, Logger } from '@nestjs/common';

import { ApiConfigService } from '../../shared/services/api-config.service.ts';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ApiConfigService) => {
        const logger = new Logger('Redis');
        const redis = new Redis(configService.redisConfig);

        redis.on('connect', () => {
          logger.log('Redis connected successfully');
        });

        redis.on('error', (error) => {
          logger.error('Redis connection error:', error);
        });

        return redis;
      },
      inject: [ApiConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
