import { StringFieldOptional } from '../../../decorators/field.decorators.ts';

export class UpdateFollowDto {
  @StringFieldOptional()
  source_user_id!: string;

  @StringFieldOptional()
  target_user_id!: string;
}
