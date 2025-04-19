import _ from 'lodash';

import { BaseTransformer } from './base.transformer.ts';

export class CreateCommentTransformer extends BaseTransformer {
  async data() {
    const data = await this.resource;

    return { data };
  }
}

export class GetCommentByOptionTransformer extends CreateCommentTransformer {}

export class GetCommentByIdTransformer extends CreateCommentTransformer {
  async data() {
    const data = await this.resource;

    const { password: _, ...user } = data.user;

    return {
      data: {
        ...data,
        user,
      },
    };
  }
}
