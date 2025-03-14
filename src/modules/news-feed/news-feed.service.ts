import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { PostService } from '../post/post.service.ts';
import { NewsFeedEntity } from './news-feed.entity.ts';
import { NewsFeedRepository } from './news-feed.repository.ts';
import { FollowService } from '../follows/follow.service.ts';
import { CreateNewsFeedDto } from './dtos/create-news-feed.dto.ts';
import { UpdateNewsFeedDto } from './dtos/update-news-feed.dto.ts';
import { NewsFeedPageOptionsDto } from './dtos/news-feed-page-options.dto.ts';
import { NewsFeedNotFoundException } from './exceptions/news-feed-not-found.exception.ts';
import { PageDto } from '../../common/dto/page.dto.ts';

@Injectable()
export class NewsFeedService {
  constructor(
    private newsFeedRepository: NewsFeedRepository,
    private postService: PostService,
    private followService: FollowService,
    @InjectQueue('post-queue') private postQueue: Queue,
  ) {}

  async createNewsFeed(
    newsFeedDto: CreateNewsFeedDto & { user_id: string },
  ): Promise<NewsFeedEntity> {
    return await this.newsFeedRepository.createNewsFeed(newsFeedDto);
  }

  async getAllNewsFeed(
    user_id: string,
    pageOptionsDto: NewsFeedPageOptionsDto,
  ): Promise<PageDto<NewsFeedEntity>> {
    const following = await this.followService.getFollowsByUser(user_id);

    const followingIds = following.map((f) => f.target_user_id);

    const jobs = await this.postQueue.getJobs(['waiting', 'active']);

    for (const job of jobs) {
      if (
        job.name === 'fan-out-post' &&
        followingIds.includes(job.data.userId)
      ) {
        const post = await this.postService.findOne({
          where: { id: job.data.postId },
        });

        const entity = await this.newsFeedRepository.getNewsFeedByField(
          'post_id',
          job.data.postId,
        );

        if (post && !entity) {
          await this.createNewsFeed({
            user_id,
            post_id: job.data.postId,
          });

          console.log(
            `Added post ${job.data.postId} from queue to newsfeed of ${user_id}`,
          );
        }
      }
    }

    return await this.newsFeedRepository.getAllNewsFeed(
      user_id,
      pageOptionsDto,
    );
  }

  async getSingleNewsFeed(id: string): Promise<NewsFeedEntity> {
    const entity = await this.newsFeedRepository.getSingleNewsFeed(id);

    if (!entity) {
      throw new NewsFeedNotFoundException();
    }

    return entity;
  }

  async getOnePostPerFollower(userId: string): Promise<any[]> {
    return await this.newsFeedRepository.getNewsFeedByField('user_id', userId);
  }

  async updateNewsFeed(
    id: string,
    updateNewsFeedDto: UpdateNewsFeedDto,
  ): Promise<boolean> {
    // await this.postService.getSinglePost(updateNewsFeedDto.post_id);
    //
    const entity = await this.newsFeedRepository.getSingleNewsFeed(id);

    if (!entity) {
      throw new NewsFeedNotFoundException();
    }

    await this.newsFeedRepository.updateNewsFeed(entity, updateNewsFeedDto);

    return true;
  }

  async deleteNewsFeed(id: string): Promise<boolean> {
    const entity = await this.newsFeedRepository.getSingleNewsFeed(id);

    if (!entity) {
      throw new NewsFeedNotFoundException();
    }

    await this.newsFeedRepository.deleteNewsFeed(entity);

    return true;
  }
}
