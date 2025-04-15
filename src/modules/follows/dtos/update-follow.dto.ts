import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class FollowUpdateDto {
  @StringFieldOptional()
  sourceUserId!: string;

  @StringFieldOptional()
  targetUserId!: string;
}
