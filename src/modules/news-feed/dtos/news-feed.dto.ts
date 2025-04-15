import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { UUIDField } from '../../../decorators/field.decorators.ts';
import type { NewsFeedEntity } from '../news-feed.entity.ts';
import type { AbstractEntity } from '../../../common/abstract.entity.ts';

export class NewsFeedDto extends AbstractDto {
  @UUIDField()
  userId!: string;

  @UUIDField()
  postId!: string;

  constructor(newsFeed: AbstractEntity & NewsFeedEntity) {
    super(newsFeed);
    this.id = newsFeed.id;
    this.postId = newsFeed.postId;
    this.userId = newsFeed.userId;
    this.createdAt = newsFeed.createdAt;
    this.updatedAt = newsFeed.updatedAt;
  }
}
