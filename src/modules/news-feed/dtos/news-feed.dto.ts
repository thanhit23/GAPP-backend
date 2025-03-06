import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { UUIDField } from '../../../decorators/field.decorators.ts';
import type { NewsFeedEntity } from '../news-feed.entity.ts';
import type { AbstractEntity } from '../../../common/abstract.entity.ts';

export class NewsFeedDto extends AbstractDto {
  @UUIDField()
  user_id!: string;

  @UUIDField()
  post_id!: string;

  constructor(newsFeed: AbstractEntity & NewsFeedEntity) {
    super(newsFeed);
    this.id = newsFeed.id;
    this.post_id = newsFeed.post_id;
    this.user_id = newsFeed.user_id;
    this.createdAt = newsFeed.createdAt;
    this.updatedAt = newsFeed.updatedAt;
  }
}
