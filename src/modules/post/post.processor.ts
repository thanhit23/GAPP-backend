import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';

import { NewsFeedEntity } from '../news-feed/news-feed.entity.ts';
import { NewsFeedRepository } from '../news-feed/news-feed.repository.ts';
import { FollowEntity } from '../follows/follow.entity.ts';
import { FollowRepository } from '../follows/follow.repository.ts';
import { GeneratorService } from '../../shared/services/generator.service.ts';

@Processor('post-queue')
export class PostProcessor {
  constructor(
    @InjectRepository(NewsFeedEntity)
    private newsfeedRepository: NewsFeedRepository,
    @InjectRepository(FollowEntity)
    private followRepository: FollowRepository,
  ) {}

  @Process('fan-out-post')
  async handleFanOutPost(job: Job) {
    const { userId, postId } = job.data;

    const followers = await this.followRepository.getFollowsByFollower(userId);

    const newsfeedEntries = followers.map((follower) => {
      const newsfeed = new NewsFeedEntity();
      newsfeed.id = new GeneratorService().uuid();
      newsfeed.user_id = follower.source_user_id;
      newsfeed.post_id = postId;
      return newsfeed;
    });

    await this.newsfeedRepository.saveNewsFeed(newsfeedEntries);

    console.log(`Fanned out post ${postId} to ${followers.length} followers`);
  }
}
