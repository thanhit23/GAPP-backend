import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class UnfollowDto {
  @StringFieldOptional()
  sourceUserId?: string;

  @StringFieldOptional()
  targetUserId?: string;
}
