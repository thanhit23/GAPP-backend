import dayjs from 'dayjs';
import Redis from 'ioredis';
import type { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';

import { FollowRepository } from '../follows/follow.repository.ts';

@Processor('post-queue')
export class PostProcessor {
  constructor(
    private followRepository: FollowRepository,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  @Process('fan-out-post')
  async handleFanOutPost(job: Job) {
    const { userId, postId } = job.data;
    const followers = await this.followRepository.getFollowing(userId);

    for (const follower of followers) {
      const newsFeedKey = `news_feed:${follower.sourceUserId}:${postId}`;

      await this.redisClient.hset(newsFeedKey, {
        time: dayjs().format('YYYY-MM-DD HH-mm'),
      });
      await this.redisClient.expire(newsFeedKey, 2 * 24 * 60 * 60);
    }
  }
}
